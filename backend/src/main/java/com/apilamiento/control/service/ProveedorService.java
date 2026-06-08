package com.apilamiento.control.service;

import com.apilamiento.control.dto.ProveedorDTO;
import com.apilamiento.control.entity.Proveedor;
import com.apilamiento.control.mapper.ProveedorMapper;
import com.apilamiento.control.repository.ProveedorRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;

@ApplicationScoped
public class ProveedorService {

    private final ProveedorRepository repository;
    private final ProveedorMapper mapper;

    public ProveedorService(ProveedorRepository repository, ProveedorMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<ProveedorDTO> listarTodos() {
        return repository.listAll().stream()
                .map(mapper::toDTO)
                .toList();
    }

    public ProveedorDTO buscarPorId(Long id) {
        return repository.findByIdOptional(id)
                .map(mapper::toDTO)
                .orElse(null);
    }

    private String generarCodigo(String nombre) {
        return nombre.toUpperCase().replaceAll("\\s+", "_").replaceAll("[^A-Z0-9_]", "");
    }

    @Transactional
    public ProveedorDTO crear(ProveedorDTO dto) {
        Proveedor entity = new Proveedor();
        entity.setRazonSocial(dto.getRazonSocial());
        entity.setCodigo(generarCodigo(dto.getRazonSocial()));
        entity.setRuc(dto.getRuc());
        entity.setEstadoActivo(true);
        entity.setUsuarioCreacion(dto.getUsuarioCreacion() != null ? dto.getUsuarioCreacion() : 1L);
        repository.persist(entity);
        return mapper.toDTO(entity);
    }

    @Transactional
    public ProveedorDTO actualizar(Long id, ProveedorDTO dto) {
        Proveedor entity = repository.findById(id);
        if (entity == null) return null;
        if (dto.getRazonSocial() != null) {
            entity.setRazonSocial(dto.getRazonSocial());
            entity.setCodigo(generarCodigo(dto.getRazonSocial()));
        }
        if (dto.getRuc() != null) entity.setRuc(dto.getRuc());
        if (dto.getEstadoActivo() != null) entity.setEstadoActivo(dto.getEstadoActivo());
        entity.setUsuarioActualizacion(dto.getUsuarioActualizacion() != null ? dto.getUsuarioActualizacion() : 1L);
        entity.setFechaActualizacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
        return mapper.toDTO(entity);
    }

    @Transactional
    public boolean eliminar(Long id) {
        Proveedor entity = repository.findById(id);
        if (entity == null) return false;
        repository.delete(entity);
        return true;
    }
}
