package com.apilamiento.control.service;

import com.apilamiento.control.dto.UsuarioDTO;
import com.apilamiento.control.entity.Rol;
import com.apilamiento.control.entity.Usuario;
import com.apilamiento.control.mapper.UsuarioMapper;
import com.apilamiento.control.repository.RolRepository;
import com.apilamiento.control.repository.UsuarioRepository;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.WebApplicationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    UsuarioRepository repository;

    @Mock
    RolRepository rolRepository;

    UsuarioMapper mapper = new UsuarioMapper();

    UsuarioService service;

    @BeforeEach
    void setUp() {
        service = new UsuarioService(repository, rolRepository, mapper);
    }

    private Usuario usuarioPersistido(Long id, String nombre, Long rolId) {
        Usuario usuario = new Usuario();
        usuario.setId(id);
        usuario.setNombre(nombre);
        usuario.setRolId(rolId);
        return usuario;
    }

    @Test
    void crear_soloConNombre_deberiaAsignarRolUsuarioPorDefecto() {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setNombre("Juan Pérez");

        Rol rolUsuario = new Rol();
        rolUsuario.setId(3L);
        rolUsuario.setNombre("Usuario");

        when(rolRepository.findByNombre("Usuario")).thenReturn(Optional.of(rolUsuario));

        doAnswer(invocation -> {
            Usuario u = invocation.getArgument(0);
            u.setId(10L);
            return null;
        }).when(repository).persist(any(Usuario.class));

        UsuarioDTO resultado = service.crear(dto);

        assertNotNull(resultado);
        assertEquals("Juan Pérez", resultado.getNombre());
        assertEquals(3L, resultado.getRolId());
        assertNull(resultado.getCorreo());
        verify(repository).persist(any(Usuario.class));
    }

    @Test
    void crear_sinNombre_deberiaLanzarBadRequest() {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setNombre("   ");

        assertThrows(BadRequestException.class, () -> service.crear(dto));
        verify(repository, never()).persist(any(Usuario.class));
    }

    @Test
    void crear_conCorreoExistente_deberiaLanzarConflict() {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setNombre("Juan Pérez");
        dto.setCorreo("juan@test.local");

        when(repository.findByCorreo("juan@test.local")).thenReturn(Optional.of(new Usuario()));

        assertThrows(WebApplicationException.class, () -> service.crear(dto));
        verify(repository, never()).persist(any(Usuario.class));
    }

    @Test
    void crear_sinRolUsuarioEnCatalogo_deberiaLanzarBadRequest() {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setNombre("Juan Pérez");

        when(rolRepository.findByNombre("Usuario")).thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> service.crear(dto));
        verify(repository, never()).persist(any(Usuario.class));
    }

    @Test
    void actualizar_conNombre_deberiaActualizar() {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setNombre("Nombre Actualizado");

        when(repository.findById(10L)).thenReturn(usuarioPersistido(10L, "Viejo", 2L));

        UsuarioDTO resultado = service.actualizar(10L, dto);

        assertNotNull(resultado);
        assertEquals("Nombre Actualizado", resultado.getNombre());
        assertEquals(2L, resultado.getRolId());
    }

    @Test
    void actualizar_cuandoNoExiste_deberiaRetornarNull() {
        when(repository.findById(99L)).thenReturn(null);

        UsuarioDTO resultado = service.actualizar(99L, new UsuarioDTO());

        assertNull(resultado);
    }

    @Test
    void actualizar_superAdminProtegido_cambiarRol_deberiaLanzarBadRequest() {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setRolId(2L);

        Usuario superAdmin = usuarioPersistido(1L, "Super Admin", 1L);
        superAdmin.setIdMicrosoft("seed-superadmin");
        when(repository.findById(1L)).thenReturn(superAdmin);

        assertThrows(BadRequestException.class, () -> service.actualizar(1L, dto));
    }

    @Test
    void actualizar_superAdminProtegido_desactivar_deberiaLanzarBadRequest() {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setEstadoActivo(false);

        Usuario superAdmin = usuarioPersistido(1L, "Super Admin", 1L);
        superAdmin.setIdMicrosoft("seed-superadmin");
        when(repository.findById(1L)).thenReturn(superAdmin);

        assertThrows(BadRequestException.class, () -> service.actualizar(1L, dto));
    }

    @Test
    void actualizar_superAdminProtegido_cualquierModificacion_deberiaLanzarBadRequest() {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setNombre("Nombre Normal");

        Usuario superAdmin = usuarioPersistido(1L, "Super Admin", 1L);
        superAdmin.setIdMicrosoft("seed-superadmin");
        when(repository.findById(1L)).thenReturn(superAdmin);

        assertThrows(BadRequestException.class, () -> service.actualizar(1L, dto));
        verify(repository, never()).delete(any(Usuario.class));
    }

    @Test
    void eliminar_superAdminProtegido_deberiaLanzarBadRequest() {
        Usuario superAdmin = usuarioPersistido(1L, "Super Admin", 1L);
        superAdmin.setIdMicrosoft("seed-superadmin");
        when(repository.findById(1L)).thenReturn(superAdmin);

        assertThrows(BadRequestException.class, () -> service.eliminar(1L));
        verify(repository, never()).delete(any(Usuario.class));
    }
}
