package com.apilamiento.control.service;

import com.apilamiento.control.dto.PsrDTO;
import com.apilamiento.control.dto.PsrRequest;
import com.apilamiento.control.entity.Campana;
import com.apilamiento.control.entity.Equipo;
import com.apilamiento.control.entity.Marca;
import com.apilamiento.control.entity.MotivoPsr;
import com.apilamiento.control.entity.Osr;
import com.apilamiento.control.entity.Psr;
import com.apilamiento.control.entity.Sede;
import com.apilamiento.control.mapper.PsrMapper;
import com.apilamiento.control.mapper.OsrMapper;
import com.apilamiento.control.repository.CampanaRepository;
import com.apilamiento.control.repository.EquipoRepository;
import com.apilamiento.control.repository.MarcaRepository;
import com.apilamiento.control.repository.MotivoPsrRepository;
import com.apilamiento.control.repository.OsrRepository;
import com.apilamiento.control.repository.PsrRepository;
import com.apilamiento.control.repository.SedeRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.Period;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

@ApplicationScoped
public class PsrService {

    private static final BigDecimal DIAS_POR_MES = new BigDecimal("30.44");

    private final PsrRepository psrRepository;
    private final MotivoPsrRepository motivoRepository;
    private final PsrMapper mapper;
    private final OsrRepository osrRepository;
    private final OsrMapper osrMapper;
    private final CampanaRepository campanaRepository;
    private final SedeRepository sedeRepository;
    private final EquipoRepository equipoRepository;
    private final MarcaRepository marcaRepository;

    public PsrService(PsrRepository psrRepository, MotivoPsrRepository motivoRepository,
                      PsrMapper mapper, OsrRepository osrRepository, OsrMapper osrMapper,
                      CampanaRepository campanaRepository, SedeRepository sedeRepository,
                      EquipoRepository equipoRepository, MarcaRepository marcaRepository) {
        this.psrRepository = psrRepository;
        this.motivoRepository = motivoRepository;
        this.mapper = mapper;
        this.osrRepository = osrRepository;
        this.osrMapper = osrMapper;
        this.campanaRepository = campanaRepository;
        this.sedeRepository = sedeRepository;
        this.equipoRepository = equipoRepository;
        this.marcaRepository = marcaRepository;
    }

    public List<PsrDTO> listarTodas() {
        List<PsrDTO> result = new ArrayList<>();
        for (Psr psr : psrRepository.listAll()) {
            result.add(toDTO(psr));
        }
        return result;
    }

    public PsrDTO buscarPorId(Long id) {
        Psr psr = psrRepository.findById(id);
        if (psr == null) return null;
        return toDTO(psr);
    }

    private PsrDTO toDTO(Psr psr) {
        MotivoPsr motivo = motivoRepository.findByIdOptional(psr.getMotivoId()).orElse(null);
        PsrDTO dto = mapper.toDTO(psr, motivo);
        Campana campana = campanaRepository.findByIdOptional(psr.getCampanaId()).orElse(null);
        Sede sede = sedeRepository.findByIdOptional(psr.getSedeId()).orElse(null);
        if (campana != null) dto.setCampanaNombre(campana.getNombre());
        if (sede != null) dto.setSedeNombre(sede.getNombre());
        osrRepository.findByPsrId(psr.getId())
                .ifPresent(osr -> {
                    dto.setOsr(osrMapper.toDTO(osr));
                    resolverEquipoAsociado(dto, osr);
                });
        return dto;
    }

    private void resolverEquipoAsociado(PsrDTO dto, Osr osr) {
        if (osr.getEquipoId() == null) return;
        Equipo equipo = equipoRepository.findByIdOptional(osr.getEquipoId()).orElse(null);
        if (equipo == null) return;
        dto.setModelo(equipo.getModelo());
        dto.setGrr(equipo.getNumeroGuiaRemision());
        dto.setFinalizado("DEVUELTO".equals(equipo.getEstadoOperativo()));
        marcaRepository.findByIdOptional(equipo.getMarcaId())
                .map(Marca::getNombre)
                .ifPresent(dto::setMarca);
    }

    private boolean estaFinalizado(Psr psr) {
        return osrRepository.findByPsrId(psr.getId())
                .flatMap(osr -> Optional.ofNullable(osr.getEquipoId()))
                .map(equipoId -> equipoRepository.findByIdOptional(equipoId).orElse(null))
                .map(equipo -> "DEVUELTO".equals(equipo.getEstadoOperativo()))
                .orElse(false);
    }

    private BigDecimal calcularMeses(LocalDateTime inicio, LocalDateTime fin) {
        java.time.LocalDate inicioDate = inicio.toLocalDate();
        java.time.LocalDate finDate = fin.toLocalDate();
        if (finDate.isBefore(inicioDate)) {
            throw new WebApplicationException(
                    "La fecha de fin debe ser igual o posterior a la fecha de inicio",
                    Response.Status.BAD_REQUEST);
        }
        Period periodo = Period.between(inicioDate, finDate.plusDays(1));
        long mesesCompletos = periodo.toTotalMonths();
        BigDecimal fraccionDias = BigDecimal.valueOf(periodo.getDays())
                .divide(DIAS_POR_MES, 8, RoundingMode.HALF_UP);
        return BigDecimal.valueOf(mesesCompletos)
                .add(fraccionDias)
                .setScale(2, RoundingMode.HALF_UP);
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

        return toDTO(psr);
    }

    @Transactional
    public PsrDTO actualizar(Long id, PsrRequest request) {
        Psr psr = psrRepository.findById(id);
        if (psr == null) return null;

        if (estaFinalizado(psr)) {
            throw new WebApplicationException(
                    "El PSR/OSR está finalizado y no puede editarse",
                    Response.Status.CONFLICT);
        }

        if (request.getNumeroPsr() != null
                && !Objects.equals(psr.getNumeroPsr(), request.getNumeroPsr().trim())) {
            throw new WebApplicationException(
                    "El número de PSR es único y no se puede modificar",
                    Response.Status.BAD_REQUEST);
        }

        if (request.getCampanaId() != null) psr.setCampanaId(request.getCampanaId());
        if (request.getSedeId() != null) psr.setSedeId(request.getSedeId());
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

        if (request.getOsr() != null) {
            Osr osr = osrRepository.findByPsrId(id)
                    .orElseThrow(() -> new WebApplicationException(
                            "La OSR relacionada no existe",
                            Response.Status.BAD_REQUEST));
            osr.setCostoUnitario(request.getOsr().getCostoUnitario());
            osr.setTipoMoneda(request.getOsr().getTipoMoneda());
            osr.setUsuarioActualizacion(
                    request.getUsuarioActualizacion() != null ? request.getUsuarioActualizacion() : 1L);
            osr.setFechaActualizacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
        }

        return toDTO(psr);
    }

    @Transactional
    public boolean eliminar(Long id) {
        Psr psr = psrRepository.findById(id);
        if (psr == null) return false;
        if (estaFinalizado(psr)) {
            throw new WebApplicationException(
                    "El PSR/OSR está finalizado y no puede eliminarse",
                    Response.Status.CONFLICT);
        }
        if (osrRepository.findByPsrId(id).isPresent()) {
            throw new WebApplicationException(
                    "El PSR tiene una OSR asociada y no puede eliminarse",
                    Response.Status.CONFLICT);
        }
        psrRepository.delete(psr);
        return true;
    }
}
