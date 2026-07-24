package com.apilamiento.control.mapper;

import com.apilamiento.control.dto.OsrDTO;
import com.apilamiento.control.entity.Osr;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class OsrMapper {

    public OsrDTO toDTO(Osr entity) {
        if (entity == null) return null;
        OsrDTO dto = new OsrDTO();
        dto.setId(entity.getId());
        dto.setPsrId(entity.getPsrId());
        dto.setNumeroOsr(entity.getNumeroOsr());
        dto.setCostoUnitario(entity.getCostoUnitario());
        dto.setTipoMoneda(entity.getTipoMoneda());
        dto.setEstadoActivo(entity.getEstadoActivo());
        dto.setFechaCreacion(entity.getFechaCreacion());
        return dto;
    }
}
