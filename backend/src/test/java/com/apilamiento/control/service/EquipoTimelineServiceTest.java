package com.apilamiento.control.service;

import com.apilamiento.control.dto.EquipoTimelineDTO;
import com.apilamiento.control.dto.EquipoTimelineEventDTO;
import com.apilamiento.control.entity.Averia;
import com.apilamiento.control.entity.Campana;
import com.apilamiento.control.entity.Equipo;
import com.apilamiento.control.entity.EvidenciaAveria;
import com.apilamiento.control.entity.EvidenciaDevolucionEquipo;
import com.apilamiento.control.entity.EvidenciaIngresoEquipo;
import com.apilamiento.control.entity.MotivoPsr;
import com.apilamiento.control.entity.Osr;
import com.apilamiento.control.entity.Psr;
import com.apilamiento.control.entity.Proveedor;
import com.apilamiento.control.entity.Sede;
import com.apilamiento.control.entity.TipoEvidenciaDevolucion;
import com.apilamiento.control.entity.TipoEvidenciaIngreso;
import com.apilamiento.control.repository.AveriaRepository;
import com.apilamiento.control.repository.CampanaRepository;
import com.apilamiento.control.repository.EquipoRepository;
import com.apilamiento.control.repository.EvidenciaAveriaRepository;
import com.apilamiento.control.repository.EvidenciaDevolucionEquipoRepository;
import com.apilamiento.control.repository.EvidenciaIngresoEquipoRepository;
import com.apilamiento.control.repository.MotivoPsrRepository;
import com.apilamiento.control.repository.OsrRepository;
import com.apilamiento.control.repository.ProveedorRepository;
import com.apilamiento.control.repository.PsrRepository;
import com.apilamiento.control.repository.SedeRepository;
import com.apilamiento.control.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EquipoTimelineServiceTest {

    @Mock
    EquipoRepository equipoRepository;
    @Mock
    OsrRepository osrRepository;
    @Mock
    PsrRepository psrRepository;
    @Mock
    AveriaRepository averiaRepository;
    @Mock
    EvidenciaIngresoEquipoRepository evidenciaIngresoRepository;
    @Mock
    EvidenciaAveriaRepository evidenciaAveriaRepository;
    @Mock
    EvidenciaDevolucionEquipoRepository evidenciaDevolucionRepository;
    @Mock
    MotivoPsrRepository motivoPsrRepository;
    @Mock
    SedeRepository sedeRepository;
    @Mock
    CampanaRepository campanaRepository;
    @Mock
    ProveedorRepository proveedorRepository;
    @Mock
    UsuarioRepository usuarioRepository;

    EquipoTimelineService service;

    @BeforeEach
    void setUp() {
        service = new EquipoTimelineService(equipoRepository, osrRepository, psrRepository,
                averiaRepository, evidenciaIngresoRepository, evidenciaAveriaRepository,
                evidenciaDevolucionRepository, motivoPsrRepository, sedeRepository,
                campanaRepository, proveedorRepository, usuarioRepository);
    }

    private Equipo equipoActivo() {
        Equipo equipo = new Equipo();
        equipo.setId(42L);
        equipo.setCodigo("EQ-000125");
        equipo.setModelo("E16");
        equipo.setNumeroSerie("H2X-458921");
        equipo.setEstadoOperativo("OPERATIVO");
        equipo.setProveedorId(7L);
        equipo.setHorometroInicio(new BigDecimal("1245"));
        equipo.setFechaIngreso(java.time.LocalDate.of(2026, 5, 2));
        equipo.setNumeroGuiaRemision("GR-2026-00125");
        return equipo;
    }

    private void mockVinculos(Equipo equipo, Psr psr, Osr osr) {
        when(osrRepository.findByEquipoId(42L)).thenReturn(Optional.ofNullable(osr));
        if (psr != null) {
            when(psrRepository.findByIdOptional(psr.getId())).thenReturn(Optional.of(psr));
        }
    }

    @Test
    void equipoNoEncontrado_devuelveNull() {
        when(equipoRepository.findByIdOptional(99L)).thenReturn(Optional.empty());
        assertNull(service.obtenerTimeline(99L));
    }

    @Test
    void equipoConPsrOsrIngreso_ejecutaEventosCompletos() {
        Equipo equipo = equipoActivo();
        when(equipoRepository.findByIdOptional(42L)).thenReturn(Optional.of(equipo));

        Sede sede = new Sede();
        sede.setId(1L);
        sede.setNombre("Recepción Packing");
        when(sedeRepository.findByIdOptional(1L)).thenReturn(Optional.of(sede));

        Campana campana = new Campana();
        campana.setId(2L);
        campana.setNombre("26-27");
        when(campanaRepository.findByIdOptional(2L)).thenReturn(Optional.of(campana));

        MotivoPsr motivo = new MotivoPsr();
        motivo.setId(3L);
        motivo.setNombre("Apilador - litio");
        when(motivoPsrRepository.findByIdOptional(3L)).thenReturn(Optional.of(motivo));

        Proveedor proveedor = new Proveedor();
        proveedor.setId(7L);
        proveedor.setRazonSocial("DERCO PERÚ SA");
        when(proveedorRepository.findByIdOptional(7L)).thenReturn(Optional.of(proveedor));

        Psr psr = new Psr();
        psr.setId(10L);
        psr.setNumeroPsr("PSR-2026-00231");
        psr.setSedeId(1L);
        psr.setCampanaId(2L);
        psr.setMotivoId(3L);
        psr.setFechaPsr(java.time.LocalDate.of(2026, 4, 25));
        when(psrRepository.findByIdOptional(10L)).thenReturn(Optional.of(psr));

        Osr osr = new Osr();
        osr.setId(20L);
        osr.setPsrId(10L);
        osr.setNumeroOsr("OSR-2026-00452");
        osr.setCostoUnitario(new BigDecimal("850"));
        osr.setTipoMoneda("USD");
        osr.setFechaOsr(java.time.LocalDate.of(2026, 4, 28));
        mockVinculos(equipo, psr, osr);

        when(averiaRepository.listByEquipoId(42L)).thenReturn(List.of());

        EquipoTimelineDTO dto = service.obtenerTimeline(42L);

        assertNotNull(dto);
        assertEquals(42L, dto.getEquipmentId());
        assertEquals("OPERATIVO", dto.getCurrentStatus());

        // PSR (25/04) + OSR (28/04) + INGRESO (02/05) + FINALIZACION PENDIENTE (null → último)
        assertEquals(4, dto.getEvents().size());
        List<String> tipos = dto.getEvents().stream().map(EquipoTimelineEventDTO::getType).toList();
        assertEquals(List.of("PSR", "OSR", "INGRESO", "FINALIZACION"), tipos);

        EquipoTimelineEventDTO psrEvent = dto.getEvents().get(0);
        assertEquals("PSR-2026-00231", psrEvent.getMetadata().getDocumentNumber());
        assertEquals("Recepción Packing", psrEvent.getMetadata().getArea());

        EquipoTimelineEventDTO ingresoEvent = dto.getEvents().get(2);
        assertEquals("GR-2026-00125", ingresoEvent.getMetadata().getDocumentNumber());
        assertEquals("DERCO PERÚ SA", ingresoEvent.getMetadata().getProvider());

        EquipoTimelineEventDTO finalizacion = dto.getEvents().get(3);
        assertEquals("PENDIENTE", finalizacion.getStatus());
        assertNull(finalizacion.getDateTime());

        assertEquals(0, dto.getSummary().getFailureCount());
        assertEquals(new BigDecimal("1245"), dto.getSummary().getInitialHourMeter());
    }

    @Test
    void equipoConAveriaAtendida_generaAveriaYReparacionConDowntime() {
        Equipo equipo = equipoActivo();
        when(equipoRepository.findByIdOptional(42L)).thenReturn(Optional.of(equipo));
        mockVinculos(equipo, null, null);
        when(proveedorRepository.findByIdOptional(7L)).thenReturn(Optional.empty());

        Averia averia = new Averia();
        averia.setId(82L);
        averia.setEquipoId(42L);
        averia.setDescripcionFalla("Falla en sistema hidráulico");
        averia.setHorometro(new BigDecimal("1300"));
        averia.setFechaHoraAveria(OffsetDateTime.of(2026, 8, 15, 10, 35, 0, 0, ZoneOffset.ofHours(-5)));
        averia.setFechaHoraAtencion(OffsetDateTime.of(2026, 8, 17, 14, 20, 0, 0, ZoneOffset.ofHours(-5)));
        averia.setAccionRealizada("Reparación del sistema hidráulico");
        averia.setEstadoAveria("ATENDIDA");
        when(averiaRepository.listByEquipoId(42L)).thenReturn(List.of(averia));

        EquipoTimelineDTO dto = service.obtenerTimeline(42L);

        // INGRESO (02/05) + AVERIA (15/08) + REPARACION (17/08) + FINALIZACION PENDIENTE (null → último)
        assertEquals(4, dto.getEvents().size());
        EquipoTimelineEventDTO averiaEvent = dto.getEvents().get(1);
        assertEquals("AVERIA", averiaEvent.getType());
        assertEquals(82L, averiaEvent.getRelatedId());
        assertEquals("averia-82", averiaEvent.getId());
        assertEquals("COMPLETADO", averiaEvent.getStatus());

        EquipoTimelineEventDTO reparacion = dto.getEvents().get(2);
        assertEquals("REPARACION", reparacion.getType());
        assertEquals("reparacion-82", reparacion.getId());
        assertEquals(82L, reparacion.getRelatedId());
        // 2 días 3 h 45 min = 3105 minutos
        assertEquals(3105L, reparacion.getMetadata().getDowntimeMinutes());

        assertEquals(3105L, dto.getSummary().getTotalDowntimeMinutes());
        assertEquals(1, dto.getSummary().getFailureCount());
    }

    @Test
    void averiaAbierta_estadoEnProcesoSinReparacion() {
        Equipo equipo = equipoActivo();
        when(equipoRepository.findByIdOptional(42L)).thenReturn(Optional.of(equipo));
        mockVinculos(equipo, null, null);
        when(proveedorRepository.findByIdOptional(7L)).thenReturn(Optional.empty());

        Averia averia = new Averia();
        averia.setId(83L);
        averia.setEquipoId(42L);
        averia.setDescripcionFalla("Problema eléctrico");
        averia.setFechaHoraAveria(OffsetDateTime.of(2026, 8, 18, 9, 15, 0, 0, ZoneOffset.ofHours(-5)));
        averia.setEstadoAveria("REPORTADA");
        when(averiaRepository.listByEquipoId(42L)).thenReturn(List.of(averia));

        EquipoTimelineDTO dto = service.obtenerTimeline(42L);

        assertEquals(3, dto.getEvents().size());
        EquipoTimelineEventDTO averiaEvent = dto.getEvents().get(1);
        assertEquals("AVERIA", averiaEvent.getType());
        assertEquals("EN_PROCESO", averiaEvent.getStatus());
        assertTrue(dto.getEvents().stream().noneMatch(e -> "REPARACION".equals(e.getType())));
    }

    @Test
    void equipoDevuelto_incluyeFinalizacionCompletada() {
        Equipo equipo = equipoActivo();
        equipo.setEstadoOperativo("DEVUELTO");
        equipo.setHorometroFin(new BigDecimal("1820"));
        equipo.setFechaDevolucion(OffsetDateTime.of(2026, 9, 30, 16, 45, 0, 0, ZoneOffset.ofHours(-5)));
        when(equipoRepository.findByIdOptional(42L)).thenReturn(Optional.of(equipo));
        mockVinculos(equipo, null, null);
        when(proveedorRepository.findByIdOptional(7L)).thenReturn(Optional.empty());
        when(averiaRepository.listByEquipoId(42L)).thenReturn(List.of());

        EvidenciaDevolucionEquipo evidencia = new EvidenciaDevolucionEquipo();
        evidencia.setTipo(TipoEvidenciaDevolucion.DEVOLUCION_FRONTAL);
        when(evidenciaDevolucionRepository.listByEquipo(42L)).thenReturn(List.of(evidencia));

        EquipoTimelineDTO dto = service.obtenerTimeline(42L);

        assertEquals(2, dto.getEvents().size());
        assertEquals("INGRESO", dto.getEvents().get(0).getType());
        EquipoTimelineEventDTO finalizacion = dto.getEvents().get(1);
        assertEquals("FINALIZACION", finalizacion.getType());
        assertEquals("COMPLETADO", finalizacion.getStatus());
        assertNotNull(finalizacion.getDateTime());
        assertEquals(1, finalizacion.getPhotos().size());
        assertEquals(new BigDecimal("1820"), dto.getSummary().getFinalHourMeter());
    }

    @Test
    void ingreso_conEvidencias_agregaFotos() {
        Equipo equipo = equipoActivo();
        when(equipoRepository.findByIdOptional(42L)).thenReturn(Optional.of(equipo));
        mockVinculos(equipo, null, null);
        when(proveedorRepository.findByIdOptional(7L)).thenReturn(Optional.empty());
        when(averiaRepository.listByEquipoId(42L)).thenReturn(List.of());

        EvidenciaIngresoEquipo evidencia = new EvidenciaIngresoEquipo();
        evidencia.setTipo(TipoEvidenciaIngreso.FRONTAL);
        when(evidenciaIngresoRepository.listByEquipo(42L)).thenReturn(List.of(evidencia));

        EquipoTimelineDTO dto = service.obtenerTimeline(42L);

        EquipoTimelineEventDTO ingreso = dto.getEvents().stream()
                .filter(e -> "INGRESO".equals(e.getType())).findFirst().orElseThrow();
        assertEquals(1, ingreso.getPhotos().size());
        assertEquals("/ingresos-equipo/42/evidencias/FRONTAL/archivo", ingreso.getPhotos().get(0).getUrl());
    }

    @Test
    void averiaConFotos_agregaFotosAlEvento() {
        Equipo equipo = equipoActivo();
        when(equipoRepository.findByIdOptional(42L)).thenReturn(Optional.of(equipo));
        mockVinculos(equipo, null, null);
        when(proveedorRepository.findByIdOptional(7L)).thenReturn(Optional.empty());

        Averia averia = new Averia();
        averia.setId(82L);
        averia.setEquipoId(42L);
        averia.setDescripcionFalla("Falla");
        averia.setEstadoAveria("REPORTADA");
        when(averiaRepository.listByEquipoId(42L)).thenReturn(List.of(averia));

        EvidenciaAveria foto = new EvidenciaAveria();
        foto.setAveriaId(82L);
        foto.setNumeroFoto((short) 1);
        when(evidenciaAveriaRepository.listByAveria(82L)).thenReturn(List.of(foto));

        EquipoTimelineDTO dto = service.obtenerTimeline(42L);

        EquipoTimelineEventDTO averiaEvent = dto.getEvents().stream()
                .filter(e -> "AVERIA".equals(e.getType())).findFirst().orElseThrow();
        assertEquals(1, averiaEvent.getPhotos().size());
        assertEquals("/averias/82/evidencias/1/archivo", averiaEvent.getPhotos().get(0).getUrl());
    }
}
