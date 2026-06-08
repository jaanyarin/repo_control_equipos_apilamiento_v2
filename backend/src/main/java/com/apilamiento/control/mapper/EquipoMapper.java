package com.apilamiento.control.mapper;

import com.apilamiento.control.dto.EquipoDTO;
import com.apilamiento.control.entity.Equipo;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class EquipoMapper {

    public EquipoDTO toDTO(Equipo entity) {
        if (entity == null) return null;
        EquipoDTO dto = new EquipoDTO();
        dto.setId(entity.getId());
        dto.setModelo(entity.getModelo());
        dto.setCodigo(entity.getCodigo());
        dto.setNumeroSerie(entity.getNumeroSerie());
        dto.setCapacidad(entity.getCapacidad());
        dto.setAlturaMaxima(entity.getAlturaMaxima());
        dto.setBateria(entity.getBateria());
        dto.setSerieBateria(entity.getSerieBateria());
        dto.setBateriaAdicional(entity.getBateriaAdicional());
        dto.setSerieBateriaAdicional(entity.getSerieBateriaAdicional());
        dto.setCargador(entity.getCargador());
        dto.setSerieCargador(entity.getSerieCargador());
        dto.setTransformador(entity.getTransformador());
        dto.setSerieTransformador(entity.getSerieTransformador());
        dto.setExtintor(entity.getExtintor());
        dto.setConoSeguridad(entity.getConoSeguridad());
        dto.setBotiquin(entity.getBotiquin());
        dto.setMesaRodillos(entity.getMesaRodillos());
        dto.setElevadorBateria(entity.getElevadorBateria());
        dto.setCableAdicional(entity.getCableAdicional());
        dto.setConectorAdicional(entity.getConectorAdicional());
        dto.setHorometroInicio(entity.getHorometroInicio());
        dto.setHorometroFin(entity.getHorometroFin());
        dto.setEstadoOperativo(entity.getEstadoOperativo());
        dto.setObservaciones(entity.getObservaciones());
        dto.setProveedorId(entity.getProveedorId());
        dto.setMarcaId(entity.getMarcaId());
        dto.setTipoEquipoId(entity.getTipoEquipoId());
        dto.setEstadoActivo(entity.getEstadoActivo());
        dto.setUsuarioCreacion(entity.getUsuarioCreacion());
        dto.setUsuarioActualizacion(entity.getUsuarioActualizacion());
        dto.setFechaCreacion(entity.getFechaCreacion());
        dto.setFechaActualizacion(entity.getFechaActualizacion());
        return dto;
    }
}
