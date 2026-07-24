package com.apilamiento.control.service;

import com.apilamiento.control.dto.OsrDTO;
import com.apilamiento.control.dto.OsrRequest;
import com.apilamiento.control.entity.Osr;
import com.apilamiento.control.entity.Psr;
import com.apilamiento.control.mapper.OsrMapper;
import com.apilamiento.control.repository.OsrRepository;
import com.apilamiento.control.repository.PsrRepository;
import jakarta.ws.rs.WebApplicationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OsrServiceTest {

    @Mock
    OsrRepository osrRepository;

    @Mock
    PsrRepository psrRepository;

    OsrService service;

    @BeforeEach
    void setUp() {
        service = new OsrService(osrRepository, psrRepository, new OsrMapper());
    }

    @Test
    void crear_deberiaAsociarOsrAlPsr() {
        Psr psr = new Psr();
        psr.setId(10L);
        when(psrRepository.findById(10L)).thenReturn(psr);
        when(osrRepository.findByPsrId(10L)).thenReturn(Optional.empty());
        when(osrRepository.findByNumeroOsr("OSR001")).thenReturn(Optional.empty());

        OsrRequest request = requestValido();
        OsrDTO result = service.crear(request);

        assertEquals(10L, result.getPsrId());
        assertEquals("OSR001", result.getNumeroOsr());
        assertEquals(new BigDecimal("150.50"), result.getCostoUnitario());
        assertEquals("PEN", result.getTipoMoneda());
        verify(osrRepository).persist(any(Osr.class));
    }

    @Test
    void crear_cuandoPsrYaTieneOsr_deberiaRetornarConflicto() {
        when(psrRepository.findById(10L)).thenReturn(new Psr());
        when(osrRepository.findByPsrId(10L)).thenReturn(Optional.of(new Osr()));

        WebApplicationException exception = assertThrows(
                WebApplicationException.class,
                () -> service.crear(requestValido()));

        assertEquals(409, exception.getResponse().getStatus());
        verify(osrRepository, never()).persist(any(Osr.class));
    }

    private OsrRequest requestValido() {
        OsrRequest request = new OsrRequest();
        request.setPsrId(10L);
        request.setNumeroOsr("OSR001");
        request.setCostoUnitario(new BigDecimal("150.50"));
        request.setTipoMoneda("PEN");
        return request;
    }
}
