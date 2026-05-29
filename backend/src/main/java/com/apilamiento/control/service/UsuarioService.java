package com.apilamiento.control.service;

import com.apilamiento.control.dto.UsuarioDTO;
import com.apilamiento.control.entity.Usuario;
import com.apilamiento.control.mapper.UsuarioMapper;
import com.apilamiento.control.repository.UsuarioRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.util.List;

@ApplicationScoped
public class UsuarioService {

    private final UsuarioRepository repository;
    private final UsuarioMapper mapper;

    public UsuarioService(UsuarioRepository repository, UsuarioMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<UsuarioDTO> listarTodos() {
        return repository.listAll().stream()
                .map(mapper::toDTO)
                .toList();
    }

    public UsuarioDTO buscarPorId(Long id) {
        return repository.findByIdOptional(id)
                .map(mapper::toDTO)
                .orElse(null);
    }

    @Transactional
    public UsuarioDTO crear(UsuarioDTO dto) {
        Usuario entity = new Usuario();
        String correo = dto.getCorreo() != null ? dto.getCorreo().toLowerCase() : null;
        entity.setIdMicrosoft(dto.getIdMicrosoft() != null ? dto.getIdMicrosoft().toLowerCase() : correo);
        entity.setCorreo(correo);
        entity.setNombre(dto.getNombre() != null ? dto.getNombre() : (correo != null ? correo.split("@")[0] : "Usuario"));
        entity.setPuesto(dto.getPuesto());
        entity.setArea(dto.getArea());
        entity.setEmpresa(dto.getEmpresa());
        entity.setDepartamento(dto.getDepartamento());
        entity.setUbicacion(dto.getUbicacion());
        entity.setRolId(dto.getRolId());
        entity.setSitioId(dto.getSitioId());
        entity.setEstadoActivo(true);
        entity.setUsuarioCreacion(dto.getUsuarioCreacion() != null ? dto.getUsuarioCreacion() : 1L);
        repository.persist(entity);
        return mapper.toDTO(entity);
    }

    @Transactional
    public UsuarioDTO actualizar(Long id, UsuarioDTO dto) {
        Usuario entity = repository.findById(id);
        if (entity == null) return null;
        if (dto.getNombre() != null) entity.setNombre(dto.getNombre());
        if (dto.getPuesto() != null) entity.setPuesto(dto.getPuesto());
        if (dto.getArea() != null) entity.setArea(dto.getArea());
        if (dto.getEmpresa() != null) entity.setEmpresa(dto.getEmpresa());
        if (dto.getDepartamento() != null) entity.setDepartamento(dto.getDepartamento());
        if (dto.getUbicacion() != null) entity.setUbicacion(dto.getUbicacion());
        if (dto.getRolId() != null) entity.setRolId(dto.getRolId());
        if (dto.getSitioId() != null) entity.setSitioId(dto.getSitioId());
        if (dto.getEstadoActivo() != null) entity.setEstadoActivo(dto.getEstadoActivo());
        entity.setUsuarioActualizacion(dto.getUsuarioActualizacion() != null ? dto.getUsuarioActualizacion() : 1L);
        return mapper.toDTO(entity);
    }

    @Transactional
    public boolean eliminar(Long id) {
        Usuario entity = repository.findById(id);
        if (entity == null) return false;
        repository.delete(entity);
        return true;
    }
}
