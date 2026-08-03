package com.apilamiento.control.mapper;

import com.apilamiento.control.dto.EvidenciaDevolucionEquipoDTO;
import com.apilamiento.control.entity.EvidenciaDevolucionEquipo;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class EvidenciaDevolucionEquipoMapper {
    public EvidenciaDevolucionEquipoDTO toDTO(EvidenciaDevolucionEquipo entity) {
        EvidenciaDevolucionEquipoDTO dto = new EvidenciaDevolucionEquipoDTO();
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