package com.apilamiento.control.service;

import com.apilamiento.control.dto.CampanaDTO;
import com.apilamiento.control.entity.Campana;
import com.apilamiento.control.mapper.CampanaMapper;
import com.apilamiento.control.repository.CampanaRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;

@ApplicationScoped
public class CampanaService {

    private final CampanaRepository repository;
    private final CampanaMapper mapper;

    public CampanaService(CampanaRepository repository, CampanaMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<CampanaDTO> listarTodas() {
        return repository.listAll().stream()
                .map(mapper::toDTO)
                .toList();
    }

    public CampanaDTO buscarPorId(Long id) {
        return repository.findByIdOptional(id)
                .map(mapper::toDTO)
                .orElse(null);
    }

    private String generarCodigo(String nombre) {
        return nombre.toUpperCase().replaceAll("\\s+", "_").replaceAll("[^A-Z0-9_]", "");
    }

    @Transactional
    public CampanaDTO crear(CampanaDTO dto) {
        Campana entity = new Campana();
        entity.setNombre(dto.getNombre());
        entity.setCodigo(generarCodigo(dto.getNombre()));
        entity.setFechaInicio(dto.getFechaInicio());
        entity.setFechaFin(dto.getFechaFin());
        entity.setEstadoActivo(true);
        entity.setUsuarioCreacion(dto.getUsuarioCreacion() != null ? dto.getUsuarioCreacion() : 1L);
        repository.persist(entity);
        return mapper.toDTO(entity);
    }

    @Transactional
    public CampanaDTO actualizar(Long id, CampanaDTO dto) {
        Campana entity = repository.findById(id);
        if (entity == null) return null;
        if (dto.getNombre() != null) {
            entity.setNombre(dto.getNombre());
            entity.setCodigo(generarCodigo(dto.getNombre()));
        }
        if (dto.getFechaInicio() != null) entity.setFechaInicio(dto.getFechaInicio());
        if (dto.getFechaFin() != null) entity.setFechaFin(dto.getFechaFin());
        if (dto.getEstadoActivo() != null) entity.setEstadoActivo(dto.getEstadoActivo());
        entity.setUsuarioActualizacion(dto.getUsuarioActualizacion() != null ? dto.getUsuarioActualizacion() : 1L);
        entity.setFechaActualizacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
        return mapper.toDTO(entity);
    }

    @Transactional
    public void activar(Long id) {
        Campana entity = repository.findById(id);
        if (entity == null) {
            throw new WebApplicationException("Campaña no encontrada", Response.Status.NOT_FOUND);
        }
        repository.findActiva().ifPresent(activa -> {
            activa.setEstadoActivo(false);
            activa.setFechaActualizacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
        });
        entity.setEstadoActivo(true);
        entity.setFechaActualizacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
    }

    @Transactional
    public void cerrar(Long id) {
        Campana entity = repository.findById(id);
        if (entity == null) {
            throw new WebApplicationException("Campaña no encontrada", Response.Status.NOT_FOUND);
        }
        entity.setEstadoActivo(false);
        entity.setFechaActualizacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
    }

    @Transactional
    public boolean eliminar(Long id) {
        Campana entity = repository.findById(id);
        if (entity == null) return false;
        repository.delete(entity);
        return true;
    }
}
