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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.util.Base64;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificacionPushServiceTest {

    @Mock TokenPushRepository tokenPushRepository;
    @Mock MarcaRepository marcaRepository;
    @Mock UsuarioRepository usuarioRepository;
    ObjectMapper objectMapper = new ObjectMapper();
    NotificacionPushMapper mapper = new NotificacionPushMapper();

    @Test
    void isConfiguradoRequeremProjectIdYServiceAccount() {
        NotificacionPushService sinConfig = new NotificacionPushService(tokenPushRepository,
                marcaRepository, usuarioRepository, mapper, "", "", HttpClient.newHttpClient(), objectMapper);
        assertFalse(sinConfig.isConfigurado());

        NotificacionPushService config = new NotificacionPushService(tokenPushRepository,
                marcaRepository, usuarioRepository, mapper, "apkequiposapilamiento", "{}", HttpClient.newHttpClient(), objectMapper);
        assertTrue(config.isConfigurado());
    }

    @Test
    void emitirIngresoEnviaAAllTokensConPayloadCorrecto() throws Exception {
        NotificacionPushService service = spy(new NotificacionPushService(tokenPushRepository,
                marcaRepository, usuarioRepository, mapper, "proj", "{}", HttpClient.newHttpClient(), objectMapper));
        doReturn("bearer-test").when(service).obtenerAccessToken();
        doNothing().when(service).enviarAToken(anyString(), any(), any());

        List<TokenPush> tokens = List.of(token("t1"), token("t2"), token("t3"));

        service.emitirIngreso("EQ-001", "JUAN PEREZ", "MODELO X", "TOYOTA", 100L, tokens);

        verify(service, times(3)).enviarAToken(anyString(), eq("bearer-test"), any());
        verifyNoInteractions(marcaRepository);
    }

    @Test
    void emitirIngresoIsolaFalloDeUnToken() throws Exception {
        NotificacionPushService service = spy(new NotificacionPushService(tokenPushRepository,
                marcaRepository, usuarioRepository, mapper, "proj", "{}", HttpClient.newHttpClient(), objectMapper));
        doReturn("bearer-test").when(service).obtenerAccessToken();
        doThrow(new RuntimeException("FCM 500")).when(service).enviarAToken(eq("t1"), any(), any());
        doNothing().when(service).enviarAToken(eq("t2"), any(), any());

        service.emitirIngreso("EQ-001", "JUAN PEREZ", "MODELO X", "TOYOTA", 100L,
                List.of(token("t1"), token("t2")));

        verify(service, times(2)).enviarAToken(anyString(), any(), any());
    }

    @Test
    void notificarIngresoEquipoResuelveMarcaYExcluyeOrigen() throws Exception {
        NotificacionPushService service = spy(new NotificacionPushService(tokenPushRepository,
                marcaRepository, usuarioRepository, mapper, "proj", "{}", HttpClient.newHttpClient(), objectMapper));
        when(tokenPushRepository.listActivosExcepto(9L)).thenReturn(List.of(token("t1"), token("t2")));
        Marca marca = new Marca();
        marca.setNombre("TOYOTA");
        when(marcaRepository.findById(3L)).thenReturn(marca);
        Usuario usuario = new Usuario();
        usuario.setId(9L);
        usuario.setNombre("JUAN PEREZ");
        when(usuarioRepository.findById(9L)).thenReturn(usuario);
        doNothing().when(service).emitirIngreso(anyString(), anyString(), anyString(), anyString(), any(), any());

        Equipo equipo = new Equipo();
        equipo.setId(100L);
        equipo.setCodigo("EQ-001");
        equipo.setModelo("MODELO X");
        equipo.setMarcaId(3L);
        service.notificarIngresoEquipo(equipo, 9L);

        Thread.sleep(200);
        verify(service).emitirIngreso(eq("EQ-001"), eq("JUAN PEREZ"), eq("MODELO X"), eq("TOYOTA"), eq(100L), anyList());
    }

    @Test
    void obtenerAccessTokenConstruyeJwtYCachea() throws Exception {
        KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
        generator.initialize(2048);
        KeyPair keyPair = generator.generateKeyPair();
        String privatePem = "-----BEGIN PRIVATE KEY-----\n"
                + Base64.getEncoder().encodeToString(keyPair.getPrivate().getEncoded())
                + "\n-----END PRIVATE KEY-----";
        String serviceAccount = "{\"client_email\":\"firebase-adminsdk@apkequiposapilamiento.iam.gserviceaccount.com\","
                + "\"private_key\":\"" + privatePem.replace("\n", "\\n") + "\"}";

        HttpClient httpClient = mock(HttpClient.class);
        @SuppressWarnings("unchecked")
        HttpResponse<String> success = mock(HttpResponse.class);
        when(success.statusCode()).thenReturn(200);
        when(success.body()).thenReturn("{\"access_token\":\"google-token-1\",\"expires_in\":3600}");
        doReturn(success).when(httpClient).send(any(HttpRequest.class), any());

        NotificacionPushService service = new NotificacionPushService(tokenPushRepository,
                marcaRepository, usuarioRepository, mapper, "proj", serviceAccount, httpClient, objectMapper);

        String first = service.obtenerAccessToken();
        String second = service.obtenerAccessToken();
        assertEquals("google-token-1", first);
        assertEquals(first, second);
        verify(httpClient, times(1)).send(any(HttpRequest.class), any());
    }

    @Test
    void enviarATokenRutaFcmCorrecta() throws Exception {
        HttpClient httpClient = mock(HttpClient.class);
        @SuppressWarnings("unchecked")
        HttpResponse<String> success = mock(HttpResponse.class);
        when(success.statusCode()).thenReturn(200);
        doReturn(success).when(httpClient).send(any(HttpRequest.class), any());

        NotificacionPushService service = new NotificacionPushService(tokenPushRepository,
                marcaRepository, usuarioRepository, mapper, "apkequiposapilamiento", "{}", httpClient, objectMapper);

        JsonNode message = mapper.mensajeIngreso("t1", "EQ-001", "JUAN PEREZ", "TOYOTA", "MODELO X", 100L);
        service.enviarAToken("t1", "bearer", message);

        var captor = org.mockito.ArgumentCaptor.forClass(HttpRequest.class);
        verify(httpClient).send(captor.capture(), any());
        assertTrue(captor.getValue().uri().toString()
                .equals("https://fcm.googleapis.com/v1/projects/apkequiposapilamiento/messages:send"));
        assertEquals("Bearer bearer", captor.getValue().headers().firstValue("Authorization").orElse(""));
    }

    @Test
    void enviarATokenLanzaSiFcmRespondeError() throws Exception {
        HttpClient httpClient = mock(HttpClient.class);
        @SuppressWarnings("unchecked")
        HttpResponse<String> error = mock(HttpResponse.class);
        when(error.statusCode()).thenReturn(404);
        when(error.body()).thenReturn("{\"error\":\"UNREGISTERED\"}");
        doReturn(error).when(httpClient).send(any(HttpRequest.class), any());

        NotificacionPushService service = new NotificacionPushService(tokenPushRepository,
                marcaRepository, usuarioRepository, mapper, "proj", "{}", httpClient, objectMapper);

        JsonNode message = mapper.mensajeIngreso("t1", "EQ-001", "JUAN PEREZ", "", "", 100L);
        assertThrows(RuntimeException.class, () -> service.enviarAToken("t1", "bearer", message));
    }

    private TokenPush token(String value) {
        TokenPush push = new TokenPush();
        push.setId((long) value.hashCode());
        push.setToken(value);
        push.setActivo(true);
        return push;
    }
}