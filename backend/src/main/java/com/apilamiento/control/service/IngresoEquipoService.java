package com.apilamiento.control.service;

import com.apilamiento.control.dto.*;
import com.apilamiento.control.entity.*;
import com.apilamiento.control.mapper.EquipoMapper;
import com.apilamiento.control.mapper.EvidenciaIngresoEquipoMapper;
import com.apilamiento.control.repository.*;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.*;

@ApplicationScoped
public class IngresoEquipoService {
    private static final long MAX_FILE_SIZE = 5L * 1024 * 1024;
    private static final Set<String> MIME_TYPES = Set.of("image/jpeg", "image/png");
    private static final Set<TipoEvidenciaIngreso> BASE_REQUIRED = EnumSet.of(
            TipoEvidenciaIngreso.GUIA_REMISION,
            TipoEvidenciaIngreso.HOROMETRO_INICIAL);

    private final PsrRepository psrRepository;
    private final OsrRepository osrRepository;
    private final MotivoPsrRepository motivoRepository;
    private final EquipoRepository equipoRepository;
    private final ProveedorRepository proveedorRepository;
    private final MarcaRepository marcaRepository;
    private final TipoEquipoRepository tipoEquipoRepository;
    private final EvidenciaIngresoEquipoRepository evidenciaRepository;
    private final EquipoMapper equipoMapper;
    private final EvidenciaIngresoEquipoMapper evidenciaMapper;

    public IngresoEquipoService(PsrRepository psrRepository, OsrRepository osrRepository,
            MotivoPsrRepository motivoRepository, EquipoRepository equipoRepository,
            ProveedorRepository proveedorRepository, MarcaRepository marcaRepository,
            TipoEquipoRepository tipoEquipoRepository,
            EvidenciaIngresoEquipoRepository evidenciaRepository,
            EquipoMapper equipoMapper, EvidenciaIngresoEquipoMapper evidenciaMapper) {
        this.psrRepository = psrRepository;
        this.osrRepository = osrRepository;
        this.motivoRepository = motivoRepository;
        this.equipoRepository = equipoRepository;
        this.proveedorRepository = proveedorRepository;
        this.marcaRepository = marcaRepository;
        this.tipoEquipoRepository = tipoEquipoRepository;
        this.evidenciaRepository = evidenciaRepository;
        this.equipoMapper = equipoMapper;
        this.evidenciaMapper = evidenciaMapper;
    }

    public List<PsrPendienteEquipoDTO> listarPsrPendientes() {
        List<PsrPendienteEquipoDTO> result = new ArrayList<>();
        for (Psr psr : psrRepository.list("estadoActivo", true)) {
            Optional<Osr> osrOpt = osrRepository.findByPsrId(psr.getId());
            if (osrOpt.isEmpty()) continue;
            Osr osr = osrOpt.get();
            if (!Boolean.TRUE.equals(osr.getEstadoActivo()) || osr.getNumeroOsr() == null) continue;

            Long draftId = null;
            if (osr.getEquipoId() != null) {
                Equipo assigned = equipoRepository.findById(osr.getEquipoId());
                if (assigned == null || Boolean.TRUE.equals(assigned.getIngresoCompleto())) continue;
                draftId = assigned.getId();
            }

            MotivoPsr motivo = motivoRepository.findById(psr.getMotivoId());
            PsrPendienteEquipoDTO dto = new PsrPendienteEquipoDTO();
            dto.setPsrId(psr.getId());
            dto.setNumeroPsr(psr.getNumeroPsr());
            dto.setMotivo(motivo == null ? null
                    : (motivo.getNombreCorto() == null ? motivo.getNombre() : motivo.getNombreCorto()));
            dto.setMeses(psr.getMeses());
            dto.setOsrId(osr.getId());
            dto.setNumeroOsr(osr.getNumeroOsr());
            dto.setBorradorEquipoId(draftId);
            result.add(dto);
        }
        return result;
    }

    @Transactional
    public EquipoDTO crearBorrador(IngresoEquipoRequest request, Long usuarioId) {
        Psr psr = psrRepository.findById(request.getPsrId());
        if (psr == null || !Boolean.TRUE.equals(psr.getEstadoActivo())) {
            throw error("PSR no encontrado o inactivo", Response.Status.NOT_FOUND);
        }
        Osr osr = osrRepository.findByPsrIdForUpdate(psr.getId())
                .orElseThrow(() -> error("El PSR debe tener una OSR antes de asignar un equipo",
                        Response.Status.BAD_REQUEST));
        if (!Boolean.TRUE.equals(osr.getEstadoActivo()) || osr.getNumeroOsr() == null) {
            throw error("La OSR no está disponible", Response.Status.BAD_REQUEST);
        }
        if (osr.getEquipoId() != null) {
            throw error("La OSR ya tiene un equipo o un ingreso en proceso", Response.Status.CONFLICT);
        }

        EquipoDTO data = request.getEquipo();
        validateEquipment(data);
        String code = data.getCodigo().trim().toUpperCase(Locale.ROOT);
        String serial = data.getNumeroSerie().trim();
        if (equipoRepository.findByCodigo(code).isPresent()) {
            throw error("El código del equipo ya está registrado", Response.Status.CONFLICT);
        }
        if (equipoRepository.findByNumeroSerie(serial).isPresent()) {
            throw error("El número de serie ya está registrado", Response.Status.CONFLICT);
        }

        Equipo entity = new Equipo();
        applyData(entity, data);
        entity.setCodigo(code);
        entity.setNumeroSerie(serial);
        entity.setIngresoCompleto(false);
        entity.setEstadoActivo(true);
        entity.setEstadoOperativo("OPERATIVO");
        entity.setUsuarioCreacion(usuarioId);
        equipoRepository.persist(entity);
        equipoRepository.flush();
        osr.setEquipoId(entity.getId());
        return equipoMapper.toDTO(entity);
    }

    @Transactional
    public EvidenciaIngresoEquipoDTO guardarEvidencia(Long equipoId, String tipoValue,
            String fileName, String mimeType, byte[] content, Long usuarioId) {
        Equipo equipo = requireDraft(equipoId);
        TipoEvidenciaIngreso tipo = parseType(tipoValue);
        String normalizedMime = mimeType == null ? "" : mimeType.toLowerCase(Locale.ROOT);
        if (!MIME_TYPES.contains(normalizedMime)) {
            throw error("Solo se permiten imágenes JPEG o PNG", Response.Status.BAD_REQUEST);
        }
        if (content == null || content.length == 0 || content.length > MAX_FILE_SIZE) {
            throw error("La fotografía debe pesar entre 1 byte y 5 MB", Response.Status.BAD_REQUEST);
        }

        EvidenciaIngresoEquipo evidence = evidenciaRepository.findByEquipoAndTipo(equipo.getId(), tipo)
                .orElseGet(EvidenciaIngresoEquipo::new);
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

    public List<EvidenciaIngresoEquipoDTO> listarEvidencias(Long equipoId) {
        requireEquipment(equipoId);
        return evidenciaRepository.listByEquipo(equipoId).stream()
                .map(evidenciaMapper::toDTO)
                .toList();
    }

    public EvidenciaIngresoEquipo obtenerArchivo(Long equipoId, String tipoValue) {
        requireEquipment(equipoId);
        return evidenciaRepository.findByEquipoAndTipo(equipoId, parseType(tipoValue))
                .orElseThrow(() -> error("Evidencia no encontrada", Response.Status.NOT_FOUND));
    }

    @Transactional
    public EquipoDTO finalizar(Long equipoId, Long usuarioId) {
        Equipo equipo = requireDraft(equipoId);
        Set<TipoEvidenciaIngreso> required = requiredEvidence(equipo);
        Set<TipoEvidenciaIngreso> current = EnumSet.noneOf(TipoEvidenciaIngreso.class);
        evidenciaRepository.listByEquipo(equipoId).forEach(item -> current.add(item.getTipo()));
        required.removeAll(current);
        if (!required.isEmpty()) {
            throw error("Faltan evidencias obligatorias: " + String.join(", ",
                    required.stream().map(Enum::name).toList()), Response.Status.BAD_REQUEST);
        }
        equipo.setIngresoCompleto(true);
        equipo.setUsuarioActualizacion(usuarioId);
        equipo.setFechaActualizacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
        return equipoMapper.toDTO(equipo);
    }

    @Transactional
    public void cancelarBorrador(Long equipoId) {
        Equipo equipo = requireDraft(equipoId);
        osrRepository.findByEquipoId(equipoId).ifPresent(osr -> osr.setEquipoId(null));
        evidenciaRepository.deleteByEquipo(equipoId);
        equipoRepository.delete(equipo);
    }

    private void validateEquipment(EquipoDTO data) {
        if (data.getFechaIngreso() == null) {
            throw error("La fecha de ingreso es obligatoria", Response.Status.BAD_REQUEST);
        }
        if (data.getNumeroGuiaRemision() == null || data.getNumeroGuiaRemision().isBlank()) {
            throw error("El número de guía de remisión es obligatorio", Response.Status.BAD_REQUEST);
        }
        requireActive(proveedorRepository.findById(data.getProveedorId()), "Proveedor");
        requireActive(marcaRepository.findById(data.getMarcaId()), "Marca");
        requireActive(tipoEquipoRepository.findById(data.getTipoEquipoId()), "Tipo de equipo");
        requireSeries(data.getBateria(), data.getSerieBateria(), "batería");
        requireSeries(data.getBateriaAdicional(), data.getSerieBateriaAdicional(), "batería adicional");
        requireSeries(data.getCargador(), data.getSerieCargador(), "cargador");
        requireSeries(data.getTransformador(), data.getSerieTransformador(), "transformador");
    }

    private void requireActive(Object catalog, String label) {
        boolean active = catalog instanceof Proveedor p && Boolean.TRUE.equals(p.getEstadoActivo())
                || catalog instanceof Marca m && Boolean.TRUE.equals(m.getEstadoActivo())
                || catalog instanceof TipoEquipo t && Boolean.TRUE.equals(t.getEstadoActivo());
        if (!active) throw error(label + " no encontrado o inactivo", Response.Status.BAD_REQUEST);
    }

    private void requireSeries(Boolean enabled, String serial, String label) {
        if (Boolean.TRUE.equals(enabled) && (serial == null || serial.isBlank())) {
            throw error("Ingrese la serie de " + label, Response.Status.BAD_REQUEST);
        }
    }

    private void applyData(Equipo entity, EquipoDTO dto) {
        entity.setProveedorId(dto.getProveedorId());
        entity.setMarcaId(dto.getMarcaId());
        entity.setTipoEquipoId(dto.getTipoEquipoId());
        entity.setModelo(dto.getModelo().trim());
        entity.setCapacidad(dto.getCapacidad());
        entity.setAlturaMaxima(dto.getAlturaMaxima());
        entity.setBateria(Boolean.TRUE.equals(dto.getBateria()));
        entity.setSerieBateria(dto.getSerieBateria());
        entity.setBateriaAdicional(Boolean.TRUE.equals(dto.getBateriaAdicional()));
        entity.setSerieBateriaAdicional(dto.getSerieBateriaAdicional());
        entity.setCargador(Boolean.TRUE.equals(dto.getCargador()));
        entity.setSerieCargador(dto.getSerieCargador());
        entity.setTransformador(Boolean.TRUE.equals(dto.getTransformador()));
        entity.setSerieTransformador(dto.getSerieTransformador());
        entity.setExtintor(Boolean.TRUE.equals(dto.getExtintor()));
        entity.setConoSeguridad(Boolean.TRUE.equals(dto.getConoSeguridad()));
        entity.setBotiquin(Boolean.TRUE.equals(dto.getBotiquin()));
        entity.setMesaRodillos(Boolean.TRUE.equals(dto.getMesaRodillos()));
        entity.setElevadorBateria(Boolean.TRUE.equals(dto.getElevadorBateria()));
        entity.setCableAdicional(Boolean.TRUE.equals(dto.getCableAdicional()));
        entity.setConectorAdicional(Boolean.TRUE.equals(dto.getConectorAdicional()));
        entity.setHorometroInicio(dto.getHorometroInicio());
        entity.setHorometroFin(dto.getHorometroFin());
        entity.setObservaciones(dto.getObservaciones());
        entity.setFechaIngreso(dto.getFechaIngreso());
        entity.setNumeroGuiaRemision(dto.getNumeroGuiaRemision().trim());
    }

    private Set<TipoEvidenciaIngreso> requiredEvidence(Equipo equipo) {
        Set<TipoEvidenciaIngreso> result = EnumSet.copyOf(BASE_REQUIRED);
        if (Boolean.TRUE.equals(equipo.getBateria())) result.add(TipoEvidenciaIngreso.BATERIA_1);
        if (Boolean.TRUE.equals(equipo.getBateriaAdicional())) result.add(TipoEvidenciaIngreso.BATERIA_2);
        if (Boolean.TRUE.equals(equipo.getConoSeguridad())) result.add(TipoEvidenciaIngreso.CONO);
        if (Boolean.TRUE.equals(equipo.getBotiquin())) result.add(TipoEvidenciaIngreso.BOTIQUIN);
        if (Boolean.TRUE.equals(equipo.getCargador())) result.add(TipoEvidenciaIngreso.CARGADOR);
        if (Boolean.TRUE.equals(equipo.getTransformador())) result.add(TipoEvidenciaIngreso.TRANSFORMADOR);
        if (Boolean.TRUE.equals(equipo.getCableAdicional())) result.add(TipoEvidenciaIngreso.CABLE_ADICIONAL);
        if (Boolean.TRUE.equals(equipo.getMesaRodillos())) result.add(TipoEvidenciaIngreso.MESA_RODILLOS);
        if (Boolean.TRUE.equals(equipo.getElevadorBateria())) result.add(TipoEvidenciaIngreso.ELEVADOR_BATERIA);
        if (Boolean.TRUE.equals(equipo.getConectorAdicional())) result.add(TipoEvidenciaIngreso.CONECTOR_ADICIONAL);
        return result;
    }

    private Equipo requireDraft(Long id) {
        Equipo equipo = requireEquipment(id);
        if (Boolean.TRUE.equals(equipo.getIngresoCompleto())) {
            throw error("El ingreso ya fue finalizado", Response.Status.CONFLICT);
        }
        return equipo;
    }

    private Equipo requireEquipment(Long id) {
        Equipo equipo = equipoRepository.findById(id);
        if (equipo == null) throw error("Equipo no encontrado", Response.Status.NOT_FOUND);
        return equipo;
    }

    private TipoEvidenciaIngreso parseType(String value) {
        try {
            return TipoEvidenciaIngreso.valueOf(value.toUpperCase(Locale.ROOT));
        } catch (Exception ex) {
            throw error("Tipo de evidencia no válido", Response.Status.BAD_REQUEST);
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
