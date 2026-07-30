package com.apilamiento.control.mapper;

import com.apilamiento.control.dto.EvidenciaAveriaDTO;
import com.apilamiento.control.entity.EvidenciaAveria;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class EvidenciaAveriaMapper {

    public EvidenciaAveriaDTO toDTO(EvidenciaAveria entity) {
        if (entity == null) return null;
        EvidenciaAveriaDTO dto = new EvidenciaAveriaDTO();
        dto.setId(entity.getId());
        dto.setAveriaId(entity.getAveriaId());
        dto.setNumeroFoto(entity.getNumeroFoto());
        dto.setNombreArchivo(entity.getNombreArchivo());
        dto.setTipoMime(entity.getTipoMime());
        dto.setTamanioBytes(entity.getTamanioBytes());
        dto.setFechaCreacion(entity.getFechaCreacion());
        return dto;
    }
}
