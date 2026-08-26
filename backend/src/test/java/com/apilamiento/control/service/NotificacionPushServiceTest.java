package com.apilamiento.control.service;

import com.apilamiento.control.entity.Equipo;
import com.apilamiento.control.entity.Proveedor;
import com.apilamiento.control.entity.TokenPush;
import com.apilamiento.control.entity.Usuario;
import com.apilamiento.control.mapper.NotificacionPushMapper;
import com.apilamiento.control.repository.ProveedorRepository;
import com.apilamiento.control.repository.TokenPushRepository;
import com.apilamiento.control.repository.UsuarioRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
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
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificacionPushServiceTest {

    @Mock TokenPushRepository tokenPushRepository;
    @Mock ProveedorRepository proveedorRepository;
    @Mock UsuarioRepository usuarioRepository;
    @Mock TokenPushService tokenPushService;
    ObjectMapper objectMapper = new ObjectMapper();
    NotificacionPushMapper mapper = new NotificacionPushMapper();

    @Test
    void isConfiguradoRequeremProjectIdYServiceAccount() {
        NotificacionPushService sinConfig = new NotificacionPushService(tokenPushRepository,
                proveedorRepository, usuarioRepository, mapper, tokenPushService, "", "", HttpClient.newHttpClient(), objectMapper);
        assertFalse(sinConfig.isConfigurado());

        NotificacionPushService config = new NotificacionPushService(tokenPushRepository,
                proveedorRepository, usuarioRepository, mapper, tokenPushService, "apkequiposapilamiento", "{}", HttpClient.newHttpClient(), objectMapper);
        assertTrue(config.isConfigurado());
    }

    @Test
    void emitirEnviaAAllTokensConPayloadCorrecto() throws Exception {
        NotificacionPushService service = spy(new NotificacionPushService(tokenPushRepository,
                proveedorRepository, usuarioRepository, mapper, tokenPushService, "proj", "{}", HttpClient.newHttpClient(), objectMapper));
        doReturn("bearer-test").when(service).obtenerAccessToken();
        doNothing().when(service).enviarAToken(anyString(), any(), any());

        List<TokenPush> tokens = List.of(token("t1"), token("t2"), token("t3"));

        service.emitir(NotificacionPushMapper.TIPO_INGRESO_EQUIPO, "ACME S.A.C.", "EQ-001", "JUAN PEREZ", 100L, tokens);

        verify(service, times(3)).enviarAToken(anyString(), eq("bearer-test"), any());
    }

    @Test
    void emitirIsolaFalloDeUnToken() throws Exception {
        NotificacionPushService service = spy(new NotificacionPushService(tokenPushRepository,
                proveedorRepository, usuarioRepository, mapper, tokenPushService, "proj", "{}", HttpClient.newHttpClient(), objectMapper));
        doReturn("bearer-test").when(service).obtenerAccessToken();
        doThrow(new RuntimeException("FCM 500")).when(service).enviarAToken(eq("t1"), any(), any());
        doNothing().when(service).enviarAToken(eq("t2"), any(), any());

        service.emitir(NotificacionPushMapper.TIPO_INGRESO_EQUIPO, "ACME S.A.C.", "EQ-001", "JUAN PEREZ", 100L,
                List.of(token("t1"), token("t2")));

        verify(service, times(2)).enviarAToken(anyString(), any(), any());
    }

    @Test
    void emitirIngresoGeneraPlantillaConFormatoEsperado() throws Exception {
        NotificacionPushService service = spy(new NotificacionPushService(tokenPushRepository,
                proveedorRepository, usuarioRepository, mapper, tokenPushService, "proj", "{}", HttpClient.newHttpClient(), objectMapper));
        doReturn("bearer-test").when(service).obtenerAccessToken();
        doNothing().when(service).enviarAToken(anyString(), any(), any());

        service.emitir(NotificacionPushMapper.TIPO_INGRESO_EQUIPO, "ACME S.A.C.", "EQ-001", "JUAN PEREZ", 100L,
                List.of(token("t1")));

        ArgumentCaptor<JsonNode> captor = ArgumentCaptor.forClass(JsonNode.class);
        verify(service).enviarAToken(eq("t1"), eq("bearer-test"), captor.capture());
        JsonNode message = captor.getValue().path("message");
        assertEquals("Nuevo ingreso de equipo", message.path("notification").path("title").asText());
        String body = message.path("notification").path("body").asText();
        assertTrue(body.contains("Evento: Nuevo ingreso de Equipo"));
        assertTrue(body.contains("Proveedor: ACME S.A.C. - Codigo: EQ-001"));
        assertTrue(body.contains("Registrado por: JUAN PEREZ"));
        assertEquals(NotificacionPushMapper.TIPO_INGRESO_EQUIPO, message.path("data").path("tipo").asText());
        assertEquals("100", message.path("data").path("entidadId").asText());
    }

    @Test
    void notificarIngresoEquipoResuelveProveedorYExcluyeOrigen() throws Exception {
        NotificacionPushService service = spy(new NotificacionPushService(tokenPushRepository,
                proveedorRepository, usuarioRepository, mapper, tokenPushService, "proj", "{}", HttpClient.newHttpClient(), objectMapper));
        when(tokenPushRepository.listActivosExcepto(9L)).thenReturn(List.of(token("t1"), token("t2")));
        Proveedor proveedor = new Proveedor();
        proveedor.setRazonSocial("ACME S.A.C.");
        when(proveedorRepository.findById(4L)).thenReturn(proveedor);
        Usuario usuario = new Usuario();
        usuario.setId(9L);
        usuario.setNombre("JUAN PEREZ");
        when(usuarioRepository.findById(9L)).thenReturn(usuario);
        doNothing().when(service).emitir(anyString(), anyString(), anyString(), anyString(), any(), anyList());

        Equipo equipo = new Equipo();
        equipo.setId(100L);
        equipo.setCodigo("EQ-001");
        equipo.setProveedorId(4L);
        service.notificarIngresoEquipo(equipo, 9L);

        Thread.sleep(200);
        verify(service).emitir(eq(NotificacionPushMapper.TIPO_INGRESO_EQUIPO), eq("ACME S.A.C."), eq("EQ-001"),
                eq("JUAN PEREZ"), eq(100L), anyList());
    }

    @Test
    void notificarAveriaReportadaResuelveProveedorYExcluyeOrigen() throws Exception {
        NotificacionPushService service = spy(new NotificacionPushService(tokenPushRepository,
                proveedorRepository, usuarioRepository, mapper, tokenPushService, "proj", "{}", HttpClient.newHttpClient(), objectMapper));
        when(tokenPushRepository.listActivosExcepto(9L)).thenReturn(List.of(token("t1")));
        Proveedor proveedor = new Proveedor();
        proveedor.setRazonSocial("ACME S.A.C.");
        when(proveedorRepository.findById(4L)).thenReturn(proveedor);
        Usuario usuario = new Usuario();
        usuario.setId(9L);
        usuario.setNombre("JUAN PEREZ");
        when(usuarioRepository.findById(9L)).thenReturn(usuario);
        doNothing().when(service).emitir(anyString(), anyString(), anyString(), anyString(), any(), anyList());

        Equipo equipo = new Equipo();
        equipo.setId(100L);
        equipo.setCodigo("EQ-001");
        equipo.setProveedorId(4L);
        service.notificarAveriaReportada(equipo, 9L);

        Thread.sleep(200);
        verify(service).emitir(eq(NotificacionPushMapper.TIPO_AVERIA_REPORTADA), eq("ACME S.A.C."), eq("EQ-001"),
                eq("JUAN PEREZ"), eq(100L), anyList());
    }

    @Test
    void notificarAveriaAtendidaEncolaConTipoCorrecto() throws Exception {
        NotificacionPushService service = spy(new NotificacionPushService(tokenPushRepository,
                proveedorRepository, usuarioRepository, mapper, tokenPushService, "proj", "{}", HttpClient.newHttpClient(), objectMapper));
        when(tokenPushRepository.listActivosExcepto(9L)).thenReturn(List.of(token("t1")));
        when(proveedorRepository.findById(4L)).thenReturn(null);
        Usuario usuario = new Usuario();
        usuario.setId(9L);
        usuario.setNombre("JUAN PEREZ");
        when(usuarioRepository.findById(9L)).thenReturn(usuario);
        doNothing().when(service).emitir(anyString(), anyString(), anyString(), anyString(), any(), anyList());

        Equipo equipo = new Equipo();
        equipo.setId(100L);
        equipo.setCodigo("EQ-001");
        equipo.setProveedorId(4L);
        service.notificarAveriaAtendida(equipo, 9L);

        Thread.sleep(200);
        verify(service).emitir(eq(NotificacionPushMapper.TIPO_AVERIA_ATENDIDA), eq(""), eq("EQ-001"),
                eq("JUAN PEREZ"), eq(100L), anyList());
    }

    @Test
    void notificarServicioFinalizadoEncolaConTipoCorrecto() throws Exception {
        NotificacionPushService service = spy(new NotificacionPushService(tokenPushRepository,
                proveedorRepository, usuarioRepository, mapper, tokenPushService, "proj", "{}", HttpClient.newHttpClient(), objectMapper));
        when(tokenPushRepository.listActivosExcepto(9L)).thenReturn(List.of(token("t1")));
        when(proveedorRepository.findById(4L)).thenReturn(null);
        Usuario usuario = new Usuario();
        usuario.setId(9L);
        usuario.setNombre("JUAN PEREZ");
        when(usuarioRepository.findById(9L)).thenReturn(usuario);
        doNothing().when(service).emitir(anyString(), anyString(), anyString(), anyString(), any(), anyList());

        Equipo equipo = new Equipo();
        equipo.setId(100L);
        equipo.setCodigo("EQ-001");
        equipo.setProveedorId(4L);
        service.notificarServicioFinalizado(equipo, 9L);

        Thread.sleep(200);
        verify(service).emitir(eq(NotificacionPushMapper.TIPO_SERVICIO_FINALIZADO), eq(""), eq("EQ-001"),
                eq("JUAN PEREZ"), eq(100L), anyList());
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
                proveedorRepository, usuarioRepository, mapper, tokenPushService, "proj", serviceAccount, httpClient, objectMapper);

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
                proveedorRepository, usuarioRepository, mapper, tokenPushService, "apkequiposapilamiento", "{}", httpClient, objectMapper);

        JsonNode message = mapper.mensajeIngreso("t1", "ACME S.A.C.", "EQ-001", "JUAN PEREZ", 100L);
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
                proveedorRepository, usuarioRepository, mapper, tokenPushService, "proj", "{}", httpClient, objectMapper);

        JsonNode message = mapper.mensajeAveriaReportada("t1", "", "EQ-001", "JUAN PEREZ", 100L);
        assertThrows(NotificacionPushService.TokenFcmNoRegistradoException.class,
                () -> service.enviarAToken("t1", "bearer", message));
    }

    @Test
    void enviarATokenLanzaErrorGenericoEnOtrosFallos() throws Exception {
        HttpClient httpClient = mock(HttpClient.class);
        @SuppressWarnings("unchecked")
        HttpResponse<String> error = mock(HttpResponse.class);
        when(error.statusCode()).thenReturn(500);
        when(error.body()).thenReturn("{\"error\":\"InternalServerError\"}");
        doReturn(error).when(httpClient).send(any(HttpRequest.class), any());

        NotificacionPushService service = new NotificacionPushService(tokenPushRepository,
                proveedorRepository, usuarioRepository, mapper, tokenPushService, "proj", "{}", httpClient, objectMapper);

        JsonNode message = mapper.mensajeAveriaReportada("t1", "", "EQ-001", "JUAN PEREZ", 100L);
        Exception ex = assertThrows(RuntimeException.class,
                () -> service.enviarAToken("t1", "bearer", message));
        assertFalse(ex instanceof NotificacionPushService.TokenFcmNoRegistradoException);
    }

    @Test
    void emitirDaDeBajaTokenCuandoFcmRespondeUnregistered() throws Exception {
        NotificacionPushService service = spy(new NotificacionPushService(tokenPushRepository,
                proveedorRepository, usuarioRepository, mapper, tokenPushService, "proj", "{}",
                HttpClient.newHttpClient(), objectMapper));
        doReturn("bearer-test").when(service).obtenerAccessToken();
        TokenPush muerto = token("t-muerto");
        TokenPush vivo = token("t-vivo");
        doThrow(new NotificacionPushService.TokenFcmNoRegistradoException("UNREGISTERED"))
                .when(service).enviarAToken(eq("t-muerto"), any(), any());
        doNothing().when(service).enviarAToken(eq("t-vivo"), any(), any());

        service.emitir(NotificacionPushMapper.TIPO_AVERIA_REPORTADA, "ACME S.A.C.", "EQ-001", "JUAN PEREZ", 100L,
                List.of(muerto, vivo));

        verify(tokenPushService).desactivarToken(muerto.getId());
        verify(tokenPushService, never()).desactivarToken(vivo.getId());
    }

    @Test
    void buildMessageSeleccionaMapperSegunTipo() {
        NotificacionPushService service = new NotificacionPushService(tokenPushRepository,
                proveedorRepository, usuarioRepository, mapper, tokenPushService, "proj", "{}", HttpClient.newHttpClient(), objectMapper);

        JsonNode atendida = service.buildMessage(NotificacionPushMapper.TIPO_AVERIA_ATENDIDA,
                "t1", "ACME", "EQ-001", "JUAN", 100L);
        assertEquals("Avería atendida", atendida.path("message").path("notification").path("title").asText());

        JsonNode finalizada = service.buildMessage(NotificacionPushMapper.TIPO_SERVICIO_FINALIZADO,
                "t1", "ACME", "EQ-001", "JUAN", 100L);
        assertEquals("Servicio finalizado", finalizada.path("message").path("notification").path("title").asText());
    }

    private TokenPush token(String value) {
        TokenPush push = new TokenPush();
        push.setId((long) value.hashCode());
        push.setToken(value);
        push.setActivo(true);
        return push;
    }
}
