package com.apilamiento.control.mapper;

import com.apilamiento.control.dto.AveriaDTO;
import com.apilamiento.control.entity.Averia;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class AveriaMapper {

    public AveriaDTO toDTO(Averia entity) {
        if (entity == null) return null;
        AveriaDTO dto = new AveriaDTO();
        dto.setId(entity.getId());
        dto.setEquipoId(entity.getEquipoId());
        dto.setDescripcionFalla(entity.getDescripcionFalla());
        dto.setFechaHoraAveria(entity.getFechaHoraAveria());
        dto.setFechaHoraAtencion(entity.getFechaHoraAtencion());
        dto.setAccionRealizada(entity.getAccionRealizada());
        dto.setDiasInactividad(entity.getDiasInactividad());
        dto.setEstadoAveria(entity.getEstadoAveria());
        dto.setObservaciones(entity.getObservaciones());
        dto.setEstadoActivo(entity.getEstadoActivo());
        dto.setUsuarioCreacion(entity.getUsuarioCreacion());
        dto.setUsuarioActualizacion(entity.getUsuarioActualizacion());
        dto.setFechaCreacion(entity.getFechaCreacion());
        dto.setFechaActualizacion(entity.getFechaActualizacion());
        return dto;
    }
}
