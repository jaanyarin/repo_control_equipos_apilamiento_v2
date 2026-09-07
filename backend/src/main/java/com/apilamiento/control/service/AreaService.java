package com.apilamiento.control.service;

import com.apilamiento.control.dto.AreaDTO;
import com.apilamiento.control.entity.Area;
import com.apilamiento.control.mapper.AreaMapper;
import com.apilamiento.control.repository.AreaRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;

@ApplicationScoped
public class AreaService {
    private final AreaRepository repository;
    private final AreaMapper mapper;

    public AreaService(AreaRepository repository, AreaMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<AreaDTO> listarTodas() {
        return repository.listAll().stream().map(mapper::toDTO).toList();
    }

    public AreaDTO buscarPorId(Long id) {
        Area entity = repository.findById(id);
        return entity == null ? null : mapper.toDTO(entity);
    }

    @Transactional
    public AreaDTO crear(AreaDTO dto) {
        String nombre = dto.getNombre().trim();
        if (repository.findByNombre(nombre).isPresent()) {
            throw new WebApplicationException("Ya existe un área con ese nombre", Response.Status.CONFLICT);
        }
        Area entity = new Area();
        entity.setNombre(nombre);
        entity.setCodigo(generarCodigo(nombre));
        entity.setEstadoActivo(true);
        entity.setUsuarioCreacion(dto.getUsuarioCreacion() != null ? dto.getUsuarioCreacion() : 1L);
        repository.persist(entity);
        return mapper.toDTO(entity);
    }

    @Transactional
    public AreaDTO actualizar(Long id, AreaDTO dto) {
        Area entity = repository.findById(id);
        if (entity == null) return null;
        if (dto.getNombre() != null && !dto.getNombre().isBlank()) {
            String nombre = dto.getNombre().trim();
            repository.findByNombre(nombre).filter(other -> !other.getId().equals(id)).ifPresent(other -> {
                throw new WebApplicationException("Ya existe un área con ese nombre", Response.Status.CONFLICT);
            });
            entity.setNombre(nombre);
            entity.setCodigo(generarCodigo(nombre));
        }
        if (dto.getEstadoActivo() != null) entity.setEstadoActivo(dto.getEstadoActivo());
        entity.setUsuarioActualizacion(dto.getUsuarioActualizacion() != null ? dto.getUsuarioActualizacion() : 1L);
        entity.setFechaActualizacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
        return mapper.toDTO(entity);
    }

    @Transactional
    public boolean eliminar(Long id) {
        Area entity = repository.findById(id);
        if (entity == null) return false;
        repository.delete(entity);
        return true;
    }

    private String generarCodigo(String nombre) {
        return nombre.toUpperCase().replaceAll("\\s+", "_").replaceAll("[^A-Z0-9ÁÉÍÓÚÑÜ_]", "");
    }
}