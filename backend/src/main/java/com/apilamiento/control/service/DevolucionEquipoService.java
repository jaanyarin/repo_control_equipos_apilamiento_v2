package com.apilamiento.control.service;

import com.apilamiento.control.dto.EquipoDTO;
import com.apilamiento.control.dto.EvidenciaDevolucionEquipoDTO;
import com.apilamiento.control.entity.Equipo;
import com.apilamiento.control.entity.EvidenciaDevolucionEquipo;
import com.apilamiento.control.entity.TipoEvidenciaDevolucion;
import com.apilamiento.control.mapper.EquipoMapper;
import com.apilamiento.control.mapper.EvidenciaDevolucionEquipoMapper;
import com.apilamiento.control.repository.EquipoRepository;
import com.apilamiento.control.repository.EvidenciaDevolucionEquipoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@ApplicationScoped
public class DevolucionEquipoService {
    private static final long MAX_FILE_SIZE = 5L * 1024 * 1024;
    private static final Set<String> MIME_TYPES = Set.of("image/jpeg", "image/png");
    private static final Set<TipoEvidenciaDevolucion> EVIDENCIA_OBLIGATORIA = Set.of(
            TipoEvidenciaDevolucion.DEVOLUCION_FRONTAL,
            TipoEvidenciaDevolucion.DEVOLUCION_LATERAL_IZQUIERDO,
            TipoEvidenciaDevolucion.DEVOLUCION_LATERAL_DERECHO,
            TipoEvidenciaDevolucion.DEVOLUCION_POSTERIOR);

    private final EquipoRepository equipoRepository;
    private final EvidenciaDevolucionEquipoRepository evidenciaRepository;
    private final EquipoMapper equipoMapper;
    private final EvidenciaDevolucionEquipoMapper evidenciaMapper;

    public DevolucionEquipoService(EquipoRepository equipoRepository,
            EvidenciaDevolucionEquipoRepository evidenciaRepository,
            EquipoMapper equipoMapper, EvidenciaDevolucionEquipoMapper evidenciaMapper) {
        this.equipoRepository = equipoRepository;
        this.evidenciaRepository = evidenciaRepository;
        this.equipoMapper = equipoMapper;
        this.evidenciaMapper = evidenciaMapper;
    }

    @Transactional
    public EvidenciaDevolucionEquipoDTO guardarEvidencia(Long equipoId, String tipoValue,
            String fileName, String mimeType, byte[] content, Long usuarioId) {
        Equipo equipo = requireEquipo(equipoId);
        if (equipo.getFechaDevolucion() != null) {
            throw error("El equipo ya fue devuelto", Response.Status.CONFLICT);
        }
        TipoEvidenciaDevolucion tipo = parseType(tipoValue);
        String normalizedMime = mimeType == null ? "" : mimeType.toLowerCase(Locale.ROOT);
        if (!MIME_TYPES.contains(normalizedMime)) {
            throw error("Solo se permiten imágenes JPEG o PNG", Response.Status.BAD_REQUEST);
        }
        if (content == null || content.length == 0 || content.length > MAX_FILE_SIZE) {
            throw error("La fotografía debe pesar entre 1 byte y 5 MB", Response.Status.BAD_REQUEST);
        }

        EvidenciaDevolucionEquipo evidence = evidenciaRepository
                .findByEquipoAndTipo(equipo.getId(), tipo).orElseGet(EvidenciaDevolucionEquipo::new);
        boolean isNew = evidence.getId() == null;
        evidence.setEquipoId(equipo.getId());
        evidence.setTipo(tipo);
        evidence.setNombreArchivo(sanitizeFileName(fileName));
        evidence.setTipoMime(normalizedMime);
        evidence.setTamanioBytes((long) content.length);
        evidence.setContenido(content);
        if (isNew) {
            evidence.setUsuarioCreacion(usuarioId);
            evidenciaRepository.persist(evidence);
        } else {
            evidence.setUsuarioActualizacion(usuarioId);
            evidence.setFechaActualizacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
        }
        return evidenciaMapper.toDTO(evidence);
    }

    public List<EvidenciaDevolucionEquipoDTO> listarEvidencias(Long equipoId) {
        requireEquipo(equipoId);
        return evidenciaRepository.listByEquipo(equipoId).stream()
                .map(evidenciaMapper::toDTO)
                .toList();
    }

    public EvidenciaDevolucionEquipo obtenerArchivo(Long equipoId, String tipoValue) {
        requireEquipo(equipoId);
        return evidenciaRepository.findByEquipoAndTipo(equipoId, parseType(tipoValue))
                .orElseThrow(() -> error("Evidencia no encontrada", Response.Status.NOT_FOUND));
    }

    @Transactional
    public EquipoDTO finalizar(Long equipoId, Long usuarioId) {
        Equipo equipo = requireEquipo(equipoId);
        if (equipo.getFechaDevolucion() != null) {
            throw error("El equipo ya fue devuelto", Response.Status.CONFLICT);
        }
        List<TipoEvidenciaDevolucion> actuales = evidenciaRepository.listByEquipo(equipoId).stream()
                .map(EvidenciaDevolucionEquipo::getTipo)
                .toList();
        List<String> faltantes = EVIDENCIA_OBLIGATORIA.stream()
                .filter(tipo -> !actuales.contains(tipo))
                .map(Enum::name)
                .toList();
        if (!faltantes.isEmpty()) {
            throw error("Faltan evidencias obligatorias de devolución: " + String.join(", ", faltantes),
                    Response.Status.BAD_REQUEST);
        }
        equipo.setFechaDevolucion(OffsetDateTime.now(ZoneId.of("America/Lima")));
        equipo.setEstadoOperativo("DEVUELTO");
        equipo.setUsuarioActualizacion(usuarioId);
        equipo.setFechaActualizacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
        return equipoMapper.toDTO(equipo);
    }

    private Equipo requireEquipo(Long id) {
        Equipo equipo = equipoRepository.findById(id);
        if (equipo == null) throw error("Equipo no encontrado", Response.Status.NOT_FOUND);
        return equipo;
    }

    private TipoEvidenciaDevolucion parseType(String value) {
        try {
            return TipoEvidenciaDevolucion.valueOf(value.toUpperCase(Locale.ROOT));
        } catch (Exception ex) {
            throw error("Tipo de evidencia de devolución no válido", Response.Status.BAD_REQUEST);
        }
    }

    private String sanitizeFileName(String value) {
        String name = value == null ? "evidencia.jpg" : value.replaceAll("[\\\\/]", "_");
        return name.length() > 255 ? name.substring(name.length() - 255) : name;
    }

    private WebApplicationException error(String message, Response.Status status) {
        return new WebApplicationException(message, status);
    }
}