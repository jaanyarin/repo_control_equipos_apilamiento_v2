package com.apilamiento.control.service;

import com.apilamiento.control.dto.MarcaDTO;
import com.apilamiento.control.entity.Marca;
import com.apilamiento.control.mapper.MarcaMapper;
import com.apilamiento.control.repository.EquipoRepository;
import com.apilamiento.control.repository.MarcaRepository;
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
class MarcaServiceTest {

    @Mock
    MarcaRepository repository;

    @Mock
    EquipoRepository equipoRepository;

    MarcaMapper mapper = new MarcaMapper();

    MarcaService service;

    @BeforeEach
    void setUp() {
        service = new MarcaService(repository, mapper, equipoRepository);
    }

    @Test
    void listarTodas_deberiaRetornarLista() {
        Marca marca = new Marca();
        marca.setId(1L);
        marca.setNombre("Toyota");
        marca.setCodigo("TOYOTA");
        when(repository.listAll()).thenReturn(List.of(marca));

        List<MarcaDTO> resultado = service.listarTodas();

        assertFalse(resultado.isEmpty());
        assertEquals(1, resultado.size());
        assertEquals("Toyota", resultado.get(0).getNombre());
    }

    @Test
    void buscarPorId_cuandoExiste_deberiaRetornarDTO() {
        Marca marca = new Marca();
        marca.setId(1L);
        marca.setNombre("Toyota");
        when(repository.findByIdOptional(1L)).thenReturn(Optional.of(marca));

        MarcaDTO resultado = service.buscarPorId(1L);

        assertNotNull(resultado);
        assertEquals("Toyota", resultado.getNombre());
    }

    @Test
    void buscarPorId_cuandoNoExiste_deberiaRetornarNull() {
        when(repository.findByIdOptional(99L)).thenReturn(Optional.empty());

        MarcaDTO resultado = service.buscarPorId(99L);

        assertNull(resultado);
    }

    @Test
    void crear_deberiaPersistirYRetornarDTO() {
        MarcaDTO dto = new MarcaDTO();
        dto.setNombre("Toyota");
        dto.setUsuarioCreacion(1L);

        MarcaDTO resultado = service.crear(dto);

        assertNotNull(resultado);
        verify(repository).persist(any(Marca.class));
    }

    @Test
    void eliminar_cuandoExiste_deberiaEliminarYRetornarTrue() {
        Marca marca = new Marca();
        marca.setId(1L);
        when(repository.findById(1L)).thenReturn(marca);
        when(equipoRepository.listByMarcaId(1L)).thenReturn(List.of());

        boolean resultado = service.eliminar(1L);

        assertTrue(resultado);
        verify(repository).delete(marca);
    }

    @Test
    void eliminar_cuandoTieneEquipos_deberiaLanzar409() {
        Marca marca = new Marca();
        marca.setId(1L);
        when(repository.findById(1L)).thenReturn(marca);
        when(equipoRepository.listByMarcaId(1L)).thenReturn(List.of(new com.apilamiento.control.entity.Equipo()));

        WebApplicationException exception = assertThrows(
                WebApplicationException.class,
                () -> service.eliminar(1L));

        assertEquals(409, exception.getResponse().getStatus());
        verify(repository, never()).delete(any());
    }

    @Test
    void eliminar_cuandoNoExiste_deberiaRetornarFalse() {
        when(repository.findById(99L)).thenReturn(null);

        boolean resultado = service.eliminar(99L);

        assertFalse(resultado);
        verify(repository, never()).delete(any());
    }
}
