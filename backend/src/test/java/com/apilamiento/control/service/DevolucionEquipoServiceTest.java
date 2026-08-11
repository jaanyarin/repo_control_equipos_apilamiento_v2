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
        when(equipoRepository.findById(1L)).thenReturn(equipo);
        when(evidenciaRepository.listByEquipo(1L)).thenReturn(todasLasEvidencias());

        service.finalizar(1L, new BigDecimal("150.5"), 9L);

        assertEquals(new BigDecimal("150.5"), equipo.getHorometroFin());
        assertEquals("DEVUELTO", equipo.getEstadoOperativo());
        assertNotNull(equipo.getFechaDevolucion());
        assertEquals(9L, equipo.getUsuarioActualizacion());
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
