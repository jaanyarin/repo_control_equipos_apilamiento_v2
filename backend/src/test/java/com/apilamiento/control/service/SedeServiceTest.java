package com.apilamiento.control.service;

import com.apilamiento.control.dto.SedeDTO;
import com.apilamiento.control.entity.Sede;
import com.apilamiento.control.mapper.SedeMapper;
import com.apilamiento.control.repository.PsrRepository;
import com.apilamiento.control.repository.SedeRepository;
import com.apilamiento.control.repository.UsuarioRepository;
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
class SedeServiceTest {

    @Mock
    SedeRepository repository;

    @Mock
    PsrRepository psrRepository;

    @Mock
    UsuarioRepository usuarioRepository;

    SedeMapper mapper = new SedeMapper();

    SedeService service;

    @BeforeEach
    void setUp() {
        service = new SedeService(repository, mapper, psrRepository, usuarioRepository);
    }

    @Test
    void eliminar_cuandoExisteSinReferencias_deberiaEliminar() {
        Sede sede = new Sede();
        sede.setId(1L);
        when(repository.findById(1L)).thenReturn(sede);
        when(psrRepository.listBySedeId(1L)).thenReturn(List.of());
        when(usuarioRepository.findBySitioId(1L)).thenReturn(List.of());

        boolean resultado = service.eliminar(1L);

        assertTrue(resultado);
        verify(repository).delete(sede);
    }

    @Test
    void eliminar_cuandoTienePsrs_deberiaLanzar409() {
        Sede sede = new Sede();
        sede.setId(1L);
        when(repository.findById(1L)).thenReturn(sede);
        when(psrRepository.listBySedeId(1L)).thenReturn(List.of(new com.apilamiento.control.entity.Psr()));

        WebApplicationException exception = assertThrows(
                WebApplicationException.class,
                () -> service.eliminar(1L));

        assertEquals(409, exception.getResponse().getStatus());
        verify(repository, never()).delete(any());
    }

    @Test
    void eliminar_cuandoTieneUsuarios_deberiaLanzar409() {
        Sede sede = new Sede();
        sede.setId(1L);
        when(repository.findById(1L)).thenReturn(sede);
        when(psrRepository.listBySedeId(1L)).thenReturn(List.of());
        when(usuarioRepository.findBySitioId(1L)).thenReturn(List.of(new com.apilamiento.control.entity.Usuario()));

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