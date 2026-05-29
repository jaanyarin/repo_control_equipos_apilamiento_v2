package com.apilamiento.control.mapper;

import com.apilamiento.control.dto.CampanaDTO;
import com.apilamiento.control.entity.Campana;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class CampanaMapper {

    public CampanaDTO toDTO(Campana entity) {
        if (entity == null) return null;
        CampanaDTO dto = new CampanaDTO();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setCodigo(entity.getCodigo());
        dto.setFechaInicio(entity.getFechaInicio());
        dto.setFechaFin(entity.getFechaFin());
        dto.setEstadoActivo(entity.getEstadoActivo());
        dto.setUsuarioCreacion(entity.getUsuarioCreacion());
        dto.setUsuarioActualizacion(entity.getUsuarioActualizacion());
        dto.setFechaCreacion(entity.getFechaCreacion());
        dto.setFechaActualizacion(entity.getFechaActualizacion());
        return dto;
    }
}
