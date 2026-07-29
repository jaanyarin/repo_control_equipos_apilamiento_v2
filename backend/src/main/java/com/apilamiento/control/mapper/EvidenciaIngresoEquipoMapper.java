package com.apilamiento.control.mapper;

import com.apilamiento.control.dto.EvidenciaIngresoEquipoDTO;
import com.apilamiento.control.entity.EvidenciaIngresoEquipo;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class EvidenciaIngresoEquipoMapper {
    public EvidenciaIngresoEquipoDTO toDTO(EvidenciaIngresoEquipo entity) {
        EvidenciaIngresoEquipoDTO dto = new EvidenciaIngresoEquipoDTO();
        dto.setId(entity.getId());
        dto.setEquipoId(entity.getEquipoId());
        dto.setTipo(entity.getTipo().name());
        dto.setNombreArchivo(entity.getNombreArchivo());
        dto.setTipoMime(entity.getTipoMime());
        dto.setTamanioBytes(entity.getTamanioBytes());
        dto.setFechaCreacion(entity.getFechaCreacion());
        return dto;
    }
}
