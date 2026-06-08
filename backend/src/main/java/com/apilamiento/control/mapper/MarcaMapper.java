package com.apilamiento.control.mapper;

import com.apilamiento.control.dto.MarcaDTO;
import com.apilamiento.control.entity.Marca;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class MarcaMapper {

    public MarcaDTO toDTO(Marca entity) {
        if (entity == null) return null;
        MarcaDTO dto = new MarcaDTO();
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
