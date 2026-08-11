package com.apilamiento.control.service;

import com.apilamiento.control.dto.OsrDTO;
import com.apilamiento.control.dto.OsrRequest;
import com.apilamiento.control.entity.Osr;
import com.apilamiento.control.mapper.OsrMapper;
import com.apilamiento.control.repository.OsrRepository;
import com.apilamiento.control.repository.PsrRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

@ApplicationScoped
public class OsrService {

    private final OsrRepository osrRepository;
    private final PsrRepository psrRepository;
    private final OsrMapper mapper;

    public OsrService(OsrRepository osrRepository, PsrRepository psrRepository, OsrMapper mapper) {
        this.osrRepository = osrRepository;
        this.psrRepository = psrRepository;
        this.mapper = mapper;
    }

    public OsrDTO buscarPorPsrId(Long psrId) {
        return osrRepository.findByPsrId(psrId).map(mapper::toDTO).orElse(null);
    }

    @Transactional
    public OsrDTO crear(OsrRequest request) {
        if (psrRepository.findById(request.getPsrId()) == null) {
            throw new WebApplicationException("PSR no encontrado", Response.Status.NOT_FOUND);
        }
        if (osrRepository.findByPsrId(request.getPsrId()).isPresent()) {
            throw new WebApplicationException("El PSR ya tiene una OSR registrada", Response.Status.CONFLICT);
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
}
