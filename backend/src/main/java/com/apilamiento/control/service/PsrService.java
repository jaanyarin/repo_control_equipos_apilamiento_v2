package com.apilamiento.control.service;

import com.apilamiento.control.dto.PsrDTO;
import com.apilamiento.control.dto.PsrRequest;
import com.apilamiento.control.entity.MotivoPsr;
import com.apilamiento.control.entity.Psr;
import com.apilamiento.control.mapper.PsrMapper;
import com.apilamiento.control.repository.MotivoPsrRepository;
import com.apilamiento.control.repository.PsrRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class PsrService {

    private static final BigDecimal DIAS_POR_MES = new BigDecimal("30.44");

    private final PsrRepository psrRepository;
    private final MotivoPsrRepository motivoRepository;
    private final PsrMapper mapper;

    public PsrService(PsrRepository psrRepository, MotivoPsrRepository motivoRepository, PsrMapper mapper) {
        this.psrRepository = psrRepository;
        this.motivoRepository = motivoRepository;
        this.mapper = mapper;
    }

    public List<PsrDTO> listarTodas() {
        List<PsrDTO> result = new ArrayList<>();
        for (Psr psr : psrRepository.listAll()) {
            MotivoPsr motivo = motivoRepository.findByIdOptional(psr.getMotivoId()).orElse(null);
            result.add(mapper.toDTO(psr, motivo));
        }
        return result;
    }

    public PsrDTO buscarPorId(Long id) {
        Psr psr = psrRepository.findById(id);
        if (psr == null) return null;
        MotivoPsr motivo = motivoRepository.findByIdOptional(psr.getMotivoId()).orElse(null);
        return mapper.toDTO(psr, motivo);
    }

    private BigDecimal calcularMeses(LocalDate inicio, LocalDate fin) {
        long dias = ChronoUnit.DAYS.between(inicio, fin);
        return BigDecimal.valueOf(dias).divide(DIAS_POR_MES, 2, RoundingMode.HALF_UP);
    }

    @Transactional
    public PsrDTO crear(PsrRequest request) {
        Psr psr = new Psr();
        psr.setCampanaId(request.getCampanaId());
        psr.setSedeId(request.getSedeId());
        psr.setNumeroPsr(request.getNumeroPsr());
        psr.setFechaPsr(request.getFechaPsr());
        psr.setMotivoId(request.getMotivoId());
        psr.setFechaInicioUso(request.getFechaInicioUso());
        psr.setFechaFinUso(request.getFechaFinUso());
        psr.setMeses(calcularMeses(request.getFechaInicioUso(), request.getFechaFinUso()));
        psr.setObservaciones(request.getObservaciones());
        psr.setEstadoActivo(true);
        psr.setUsuarioCreacion(request.getUsuarioCreacion() != null ? request.getUsuarioCreacion() : 1L);
        psrRepository.persist(psr);

        MotivoPsr motivo = motivoRepository.findByIdOptional(psr.getMotivoId()).orElse(null);
        return mapper.toDTO(psr, motivo);
    }

    @Transactional
    public PsrDTO actualizar(Long id, PsrRequest request) {
        Psr psr = psrRepository.findById(id);
        if (psr == null) return null;

        if (request.getCampanaId() != null) psr.setCampanaId(request.getCampanaId());
        if (request.getSedeId() != null) psr.setSedeId(request.getSedeId());
        if (request.getNumeroPsr() != null) psr.setNumeroPsr(request.getNumeroPsr());
        if (request.getFechaPsr() != null) psr.setFechaPsr(request.getFechaPsr());
        if (request.getMotivoId() != null) psr.setMotivoId(request.getMotivoId());
        if (request.getFechaInicioUso() != null) psr.setFechaInicioUso(request.getFechaInicioUso());
        if (request.getFechaFinUso() != null) psr.setFechaFinUso(request.getFechaFinUso());
        if (request.getFechaInicioUso() != null && request.getFechaFinUso() != null) {
            psr.setMeses(calcularMeses(request.getFechaInicioUso(), request.getFechaFinUso()));
        }
        psr.setObservaciones(request.getObservaciones());
        psr.setUsuarioActualizacion(request.getUsuarioActualizacion() != null ? request.getUsuarioActualizacion() : 1L);
        psr.setFechaActualizacion(OffsetDateTime.now(ZoneId.of("America/Lima")));

        MotivoPsr motivo = motivoRepository.findByIdOptional(psr.getMotivoId()).orElse(null);
        return mapper.toDTO(psr, motivo);
    }

    @Transactional
    public boolean eliminar(Long id) {
        Psr psr = psrRepository.findById(id);
        if (psr == null) return false;
        psrRepository.delete(psr);
        return true;
    }
}