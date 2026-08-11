package com.apilamiento.control.service;

import com.apilamiento.control.dto.UsuarioDTO;
import com.apilamiento.control.entity.Rol;
import com.apilamiento.control.entity.Usuario;
import com.apilamiento.control.mapper.UsuarioMapper;
import com.apilamiento.control.repository.RolRepository;
import com.apilamiento.control.repository.UsuarioRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import org.mindrot.jbcrypt.BCrypt;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;

@ApplicationScoped
public class UsuarioService {

    private final UsuarioRepository repository;
    private final RolRepository rolRepository;
    private final UsuarioMapper mapper;

    public UsuarioService(UsuarioRepository repository, RolRepository rolRepository, UsuarioMapper mapper) {
        this.repository = repository;
        this.rolRepository = rolRepository;
        this.mapper = mapper;
    }

    public List<UsuarioDTO> listarTodos() {
        return repository.listAllWithRol().stream()
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
        String correo = dto.getCorreo() != null ? dto.getCorreo().trim().toLowerCase() : null;
        if (correo != null && !correo.isBlank()) {
            if (repository.findByCorreo(correo).isPresent()) {
                throw new WebApplicationException("Ya existe un usuario con ese correo", Response.Status.CONFLICT);
            }
        } else {
            correo = null;
        }
        entity.setIdMicrosoft(dto.getIdMicrosoft() != null ? dto.getIdMicrosoft().toLowerCase() : correo);
        entity.setCorreo(correo);
        String nombre = dto.getNombre() != null ? dto.getNombre().trim() : "";
        if (nombre.isBlank()) {
            throw new BadRequestException("El nombre es obligatorio");
        }
        entity.setNombre(nombre);
        entity.setPuesto(dto.getPuesto());
        entity.setArea(dto.getArea());
        entity.setEmpresa(dto.getEmpresa());
        entity.setDepartamento(dto.getDepartamento());
        entity.setUbicacion(dto.getUbicacion());
        entity.setRolId(resolverRolPorDefecto(dto.getRolId()));
        entity.setSitioId(dto.getSitioId());
        entity.setEstadoActivo(true);
        entity.setPasswordHash(BCrypt.hashpw("00000000", BCrypt.gensalt()));
        entity.setPasswordResetRequired(true);
        entity.setUsuarioCreacion(dto.getUsuarioCreacion() != null ? dto.getUsuarioCreacion() : 1L);
        repository.persist(entity);
        return mapper.toDTO(entity);
    }

    private Long resolverRolPorDefecto(Long rolId) {
        if (rolId != null) return rolId;
        Rol rol = rolRepository.findByNombre("Usuario").orElse(null);
        if (rol == null) {
            throw new BadRequestException("No se pudo asignar el rol por defecto (Usuario)");
        }
        return rol.getId();
    }

    @Transactional
    public UsuarioDTO actualizar(Long id, UsuarioDTO dto) {
        Usuario entity = repository.findById(id);
        if (entity == null) return null;
        if (esSuperAdminProtegido(entity)) {
            throw new BadRequestException("El Super Admin no puede ser modificado");
        }
        if (dto.getNombre() != null) entity.setNombre(dto.getNombre());
        if (dto.getPuesto() != null) entity.setPuesto(dto.getPuesto());
        if (dto.getArea() != null) entity.setArea(dto.getArea());
        if (dto.getEmpresa() != null) entity.setEmpresa(dto.getEmpresa());
        if (dto.getDepartamento() != null) entity.setDepartamento(dto.getDepartamento());
        if (dto.getUbicacion() != null) entity.setUbicacion(dto.getUbicacion());
        if (dto.getRolId() != null) entity.setRolId(dto.getRolId());
        if (dto.getSitioId() != null) entity.setSitioId(dto.getSitioId());
        if (dto.getEstadoActivo() != null) entity.setEstadoActivo(dto.getEstadoActivo());
        entity.setFechaActualizacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
        entity.setUsuarioActualizacion(dto.getUsuarioActualizacion() != null ? dto.getUsuarioActualizacion() : 1L);
        return mapper.toDTO(entity);
    }

    @Transactional
    public boolean eliminar(Long id) {
        Usuario entity = repository.findById(id);
        if (entity == null) return false;
        if (esSuperAdminProtegido(entity)) {
            throw new BadRequestException("El Super Admin no puede ser eliminado");
        }
        repository.delete(entity);
        return true;
    }

    private boolean esSuperAdminProtegido(Usuario entity) {
        return entity != null
                && (Long.valueOf(1L).equals(entity.getId())
                    || "seed-superadmin".equalsIgnoreCase(entity.getIdMicrosoft()));
    }
}
