package com.apilamiento.control.service;

import com.apilamiento.control.dto.TipoEquipoDTO;
import com.apilamiento.control.entity.TipoEquipo;
import com.apilamiento.control.mapper.TipoEquipoMapper;
import com.apilamiento.control.repository.TipoEquipoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;

@ApplicationScoped
public class TipoEquipoService {

    private final TipoEquipoRepository repository;
    private final TipoEquipoMapper mapper;

    public TipoEquipoService(TipoEquipoRepository repository, TipoEquipoMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<TipoEquipoDTO> listarTodos() {
        return repository.listAll().stream()
                .map(mapper::toDTO)
                .toList();
    }

    public TipoEquipoDTO buscarPorId(Long id) {
        return repository.findByIdOptional(id)
                .map(mapper::toDTO)
                .orElse(null);
    }

    private String generarCodigo(String nombre) {
        return nombre.toUpperCase().replaceAll("\\s+", "_").replaceAll("[^A-Z0-9_]", "");
    }

    @Transactional
    public TipoEquipoDTO crear(TipoEquipoDTO dto) {
        TipoEquipo entity = new TipoEquipo();
        entity.setNombre(dto.getNombre());
        entity.setCodigo(generarCodigo(dto.getNombre()));
        entity.setDescripcion(dto.getDescripcion());
        entity.setEstadoActivo(true);
        entity.setUsuarioCreacion(dto.getUsuarioCreacion() != null ? dto.getUsuarioCreacion() : 1L);
        repository.persist(entity);
        return mapper.toDTO(entity);
    }

    @Transactional
    public TipoEquipoDTO actualizar(Long id, TipoEquipoDTO dto) {
        TipoEquipo entity = repository.findById(id);
        if (entity == null) return null;
        if (dto.getNombre() != null) {
            entity.setNombre(dto.getNombre());
            entity.setCodigo(generarCodigo(dto.getNombre()));
        }
        if (dto.getDescripcion() != null) entity.setDescripcion(dto.getDescripcion());
        if (dto.getEstadoActivo() != null) entity.setEstadoActivo(dto.getEstadoActivo());
        entity.setUsuarioActualizacion(dto.getUsuarioActualizacion() != null ? dto.getUsuarioActualizacion() : 1L);
        entity.setFechaActualizacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
        return mapper.toDTO(entity);
    }

    @Transactional
    public boolean eliminar(Long id) {
        TipoEquipo entity = repository.findById(id);
        if (entity == null) return false;
        repository.delete(entity);
        return true;
    }
}
