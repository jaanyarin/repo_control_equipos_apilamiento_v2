package com.apilamiento.control.service;

import com.apilamiento.control.dto.OsrUpdateRequest;
import com.apilamiento.control.dto.PsrDTO;
import com.apilamiento.control.dto.PsrRequest;
import com.apilamiento.control.entity.Campana;
import com.apilamiento.control.entity.Equipo;
import com.apilamiento.control.entity.Osr;
import com.apilamiento.control.entity.Psr;
import com.apilamiento.control.entity.Sede;
import com.apilamiento.control.mapper.OsrMapper;
import com.apilamiento.control.mapper.PsrMapper;
import com.apilamiento.control.repository.CampanaRepository;
import com.apilamiento.control.repository.EquipoRepository;
import com.apilamiento.control.repository.MarcaRepository;
import com.apilamiento.control.repository.MotivoPsrRepository;
import com.apilamiento.control.repository.OsrRepository;
import com.apilamiento.control.repository.PsrRepository;
import com.apilamiento.control.repository.SedeRepository;
import jakarta.ws.rs.WebApplicationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PsrServiceTest {

    @Mock
    PsrRepository psrRepository;

    @Mock
    MotivoPsrRepository motivoRepository;

    @Mock
    OsrRepository osrRepository;

    @Mock
    CampanaRepository campanaRepository;

    @Mock
    SedeRepository sedeRepository;

    @Mock
    EquipoRepository equipoRepository;

    @Mock
    MarcaRepository marcaRepository;

    PsrService service;

    @BeforeEach
    void setUp() {
        service = new PsrService(
                psrRepository,
                motivoRepository,
                new PsrMapper(),
                osrRepository,
                new OsrMapper(),
                campanaRepository,
                sedeRepository,
                equipoRepository,
                marcaRepository);
    }

    @Test
    void actualizar_noDebePermitirCambiarNumeroPsr() {
        Psr psr = new Psr();
        psr.setId(1L);
        psr.setNumeroPsr("PSR001");
        when(psrRepository.findById(1L)).thenReturn(psr);

        PsrRequest request = new PsrRequest();
        request.setNumeroPsr("PSR002");

        WebApplicationException exception = assertThrows(
                WebApplicationException.class,
                () -> service.actualizar(1L, request));

        assertEquals(400, exception.getResponse().getStatus());
        assertEquals("PSR001", psr.getNumeroPsr());
    }

    @Test
    void actualizar_deberiaCalcularTresMesesCalendarioYActualizarOsr() {
        Psr psr = new Psr();
        psr.setId(1L);
        psr.setNumeroPsr("PSR001");
        psr.setMotivoId(20L);
        psr.setCampanaId(2L);
        psr.setSedeId(10L);
        Osr osr = new Osr();
        osr.setNumeroOsr("OSR001");

        when(psrRepository.findById(1L)).thenReturn(psr);
        when(osrRepository.findByPsrId(1L)).thenReturn(Optional.of(osr));
        Campana campana = new Campana();
        campana.setNombre("26-27");
        Sede sede = new Sede();
        sede.setNombre("Packing Uva");
        when(campanaRepository.findByIdOptional(2L)).thenReturn(Optional.of(campana));
        when(sedeRepository.findByIdOptional(10L)).thenReturn(Optional.of(sede));

        PsrRequest request = new PsrRequest();
        request.setNumeroPsr("PSR001");
        request.setFechaInicioUso(LocalDate.of(2026, 8, 1));
        request.setFechaFinUso(LocalDate.of(2026, 10, 31));
        OsrUpdateRequest osrUpdate = new OsrUpdateRequest();
        osrUpdate.setCostoUnitario(new BigDecimal("825.40"));
        osrUpdate.setTipoMoneda("USD");
        request.setOsr(osrUpdate);

        PsrDTO result = service.actualizar(1L, request);

        assertEquals(new BigDecimal("3.00"), psr.getMeses());
        assertEquals(new BigDecimal("825.40"), osr.getCostoUnitario());
        assertEquals("USD", osr.getTipoMoneda());
        assertEquals("OSR001", osr.getNumeroOsr());
        assertEquals("26-27", result.getCampanaNombre());
        assertEquals("Packing Uva", result.getSedeNombre());
        verify(osrRepository, times(3)).findByPsrId(1L);
    }

    @Test
    void actualizar_noDebePermitirEditarPsrFinalizado() {
        Psr psr = new Psr();
        psr.setId(1L);
        psr.setNumeroPsr("PSR001");
        Osr osr = new Osr();
        osr.setEquipoId(7L);
        Equipo equipo = new Equipo();
        equipo.setEstadoOperativo("DEVUELTO");

        when(psrRepository.findById(1L)).thenReturn(psr);
        when(osrRepository.findByPsrId(1L)).thenReturn(Optional.of(osr));
        when(equipoRepository.findByIdOptional(7L)).thenReturn(Optional.of(equipo));

        PsrRequest request = new PsrRequest();
        request.setNumeroPsr("PSR001");

        WebApplicationException exception = assertThrows(
                WebApplicationException.class,
                () -> service.actualizar(1L, request));

        assertEquals(409, exception.getResponse().getStatus());
        verify(equipoRepository).findByIdOptional(7L);
    }

    @Test
    void eliminar_noDebePermitirEliminarPsrFinalizado() {
        Psr psr = new Psr();
        psr.setId(1L);
        Osr osr = new Osr();
        osr.setEquipoId(7L);
        Equipo equipo = new Equipo();
        equipo.setEstadoOperativo("DEVUELTO");

        when(psrRepository.findById(1L)).thenReturn(psr);
        when(osrRepository.findByPsrId(1L)).thenReturn(Optional.of(osr));
        when(equipoRepository.findByIdOptional(7L)).thenReturn(Optional.of(equipo));

        WebApplicationException exception = assertThrows(
                WebApplicationException.class,
                () -> service.eliminar(1L));

        assertEquals(409, exception.getResponse().getStatus());
        verify(equipoRepository).findByIdOptional(7L);
    }

    @Test
    void actualizar_deberiaPermitirEditarPsrConEquipoOperativo() {
        Psr psr = new Psr();
        psr.setId(1L);
        psr.setNumeroPsr("PSR001");
        Osr osr = new Osr();
        osr.setEquipoId(7L);
        Equipo equipo = new Equipo();
        equipo.setEstadoOperativo("OPERATIVO");
        Campana campana = new Campana();
        campana.setNombre("26-27");
        Sede sede = new Sede();
        sede.setNombre("Packing Uva");

        when(psrRepository.findById(1L)).thenReturn(psr);
        when(osrRepository.findByPsrId(1L)).thenReturn(Optional.of(osr));
        when(equipoRepository.findByIdOptional(7L)).thenReturn(Optional.of(equipo));
        when(campanaRepository.findByIdOptional(psr.getCampanaId())).thenReturn(Optional.of(campana));
        when(sedeRepository.findByIdOptional(psr.getSedeId())).thenReturn(Optional.of(sede));

        PsrRequest request = new PsrRequest();
        request.setNumeroPsr("PSR001");

        PsrDTO result = service.actualizar(1L, request);

        assertEquals(Boolean.FALSE, result.getFinalizado());
    }

    @Test
    void listarMarcasFinalizadoTrueCuandoEquipoDevuelto() {
        Psr psr = new Psr();
        psr.setId(1L);
        psr.setNumeroPsr("PSR001");
        psr.setCampanaId(2L);
        psr.setSedeId(10L);
        Osr osr = new Osr();
        osr.setEquipoId(7L);
        Equipo equipo = new Equipo();
        equipo.setEstadoOperativo("DEVUELTO");
        Campana campana = new Campana();
        campana.setNombre("26-27");
        Sede sede = new Sede();
        sede.setNombre("Packing Uva");

        when(psrRepository.listAll()).thenReturn(java.util.List.of(psr));
        when(osrRepository.findByPsrId(1L)).thenReturn(Optional.of(osr));
        when(equipoRepository.findByIdOptional(7L)).thenReturn(Optional.of(equipo));
        when(campanaRepository.findByIdOptional(2L)).thenReturn(Optional.of(campana));
        when(sedeRepository.findByIdOptional(10L)).thenReturn(Optional.of(sede));

        java.util.List<PsrDTO> result = service.listarTodas();

        assertEquals(1, result.size());
        assertEquals(Boolean.TRUE, result.get(0).getFinalizado());
    }
}
