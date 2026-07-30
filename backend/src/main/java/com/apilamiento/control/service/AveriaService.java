package com.apilamiento.control.service;

import com.apilamiento.control.dto.AveriaDTO;
import com.apilamiento.control.dto.EvidenciaAveriaDTO;
import com.apilamiento.control.entity.Averia;
import com.apilamiento.control.entity.EvidenciaAveria;
import com.apilamiento.control.mapper.AveriaMapper;
import com.apilamiento.control.mapper.EvidenciaAveriaMapper;
import com.apilamiento.control.repository.AveriaRepository;
import com.apilamiento.control.repository.EvidenciaAveriaRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Locale;

@ApplicationScoped
public class AveriaService {

    private static final long MAX_FILE_SIZE = 5L * 1024 * 1024;
    private static final int MAX_FOTOS = 3;
    private static final java.util.Set<String> MIME_TYPES = java.util.Set.of("image/jpeg", "image/png");

    private final AveriaRepository repository;
    private final AveriaMapper mapper;
    private final EvidenciaAveriaRepository evidenciaRepository;
    private final EvidenciaAveriaMapper evidenciaMapper;

    public AveriaService(AveriaRepository repository, AveriaMapper mapper,
            EvidenciaAveriaRepository evidenciaRepository,
            EvidenciaAveriaMapper evidenciaMapper) {
        this.repository = repository;
        this.mapper = mapper;
        this.evidenciaRepository = evidenciaRepository;
        this.evidenciaMapper = evidenciaMapper;
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

    @Transactional
    public EvidenciaAveriaDTO guardarEvidencia(Long averiaId, Short numeroFoto,
            String fileName, String mimeType, byte[] content, Long usuarioId) {
        Averia averia = repository.findById(averiaId);
        if (averia == null) throw error("Avería no encontrada", Response.Status.NOT_FOUND);
        if (numeroFoto < 1 || numeroFoto > MAX_FOTOS) {
            throw error("El número de foto debe estar entre 1 y " + MAX_FOTOS, Response.Status.BAD_REQUEST);
        }
        String normalizedMime = mimeType == null ? "" : mimeType.toLowerCase(Locale.ROOT);
        if (!MIME_TYPES.contains(normalizedMime)) {
            throw error("Solo se permiten imágenes JPEG o PNG", Response.Status.BAD_REQUEST);
        }
        if (content == null || content.length == 0 || content.length > MAX_FILE_SIZE) {
            throw error("La fotografía debe pesar entre 1 byte y 5 MB", Response.Status.BAD_REQUEST);
        }
        String safeName = sanitizeFileName(fileName);
        EvidenciaAveria evidence = evidenciaRepository
                .findByAveriaAndNumero(averiaId, numeroFoto)
                .orElseGet(EvidenciaAveria::new);
        boolean isNew = evidence.getId() == null;
        evidence.setAveriaId(averiaId);
        evidence.setNumeroFoto(numeroFoto);
        evidence.setNombreArchivo(safeName);
        evidence.setTipoMime(normalizedMime);
        evidence.setTamanioBytes((long) content.length);
        evidence.setContenido(content);
        if (isNew) {
            evidence.setUsuarioCreacion(usuarioId);
            evidenciaRepository.persist(evidence);
        }
        return evidenciaMapper.toDTO(evidence);
    }

    public List<EvidenciaAveriaDTO> listarEvidencias(Long averiaId) {
        requireAveria(averiaId);
        return evidenciaRepository.listByAveria(averiaId).stream()
                .map(evidenciaMapper::toDTO)
                .toList();
    }

    public EvidenciaAveria obtenerArchivo(Long averiaId, Short numeroFoto) {
        requireAveria(averiaId);
        return evidenciaRepository.findByAveriaAndNumero(averiaId, numeroFoto)
                .orElseThrow(() -> error("Evidencia no encontrada", Response.Status.NOT_FOUND));
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

    private Averia requireAveria(Long id) {
        Averia entity = repository.findById(id);
        if (entity == null) throw error("Avería no encontrada", Response.Status.NOT_FOUND);
        return entity;
    }

    private String sanitizeFileName(String value) {
        String name = value == null ? "foto.jpg" : value.replaceAll("[\\\\/]", "_");
        return name.length() > 255 ? name.substring(name.length() - 255) : name;
    }

    private WebApplicationException error(String message, Response.Status status) {
        return new WebApplicationException(message, status);
    }
}
