package com.apilamiento.control.mapper;

import com.apilamiento.control.dto.TipoEquipoDTO;
import com.apilamiento.control.entity.TipoEquipo;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class TipoEquipoMapper {

    public TipoEquipoDTO toDTO(TipoEquipo entity) {
        if (entity == null) return null;
        TipoEquipoDTO dto = new TipoEquipoDTO();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setCodigo(entity.getCodigo());
        dto.setDescripcion(entity.getDescripcion());
        dto.setEstadoActivo(entity.getEstadoActivo());
        dto.setUsuarioCreacion(entity.getUsuarioCreacion());
        dto.setUsuarioActualizacion(entity.getUsuarioActualizacion());
        dto.setFechaCreacion(entity.getFechaCreacion());
        dto.setFechaActualizacion(entity.getFechaActualizacion());
        return dto;
    }
}
