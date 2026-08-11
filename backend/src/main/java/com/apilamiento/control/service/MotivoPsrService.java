package com.apilamiento.control.service;

import com.apilamiento.control.dto.MotivoPsrDTO;
import com.apilamiento.control.entity.MotivoPsr;
import com.apilamiento.control.mapper.MotivoPsrMapper;
import com.apilamiento.control.repository.MotivoPsrRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;

@ApplicationScoped
public class MotivoPsrService {

    private final MotivoPsrRepository repository;
    private final MotivoPsrMapper mapper;

    public MotivoPsrService(MotivoPsrRepository repository, MotivoPsrMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<MotivoPsrDTO> listarTodas() {
        return repository.listAll().stream()
                .map(mapper::toDTO)
                .toList();
    }

    public MotivoPsrDTO buscarPorId(Long id) {
        return repository.findByIdOptional(id)
                .map(mapper::toDTO)
                .orElse(null);
    }

    private String generarCodigo(String nombre) {
        String base = nombre.toUpperCase().replaceAll("\\s+", "_").replaceAll("[^A-Z0-9_]", "");
        return base.length() > 50 ? base.substring(0, 50) : base;
    }

    private String generarNombreCorto(String nombre) {
        if (nombre == null || nombre.isBlank()) return null;
        String corto = nombre.trim();
        return corto.length() > 100 ? corto.substring(0, 100) : corto;
    }

    private String resolverNombreCorto(MotivoPsrDTO dto) {
        if (dto.getNombreCorto() != null && !dto.getNombreCorto().isBlank()) {
            return dto.getNombreCorto().trim();
        }
        return generarNombreCorto(dto.getNombre());
    }

    @Transactional
    public MotivoPsrDTO crear(MotivoPsrDTO dto) {
        MotivoPsr entity = new MotivoPsr();
        entity.setNombre(dto.getNombre());
        entity.setNombreCorto(resolverNombreCorto(dto));
        entity.setCodigo(generarCodigo(dto.getNombre()));
        entity.setEstadoActivo(true);
        entity.setUsuarioCreacion(dto.getUsuarioCreacion() != null ? dto.getUsuarioCreacion() : 1L);
        repository.persist(entity);
        return mapper.toDTO(entity);
    }

    @Transactional
    public MotivoPsrDTO actualizar(Long id, MotivoPsrDTO dto) {
        MotivoPsr entity = repository.findById(id);
        if (entity == null) return null;
        if (dto.getNombre() != null) {
            entity.setNombre(dto.getNombre());
            entity.setCodigo(generarCodigo(dto.getNombre()));
        }
        if (dto.getNombreCorto() != null) entity.setNombreCorto(dto.getNombreCorto());
        if (dto.getEstadoActivo() != null) entity.setEstadoActivo(dto.getEstadoActivo());
        entity.setUsuarioActualizacion(dto.getUsuarioActualizacion() != null ? dto.getUsuarioActualizacion() : 1L);
        entity.setFechaActualizacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
        return mapper.toDTO(entity);
    }

    @Transactional
    public boolean eliminar(Long id) {
        MotivoPsr entity = repository.findById(id);
        if (entity == null) return false;
        repository.delete(entity);
        return true;
    }
}