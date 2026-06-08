package com.apilamiento.control.service;

import com.apilamiento.control.dto.MarcaDTO;
import com.apilamiento.control.entity.Marca;
import com.apilamiento.control.mapper.MarcaMapper;
import com.apilamiento.control.repository.MarcaRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;

@ApplicationScoped
public class MarcaService {

    private final MarcaRepository repository;
    private final MarcaMapper mapper;

    public MarcaService(MarcaRepository repository, MarcaMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<MarcaDTO> listarTodas() {
        return repository.listAll().stream()
                .map(mapper::toDTO)
                .toList();
    }

    public MarcaDTO buscarPorId(Long id) {
        return repository.findByIdOptional(id)
                .map(mapper::toDTO)
                .orElse(null);
    }

    private String generarCodigo(String nombre) {
        return nombre.toUpperCase().replaceAll("\\s+", "_").replaceAll("[^A-Z0-9_]", "");
    }

    @Transactional
    public MarcaDTO crear(MarcaDTO dto) {
        Marca entity = new Marca();
        entity.setNombre(dto.getNombre());
        entity.setCodigo(generarCodigo(dto.getNombre()));
        entity.setEstadoActivo(true);
        entity.setUsuarioCreacion(dto.getUsuarioCreacion() != null ? dto.getUsuarioCreacion() : 1L);
        repository.persist(entity);
        return mapper.toDTO(entity);
    }

    @Transactional
    public MarcaDTO actualizar(Long id, MarcaDTO dto) {
        Marca entity = repository.findById(id);
        if (entity == null) return null;
        if (dto.getNombre() != null) {
            entity.setNombre(dto.getNombre());
            entity.setCodigo(generarCodigo(dto.getNombre()));
        }
        if (dto.getEstadoActivo() != null) entity.setEstadoActivo(dto.getEstadoActivo());
        entity.setUsuarioActualizacion(dto.getUsuarioActualizacion() != null ? dto.getUsuarioActualizacion() : 1L);
        entity.setFechaActualizacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
        return mapper.toDTO(entity);
    }

    @Transactional
    public boolean eliminar(Long id) {
        Marca entity = repository.findById(id);
        if (entity == null) return false;
        repository.delete(entity);
        return true;
    }
}
