package com.apilamiento.control.mapper;

import com.apilamiento.control.dto.SedeDTO;
import com.apilamiento.control.entity.Sede;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class SedeMapper {

    public SedeDTO toDTO(Sede entity) {
        if (entity == null) return null;
        SedeDTO dto = new SedeDTO();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setCodigo(entity.getCodigo());
        dto.setDireccion(entity.getDireccion());
        dto.setEstadoActivo(entity.getEstadoActivo());
        dto.setUsuarioCreacion(entity.getUsuarioCreacion());
        dto.setUsuarioActualizacion(entity.getUsuarioActualizacion());
        dto.setFechaCreacion(entity.getFechaCreacion());
        dto.setFechaActualizacion(entity.getFechaActualizacion());
        return dto;
    }
}
