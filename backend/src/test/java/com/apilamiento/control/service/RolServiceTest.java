package com.apilamiento.control.service;

import com.apilamiento.control.dto.RolDTO;
import com.apilamiento.control.entity.Rol;
import com.apilamiento.control.mapper.RolMapper;
import com.apilamiento.control.repository.RolRepository;
import com.apilamiento.control.repository.UsuarioRepository;
import jakarta.ws.rs.WebApplicationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RolServiceTest {

    @Mock
    RolRepository repository;

    @Mock
    UsuarioRepository usuarioRepository;

    RolMapper mapper = new RolMapper();

    RolService service;

    @BeforeEach
    void setUp() {
        service = new RolService(repository, mapper, usuarioRepository);
    }

    @Test
    void listarTodos_deberiaRetornarLista() {
        Rol rol = new Rol();
        rol.setId(1L);
        rol.setNombre("Admin");
        when(repository.listAll()).thenReturn(List.of(rol));

        List<RolDTO> resultado = service.listarTodos();

        assertFalse(resultado.isEmpty());
        assertEquals(1, resultado.size());
        assertEquals("Admin", resultado.get(0).getNombre());
    }

    @Test
    void buscarPorId_cuandoExiste_deberiaRetornarDTO() {
        Rol rol = new Rol();
        rol.setId(1L);
        rol.setNombre("Admin");
        when(repository.findByIdOptional(1L)).thenReturn(Optional.of(rol));

        RolDTO resultado = service.buscarPorId(1L);

        assertNotNull(resultado);
        assertEquals("Admin", resultado.getNombre());
    }

    @Test
    void crear_deberiaPersistirYRetornarDTO() {
        RolDTO dto = new RolDTO();
        dto.setNombre("NuevoRol");
        dto.setDescripcion("Test");

        RolDTO resultado = service.crear(dto);

        assertNotNull(resultado);
        verify(repository).persist(any(Rol.class));
    }

    @Test
    void eliminar_cuandoExiste_deberiaRetornarTrue() {
        Rol rol = new Rol();
        rol.setId(1L);
        when(repository.findById(1L)).thenReturn(rol);
        when(usuarioRepository.findByRolId(1L)).thenReturn(List.of());

        boolean resultado = service.eliminar(1L);

        assertTrue(resultado);
        verify(repository).delete(rol);
    }

    @Test
    void eliminar_cuandoTieneUsuarios_deberiaLanzar409() {
        Rol rol = new Rol();
        rol.setId(1L);
        when(repository.findById(1L)).thenReturn(rol);
        when(usuarioRepository.findByRolId(1L)).thenReturn(List.of(new com.apilamiento.control.entity.Usuario()));

        WebApplicationException exception = assertThrows(
                WebApplicationException.class,
                () -> service.eliminar(1L));

        assertEquals(409, exception.getResponse().getStatus());
        verify(repository, never()).delete(any());
    }
}
