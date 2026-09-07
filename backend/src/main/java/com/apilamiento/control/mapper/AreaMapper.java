package com.apilamiento.control.mapper;

import com.apilamiento.control.dto.AreaDTO;
import com.apilamiento.control.entity.Area;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class AreaMapper {
    public AreaDTO toDTO(Area entity) {
        AreaDTO dto = new AreaDTO();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setCodigo(entity.getCodigo());
        dto.setEstadoActivo(entity.getEstadoActivo());
        dto.setUsuarioCreacion(entity.getUsuarioCreacion());
        dto.setUsuarioActualizacion(entity.getUsuarioActualizacion());
        dto.setFechaCreacion(entity.getFechaCreacion());
        dto.setFechaActualizacion(entity.getFechaActualizacion());
        return dto;
    }
}