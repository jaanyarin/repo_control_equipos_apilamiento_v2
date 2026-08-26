package com.apilamiento.control.service;

import com.apilamiento.control.dto.EquipoTimelineDTO;
import com.apilamiento.control.dto.EquipoTimelineEventDTO;
import com.apilamiento.control.dto.EquipoTimelineMetadataDTO;
import com.apilamiento.control.dto.EquipoTimelinePhotoDTO;
import com.apilamiento.control.dto.EquipoTimelineSummaryDTO;
import com.apilamiento.control.entity.Averia;
import com.apilamiento.control.entity.Campana;
import com.apilamiento.control.entity.Equipo;
import com.apilamiento.control.entity.EvidenciaAveria;
import com.apilamiento.control.entity.EvidenciaDevolucionEquipo;
import com.apilamiento.control.entity.EvidenciaIngresoEquipo;
import com.apilamiento.control.entity.MotivoPsr;
import com.apilamiento.control.entity.Osr;
import com.apilamiento.control.entity.Psr;
import com.apilamiento.control.entity.Proveedor;
import com.apilamiento.control.entity.Sede;
import com.apilamiento.control.entity.Usuario;
import com.apilamiento.control.repository.AveriaRepository;
import com.apilamiento.control.repository.CampanaRepository;
import com.apilamiento.control.repository.EquipoRepository;
import com.apilamiento.control.repository.EvidenciaAveriaRepository;
import com.apilamiento.control.repository.EvidenciaDevolucionEquipoRepository;
import com.apilamiento.control.repository.EvidenciaIngresoEquipoRepository;
import com.apilamiento.control.repository.MotivoPsrRepository;
import com.apilamiento.control.repository.OsrRepository;
import com.apilamiento.control.repository.ProveedorRepository;
import com.apilamiento.control.repository.PsrRepository;
import com.apilamiento.control.repository.SedeRepository;
import com.apilamiento.control.repository.UsuarioRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@ApplicationScoped
public class EquipoTimelineService {

    private static final ZoneId ZONE = ZoneId.of("America/Lima");

    private final EquipoRepository equipoRepository;
    private final OsrRepository osrRepository;
    private final PsrRepository psrRepository;
    private final AveriaRepository averiaRepository;
    private final EvidenciaIngresoEquipoRepository evidenciaIngresoRepository;
    private final EvidenciaAveriaRepository evidenciaAveriaRepository;
    private final EvidenciaDevolucionEquipoRepository evidenciaDevolucionRepository;
    private final MotivoPsrRepository motivoPsrRepository;
    private final SedeRepository sedeRepository;
    private final CampanaRepository campanaRepository;
    private final ProveedorRepository proveedorRepository;
    private final UsuarioRepository usuarioRepository;

    public EquipoTimelineService(EquipoRepository equipoRepository,
            OsrRepository osrRepository, PsrRepository psrRepository,
            AveriaRepository averiaRepository,
            EvidenciaIngresoEquipoRepository evidenciaIngresoRepository,
            EvidenciaAveriaRepository evidenciaAveriaRepository,
            EvidenciaDevolucionEquipoRepository evidenciaDevolucionRepository,
            MotivoPsrRepository motivoPsrRepository, SedeRepository sedeRepository,
            CampanaRepository campanaRepository, ProveedorRepository proveedorRepository,
            UsuarioRepository usuarioRepository) {
        this.equipoRepository = equipoRepository;
        this.osrRepository = osrRepository;
        this.psrRepository = psrRepository;
        this.averiaRepository = averiaRepository;
        this.evidenciaIngresoRepository = evidenciaIngresoRepository;
        this.evidenciaAveriaRepository = evidenciaAveriaRepository;
        this.evidenciaDevolucionRepository = evidenciaDevolucionRepository;
        this.motivoPsrRepository = motivoPsrRepository;
        this.sedeRepository = sedeRepository;
        this.campanaRepository = campanaRepository;
        this.proveedorRepository = proveedorRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public EquipoTimelineDTO obtenerTimeline(Long equipoId) {
        Equipo equipo = equipoRepository.findByIdOptional(equipoId).orElse(null);
        if (equipo == null) return null;

        Map<Long, String> nombreUsuarios = new HashMap<>();
        List<EquipoTimelineEventDTO> events = new ArrayList<>();
        long totalDowntimeMinutes = 0;

        // Vínculo PSR / OSR
        Optional<Osr> osrOpt = osrRepository.findByEquipoId(equipoId);
        Psr psr = osrOpt.flatMap(osr -> psrRepository.findByIdOptional(osr.getPsrId())).orElse(null);
        Osr osr = osrOpt.orElse(null);
        Sede sede = psr != null ? sedeRepository.findByIdOptional(psr.getSedeId()).orElse(null) : null;
        Campana campana = psr != null ? campanaRepository.findByIdOptional(psr.getCampanaId()).orElse(null) : null;
        MotivoPsr motivo = psr != null ? motivoPsrRepository.findByIdOptional(psr.getMotivoId()).orElse(null) : null;
        Proveedor proveedor = proveedorRepository.findByIdOptional(equipo.getProveedorId()).orElse(null);

        // PSR
        if (psr != null) {
            EquipoTimelineEventDTO event = nuevoEvento(equipo, "PSR", "psr-" + psr.getId(),
                    fechaOOffset(psr.getFechaPsr(), psr.getFechaCreacion()));
            event.setTitle("PSR registrada");
            event.setStatus("COMPLETADO");
            event.setDescription(motivo != null ? motivo.getNombre() : null);
            EquipoTimelineMetadataDTO md = new EquipoTimelineMetadataDTO();
            md.setDocumentNumber(psr.getNumeroPsr());
            md.setArea(sede != null ? sede.getNombre() : null);
            md.setCampana(campana != null ? campana.getNombre() : null);
            md.setUserName(nombreUsuario(psr.getUsuarioCreacion(), nombreUsuarios));
            event.setMetadata(md);
            event.setRelatedId(psr.getId());
            events.add(event);
        }

        // OSR
        if (osr != null) {
            EquipoTimelineEventDTO event = nuevoEvento(equipo, "OSR", "osr-" + osr.getId(),
                    fechaOOffset(osr.getFechaOsr(), osr.getFechaCreacion()));
            event.setTitle("OSR registrada");
            event.setStatus("COMPLETADO");
            EquipoTimelineMetadataDTO md = new EquipoTimelineMetadataDTO();
            md.setDocumentNumber(osr.getNumeroOsr());
            md.setCostPerMonth(osr.getCostoUnitario());
            md.setCurrency(osr.getTipoMoneda());
            md.setUserName(nombreUsuario(osr.getUsuarioCreacion(), nombreUsuarios));
            event.setMetadata(md);
            event.setRelatedId(osr.getId());
            events.add(event);
        }

        // Ingreso del equipo
        if (equipo.getFechaIngreso() != null || equipo.getFechaCreacion() != null) {
            EquipoTimelineEventDTO event = nuevoEvento(equipo, "INGRESO", "ingreso-" + equipo.getId(),
                    fechaOOffset(equipo.getFechaIngreso(), equipo.getFechaCreacion()));
            event.setTitle("Equipo ingresado");
            event.setStatus("COMPLETADO");
            event.setDescription(proveedor != null ? proveedor.getRazonSocial() : null);
            EquipoTimelineMetadataDTO md = new EquipoTimelineMetadataDTO();
            md.setDocumentNumber(equipo.getNumeroGuiaRemision());
            md.setArea(sede != null ? sede.getNombre() : null);
            md.setHourMeter(equipo.getHorometroInicio());
            md.setProvider(proveedor != null ? proveedor.getRazonSocial() : null);
            md.setUserName(nombreUsuario(equipo.getUsuarioCreacion(), nombreUsuarios));
            event.setMetadata(md);
            event.setRelatedId(equipo.getId());
            event.setPhotos(fotosIngreso(equipoId));
            events.add(event);
        }

        // Averías + reparaciones
        for (Averia averia : averiaRepository.listByEquipoId(equipoId)) {
            long downtime = calcularDowntime(averia);
            totalDowntimeMinutes += downtime;

            EquipoTimelineEventDTO averiaEvent = nuevoEvento(equipo, "AVERIA", "averia-" + averia.getId(),
                    averia.getFechaHoraAveria());
            averiaEvent.setTitle("Avería reportada");
            averiaEvent.setStatus("ATENDIDA".equals(averia.getEstadoAveria()) ? "COMPLETADO" : "EN_PROCESO");
            averiaEvent.setDescription(averia.getDescripcionFalla());
            EquipoTimelineMetadataDTO mdAveria = new EquipoTimelineMetadataDTO();
            mdAveria.setFailure(averia.getDescripcionFalla());
            mdAveria.setHourMeter(averia.getHorometro());
            mdAveria.setUserName(nombreUsuario(averia.getUsuarioCreacion(), nombreUsuarios));
            averiaEvent.setMetadata(mdAveria);
            averiaEvent.setRelatedId(averia.getId());
            averiaEvent.setPhotos(fotosAveria(averia.getId()));
            events.add(averiaEvent);

            if (averia.getFechaHoraAtencion() != null) {
                EquipoTimelineEventDTO reparacionEvent = nuevoEvento(equipo, "REPARACION",
                        "reparacion-" + averia.getId(), averia.getFechaHoraAtencion());
                reparacionEvent.setTitle("Reparación finalizada");
                reparacionEvent.setStatus("COMPLETADO");
                reparacionEvent.setDescription("Equipo operativo");
                EquipoTimelineMetadataDTO mdReparacion = new EquipoTimelineMetadataDTO();
                mdReparacion.setAction(averia.getAccionRealizada());
                mdReparacion.setDowntimeMinutes(downtime);
                mdReparacion.setHourMeter(averia.getHorometroAtencion());
                mdReparacion.setProvider(proveedor != null ? proveedor.getRazonSocial() : null);
                mdReparacion.setUserName(nombreUsuario(averia.getUsuarioActualizacion(), nombreUsuarios));
                reparacionEvent.setMetadata(mdReparacion);
                reparacionEvent.setRelatedId(averia.getId());
                events.add(reparacionEvent);
            }
        }

        // Finalización del servicio
        if (equipo.getFechaDevolucion() != null) {
            EquipoTimelineEventDTO event = nuevoEvento(equipo, "FINALIZACION", "finalizacion-" + equipo.getId(),
                    equipo.getFechaDevolucion());
            event.setTitle("Finalización del servicio");
            event.setStatus("COMPLETADO");
            event.setDescription("Equipo devuelto");
            EquipoTimelineMetadataDTO md = new EquipoTimelineMetadataDTO();
            md.setHourMeter(equipo.getHorometroFin());
            md.setDocumentNumber(equipo.getNumeroGuiaRemision());
            md.setProvider(proveedor != null ? proveedor.getRazonSocial() : null);
            md.setUserName(nombreUsuario(equipo.getUsuarioActualizacion(), nombreUsuarios));
            event.setMetadata(md);
            event.setRelatedId(equipo.getId());
            event.setPhotos(fotosDevolucion(equipoId));
            events.add(event);
        } else if (!"DEVUELTO".equals(equipo.getEstadoOperativo())) {
            EquipoTimelineEventDTO event = nuevoEvento(equipo, "FINALIZACION", "finalizacion-pendiente-" + equipo.getId(), null);
            event.setTitle("Finalización del servicio");
            event.setStatus("PENDIENTE");
            event.setDescription("Pendiente");
            event.setRelatedId(equipo.getId());
            events.add(event);
        }

        events.sort(comparadorEventos());

        EquipoTimelineSummaryDTO summary = new EquipoTimelineSummaryDTO();
        summary.setEntryDate(fechaOOffset(equipo.getFechaIngreso(), equipo.getFechaCreacion()));
        summary.setInitialHourMeter(equipo.getHorometroInicio());
        summary.setFinalHourMeter(equipo.getHorometroFin());
        summary.setFailureCount(averiaRepository.listByEquipoId(equipoId).size());
        summary.setTotalDowntimeMinutes(totalDowntimeMinutes);
        summary.setFinalDate(equipo.getFechaDevolucion());

        EquipoTimelineDTO dto = new EquipoTimelineDTO();
        dto.setEquipmentId(equipoId);
        dto.setCurrentStatus(equipo.getEstadoOperativo());
        dto.setSummary(summary);
        dto.setEvents(events);
        return dto;
    }

    private EquipoTimelineEventDTO nuevoEvento(Equipo equipo, String type, String id, OffsetDateTime dateTime) {
        EquipoTimelineEventDTO event = new EquipoTimelineEventDTO();
        event.setId(id);
        event.setEquipmentId(equipo.getId());
        event.setType(type);
        event.setDateTime(dateTime);
        return event;
    }

    private OffsetDateTime toOffset(LocalDateTime ldt) {
        return ldt != null ? ldt.atZone(ZONE).toOffsetDateTime() : null;
    }

    private OffsetDateTime fechaOOffset(LocalDateTime ldt, OffsetDateTime fallback) {
        OffsetDateTime value = toOffset(ldt);
        return value != null ? value : fallback;
    }

    private long calcularDowntime(Averia averia) {
        if (averia.getFechaHoraAveria() == null || averia.getFechaHoraAtencion() == null) return 0;
        long minutes = ChronoUnit.MINUTES.between(averia.getFechaHoraAveria(), averia.getFechaHoraAtencion());
        return Math.max(0, minutes);
    }

    private List<EquipoTimelinePhotoDTO> fotosIngreso(Long equipoId) {
        List<EquipoTimelinePhotoDTO> fotos = new ArrayList<>();
        for (EvidenciaIngresoEquipo item : evidenciaIngresoRepository.listByEquipo(equipoId)) {
            fotos.add(foto("ingreso-" + item.getTipo().name(), item.getTipo().name(),
                    "/ingresos-equipo/" + equipoId + "/evidencias/" + item.getTipo().name() + "/archivo"));
        }
        return fotos;
    }

    private List<EquipoTimelinePhotoDTO> fotosAveria(Long averiaId) {
        List<EquipoTimelinePhotoDTO> fotos = new ArrayList<>();
        for (EvidenciaAveria item : evidenciaAveriaRepository.listByAveria(averiaId)) {
            fotos.add(foto("averia-" + averiaId + "-foto-" + item.getNumeroFoto(), "FOTO_" + item.getNumeroFoto(),
                    "/averias/" + averiaId + "/evidencias/" + item.getNumeroFoto() + "/archivo"));
        }
        return fotos;
    }

    private List<EquipoTimelinePhotoDTO> fotosDevolucion(Long equipoId) {
        List<EquipoTimelinePhotoDTO> fotos = new ArrayList<>();
        for (EvidenciaDevolucionEquipo item : evidenciaDevolucionRepository.listByEquipo(equipoId)) {
            fotos.add(foto("devolucion-" + item.getTipo().name(), item.getTipo().name(),
                    "/devolucion-equipos/" + equipoId + "/evidencias/" + item.getTipo().name() + "/archivo"));
        }
        return fotos;
    }

    private EquipoTimelinePhotoDTO foto(String id, String type, String url) {
        EquipoTimelinePhotoDTO foto = new EquipoTimelinePhotoDTO();
        foto.setId(id);
        foto.setType(type);
        foto.setUrl(url);
        foto.setDescription(type.replaceAll("_", " "));
        return foto;
    }

    private String nombreUsuario(Long usuarioId, Map<Long, String> cache) {
        if (usuarioId == null) return null;
        return cache.computeIfAbsent(usuarioId, id -> {
            Optional<Usuario> usuario = usuarioRepository.findByIdOptional(id);
            return usuario.map(Usuario::getNombre).orElse(null);
        });
    }

    private Comparator<EquipoTimelineEventDTO> comparadorEventos() {
        Map<String, Integer> ordenTipos = new HashMap<>();
        ordenTipos.put("PSR", 1);
        ordenTipos.put("OSR", 2);
        ordenTipos.put("INGRESO", 3);
        ordenTipos.put("AVERIA", 4);
        ordenTipos.put("REPARACION", 5);
        ordenTipos.put("FINALIZACION", 6);
        return (a, b) -> {
            OffsetDateTime da = a.getDateTime();
            OffsetDateTime db = b.getDateTime();
            if (da == null && db == null) {
                return orden(ordenTipos, a) - orden(ordenTipos, b);
            }
            if (da == null) return 1;
            if (db == null) return -1;
            int porFecha = da.compareTo(db);
            if (porFecha != 0) return porFecha;
            return orden(ordenTipos, a) - orden(ordenTipos, b);
        };
    }

    private int orden(Map<String, Integer> ordenTipos, EquipoTimelineEventDTO evento) {
        return ordenTipos.getOrDefault(evento.getType(), 99);
    }
}
