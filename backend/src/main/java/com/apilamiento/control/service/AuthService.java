package com.apilamiento.control.service;

import com.apilamiento.control.entity.Usuario;
import com.apilamiento.control.repository.UsuarioRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.StringJoiner;

@ApplicationScoped
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final String tenantId;
    private final String clientId;
    private final String clientSecret;
    private final String redirectUri;
    private final String authorizeUrlBase;
    private final String tokenUrl;
    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    private static final String GRAPH_ME_URL = "https://graph.microsoft.com/v1.0/me";
    private static final String GRAPH_USERS_URL = "https://graph.microsoft.com/v1.0/users";
    private static final String GRAPH_DEFAULT_SCOPE = "https://graph.microsoft.com/.default";

    private String appAccessToken;
    private Instant appTokenExpiry;

    @Inject
    public AuthService(
            UsuarioRepository usuarioRepository,
            JwtService jwtService,
            @ConfigProperty(name = "apilamiento.oidc.tenant-id") String tenantId,
            @ConfigProperty(name = "apilamiento.oidc.client-id") String clientId,
            @ConfigProperty(name = "apilamiento.oidc.client-secret") String clientSecret,
            @ConfigProperty(name = "apilamiento.oidc.redirect-uri") String redirectUri) {
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
        this.tenantId = tenantId;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
        this.authorizeUrlBase = buildAuthorizeUrl();
        this.tokenUrl = buildTokenUrl();
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
    }

    private String buildAuthorizeUrl() {
        return "https://login.microsoftonline.com/" + tenantId + "/oauth2/v2.0/authorize"
                + "?client_id=" + clientId
                + "&response_type=code"
                + "&redirect_uri=" + URLEncoder.encode(redirectUri, StandardCharsets.UTF_8)
                + "&response_mode=query"
                + "&scope=" + URLEncoder.encode("openid email profile User.Read", StandardCharsets.UTF_8)
                + "&prompt=select_account";
    }

    private String buildTokenUrl() {
        return "https://login.microsoftonline.com/" + tenantId + "/oauth2/v2.0/token";
    }

    public String getAuthorizeUrl(String redirectUri) {
        return authorizeUrlBase + "&state=" + URLEncoder.encode(redirectUri, StandardCharsets.UTF_8);
    }

    public String generateMobileAuthorizeUrl(String mobileRedirectUri) {
        return "https://login.microsoftonline.com/" + tenantId + "/oauth2/v2.0/authorize"
                + "?client_id=" + clientId
                + "&response_type=code"
                + "&redirect_uri=" + URLEncoder.encode(mobileRedirectUri, StandardCharsets.UTF_8)
                + "&response_mode=query"
                + "&scope=" + URLEncoder.encode("openid email profile User.Read", StandardCharsets.UTF_8)
                + "&prompt=select_account"
                + "&state=" + URLEncoder.encode(mobileRedirectUri, StandardCharsets.UTF_8);
    }

    @Transactional
    public String handleMobileCallback(String code, String mobileRedirectUri) throws Exception {
        String accessToken = exchangeCodeForToken(code, mobileRedirectUri);
        return processGraphUser(accessToken);
    }

    public String buildMobileRedirectUrl(String mobileRedirectUri, String jwt) {
        String base = mobileRedirectUri.endsWith("/") ? mobileRedirectUri.substring(0, mobileRedirectUri.length() - 1) : mobileRedirectUri;
        return base + "/auth/callback?token=" + jwt;
    }

    @Transactional
    public String handleCallback(String code) throws Exception {
        String accessToken = exchangeCodeForToken(code, redirectUri);
        return processGraphUser(accessToken);
    }

    private String exchangeCodeForToken(String code, String redirectUri) throws Exception {
        String body = new StringJoiner("&")
                .add("client_id=" + URLEncoder.encode(clientId, StandardCharsets.UTF_8))
                .add("client_secret=" + URLEncoder.encode(clientSecret, StandardCharsets.UTF_8))
                .add("code=" + URLEncoder.encode(code, StandardCharsets.UTF_8))
                .add("redirect_uri=" + URLEncoder.encode(redirectUri, StandardCharsets.UTF_8))
                .add("grant_type=authorization_code")
                .toString();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(tokenUrl))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200) {
            throw new RuntimeException("Error al intercambiar código por token: " + response.body());
        }

        JsonNode json = objectMapper.readTree(response.body());
        return json.get("access_token").asText();
    }

    @Transactional
    protected String processGraphUser(String accessToken) throws Exception {
        JsonNode graphUser = callGraphApi(accessToken);

        if (graphUser.has("accountEnabled") && !graphUser.get("accountEnabled").asBoolean()) {
            throw new RuntimeException("Usuario no activo en la empresa");
        }

        String mailField = graphUser.has("mail") && !graphUser.get("mail").isNull() ? graphUser.get("mail").asText() : "null";
        String upnField = graphUser.has("userPrincipalName") && !graphUser.get("userPrincipalName").isNull() ? graphUser.get("userPrincipalName").asText() : "null";
        log.info("Graph user - mail: [{}], userPrincipalName: [{}]", mailField, upnField);

        String email = getGraphField(graphUser, "userPrincipalName", "mail");
        if (email == null || email.isBlank()) {
            throw new RuntimeException("No se pudo obtener el email del usuario de Microsoft");
        }
        email = email.toLowerCase();
        log.info("Email usado para busqueda: [{}]", email);

        Usuario user = usuarioRepository.findByCorreo(email).orElse(null);
        log.info("Usuario encontrado en DB: {}", user != null ? user.getCorreo() : "null");
        if (user == null) {
            throw new RuntimeException("Usuario no registrado para el uso del app");
        }

        if (!user.getEstadoActivo()) {
            throw new RuntimeException("Usuario no activo en el app");
        }

        String msId = graphUser.has("id") ? graphUser.get("id").asText() : email;
        String nombre = getGraphField(graphUser, "displayName", null);
        String puesto = graphUser.has("jobTitle") ? graphUser.get("jobTitle").asText(null) : null;
        String empresa = graphUser.has("companyName") ? graphUser.get("companyName").asText(null) : null;
        String departamento = graphUser.has("department") ? graphUser.get("department").asText(null) : null;
        String ubicacion = graphUser.has("officeLocation") ? graphUser.get("officeLocation").asText(null) : null;

        user.setIdMicrosoft(msId);
        if (nombre != null) user.setNombre(nombre);
        user.setPuesto(puesto);
        user.setEmpresa(empresa);
        user.setDepartamento(departamento);
        user.setUbicacion(ubicacion);
        user.setUltimoAcceso(OffsetDateTime.now(ZoneId.of("America/Lima")));
        user.setFechaActualizacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
        usuarioRepository.persist(user);

        return jwtService.generateToken(user);
    }

    private JsonNode callGraphApi(String accessToken) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(GRAPH_ME_URL))
                .header("Authorization", "Bearer " + accessToken)
                .GET()
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200) {
            throw new RuntimeException("Error al llamar a Graph API: " + response.body());
        }

        return objectMapper.readTree(response.body());
    }

    private String getGraphField(JsonNode node, String primary, String fallback) {
        if (node.has(primary) && !node.get(primary).isNull()) {
            return node.get(primary).asText();
        }
        if (fallback != null && node.has(fallback) && !node.get(fallback).isNull()) {
            return node.get(fallback).asText();
        }
        return null;
    }

    public com.apilamiento.control.dto.UsuarioDTO getAuthenticatedUser(String correo) {
        Usuario user = usuarioRepository.findByCorreo(correo).orElse(null);
        if (user == null) return null;
        com.apilamiento.control.dto.UsuarioDTO dto = new com.apilamiento.control.dto.UsuarioDTO();
        dto.setId(user.getId());
        dto.setIdMicrosoft(user.getIdMicrosoft());
        dto.setCorreo(user.getCorreo());
        dto.setNombre(user.getNombre());
        dto.setPuesto(user.getPuesto());
        dto.setArea(user.getArea());
        dto.setEmpresa(user.getEmpresa());
        dto.setDepartamento(user.getDepartamento());
        dto.setUbicacion(user.getUbicacion());
        dto.setRolId(user.getRolId());
        if (user.getRol() != null) dto.setRolNombre(user.getRol().getNombre());
        dto.setSitioId(user.getSitioId());
        dto.setUltimoAcceso(user.getUltimoAcceso());
        dto.setEstadoActivo(user.getEstadoActivo());
        return dto;
    }

    public List<String> searchUsersByEmail(String query) throws Exception {
        if (query == null || query.isBlank()) return List.of();

        String token = getAppAccessToken();

        String url = GRAPH_USERS_URL + "?$search=%22mail:" + URLEncoder.encode(query, StandardCharsets.UTF_8) + "%22&$select=mail&$top=10&$count=true";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Authorization", "Bearer " + token)
                .header("ConsistencyLevel", "eventual")
                .GET()
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200) {
            throw new RuntimeException("Error al buscar usuarios en Graph: " + response.body());
        }

        JsonNode json = objectMapper.readTree(response.body());
        JsonNode users = json.get("value");
        if (users == null || !users.isArray()) return List.of();

        List<String> emails = new java.util.ArrayList<>();
        for (JsonNode user : users) {
            if (user.has("mail") && !user.get("mail").isNull()) {
                emails.add(user.get("mail").asText());
            }
        }
        return emails;
    }

    private String getAppAccessToken() throws Exception {
        if (appAccessToken != null && appTokenExpiry != null && Instant.now().isBefore(appTokenExpiry)) {
            return appAccessToken;
        }

        String body = new StringJoiner("&")
                .add("client_id=" + URLEncoder.encode(clientId, StandardCharsets.UTF_8))
                .add("client_secret=" + URLEncoder.encode(clientSecret, StandardCharsets.UTF_8))
                .add("scope=" + URLEncoder.encode(GRAPH_DEFAULT_SCOPE, StandardCharsets.UTF_8))
                .add("grant_type=client_credentials")
                .toString();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(tokenUrl))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200) {
            throw new RuntimeException("Error al obtener token app-only: " + response.body());
        }

        JsonNode json = objectMapper.readTree(response.body());
        appAccessToken = json.get("access_token").asText();
        int expiresIn = json.has("expires_in") ? json.get("expires_in").asInt() : 3600;
        appTokenExpiry = Instant.now().plusSeconds(expiresIn - 60);
        return appAccessToken;
    }
}
