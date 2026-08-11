package com.apilamiento.control.service;

import com.apilamiento.control.entity.Usuario;
import com.apilamiento.control.repository.RolRepository;
import com.apilamiento.control.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mindrot.jbcrypt.BCrypt;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LocalAuthServiceTest {

    @Mock
    UsuarioRepository usuarioRepository;

    @Mock
    RolRepository rolRepository;

    @Mock
    JwtService jwtService;

    LocalAuthService service;

    @BeforeEach
    void setUp() {
        service = new LocalAuthService(usuarioRepository, rolRepository, jwtService);
    }

    @Test
    void loginTemporal_deberiaIndicarCambioObligatorio() {
        Usuario usuario = usuarioNuevo();
        when(usuarioRepository.findById(15L)).thenReturn(usuario);
        when(jwtService.generateToken(usuario)).thenReturn("token-temporal");

        Map<String, Object> result = service.loginLocal(15L, "00000000");

        assertEquals("token-temporal", result.get("token"));
        assertEquals(Boolean.TRUE, result.get("passwordResetRequired"));
    }

    @Test
    void cambiarPassword_deberiaPersistirHashYDesactivarCambioObligatorio() {
        Usuario usuario = usuarioNuevo();
        when(usuarioRepository.findById(15L)).thenReturn(usuario);
        when(jwtService.generateToken(usuario)).thenReturn("token-definitivo");

        Map<String, Object> result = service.changePassword(15L, "00001234");

        assertFalse(usuario.getPasswordResetRequired());
        assertTrue(BCrypt.checkpw("00001234", usuario.getPasswordHash()));
        assertFalse(BCrypt.checkpw("00000000", usuario.getPasswordHash()));
        assertEquals("token-definitivo", result.get("token"));
        verify(usuarioRepository).persist(usuario);
    }

    @Test
    void cambiarPassword_deberiaRechazarMenosDeOchoDigitos() {
        RuntimeException error = assertThrows(
                RuntimeException.class,
                () -> service.changePassword(15L, "1234"));

        assertEquals("La nueva contraseña debe tener exactamente 8 dígitos numéricos", error.getMessage());
        verify(usuarioRepository, never()).findById(anyLong());
        verify(usuarioRepository, never()).persist(any(Usuario.class));
    }

    @Test
    void cambiarPassword_deberiaRechazarLetras() {
        RuntimeException error = assertThrows(
                RuntimeException.class,
                () -> service.changePassword(15L, "NuevaClave2026"));

        assertEquals("La nueva contraseña debe tener exactamente 8 dígitos numéricos", error.getMessage());
        verify(usuarioRepository, never()).findById(anyLong());
        verify(usuarioRepository, never()).persist(any(Usuario.class));
    }

    @Test
    void cambiarPassword_deberiaRechazarLaMismaPasswordTemporal() {
        Usuario usuario = usuarioNuevo();
        when(usuarioRepository.findById(15L)).thenReturn(usuario);

        RuntimeException error = assertThrows(
                RuntimeException.class,
                () -> service.changePassword(15L, "00000000"));

        assertEquals("La nueva contraseña debe ser diferente de la contraseña actual", error.getMessage());
        assertTrue(usuario.getPasswordResetRequired());
        verify(usuarioRepository, never()).persist(any(Usuario.class));
    }

    private Usuario usuarioNuevo() {
        Usuario usuario = new Usuario();
        usuario.setId(15L);
        usuario.setNombre("Usuario Prueba");
        usuario.setEstadoActivo(true);
        usuario.setPasswordHash(BCrypt.hashpw("00000000", BCrypt.gensalt()));
        usuario.setPasswordResetRequired(true);
        return usuario;
    }
}
