package com.apilamiento.control.mapper;

import com.apilamiento.control.dto.PsrDTO;
import com.apilamiento.control.entity.MotivoPsr;
import com.apilamiento.control.entity.Psr;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class PsrMapper {

    public PsrDTO toDTO(Psr psr, MotivoPsr motivo) {
        if (psr == null) return null;
        PsrDTO dto = new PsrDTO();
        dto.setId(psr.getId());
        dto.setCampanaId(psr.getCampanaId());
        dto.setSedeId(psr.getSedeId());
        dto.setNumeroPsr(psr.getNumeroPsr());
        dto.setFechaPsr(psr.getFechaPsr());
        dto.setMotivoId(psr.getMotivoId());
        dto.setFechaInicioUso(psr.getFechaInicioUso());
        dto.setFechaFinUso(psr.getFechaFinUso());
        dto.setMeses(psr.getMeses());
        dto.setObservaciones(psr.getObservaciones());
        dto.setEstadoActivo(psr.getEstadoActivo());
        dto.setUsuarioCreacion(psr.getUsuarioCreacion());
        dto.setUsuarioActualizacion(psr.getUsuarioActualizacion());
        dto.setFechaCreacion(psr.getFechaCreacion());
        dto.setFechaActualizacion(psr.getFechaActualizacion());
        if (motivo != null) {
            dto.setMotivoNombre(motivo.getNombre());
            dto.setMotivoNombreCorto(motivo.getNombreCorto());
        }
        return dto;
    }
}