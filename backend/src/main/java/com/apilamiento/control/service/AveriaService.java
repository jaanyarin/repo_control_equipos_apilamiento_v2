package com.apilamiento.control.service;

import com.apilamiento.control.dto.AveriaDTO;
import com.apilamiento.control.entity.Averia;
import com.apilamiento.control.mapper.AveriaMapper;
import com.apilamiento.control.repository.AveriaRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;

@ApplicationScoped
public class AveriaService {

    private final AveriaRepository repository;
    private final AveriaMapper mapper;

    public AveriaService(AveriaRepository repository, AveriaMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<AveriaDTO> listarTodas() {
        return repository.listAll().stream()
                .map(mapper::toDTO)
                .toList();
    }

    public AveriaDTO buscarPorId(Long id) {
        return repository.findByIdOptional(id)
                .map(mapper::toDTO)
                .orElse(null);
    }

    public List<AveriaDTO> listarPorEquipo(Long equipoId) {
        return repository.list("equipoId", equipoId).stream()
                .map(mapper::toDTO)
                .toList();
    }

    public List<AveriaDTO> listarPorEstado(String estadoAveria) {
        return repository.list("estadoAveria", estadoAveria).stream()
                .map(mapper::toDTO)
                .toList();
    }

    private long calcularDiasInactividad(OffsetDateTime inicio, OffsetDateTime fin) {
        if (inicio == null || fin == null) return 0;
        return ChronoUnit.DAYS.between(inicio, fin);
    }

    @Transactional
    public AveriaDTO crear(AveriaDTO dto) {
        Averia entity = new Averia();
        entity.setEquipoId(dto.getEquipoId());
        entity.setDescripcionFalla(dto.getDescripcionFalla());
        entity.setFechaHoraAveria(OffsetDateTime.now(ZoneId.of("America/Lima")));
        entity.setEstadoAveria("REPORTADA");
        entity.setObservaciones(dto.getObservaciones());
        entity.setEstadoActivo(true);
        entity.setUsuarioCreacion(dto.getUsuarioCreacion() != null ? dto.getUsuarioCreacion() : 1L);
        repository.persist(entity);
        return mapper.toDTO(entity);
    }

    @Transactional
    public AveriaDTO actualizar(Long id, AveriaDTO dto) {
        Averia entity = repository.findById(id);
        if (entity == null) return null;
        if (dto.getDescripcionFalla() != null) entity.setDescripcionFalla(dto.getDescripcionFalla());
        if (dto.getFechaHoraAveria() != null) entity.setFechaHoraAveria(dto.getFechaHoraAveria());
        if (dto.getAccionRealizada() != null) entity.setAccionRealizada(dto.getAccionRealizada());
        if (dto.getObservaciones() != null) entity.setObservaciones(dto.getObservaciones());
        if (dto.getEstadoActivo() != null) entity.setEstadoActivo(dto.getEstadoActivo());
        if ("ATENDIDA".equals(dto.getEstadoAveria())) {
            entity.setEstadoAveria("ATENDIDA");
            entity.setFechaHoraAtencion(OffsetDateTime.now(ZoneId.of("America/Lima")));
            entity.setDiasInactividad((int) calcularDiasInactividad(entity.getFechaHoraAveria(), entity.getFechaHoraAtencion()));
        } else if (dto.getEstadoAveria() != null) {
            entity.setEstadoAveria(dto.getEstadoAveria());
        }
        entity.setUsuarioActualizacion(dto.getUsuarioActualizacion() != null ? dto.getUsuarioActualizacion() : 1L);
        entity.setFechaActualizacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
        return mapper.toDTO(entity);
    }

    @Transactional
    public boolean eliminar(Long id) {
        Averia entity = repository.findById(id);
        if (entity == null) return false;
        repository.delete(entity);
        return true;
    }
}
