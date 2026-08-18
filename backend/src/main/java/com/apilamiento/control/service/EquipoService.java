package com.apilamiento.control.service;

import com.apilamiento.control.dto.EquipoDTO;
import com.apilamiento.control.dto.PsrOsrRefDTO;
import com.apilamiento.control.entity.Equipo;
import com.apilamiento.control.entity.Osr;
import com.apilamiento.control.entity.Psr;
import com.apilamiento.control.mapper.EquipoMapper;
import com.apilamiento.control.repository.CampanaRepository;
import com.apilamiento.control.repository.AveriaRepository;
import com.apilamiento.control.repository.EquipoRepository;
import com.apilamiento.control.repository.MarcaRepository;
import com.apilamiento.control.repository.OsrRepository;
import com.apilamiento.control.repository.ProveedorRepository;
import com.apilamiento.control.repository.PsrRepository;
import com.apilamiento.control.repository.SedeRepository;
import com.apilamiento.control.repository.TipoEquipoRepository;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;

@ApplicationScoped
public class EquipoService {

    private final EquipoRepository repository;
    private final EquipoMapper mapper;
    private final ProveedorRepository proveedorRepository;
    private final MarcaRepository marcaRepository;
    private final TipoEquipoRepository tipoEquipoRepository;
    private final OsrRepository osrRepository;
    private final PsrRepository psrRepository;
    private final SedeRepository sedeRepository;
    private final CampanaRepository campanaRepository;
    private final AveriaRepository averiaRepository;

    public EquipoService(EquipoRepository repository, EquipoMapper mapper,
            ProveedorRepository proveedorRepository, MarcaRepository marcaRepository,
            TipoEquipoRepository tipoEquipoRepository, OsrRepository osrRepository,
            PsrRepository psrRepository, SedeRepository sedeRepository,
            CampanaRepository campanaRepository, AveriaRepository averiaRepository) {
        this.repository = repository;
        this.mapper = mapper;
        this.proveedorRepository = proveedorRepository;
        this.marcaRepository = marcaRepository;
        this.tipoEquipoRepository = tipoEquipoRepository;
        this.osrRepository = osrRepository;
        this.psrRepository = psrRepository;
        this.sedeRepository = sedeRepository;
        this.campanaRepository = campanaRepository;
        this.averiaRepository = averiaRepository;
    }

    public List<EquipoDTO> listarTodos() {
        return repository.listCompletos().stream()
                .map(this::toDTO)
                .toList();
    }

    public EquipoDTO buscarPorId(Long id) {
        return repository.findByIdOptional(id)
                .map(this::toDTOConVinculacion)
                .orElse(null);
    }

    public List<EquipoDTO> listarPorProveedor(Long proveedorId) {
        return repository.list("proveedorId", proveedorId).stream()
                .map(this::toDTO)
                .toList();
    }

    public List<EquipoDTO> listarPorMarca(Long marcaId) {
        return repository.list("marcaId", marcaId).stream()
                .map(this::toDTO)
                .toList();
    }

    public List<EquipoDTO> listarPorTipoEquipo(Long tipoEquipoId) {
        return repository.list("tipoEquipoId", tipoEquipoId).stream()
                .map(this::toDTO)
                .toList();
    }

    public List<EquipoDTO> listarPorEstadoOperativo(String estadoOperativo) {
        return repository.list("estadoOperativo", estadoOperativo).stream()
                .map(this::toDTO)
                .toList();
    }

    public List<EquipoDTO> listarResumen() {
        return listarTodos();
    }

    private EquipoDTO toDTO(Equipo entity) {
        EquipoDTO dto = mapper.toDTO(entity);
        proveedorRepository.findByIdOptional(entity.getProveedorId())
                .ifPresent(value -> dto.setProveedorNombre(value.getRazonSocial()));
        marcaRepository.findByIdOptional(entity.getMarcaId())
                .ifPresent(value -> dto.setMarcaNombre(value.getNombre()));
        tipoEquipoRepository.findByIdOptional(entity.getTipoEquipoId())
                .ifPresent(value -> dto.setTipoEquipoNombre(value.getNombre()));
        return dto;
    }

    private EquipoDTO toDTOConVinculacion(Equipo entity) {
        EquipoDTO dto = toDTO(entity);
        dto.setPsrOsr(resolverPsrOsr(entity.getId()));
        return dto;
    }

    private PsrOsrRefDTO resolverPsrOsr(Long equipoId) {
        return osrRepository.findByEquipoId(equipoId)
                .map(this::toPsrOsrRef)
                .orElse(null);
    }

    private PsrOsrRefDTO toPsrOsrRef(Osr osr) {
        PsrOsrRefDTO ref = new PsrOsrRefDTO();
        ref.setNumeroOsr(osr.getNumeroOsr());
        Psr psr = psrRepository.findByIdOptional(osr.getPsrId()).orElse(null);
        if (psr == null) return ref;
        ref.setPsrId(psr.getId());
        ref.setNumeroPsr(psr.getNumeroPsr());
        sedeRepository.findByIdOptional(psr.getSedeId())
                .ifPresent(value -> ref.setSedeNombre(value.getNombre()));
        campanaRepository.findByIdOptional(psr.getCampanaId())
                .ifPresent(value -> ref.setCampanaNombre(value.getNombre()));
        return ref;
    }

    @Transactional
    public EquipoDTO crear(EquipoDTO dto) {
        Equipo entity = new Equipo();
        entity.setModelo(dto.getModelo());
        entity.setCodigo(dto.getCodigo().trim().toUpperCase());
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
        entity.setFechaIngreso(dto.getFechaIngreso());
        entity.setNumeroGuiaRemision(dto.getNumeroGuiaRemision());
        entity.setIngresoCompleto(dto.getIngresoCompleto() == null || dto.getIngresoCompleto());
        entity.setProveedorId(dto.getProveedorId());
        entity.setMarcaId(dto.getMarcaId());
        entity.setTipoEquipoId(dto.getTipoEquipoId());
        entity.setEstadoActivo(true);
        entity.setUsuarioCreacion(dto.getUsuarioCreacion() != null ? dto.getUsuarioCreacion() : 1L);
        repository.persist(entity);
        return toDTO(entity);
    }

    @Transactional
    public EquipoDTO actualizar(Long id, EquipoDTO dto) {
        Equipo entity = repository.findById(id);
        if (entity == null) return null;
        if (dto.getModelo() != null) {
            entity.setModelo(dto.getModelo());
        }
        String requestedCode = dto.getCodigo().trim().toUpperCase();
        repository.findByCodigo(requestedCode)
                .filter(found -> !found.getId().equals(id))
                .ifPresent(found -> { throw new WebApplicationException(
                        "El código del equipo ya está registrado", Response.Status.CONFLICT); });
        repository.findByNumeroSerie(dto.getNumeroSerie().trim())
                .filter(found -> !found.getId().equals(id))
                .ifPresent(found -> { throw new WebApplicationException(
                        "El número de serie ya está registrado", Response.Status.CONFLICT); });
        entity.setCodigo(requestedCode);
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
        if (dto.getFechaIngreso() != null) entity.setFechaIngreso(dto.getFechaIngreso());
        if (dto.getNumeroGuiaRemision() != null) entity.setNumeroGuiaRemision(dto.getNumeroGuiaRemision());
        if (dto.getProveedorId() != null) entity.setProveedorId(dto.getProveedorId());
        if (dto.getMarcaId() != null) entity.setMarcaId(dto.getMarcaId());
        if (dto.getTipoEquipoId() != null) entity.setTipoEquipoId(dto.getTipoEquipoId());
        if (dto.getEstadoActivo() != null) entity.setEstadoActivo(dto.getEstadoActivo());
        entity.setUsuarioActualizacion(dto.getUsuarioActualizacion() != null ? dto.getUsuarioActualizacion() : 1L);
        entity.setFechaActualizacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
        return toDTO(entity);
    }

    @Transactional
    public boolean eliminar(Long id) {
        Equipo entity = repository.findById(id);
        if (entity == null) return false;
        boolean tieneAverias = !averiaRepository.listByEquipoId(id).isEmpty();
        boolean tieneOsr = osrRepository.findByEquipoId(id).isPresent();
        if (tieneAverias || tieneOsr) {
            throw new WebApplicationException(
                    "No se puede eliminar el equipo porque tiene averías u OSR asociadas",
                    Response.Status.CONFLICT);
        }
        repository.delete(entity);
        return true;
    }
}
