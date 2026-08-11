package com.apilamiento.control.service;

import com.apilamiento.control.entity.Equipo;
import com.apilamiento.control.entity.EvidenciaDevolucionEquipo;
import com.apilamiento.control.entity.TipoEvidenciaDevolucion;
import com.apilamiento.control.mapper.EquipoMapper;
import com.apilamiento.control.mapper.EvidenciaDevolucionEquipoMapper;
import com.apilamiento.control.repository.EquipoRepository;
import com.apilamiento.control.repository.EvidenciaDevolucionEquipoRepository;
import jakarta.ws.rs.WebApplicationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.math.BigDecimal;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DevolucionEquipoServiceTest {
    @Mock EquipoRepository equipoRepository;
    @Mock EvidenciaDevolucionEquipoRepository evidenciaRepository;
    DevolucionEquipoService service;

    @BeforeEach
    void setUp() {
        service = new DevolucionEquipoService(equipoRepository, evidenciaRepository,
                new EquipoMapper(), new EvidenciaDevolucionEquipoMapper());
    }

    @Test
    void finalizar_rechazaHorometroFinalNulo() {
        when(equipoRepository.findById(1L)).thenReturn(equipoEnDevolucion());

        WebApplicationException error = assertThrows(WebApplicationException.class,
                () -> service.finalizar(1L, null, 9L));

        assertEquals(400, error.getResponse().getStatus());
    }

    @Test
    void finalizar_rechazaHorometroFinalSinDecimal() {
        when(equipoRepository.findById(1L)).thenReturn(equipoEnDevolucion());

        WebApplicationException error = assertThrows(WebApplicationException.class,
                () -> service.finalizar(1L, new BigDecimal("1234"), 9L));

        assertEquals(400, error.getResponse().getStatus());
    }

    @Test
    void finalizar_rechazaHorometroFinalConDosDecimales() {
        when(equipoRepository.findById(1L)).thenReturn(equipoEnDevolucion());

        WebApplicationException error = assertThrows(WebApplicationException.class,
                () -> service.finalizar(1L, new BigDecimal("1234.55"), 9L));

        assertEquals(400, error.getResponse().getStatus());
    }

    @Test
    void finalizar_rechazaHorometroFinalConMasDeSeisEnteros() {
        when(equipoRepository.findById(1L)).thenReturn(equipoEnDevolucion());

        WebApplicationException error = assertThrows(WebApplicationException.class,
                () -> service.finalizar(1L, new BigDecimal("1234567.5"), 9L));

        assertEquals(400, error.getResponse().getStatus());
    }

    @Test
    void finalizar_rechazaHorometroFinalMenorAlInicial() {
        when(equipoRepository.findById(1L)).thenReturn(equipoEnDevolucion());

        WebApplicationException error = assertThrows(WebApplicationException.class,
                () -> service.finalizar(1L, new BigDecimal("50.5"), 9L));

        assertEquals(400, error.getResponse().getStatus());
    }

    @Test
    void finalizar_rechazaSiEquipoYaFueDevuelto() {
        Equipo equipo = equipoEnDevolucion();
        equipo.setFechaDevolucion(java.time.OffsetDateTime.now());
        when(equipoRepository.findById(1L)).thenReturn(equipo);

        WebApplicationException error = assertThrows(WebApplicationException.class,
                () -> service.finalizar(1L, new BigDecimal("150.5"), 9L));

        assertEquals(409, error.getResponse().getStatus());
        assertEquals("El equipo ya fue devuelto", error.getMessage());
        verify(evidenciaRepository, never()).listByEquipo(anyLong());
    }

    @Test
    void finalizar_guardaHorometroFinalYMarcaDevuelto() {
        Equipo equipo = equipoEnDevolucion();
        List<EvidenciaDevolucionEquipo> evidencias = todasLasEvidencias();
        when(equipoRepository.findById(1L)).thenReturn(equipo);
        when(evidenciaRepository.listByEquipo(1L)).thenReturn(evidencias);

        service.finalizar(1L, new BigDecimal("150.5"), 9L);

        assertEquals(new BigDecimal("150.5"), equipo.getHorometroFin());
        assertEquals("DEVUELTO", equipo.getEstadoOperativo());
        assertNotNull(equipo.getFechaDevolucion());
        assertEquals(9L, equipo.getUsuarioActualizacion());
        assertTrue(evidencias.stream().allMatch(e -> e.getUsuarioActualizacion() != null
                && e.getFechaActualizacion() != null));
    }

    @Test
    void finalizar_rechazaSiFaltanEvidenciasDeAccesoriosPresentes() {
        Equipo equipo = equipoEnDevolucion();
        equipo.setBateria(true);
        equipo.setCargador(true);
        when(equipoRepository.findById(1L)).thenReturn(equipo);
        when(evidenciaRepository.listByEquipo(1L)).thenReturn(todasLasEvidencias());

        WebApplicationException error = assertThrows(WebApplicationException.class,
                () -> service.finalizar(1L, new BigDecimal("150.5"), 9L));

        assertEquals(400, error.getResponse().getStatus());
        assertTrue(error.getMessage().contains("BATERIA_1"));
        assertTrue(error.getMessage().contains("CARGADOR"));
    }

    @Test
    void finalizar_aceptaEvidenciasDeAccesoriosPresentes() {
        Equipo equipo = equipoEnDevolucion();
        equipo.setBateria(true);
        equipo.setCargador(true);
        when(equipoRepository.findById(1L)).thenReturn(equipo);
        List<EvidenciaDevolucionEquipo> todas = new java.util.ArrayList<>(todasLasEvidencias());
        todas.add(evidencia(TipoEvidenciaDevolucion.BATERIA_1));
        todas.add(evidencia(TipoEvidenciaDevolucion.CARGADOR));
        when(evidenciaRepository.listByEquipo(1L)).thenReturn(todas);

        service.finalizar(1L, new BigDecimal("150.5"), 9L);

        assertEquals("DEVUELTO", equipo.getEstadoOperativo());
    }

    @Test
    void guardarEvidencia_accesorio_deberiaPersistir() {
        Equipo equipo = equipoEnDevolucion();
        when(equipoRepository.findById(1L)).thenReturn(equipo);
        when(evidenciaRepository.findByEquipoAndTipo(1L, TipoEvidenciaDevolucion.CARGADOR))
                .thenReturn(java.util.Optional.empty());

        var dto = service.guardarEvidencia(1L, TipoEvidenciaDevolucion.CARGADOR.name(),
                "cargador.jpg", "image/jpeg", new byte[]{1, 2}, 9L);

        assertNotNull(dto);
        assertEquals("CARGADOR", dto.getTipo());
        verify(evidenciaRepository).persist(any(EvidenciaDevolucionEquipo.class));
    }

    @Test
    void finalizar_rechazaSiFaltaExtintorPresente() {
        Equipo equipo = equipoEnDevolucion();
        equipo.setExtintor(true);
        when(equipoRepository.findById(1L)).thenReturn(equipo);
        when(evidenciaRepository.listByEquipo(1L)).thenReturn(todasLasEvidencias());

        WebApplicationException error = assertThrows(WebApplicationException.class,
                () -> service.finalizar(1L, new BigDecimal("150.5"), 9L));

        assertEquals(400, error.getResponse().getStatus());
        assertTrue(error.getMessage().contains("EXTINTOR"));
    }

    @Test
    void finalizar_aceptaExtintorPresente() {
        Equipo equipo = equipoEnDevolucion();
        equipo.setExtintor(true);
        when(equipoRepository.findById(1L)).thenReturn(equipo);
        List<EvidenciaDevolucionEquipo> todas = new java.util.ArrayList<>(todasLasEvidencias());
        todas.add(evidencia(TipoEvidenciaDevolucion.EXTINTOR));
        when(evidenciaRepository.listByEquipo(1L)).thenReturn(todas);

        service.finalizar(1L, new BigDecimal("150.5"), 9L);

        assertEquals("DEVUELTO", equipo.getEstadoOperativo());
    }

    private Equipo equipoEnDevolucion() {
        Equipo equipo = new Equipo();
        equipo.setId(1L);
        equipo.setHorometroInicio(new BigDecimal("100.5"));
        return equipo;
    }

    private List<EvidenciaDevolucionEquipo> todasLasEvidencias() {
        return List.of(
                evidencia(TipoEvidenciaDevolucion.DEVOLUCION_FRONTAL),
                evidencia(TipoEvidenciaDevolucion.DEVOLUCION_LATERAL_IZQUIERDO),
                evidencia(TipoEvidenciaDevolucion.DEVOLUCION_LATERAL_DERECHO),
                evidencia(TipoEvidenciaDevolucion.DEVOLUCION_POSTERIOR));
    }

    private EvidenciaDevolucionEquipo evidencia(TipoEvidenciaDevolucion tipo) {
        EvidenciaDevolucionEquipo evidence = new EvidenciaDevolucionEquipo();
        evidence.setTipo(tipo);
        return evidence;
    }
}
