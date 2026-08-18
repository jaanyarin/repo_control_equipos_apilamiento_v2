package com.apilamiento.control.service;

import com.apilamiento.control.dto.RolDTO;
import com.apilamiento.control.entity.Rol;
import com.apilamiento.control.mapper.RolMapper;
import com.apilamiento.control.repository.RolRepository;
import com.apilamiento.control.repository.UsuarioRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;

@ApplicationScoped
public class RolService {

    private final RolRepository repository;
    private final RolMapper mapper;
    private final UsuarioRepository usuarioRepository;

    public RolService(RolRepository repository, RolMapper mapper, UsuarioRepository usuarioRepository) {
        this.repository = repository;
        this.mapper = mapper;
        this.usuarioRepository = usuarioRepository;
    }

    public List<RolDTO> listarTodos() {
        return repository.listAll().stream()
                .map(mapper::toDTO)
                .toList();
    }

    public RolDTO buscarPorId(Long id) {
        return repository.findByIdOptional(id)
                .map(mapper::toDTO)
                .orElse(null);
    }

    @Transactional
    public RolDTO crear(RolDTO dto) {
        Rol entity = new Rol();
        entity.setNombre(dto.getNombre());
        entity.setDescripcion(dto.getDescripcion());
        entity.setEstadoActivo(dto.getEstadoActivo() != null ? dto.getEstadoActivo() : true);
        entity.setUsuarioCreacion(dto.getUsuarioCreacion() != null ? dto.getUsuarioCreacion() : 1L);
        repository.persist(entity);
        return mapper.toDTO(entity);
    }

    @Transactional
    public RolDTO actualizar(Long id, RolDTO dto) {
        Rol entity = repository.findById(id);
        if (entity == null) return null;
        if (dto.getNombre() != null) entity.setNombre(dto.getNombre());
        if (dto.getDescripcion() != null) entity.setDescripcion(dto.getDescripcion());
        if (dto.getEstadoActivo() != null) entity.setEstadoActivo(dto.getEstadoActivo());
        entity.setUsuarioActualizacion(dto.getUsuarioActualizacion() != null ? dto.getUsuarioActualizacion() : 1L);
        entity.setFechaActualizacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
        return mapper.toDTO(entity);
    }

    @Transactional
    public boolean eliminar(Long id) {
        Rol entity = repository.findById(id);
        if (entity == null) return false;
        if (!usuarioRepository.findByRolId(id).isEmpty()) {
            throw new WebApplicationException(
                    "No se puede eliminar el rol porque tiene usuarios asociados",
                    Response.Status.CONFLICT);
        }
        repository.delete(entity);
        return true;
    }
}
