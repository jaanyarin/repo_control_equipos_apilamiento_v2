package com.apilamiento.control.service;

import com.apilamiento.control.dto.PsrPendienteEquipoDTO;
import com.apilamiento.control.dto.IngresoEquipoRequest;
import com.apilamiento.control.dto.EquipoDTO;
import com.apilamiento.control.entity.*;
import com.apilamiento.control.mapper.EquipoMapper;
import com.apilamiento.control.mapper.EvidenciaIngresoEquipoMapper;
import com.apilamiento.control.repository.*;
import jakarta.ws.rs.WebApplicationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.math.BigDecimal;
import java.time.LocalDate;
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
    @Mock NotificacionPushService notificacionPushService;
    IngresoEquipoService service;

    @BeforeEach
    void setUp() {
        service = new IngresoEquipoService(psrRepository, osrRepository, motivoRepository,
                equipoRepository, proveedorRepository, marcaRepository, tipoEquipoRepository,
                evidenciaRepository, notificacionPushService,
                new EquipoMapper(), new EvidenciaIngresoEquipoMapper());
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
    void finalizarCompletaConLasFotosBase() {
        Equipo equipo = draft();
        when(equipoRepository.findById(1L)).thenReturn(equipo);
        when(evidenciaRepository.listByEquipo(1L)).thenReturn(List.of(
                evidence(TipoEvidenciaIngreso.GUIA_REMISION),
                evidence(TipoEvidenciaIngreso.HOROMETRO_INICIAL),
                evidence(TipoEvidenciaIngreso.FRONTAL),
                evidence(TipoEvidenciaIngreso.LATERAL_IZQUIERDO),
                evidence(TipoEvidenciaIngreso.LATERAL_DERECHO),
                evidence(TipoEvidenciaIngreso.POSTERIOR)));

        service.finalizar(1L, 9L);

        assertTrue(equipo.getIngresoCompleto());
        assertEquals(9L, equipo.getUsuarioActualizacion());
        verify(notificacionPushService).notificarIngresoEquipo(equipo, 9L);
    }

    @Test
    void finalizarRechazaCuandoFaltanLasVistasDelEquipo() {
        Equipo equipo = draft();
        when(equipoRepository.findById(1L)).thenReturn(equipo);
        when(evidenciaRepository.listByEquipo(1L)).thenReturn(List.of(
                evidence(TipoEvidenciaIngreso.GUIA_REMISION),
                evidence(TipoEvidenciaIngreso.HOROMETRO_INICIAL)));

        WebApplicationException error = assertThrows(WebApplicationException.class,
                () -> service.finalizar(1L, 9L));

        assertEquals(400, error.getResponse().getStatus());
        assertFalse(equipo.getIngresoCompleto());
    }

    @Test
    void guardarEvidencia_vistaFrontal_deberiaPersistir() {
        Equipo equipo = draft();
        when(equipoRepository.findById(1L)).thenReturn(equipo);
        when(evidenciaRepository.findByEquipoAndTipo(1L, TipoEvidenciaIngreso.FRONTAL)).thenReturn(Optional.empty());
        doAnswer(invocation -> {
            EvidenciaIngresoEquipo e = invocation.getArgument(0);
            return e;
        }).when(evidenciaRepository).persist(any(EvidenciaIngresoEquipo.class));

        var dto = service.guardarEvidencia(1L, "FRONTAL", "frontal.jpg", "image/jpeg", new byte[]{1, 2, 3}, 9L);

        assertNotNull(dto);
        assertEquals("FRONTAL", dto.getTipo());
        verify(evidenciaRepository).persist(any(EvidenciaIngresoEquipo.class));
    }

    @Test
    void evidenciaRechazaMimeNoPermitido() {
        when(equipoRepository.findById(1L)).thenReturn(draft());
        assertThrows(WebApplicationException.class, () ->
                service.guardarEvidencia(1L, "FRONTAL", "foto.gif", "image/gif", new byte[]{1}, 9L));
        verifyNoInteractions(evidenciaRepository);
    }

    @Test
    void crearBorrador_persisteHorometroInicioYFin() {
        Psr psr = new Psr();
        psr.setId(10L);
        psr.setEstadoActivo(true);
        Osr osr = new Osr();
        osr.setId(20L);
        osr.setEstadoActivo(true);
        osr.setNumeroOsr("OSR20");
        when(psrRepository.findById(10L)).thenReturn(psr);
        when(osrRepository.findByPsrIdForUpdate(10L)).thenReturn(Optional.of(osr));
        when(proveedorRepository.findById(1L)).thenReturn(proveedorActivo());
        when(marcaRepository.findById(2L)).thenReturn(marcaActiva());
        when(tipoEquipoRepository.findById(3L)).thenReturn(tipoActivo());
        when(equipoRepository.findByCodigo("COD-HOR-01")).thenReturn(Optional.empty());
        when(equipoRepository.findByNumeroSerie("SN001")).thenReturn(Optional.empty());

        ArgumentCaptor<Equipo> captor = ArgumentCaptor.forClass(Equipo.class);
        doAnswer(invocation -> {
            Equipo eq = invocation.getArgument(0);
            eq.setId(99L);
            return null;
        }).when(equipoRepository).persist(captor.capture());

        EquipoDTO equipoDTO = new EquipoDTO();
        equipoDTO.setProveedorId(1L);
        equipoDTO.setMarcaId(2L);
        equipoDTO.setTipoEquipoId(3L);
        equipoDTO.setModelo("MODEL-X");
        equipoDTO.setCodigo("cod-hor-01");
        equipoDTO.setNumeroSerie("SN001");
        equipoDTO.setFechaIngreso(LocalDate.of(2026, 8, 10));
        equipoDTO.setNumeroGuiaRemision("GUIA-001");
        equipoDTO.setHorometroInicio(new BigDecimal("1234.5"));
        equipoDTO.setHorometroFin(new BigDecimal("24345.6"));

        IngresoEquipoRequest request = new IngresoEquipoRequest();
        request.setPsrId(10L);
        request.setEquipo(equipoDTO);

        service.crearBorrador(request, 1L);

        Equipo persistido = captor.getValue();
        assertEquals(new BigDecimal("1234.5"), persistido.getHorometroInicio());
        assertEquals(new BigDecimal("24345.6"), persistido.getHorometroFin());
    }

    private Proveedor proveedorActivo() {
        Proveedor p = new Proveedor();
        p.setEstadoActivo(true);
        return p;
    }

    private Marca marcaActiva() {
        Marca m = new Marca();
        m.setEstadoActivo(true);
        return m;
    }

    private TipoEquipo tipoActivo() {
        TipoEquipo t = new TipoEquipo();
        t.setEstadoActivo(true);
        return t;
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
