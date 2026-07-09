package com.apilamiento.control.mapper;

import com.apilamiento.control.dto.MotivoPsrDTO;
import com.apilamiento.control.entity.MotivoPsr;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class MotivoPsrMapper {

    public MotivoPsrDTO toDTO(MotivoPsr entity) {
        if (entity == null) return null;
        MotivoPsrDTO dto = new MotivoPsrDTO();
        dto.setId(entity.getId());
        dto.setCodigo(entity.getCodigo());
        dto.setNombre(entity.getNombre());
        dto.setNombreCorto(entity.getNombreCorto());
        dto.setEstadoActivo(entity.getEstadoActivo());
        dto.setUsuarioCreacion(entity.getUsuarioCreacion());
        dto.setUsuarioActualizacion(entity.getUsuarioActualizacion());
        dto.setFechaCreacion(entity.getFechaCreacion());
        dto.setFechaActualizacion(entity.getFechaActualizacion());
        return dto;
    }
}