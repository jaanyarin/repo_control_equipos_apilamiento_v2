package com.apilamiento.control.service;

import com.apilamiento.control.dto.AreaDTO;
import com.apilamiento.control.entity.Area;
import com.apilamiento.control.entity.Usuario;
import com.apilamiento.control.mapper.AreaMapper;
import com.apilamiento.control.repository.AreaRepository;
import com.apilamiento.control.repository.EquipoRepository;
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
class AreaServiceTest {

    @Mock AreaRepository repository;
    @Mock EquipoRepository equipoRepository;
    @Mock UsuarioRepository usuarioRepository;
    AreaMapper mapper = new AreaMapper();
    AreaService service;

    @BeforeEach
    void setUp() {
        service = new AreaService(repository, mapper, equipoRepository, usuarioRepository);
    }

    @Test
    void listarTodas_deberiaRetornarLista() {
        Area area = new Area();
        area.setId(1L);
        area.setNombre("Test Area");
        when(repository.listAll()).thenReturn(List.of(area));

        List<AreaDTO> result = service.listarTodas();

        assertEquals(1, result.size());
        assertEquals("Test Area", result.getFirst().getNombre());
    }

    @Test
    void buscarPorId_cuandoExiste_deberiaRetornarDTO() {
        Area area = new Area();
        area.setId(1L);
        area.setNombre("Area Uno");
        when(repository.findById(1L)).thenReturn(area);

        AreaDTO result = service.buscarPorId(1L);

        assertNotNull(result);
        assertEquals("Area Uno", result.getNombre());
    }

    @Test
    void buscarPorId_cuandoNoExiste_deberiaRetornarNull() {
        when(repository.findById(99L)).thenReturn(null);

        AreaDTO result = service.buscarPorId(99L);

        assertNull(result);
    }

    @Test
    void crear_nombreDuplicado_deberiaLanzar409() {
        Area existente = new Area();
        existente.setId(1L);
        existente.setNombre("Recepcion");
        when(repository.findByNombre("Recepcion")).thenReturn(Optional.of(existente));

        AreaDTO dto = new AreaDTO();
        dto.setNombre("Recepcion");

        WebApplicationException ex = assertThrows(WebApplicationException.class,
                () -> service.crear(dto));
        assertEquals(409, ex.getResponse().getStatus());
    }

    @Test
    void crear_nombreValido_deberiaPersistir() {
        when(repository.findByNombre("Nueva Area")).thenReturn(Optional.empty());

        AreaDTO dto = new AreaDTO();
        dto.setNombre("Nueva Area");

        AreaDTO result = service.crear(dto);

        assertNotNull(result);
        verify(repository).persist(any(Area.class));
    }

    @Test
    void actualizar_nombreDuplicado_enOtroRegistro_deberiaLanzar409() {
        Area actual = new Area();
        actual.setId(1L);
        actual.setNombre("Original");
        when(repository.findById(1L)).thenReturn(actual);

        Area duplicada = new Area();
        duplicada.setId(2L);
        duplicada.setNombre("Duplicada");
        when(repository.findByNombre("Duplicada")).thenReturn(Optional.of(duplicada));

        AreaDTO dto = new AreaDTO();
        dto.setNombre("Duplicada");

        WebApplicationException ex = assertThrows(WebApplicationException.class,
                () -> service.actualizar(1L, dto));
        assertEquals(409, ex.getResponse().getStatus());
    }

    @Test
    void actualizar_nombreValido_deberiaActualizar() {
        Area actual = new Area();
        actual.setId(1L);
        actual.setNombre("Original");
        when(repository.findById(1L)).thenReturn(actual);
        when(repository.findByNombre("Renombrada")).thenReturn(Optional.empty());

        AreaDTO dto = new AreaDTO();
        dto.setNombre("Renombrada");

        AreaDTO result = service.actualizar(1L, dto);

        assertEquals("Renombrada", result.getNombre());
    }

    @Test
    void eliminar_areaNoExiste_deberiaRetornarFalse() {
        when(repository.findById(99L)).thenReturn(null);

        assertFalse(service.eliminar(99L));
    }

    @Test
    void eliminar_areaConEquipos_deberiaLanzar409() {
        Area area = new Area();
        area.setId(1L);
        area.setNombre("Area Con Equipos");
        when(repository.findById(1L)).thenReturn(area);
        when(equipoRepository.count("areaId", 1L)).thenReturn(3L);

        WebApplicationException ex = assertThrows(WebApplicationException.class,
                () -> service.eliminar(1L));
        assertEquals(409, ex.getResponse().getStatus());
        verify(repository, never()).delete(any());
    }

    @Test
    void eliminar_areaConUsuarios_deberiaLanzar409() {
        Area area = new Area();
        area.setId(1L);
        area.setNombre("Area Con Usuarios");
        when(repository.findById(1L)).thenReturn(area);
        when(equipoRepository.count("areaId", 1L)).thenReturn(0L);
        when(usuarioRepository.count("area", "Area Con Usuarios")).thenReturn(2L);

        WebApplicationException ex = assertThrows(WebApplicationException.class,
                () -> service.eliminar(1L));
        assertEquals(409, ex.getResponse().getStatus());
        verify(repository, never()).delete(any());
    }

    @Test
    void eliminar_areaSinReferencias_deberiaEliminar() {
        Area area = new Area();
        area.setId(1L);
        area.setNombre("Area Vacia");
        when(repository.findById(1L)).thenReturn(area);
        when(equipoRepository.count("areaId", 1L)).thenReturn(0L);
        when(usuarioRepository.count("area", "Area Vacia")).thenReturn(0L);

        assertTrue(service.eliminar(1L));
        verify(repository).delete(area);
    }

    @Test
    void areaIdDelUsuario_usuarioConArea_deberiaRetornarAreaId() {
        Usuario usuario = new Usuario();
        usuario.setArea("Recepcion");
        when(usuarioRepository.findByIdOptional(10L)).thenReturn(Optional.of(usuario));

        Area area = new Area();
        area.setId(5L);
        area.setNombre("Recepcion");
        when(repository.findByNombre("Recepcion")).thenReturn(Optional.of(area));

        Long result = service.areaIdDelUsuario(10L);

        assertEquals(5L, result);
    }

    @Test
    void areaIdDelUsuario_usuarioSinArea_deberiaRetornarNull() {
        Usuario usuario = new Usuario();
        usuario.setArea(null);
        when(usuarioRepository.findByIdOptional(10L)).thenReturn(Optional.of(usuario));

        assertNull(service.areaIdDelUsuario(10L));
    }

    @Test
    void areaIdDelUsuario_usuarioNulo_deberiaRetornarNull() {
        assertNull(service.areaIdDelUsuario(null));
    }
}
