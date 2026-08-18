package com.apilamiento.control.service;

import com.apilamiento.control.dto.CampanaDTO;
import com.apilamiento.control.entity.Campana;
import com.apilamiento.control.mapper.CampanaMapper;
import com.apilamiento.control.repository.CampanaRepository;
import com.apilamiento.control.repository.PsrRepository;
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
class CampanaServiceTest {

    @Mock
    CampanaRepository repository;

    @Mock
    PsrRepository psrRepository;

    CampanaMapper mapper = new CampanaMapper();

    CampanaService service;

    @BeforeEach
    void setUp() {
        service = new CampanaService(repository, mapper, psrRepository);
    }

    @Test
    void eliminar_cuandoExisteSinReferencias_deberiaEliminar() {
        Campana campana = new Campana();
        campana.setId(1L);
        when(repository.findById(1L)).thenReturn(campana);
        when(psrRepository.listByCampanaId(1L)).thenReturn(List.of());

        boolean resultado = service.eliminar(1L);

        assertTrue(resultado);
        verify(repository).delete(campana);
    }

    @Test
    void eliminar_cuandoTienePsrs_deberiaLanzar409() {
        Campana campana = new Campana();
        campana.setId(1L);
        when(repository.findById(1L)).thenReturn(campana);
        when(psrRepository.listByCampanaId(1L)).thenReturn(List.of(new com.apilamiento.control.entity.Psr()));

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