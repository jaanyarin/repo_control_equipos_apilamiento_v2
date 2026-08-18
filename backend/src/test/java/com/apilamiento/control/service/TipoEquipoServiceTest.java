package com.apilamiento.control.service;

import com.apilamiento.control.dto.TipoEquipoDTO;
import com.apilamiento.control.entity.TipoEquipo;
import com.apilamiento.control.mapper.TipoEquipoMapper;
import com.apilamiento.control.repository.EquipoRepository;
import com.apilamiento.control.repository.TipoEquipoRepository;
import jakarta.ws.rs.WebApplicationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TipoEquipoServiceTest {

    @Mock
    TipoEquipoRepository repository;

    @Mock
    EquipoRepository equipoRepository;

    TipoEquipoMapper mapper = new TipoEquipoMapper();

    TipoEquipoService service;

    @BeforeEach
    void setUp() {
        service = new TipoEquipoService(repository, mapper, equipoRepository);
    }

    @Test
    void eliminar_cuandoExisteSinReferencias_deberiaEliminar() {
        TipoEquipo tipo = new TipoEquipo();
        tipo.setId(1L);
        when(repository.findById(1L)).thenReturn(tipo);
        when(equipoRepository.listByTipoEquipoId(1L)).thenReturn(List.of());

        boolean resultado = service.eliminar(1L);

        assertTrue(resultado);
        verify(repository).delete(tipo);
    }

    @Test
    void eliminar_cuandoTieneEquipos_deberiaLanzar409() {
        TipoEquipo tipo = new TipoEquipo();
        tipo.setId(1L);
        when(repository.findById(1L)).thenReturn(tipo);
        when(equipoRepository.listByTipoEquipoId(1L)).thenReturn(List.of(new com.apilamiento.control.entity.Equipo()));

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