package com.apilamiento.control.mapper;

import com.apilamiento.control.dto.RolDTO;
import com.apilamiento.control.entity.Rol;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class RolMapper {

    public RolDTO toDTO(Rol entity) {
        if (entity == null) return null;
        RolDTO dto = new RolDTO();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());
        dto.setEstadoActivo(entity.getEstadoActivo());
        dto.setUsuarioCreacion(entity.getUsuarioCreacion());
        dto.setUsuarioActualizacion(entity.getUsuarioActualizacion());
        dto.setFechaCreacion(entity.getFechaCreacion());
        dto.setFechaActualizacion(entity.getFechaActualizacion());
        return dto;
    }
}
