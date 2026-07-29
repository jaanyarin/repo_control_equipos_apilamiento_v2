package com.apilamiento.control.service;

import com.apilamiento.control.dto.PsrPendienteEquipoDTO;
import com.apilamiento.control.entity.*;
import com.apilamiento.control.mapper.EquipoMapper;
import com.apilamiento.control.mapper.EvidenciaIngresoEquipoMapper;
import com.apilamiento.control.repository.*;
import jakarta.ws.rs.WebApplicationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IngresoEquipoServiceTest {
    @Mock PsrRepository psrRepository;
    @Mock OsrRepository osrRepository;
    @Mock MotivoPsrRepository motivoRepository;
    @Mock EquipoRepository equipoRepository;
    @Mock ProveedorRepository proveedorRepository;
    @Mock MarcaRepository marcaRepository;
    @Mock TipoEquipoRepository tipoEquipoRepository;
    @Mock EvidenciaIngresoEquipoRepository evidenciaRepository;
    IngresoEquipoService service;

    @BeforeEach
    void setUp() {
        service = new IngresoEquipoService(psrRepository, osrRepository, motivoRepository,
                equipoRepository, proveedorRepository, marcaRepository, tipoEquipoRepository,
                evidenciaRepository, new EquipoMapper(), new EvidenciaIngresoEquipoMapper());
    }

    @Test
    void pendientesIncluyeSoloPsrConOsrDisponible() {
        Psr psr = new Psr();
        psr.setId(10L);
        psr.setNumeroPsr("PSR10");
        psr.setEstadoActivo(true);
        psr.setMotivoId(5L);
        Osr osr = new Osr();
        osr.setId(20L);
        osr.setNumeroOsr("OSR20");
        osr.setEstadoActivo(true);
        when(psrRepository.list("estadoActivo", true)).thenReturn(List.of(psr));
        when(osrRepository.findByPsrId(10L)).thenReturn(Optional.of(osr));

        List<PsrPendienteEquipoDTO> result = service.listarPsrPendientes();

        assertEquals(1, result.size());
        assertEquals("OSR20", result.getFirst().getNumeroOsr());
        assertNull(result.getFirst().getBorradorEquipoId());
    }

    @Test
    void finalizarRechazaCuandoFaltanFotosBase() {
        Equipo equipo = draft();
        when(equipoRepository.findById(1L)).thenReturn(equipo);
        when(evidenciaRepository.listByEquipo(1L)).thenReturn(List.of());

        WebApplicationException error = assertThrows(WebApplicationException.class,
                () -> service.finalizar(1L, 9L));

        assertEquals(400, error.getResponse().getStatus());
        assertFalse(equipo.getIngresoCompleto());
    }

    @Test
    void finalizarCompletaConLasCincoFotosBase() {
        Equipo equipo = draft();
        when(equipoRepository.findById(1L)).thenReturn(equipo);
        when(evidenciaRepository.listByEquipo(1L)).thenReturn(List.of(
                evidence(TipoEvidenciaIngreso.LATERAL_IZQUIERDO),
                evidence(TipoEvidenciaIngreso.LATERAL_DERECHO),
                evidence(TipoEvidenciaIngreso.FRONTAL),
                evidence(TipoEvidenciaIngreso.POSTERIOR),
                evidence(TipoEvidenciaIngreso.GUIA_REMISION)));

        service.finalizar(1L, 9L);

        assertTrue(equipo.getIngresoCompleto());
        assertEquals(9L, equipo.getUsuarioActualizacion());
    }

    @Test
    void evidenciaRechazaMimeNoPermitido() {
        when(equipoRepository.findById(1L)).thenReturn(draft());
        assertThrows(WebApplicationException.class, () ->
                service.guardarEvidencia(1L, "FRONTAL", "foto.gif", "image/gif", new byte[]{1}, 9L));
        verifyNoInteractions(evidenciaRepository);
    }

    private Equipo draft() {
        Equipo equipo = new Equipo();
        equipo.setId(1L);
        equipo.setIngresoCompleto(false);
        return equipo;
    }

    private EvidenciaIngresoEquipo evidence(TipoEvidenciaIngreso tipo) {
        EvidenciaIngresoEquipo evidence = new EvidenciaIngresoEquipo();
        evidence.setTipo(tipo);
        return evidence;
    }
}
