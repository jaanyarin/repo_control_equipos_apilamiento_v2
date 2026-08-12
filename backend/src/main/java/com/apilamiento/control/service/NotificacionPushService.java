package com.apilamiento.control.service;

import com.apilamiento.control.entity.Equipo;
import com.apilamiento.control.entity.Marca;
import com.apilamiento.control.entity.TokenPush;
import com.apilamiento.control.entity.Usuario;
import com.apilamiento.control.mapper.NotificacionPushMapper;
import com.apilamiento.control.repository.MarcaRepository;
import com.apilamiento.control.repository.TokenPushRepository;
import com.apilamiento.control.repository.UsuarioRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@ApplicationScoped
public class NotificacionPushService {

    private static final Logger log = LoggerFactory.getLogger(NotificacionPushService.class);

    static final String FCM_SEND_URL_TEMPLATE = "https://fcm.googleapis.com/v1/projects/%s/messages:send";
    static final String OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
    static final String FCM_SCOPE = "https://www.googleapis.com/auth/firebase.messaging";
    static final long GOOGLE_TOKEN_LIFETIME_SECONDS = 3600;
    static final String BEGEN_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----";
    static final String END_PRIVATE_KEY = "-----END PRIVATE KEY-----";

    private final TokenPushRepository tokenPushRepository;
    private final MarcaRepository marcaRepository;
    private final UsuarioRepository usuarioRepository;
    private final NotificacionPushMapper notificacionPushMapper;
    private final String projectId;
    private final String serviceAccountJson;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final ExecutorService executor = Executors.newCachedThreadPool(runnable -> {
        Thread thread = new Thread(runnable, "fcm-notifier");
        thread.setDaemon(true);
        return thread;
    });

    private volatile String accessToken;
    private volatile Instant accessTokenExpiry;

    @Inject
    public NotificacionPushService(TokenPushRepository tokenPushRepository,
            MarcaRepository marcaRepository,
            UsuarioRepository usuarioRepository,
            NotificacionPushMapper notificacionPushMapper,
            @ConfigProperty(name = "app.fcm.project-id") String projectId,
            @ConfigProperty(name = "app.fcm.service-account") Optional<String> serviceAccountJson) {
        this(tokenPushRepository, marcaRepository, usuarioRepository, notificacionPushMapper,
                projectId, serviceAccountJson.orElse(""), HttpClient.newHttpClient(), new ObjectMapper());
    }

    NotificacionPushService(TokenPushRepository tokenPushRepository,
            MarcaRepository marcaRepository,
            UsuarioRepository usuarioRepository,
            NotificacionPushMapper notificacionPushMapper,
            String projectId, String serviceAccountJson,
            HttpClient httpClient, ObjectMapper objectMapper) {
        this.tokenPushRepository = tokenPushRepository;
        this.marcaRepository = marcaRepository;
        this.usuarioRepository = usuarioRepository;
        this.notificacionPushMapper = notificacionPushMapper;
        this.projectId = projectId;
        this.serviceAccountJson = serviceAccountJson;
        this.httpClient = httpClient;
        this.objectMapper = objectMapper;
    }

    public boolean isConfigurado() {
        return projectId != null && !projectId.isBlank()
                && serviceAccountJson != null && !serviceAccountJson.isBlank();
    }

    public void notificarIngresoEquipo(Equipo equipo, Long usuarioOrigenId) {
        if (!isConfigurado()) {
            log.warn("FCM no configurado (app.fcm.*): se omite notificacion de ingreso");
            return;
        }
        try {
            List<TokenPush> tokens = usuarioOrigenId == null
                    ? tokenPushRepository.listAllActivos()
                    : tokenPushRepository.listActivosExcepto(usuarioOrigenId);
            if (tokens.isEmpty()) {
                log.info("Sin tokens FCM para notificar el ingreso del equipo {}", equipo.getCodigo());
                return;
            }
            String codigo = equipo.getCodigo();
            String modelo = equipo.getModelo();
            Long marcaId = equipo.getMarcaId();
            Long equipoId = equipo.getId();
            Marca marca = marcaId == null ? null : marcaRepository.findById(marcaId);
            String marcaNombre = marca == null ? "" : marca.getNombre();
            String usuarioNombre = usuarioOrigenId == null ? "" : resolverUsuarioNombre(usuarioOrigenId);
            executor.submit(() -> emitirIngreso(codigo, usuarioNombre, modelo, marcaNombre, equipoId, tokens));
        } catch (Exception ex) {
            log.warn("No se pudo encolar la notificacion de ingreso: {}", ex.getMessage());
        }
    }

    void emitirIngreso(String codigo, String usuarioNombre, String modelo, String marcaNombre,
            Long equipoId, List<TokenPush> tokens) {
        try {
            String bearer = obtenerAccessToken();
            int enviados = 0;
            for (TokenPush token : tokens) {
                try {
                    JsonNode message = notificacionPushMapper.mensajeIngreso(
                            token.getToken(), codigo, usuarioNombre, marcaNombre, modelo, equipoId);
                    enviarAToken(token.getToken(), bearer, message);
                    enviados++;
                } catch (Exception ex) {
                    log.warn("FCM fallo para el dispositivo {}: {}", token.getId(), ex.getMessage());
                }
            }
            log.info("Notificaciones de ingreso enviadas: {}/{}", enviados, tokens.size());
        } catch (Exception ex) {
            log.warn("No se pudo enviar las notificaciones de ingreso: {}", ex.getMessage());
        }
    }

    private String resolverUsuarioNombre(Long usuarioId) {
        try {
            Usuario usuario = usuarioRepository.findById(usuarioId);
            return usuario != null && usuario.getNombre() != null ? usuario.getNombre() : "";
        } catch (Exception ex) {
            log.warn("No se pudo resolver el nombre del usuario {}: {}", usuarioId, ex.getMessage());
            return "";
        }
    }

    void enviarAToken(String token, String bearer, JsonNode message) throws Exception {
        String url = String.format(FCM_SEND_URL_TEMPLATE, projectId);
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Authorization", "Bearer " + bearer)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(message)))
                .build();
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() / 100 != 2) {
            throw new RuntimeException("FCM respondiÃ³ " + response.statusCode() + ": " + response.body());
        }
    }

    String obtenerAccessToken() throws Exception {
        if (accessToken != null && accessTokenExpiry != null
                && Instant.now().isBefore(accessTokenExpiry)) {
            return accessToken;
        }
        JsonNode serviceAccount = parseServiceAccount();
        String assertion = buildJwtAssertion(serviceAccount);
        String body = "grant_type=" + urlEncode("urn:ietf:params:oauth:grant-type:jwt-bearer")
                + "&assertion=" + urlEncode(assertion);
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(OAUTH_TOKEN_URL))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() / 100 != 2) {
            throw new RuntimeException("OAuth2 Google respondiÃ³ " + response.statusCode() + ": " + response.body());
        }
        JsonNode json = objectMapper.readTree(response.body());
        accessToken = json.get("access_token").asText();
        int expiresIn = json.has("expires_in") ? json.get("expires_in").asInt() : 3600;
        accessTokenExpiry = Instant.now().plusSeconds(expiresIn - 60L);
        return accessToken;
    }

    private JsonNode parseServiceAccount() throws Exception {
        return objectMapper.readTree(serviceAccountJson);
    }

    private String buildJwtAssertion(JsonNode serviceAccount) throws Exception {
        String issuer = serviceAccount.get("client_email").asText();
        Instant now = Instant.now();
        String header = "{\"alg\":\"RS256\",\"typ\":\"JWT\"}";
        String claims = "{\"iss\":\"" + escape(issuer)
                + "\",\"scope\":\"" + FCM_SCOPE
                + "\",\"aud\":\"" + OAUTH_TOKEN_URL
                + "\",\"iat\":" + now.getEpochSecond()
                + ",\"exp\":" + (now.getEpochSecond() + GOOGLE_TOKEN_LIFETIME_SECONDS) + "}";
        String signingInput = base64UrlEncode(header.getBytes(StandardCharsets.UTF_8))
                + "." + base64UrlEncode(claims.getBytes(StandardCharsets.UTF_8));
        byte[] signature = signRsaSha256(signingInput, serviceAccount.get("private_key").asText());
        return signingInput + "." + base64UrlEncode(signature);
    }

    private byte[] signRsaSha256(String data, String pemPrivateKey) throws Exception {
        String cleaned = pemPrivateKey
                .replace(BEGEN_PRIVATE_KEY, "")
                .replace(END_PRIVATE_KEY, "")
                .replaceAll("\\s", "");
        byte[] der = Base64.getDecoder().decode(cleaned);
        java.security.spec.PKCS8EncodedKeySpec spec = new java.security.spec.PKCS8EncodedKeySpec(der);
        java.security.KeyFactory factory = java.security.KeyFactory.getInstance("RSA");
        java.security.PrivateKey privateKey = factory.generatePrivate(spec);
        java.security.Signature signature = java.security.Signature.getInstance("SHA256withRSA");
        signature.initSign(privateKey);
        signature.update(data.getBytes(StandardCharsets.UTF_8));
        return signature.sign();
    }

    private String escape(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private String base64UrlEncode(byte[] data) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(data);
    }

    private String urlEncode(String value) {
        return java.net.URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}