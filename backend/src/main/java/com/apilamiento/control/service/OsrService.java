package com.apilamiento.control.service;

import com.apilamiento.control.dto.OsrDTO;
import com.apilamiento.control.dto.OsrRequest;
import com.apilamiento.control.dto.OsrUpdateRequest;
import com.apilamiento.control.entity.Equipo;
import com.apilamiento.control.entity.Osr;
import com.apilamiento.control.mapper.OsrMapper;
import com.apilamiento.control.repository.EquipoRepository;
import com.apilamiento.control.repository.OsrRepository;
import com.apilamiento.control.repository.PsrRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;

@ApplicationScoped
public class OsrService {

    private final OsrRepository osrRepository;
    private final PsrRepository psrRepository;
    private final EquipoRepository equipoRepository;
    private final OsrMapper mapper;

    @Inject
    public OsrService(OsrRepository osrRepository, PsrRepository psrRepository,
                      EquipoRepository equipoRepository, OsrMapper mapper) {
        this.osrRepository = osrRepository;
        this.psrRepository = psrRepository;
        this.equipoRepository = equipoRepository;
        this.mapper = mapper;
    }

    // Constructor legacy for tests without EquipoRepository
    public OsrService(OsrRepository osrRepository, PsrRepository psrRepository, OsrMapper mapper) {
        this(osrRepository, psrRepository, null, mapper);
    }

    public OsrDTO buscarPorPsrId(Long psrId) {
        return osrRepository.findByPsrId(psrId).map(mapper::toDTO).orElse(null);
    }

    public List<OsrDTO> listarPorPsrId(Long psrId) {
        return osrRepository.listByPsrId(psrId).stream().map(mapper::toDTO).toList();
    }

    public OsrDTO buscarPorId(Long id) {
        Osr osr = osrRepository.findById(id);
        return osr == null ? null : mapper.toDTO(osr);
    }

    @Transactional
    public OsrDTO crear(OsrRequest request) {
        if (psrRepository.findById(request.getPsrId()) == null) {
            throw new WebApplicationException("PSR no encontrado", Response.Status.NOT_FOUND);
        }

        String numeroOsr = request.getNumeroOsr().trim();
        if (osrRepository.findByNumeroOsr(numeroOsr).isPresent()) {
            throw new WebApplicationException("El número de OSR ya está registrado", Response.Status.CONFLICT);
        }

        Osr entity = new Osr();
        entity.setPsrId(request.getPsrId());
        entity.setNumeroOsr(numeroOsr);
        entity.setCostoUnitario(request.getCostoUnitario());
        entity.setTipoMoneda(request.getTipoMoneda());
        entity.setEstadoActivo(true);
        entity.setUsuarioCreacion(request.getUsuarioCreacion() != null ? request.getUsuarioCreacion() : 1L);
        osrRepository.persist(entity);
        return mapper.toDTO(entity);
    }

    @Transactional
    public OsrDTO actualizar(Long id, OsrUpdateRequest request, Long usuarioId) {
        Osr osr = osrRepository.findById(id);
        if (osr == null) {
            throw new WebApplicationException("OSR no encontrada", Response.Status.NOT_FOUND);
        }
        if (osr.getEquipoId() != null && equipoRepository != null) {
            Equipo equipo = equipoRepository.findById(osr.getEquipoId());
            if (equipo != null && "DEVUELTO".equals(equipo.getEstadoOperativo())) {
                throw new WebApplicationException("La OSR está finalizada y no puede editarse", Response.Status.CONFLICT);
            }
        }
        osr.setCostoUnitario(request.getCostoUnitario());
        osr.setTipoMoneda(request.getTipoMoneda());
        osr.setUsuarioActualizacion(usuarioId != null ? usuarioId : 1L);
        osr.setFechaActualizacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
        return mapper.toDTO(osr);
    }

    @Transactional
    public boolean eliminar(Long id) {
        Osr osr = osrRepository.findById(id);
        if (osr == null) return false;
        if (osr.getEquipoId() != null) {
            throw new WebApplicationException("La OSR tiene un equipo asociado y no puede eliminarse", Response.Status.CONFLICT);
        }
        if (equipoRepository != null && osr.getEquipoId() != null) {
            Equipo equipo = equipoRepository.findById(osr.getEquipoId());
            if (equipo != null && "DEVUELTO".equals(equipo.getEstadoOperativo())) {
                throw new WebApplicationException("La OSR está finalizada y no puede eliminarse", Response.Status.CONFLICT);
            }
        }
        osrRepository.delete(osr);
        return true;
    }
}
