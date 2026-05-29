package com.apilamiento.control.service;

import com.apilamiento.control.dto.SedeDTO;
import com.apilamiento.control.entity.Sede;
import com.apilamiento.control.mapper.SedeMapper;
import com.apilamiento.control.repository.SedeRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;

@ApplicationScoped
public class SedeService {

    private final SedeRepository repository;
    private final SedeMapper mapper;

    public SedeService(SedeRepository repository, SedeMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<SedeDTO> listarTodas() {
        return repository.listAll().stream()
                .map(mapper::toDTO)
                .toList();
    }

    public SedeDTO buscarPorId(Long id) {
        return repository.findByIdOptional(id)
                .map(mapper::toDTO)
                .orElse(null);
    }

    private String generarCodigo(String nombre) {
        return nombre.toUpperCase().replaceAll("\\s+", "_").replaceAll("[^A-Z0-9_]", "");
    }

    @Transactional
    public SedeDTO crear(SedeDTO dto) {
        Sede entity = new Sede();
        entity.setNombre(dto.getNombre());
        entity.setCodigo(generarCodigo(dto.getNombre()));
        entity.setDireccion(dto.getDireccion());
        entity.setEstadoActivo(true);
        entity.setUsuarioCreacion(dto.getUsuarioCreacion() != null ? dto.getUsuarioCreacion() : 1L);
        repository.persist(entity);
        return mapper.toDTO(entity);
    }

    @Transactional
    public SedeDTO actualizar(Long id, SedeDTO dto) {
        Sede entity = repository.findById(id);
        if (entity == null) return null;
        if (dto.getNombre() != null) {
            entity.setNombre(dto.getNombre());
            entity.setCodigo(generarCodigo(dto.getNombre()));
        }
        if (dto.getDireccion() != null) entity.setDireccion(dto.getDireccion());
        if (dto.getEstadoActivo() != null) entity.setEstadoActivo(dto.getEstadoActivo());
        entity.setUsuarioActualizacion(dto.getUsuarioActualizacion() != null ? dto.getUsuarioActualizacion() : 1L);
        entity.setFechaActualizacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
        return mapper.toDTO(entity);
    }

    @Transactional
    public boolean eliminar(Long id) {
        Sede entity = repository.findById(id);
        if (entity == null) return false;
        repository.delete(entity);
        return true;
    }
}
