package com.apilamiento.control.mapper;

import com.apilamiento.control.dto.UsuarioDTO;
import com.apilamiento.control.entity.Usuario;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class UsuarioMapper {

    public UsuarioDTO toDTO(Usuario entity) {
        if (entity == null) return null;
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(entity.getId());
        dto.setIdMicrosoft(entity.getIdMicrosoft());
        dto.setCorreo(entity.getCorreo());
        dto.setNombre(entity.getNombre());
        dto.setPuesto(entity.getPuesto());
        dto.setArea(entity.getArea());
        dto.setEmpresa(entity.getEmpresa());
        dto.setDepartamento(entity.getDepartamento());
        dto.setUbicacion(entity.getUbicacion());
        dto.setRolId(entity.getRolId());
        if (entity.getRol() != null) {
            dto.setRolNombre(entity.getRol().getNombre());
        }
        dto.setSitioId(entity.getSitioId());
        dto.setUltimoAcceso(entity.getUltimoAcceso());
        dto.setEstadoActivo(entity.getEstadoActivo());
        dto.setUsuarioCreacion(entity.getUsuarioCreacion());
        dto.setUsuarioActualizacion(entity.getUsuarioActualizacion());
        dto.setFechaCreacion(entity.getFechaCreacion());
        dto.setFechaActualizacion(entity.getFechaActualizacion());
        dto.setFechaBaja(entity.getFechaBaja());
        return dto;
    }
}
