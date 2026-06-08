package com.apilamiento.control.service;

import com.apilamiento.control.dto.EquipoDTO;
import com.apilamiento.control.entity.Equipo;
import com.apilamiento.control.mapper.EquipoMapper;
import com.apilamiento.control.repository.EquipoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;

@ApplicationScoped
public class EquipoService {

    private final EquipoRepository repository;
    private final EquipoMapper mapper;

    public EquipoService(EquipoRepository repository, EquipoMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<EquipoDTO> listarTodos() {
        return repository.listAll().stream()
                .map(mapper::toDTO)
                .toList();
    }

    public EquipoDTO buscarPorId(Long id) {
        return repository.findByIdOptional(id)
                .map(mapper::toDTO)
                .orElse(null);
    }

    public List<EquipoDTO> listarPorProveedor(Long proveedorId) {
        return repository.list("proveedorId", proveedorId).stream()
                .map(mapper::toDTO)
                .toList();
    }

    public List<EquipoDTO> listarPorMarca(Long marcaId) {
        return repository.list("marcaId", marcaId).stream()
                .map(mapper::toDTO)
                .toList();
    }

    public List<EquipoDTO> listarPorTipoEquipo(Long tipoEquipoId) {
        return repository.list("tipoEquipoId", tipoEquipoId).stream()
                .map(mapper::toDTO)
                .toList();
    }

    public List<EquipoDTO> listarPorEstadoOperativo(String estadoOperativo) {
        return repository.list("estadoOperativo", estadoOperativo).stream()
                .map(mapper::toDTO)
                .toList();
    }

    public List<EquipoDTO> listarResumen() {
        return listarTodos();
    }

    private String generarCodigo(String modelo, String numeroSerie) {
        String base = modelo != null ? modelo : "EQ";
        if (numeroSerie != null && !numeroSerie.isBlank()) {
            base = base + "_" + numeroSerie;
        }
        return base.toUpperCase().replaceAll("\\s+", "_").replaceAll("[^A-Z0-9_]", "");
    }

    @Transactional
    public EquipoDTO crear(EquipoDTO dto) {
        Equipo entity = new Equipo();
        entity.setModelo(dto.getModelo());
        entity.setCodigo(generarCodigo(dto.getModelo(), dto.getNumeroSerie()));
        entity.setNumeroSerie(dto.getNumeroSerie());
        entity.setCapacidad(dto.getCapacidad());
        entity.setAlturaMaxima(dto.getAlturaMaxima());
        entity.setBateria(dto.getBateria());
        entity.setSerieBateria(dto.getSerieBateria());
        entity.setBateriaAdicional(dto.getBateriaAdicional());
        entity.setSerieBateriaAdicional(dto.getSerieBateriaAdicional());
        entity.setCargador(dto.getCargador());
        entity.setSerieCargador(dto.getSerieCargador());
        entity.setTransformador(dto.getTransformador());
        entity.setSerieTransformador(dto.getSerieTransformador());
        entity.setExtintor(dto.getExtintor());
        entity.setConoSeguridad(dto.getConoSeguridad());
        entity.setBotiquin(dto.getBotiquin());
        entity.setMesaRodillos(dto.getMesaRodillos());
        entity.setElevadorBateria(dto.getElevadorBateria());
        entity.setCableAdicional(dto.getCableAdicional());
        entity.setConectorAdicional(dto.getConectorAdicional());
        entity.setHorometroInicio(dto.getHorometroInicio());
        entity.setHorometroFin(dto.getHorometroFin());
        entity.setEstadoOperativo(dto.getEstadoOperativo());
        entity.setObservaciones(dto.getObservaciones());
        entity.setProveedorId(dto.getProveedorId());
        entity.setMarcaId(dto.getMarcaId());
        entity.setTipoEquipoId(dto.getTipoEquipoId());
        entity.setEstadoActivo(true);
        entity.setUsuarioCreacion(dto.getUsuarioCreacion() != null ? dto.getUsuarioCreacion() : 1L);
        repository.persist(entity);
        return mapper.toDTO(entity);
    }

    @Transactional
    public EquipoDTO actualizar(Long id, EquipoDTO dto) {
        Equipo entity = repository.findById(id);
        if (entity == null) return null;
        if (dto.getModelo() != null) {
            entity.setModelo(dto.getModelo());
            entity.setCodigo(generarCodigo(dto.getModelo(), dto.getNumeroSerie()));
        }
        if (dto.getNumeroSerie() != null) entity.setNumeroSerie(dto.getNumeroSerie());
        if (dto.getCapacidad() != null) entity.setCapacidad(dto.getCapacidad());
        if (dto.getAlturaMaxima() != null) entity.setAlturaMaxima(dto.getAlturaMaxima());
        if (dto.getBateria() != null) entity.setBateria(dto.getBateria());
        if (dto.getSerieBateria() != null) entity.setSerieBateria(dto.getSerieBateria());
        if (dto.getBateriaAdicional() != null) entity.setBateriaAdicional(dto.getBateriaAdicional());
        if (dto.getSerieBateriaAdicional() != null) entity.setSerieBateriaAdicional(dto.getSerieBateriaAdicional());
        if (dto.getCargador() != null) entity.setCargador(dto.getCargador());
        if (dto.getSerieCargador() != null) entity.setSerieCargador(dto.getSerieCargador());
        if (dto.getTransformador() != null) entity.setTransformador(dto.getTransformador());
        if (dto.getSerieTransformador() != null) entity.setSerieTransformador(dto.getSerieTransformador());
        if (dto.getExtintor() != null) entity.setExtintor(dto.getExtintor());
        if (dto.getConoSeguridad() != null) entity.setConoSeguridad(dto.getConoSeguridad());
        if (dto.getBotiquin() != null) entity.setBotiquin(dto.getBotiquin());
        if (dto.getMesaRodillos() != null) entity.setMesaRodillos(dto.getMesaRodillos());
        if (dto.getElevadorBateria() != null) entity.setElevadorBateria(dto.getElevadorBateria());
        if (dto.getCableAdicional() != null) entity.setCableAdicional(dto.getCableAdicional());
        if (dto.getConectorAdicional() != null) entity.setConectorAdicional(dto.getConectorAdicional());
        if (dto.getHorometroInicio() != null) entity.setHorometroInicio(dto.getHorometroInicio());
        if (dto.getHorometroFin() != null) entity.setHorometroFin(dto.getHorometroFin());
        if (dto.getEstadoOperativo() != null) entity.setEstadoOperativo(dto.getEstadoOperativo());
        if (dto.getObservaciones() != null) entity.setObservaciones(dto.getObservaciones());
        if (dto.getProveedorId() != null) entity.setProveedorId(dto.getProveedorId());
        if (dto.getMarcaId() != null) entity.setMarcaId(dto.getMarcaId());
        if (dto.getTipoEquipoId() != null) entity.setTipoEquipoId(dto.getTipoEquipoId());
        if (dto.getEstadoActivo() != null) entity.setEstadoActivo(dto.getEstadoActivo());
        entity.setUsuarioActualizacion(dto.getUsuarioActualizacion() != null ? dto.getUsuarioActualizacion() : 1L);
        entity.setFechaActualizacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
        return mapper.toDTO(entity);
    }

    @Transactional
    public boolean eliminar(Long id) {
        Equipo entity = repository.findById(id);
        if (entity == null) return false;
        repository.delete(entity);
        return true;
    }
}
