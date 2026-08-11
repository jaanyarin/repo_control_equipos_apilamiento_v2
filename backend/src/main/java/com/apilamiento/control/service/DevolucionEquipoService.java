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
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.EnumSet;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@ApplicationScoped
public class DevolucionEquipoService {
    private static final long MAX_FILE_SIZE = 5L * 1024 * 1024;
    private static final Set<String> MIME_TYPES = Set.of("image/jpeg", "image/png");
    private static final Set<TipoEvidenciaDevolucion> VISTAS_OBLIGATORIAS = Set.of(
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
    public EquipoDTO finalizar(Long equipoId, BigDecimal horometroFin, Long usuarioId) {
        Equipo equipo = requireEquipo(equipoId);
        if (equipo.getFechaDevolucion() != null) {
            throw error("El equipo ya fue devuelto", Response.Status.CONFLICT);
        }
        validateHorometroFin(equipo, horometroFin);
        List<EvidenciaDevolucionEquipo> evidencias = evidenciaRepository.listByEquipo(equipoId);
        List<TipoEvidenciaDevolucion> actuales = evidencias.stream()
                .map(EvidenciaDevolucionEquipo::getTipo)
                .toList();
        List<String> faltantes = evidenciaRequerida(equipo).stream()
                .filter(tipo -> !actuales.contains(tipo))
                .map(Enum::name)
                .toList();
        if (!faltantes.isEmpty()) {
            throw error("Faltan evidencias obligatorias de devolución: " + String.join(", ", faltantes),
                    Response.Status.BAD_REQUEST);
        }
        OffsetDateTime ahora = OffsetDateTime.now(ZoneId.of("America/Lima"));
        for (EvidenciaDevolucionEquipo evidencia : evidencias) {
            evidencia.setUsuarioActualizacion(usuarioId);
            evidencia.setFechaActualizacion(ahora);
        }
        equipo.setHorometroFin(horometroFin);
        equipo.setFechaDevolucion(ahora);
        equipo.setEstadoOperativo("DEVUELTO");
        equipo.setUsuarioActualizacion(usuarioId);
        equipo.setFechaActualizacion(ahora);
        return equipoMapper.toDTO(equipo);
    }

    private void validateHorometroFin(Equipo equipo, BigDecimal value) {
        if (value == null) {
            throw error("El horómetro final es obligatorio", Response.Status.BAD_REQUEST);
        }
        int integerDigits = value.precision() - value.scale();
        if (value.signum() < 0 || value.scale() != 1 || integerDigits < 1 || integerDigits > 6) {
            throw error("El horómetro final debe tener entre 1 y 6 enteros y 1 decimal (ej. 1234.5)",
                    Response.Status.BAD_REQUEST);
        }
        if (equipo.getHorometroInicio() != null && value.compareTo(equipo.getHorometroInicio()) < 0) {
            throw error("El horómetro final no puede ser menor que el horómetro inicial",
                    Response.Status.BAD_REQUEST);
        }
    }

    private Set<TipoEvidenciaDevolucion> evidenciaRequerida(Equipo equipo) {
        Set<TipoEvidenciaDevolucion> result = EnumSet.copyOf(VISTAS_OBLIGATORIAS);
        if (Boolean.TRUE.equals(equipo.getExtintor())) result.add(TipoEvidenciaDevolucion.EXTINTOR);
        if (Boolean.TRUE.equals(equipo.getBateria())) result.add(TipoEvidenciaDevolucion.BATERIA_1);
        if (Boolean.TRUE.equals(equipo.getBateriaAdicional())) result.add(TipoEvidenciaDevolucion.BATERIA_2);
        if (Boolean.TRUE.equals(equipo.getConoSeguridad())) result.add(TipoEvidenciaDevolucion.CONO);
        if (Boolean.TRUE.equals(equipo.getBotiquin())) result.add(TipoEvidenciaDevolucion.BOTIQUIN);
        if (Boolean.TRUE.equals(equipo.getCargador())) result.add(TipoEvidenciaDevolucion.CARGADOR);
        if (Boolean.TRUE.equals(equipo.getTransformador())) result.add(TipoEvidenciaDevolucion.TRANSFORMADOR);
        if (Boolean.TRUE.equals(equipo.getCableAdicional())) result.add(TipoEvidenciaDevolucion.CABLE_ADICIONAL);
        if (Boolean.TRUE.equals(equipo.getMesaRodillos())) result.add(TipoEvidenciaDevolucion.MESA_RODILLOS);
        if (Boolean.TRUE.equals(equipo.getElevadorBateria())) result.add(TipoEvidenciaDevolucion.ELEVADOR_BATERIA);
        if (Boolean.TRUE.equals(equipo.getConectorAdicional())) result.add(TipoEvidenciaDevolucion.CONECTOR_ADICIONAL);
        return result;
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