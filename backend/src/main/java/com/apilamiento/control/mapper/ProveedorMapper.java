package com.apilamiento.control.mapper;

import com.apilamiento.control.dto.ProveedorDTO;
import com.apilamiento.control.entity.Proveedor;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ProveedorMapper {

    public ProveedorDTO toDTO(Proveedor entity) {
        if (entity == null) return null;
        ProveedorDTO dto = new ProveedorDTO();
        dto.setId(entity.getId());
        dto.setRazonSocial(entity.getRazonSocial());
        dto.setCodigo(entity.getCodigo());
        dto.setRuc(entity.getRuc());
        dto.setEstadoActivo(entity.getEstadoActivo());
        dto.setUsuarioCreacion(entity.getUsuarioCreacion());
        dto.setUsuarioActualizacion(entity.getUsuarioActualizacion());
        dto.setFechaCreacion(entity.getFechaCreacion());
        dto.setFechaActualizacion(entity.getFechaActualizacion());
        return dto;
    }
}
