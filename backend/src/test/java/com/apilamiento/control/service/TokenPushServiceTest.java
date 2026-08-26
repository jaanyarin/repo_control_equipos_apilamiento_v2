package com.apilamiento.control.service;

import com.apilamiento.control.entity.TokenPush;
import com.apilamiento.control.repository.TokenPushRepository;
import jakarta.ws.rs.WebApplicationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TokenPushServiceTest {

    @Mock TokenPushRepository tokenPushRepository;
    TokenPushService service;

    @BeforeEach
    void setUp() {
        service = new TokenPushService(tokenPushRepository);
    }

    @Test
    void registrarTokenNuevoPersisteConUsuario() {
        when(tokenPushRepository.findByToken("abc-token")).thenReturn(Optional.empty());
        doAnswer(invocation -> invocation.getArgument(0)).when(tokenPushRepository).persist(any(TokenPush.class));

        service.registrarToken(7L, "abc-token", "android");

        ArgumentCaptor<TokenPush> captor = ArgumentCaptor.forClass(TokenPush.class);
        verify(tokenPushRepository).persist(captor.capture());
        TokenPush saved = captor.getValue();
        assertEquals(7L, saved.getUsuarioId());
        assertEquals("abc-token", saved.getToken());
        assertEquals("ANDROID", saved.getPlataforma());
        assertTrue(saved.getActivo());
        assertNull(saved.getFechaActualizacion());
    }

    @Test
    void registrarTokenExistenteReasignaUsuarioYActiva() {
        TokenPush existing = new TokenPush();
        existing.setId(5L);
        existing.setToken("abc-token");
        when(tokenPushRepository.findByToken("abc-token")).thenReturn(Optional.of(existing));

        service.registrarToken(9L, "abc-token", null);

        assertEquals(9L, existing.getUsuarioId());
        assertEquals("ANDROID", existing.getPlataforma());
        assertTrue(existing.getActivo());
        assertNotNull(existing.getFechaActualizacion());
    }

    @Test
    void registrarTokenRechazaTokenVacio() {
        WebApplicationException error = assertThrows(WebApplicationException.class,
                () -> service.registrarToken(1L, " ", "ANDROID"));
        assertEquals(400, error.getResponse().getStatus());
        verifyNoInteractions(tokenPushRepository);
    }

    @Test
    void registrarTokenRechazaUsuarioNull() {
        WebApplicationException error = assertThrows(WebApplicationException.class,
                () -> service.registrarToken(null, "abc-token", "ANDROID"));
        assertEquals(401, error.getResponse().getStatus());
        verifyNoInteractions(tokenPushRepository);
    }

    @Test
    void eliminarTokenDesactiva() {
        TokenPush existing = new TokenPush();
        existing.setToken("abc-token");
        when(tokenPushRepository.findByToken("abc-token")).thenReturn(Optional.of(existing));

        service.eliminarToken("abc-token");

        assertFalse(existing.getActivo());
        assertNotNull(existing.getFechaActualizacion());
    }

    @Test
    void registrarTokenDesactivaOtrosTokensDelMismoUsuario() {
        when(tokenPushRepository.findByToken("nuevo-token")).thenReturn(Optional.empty());
        doAnswer(invocation -> invocation.getArgument(0)).when(tokenPushRepository).persist(any(TokenPush.class));
        TokenPush viejo = new TokenPush();
        viejo.setId(3L);
        viejo.setToken("viejo-token");
        viejo.setActivo(true);
        when(tokenPushRepository.listActivosDeUsuarioExcluyendo(7L, "nuevo-token")).thenReturn(List.of(viejo));

        service.registrarToken(7L, "nuevo-token", "ANDROID");

        assertFalse(viejo.getActivo());
        assertNotNull(viejo.getFechaActualizacion());
    }

    @Test
    void desactivarTokenPorIdDaDeBajaSoloSiActivo() {
        TokenPush activo = new TokenPush();
        activo.setId(8L);
        activo.setActivo(true);
        when(tokenPushRepository.findById(8L)).thenReturn(activo);

        service.desactivarToken(8L);

        assertFalse(activo.getActivo());
        assertNotNull(activo.getFechaActualizacion());
    }

    @Test
    void desactivarTokenPorIdNoHaceNadaSiYaInactivo() {
        TokenPush inactivo = new TokenPush();
        inactivo.setId(9L);
        inactivo.setActivo(false);
        when(tokenPushRepository.findById(9L)).thenReturn(inactivo);

        service.desactivarToken(9L);

        assertFalse(inactivo.getActivo());
        assertNull(inactivo.getFechaActualizacion());
    }
}