package com.apilamiento.control.service;

import com.apilamiento.control.dto.MotivoPsrDTO;
import com.apilamiento.control.entity.MotivoPsr;
import com.apilamiento.control.entity.TipoEquipo;
import com.apilamiento.control.mapper.MotivoPsrMapper;
import com.apilamiento.control.repository.MotivoPsrRepository;
import com.apilamiento.control.repository.PsrRepository;
import com.apilamiento.control.repository.TipoEquipoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;

@ApplicationScoped
public class MotivoPsrService {

    private final MotivoPsrRepository repository;
    private final MotivoPsrMapper mapper;
    private final TipoEquipoRepository tipoEquipoRepository;
    private final PsrRepository psrRepository;

    public MotivoPsrService(MotivoPsrRepository repository, MotivoPsrMapper mapper,
                            TipoEquipoRepository tipoEquipoRepository, PsrRepository psrRepository) {
        this.repository = repository;
        this.mapper = mapper;
        this.tipoEquipoRepository = tipoEquipoRepository;
        this.psrRepository = psrRepository;
    }

    public List<MotivoPsrDTO> listarTodas() {
        return repository.listAll().stream()
                .map(mapper::toDTO)
                .toList();
    }

    public MotivoPsrDTO buscarPorId(Long id) {
        return repository.findByIdOptional(id)
                .map(mapper::toDTO)
                .orElse(null);
    }

    private String generarCodigo(String nombre) {
        String base = nombre.toUpperCase().replaceAll("\\s+", "_").replaceAll("[^A-Z0-9_]", "");
        return base.length() > 50 ? base.substring(0, 50) : base;
    }

    private String generarNombreCorto(String nombre) {
        if (nombre == null || nombre.isBlank()) return null;
        String corto = nombre.trim();
        return corto.length() > 100 ? corto.substring(0, 100) : corto;
    }

    private String resolverNombreCorto(MotivoPsrDTO dto) {
        if (dto.getNombreCorto() != null && !dto.getNombreCorto().isBlank()) {
            return dto.getNombreCorto().trim();
        }
        return generarNombreCorto(dto.getNombre());
    }

    @Transactional
    public MotivoPsrDTO crear(MotivoPsrDTO dto) {
        MotivoPsr entity = new MotivoPsr();
        entity.setNombre(dto.getNombre());
        String nombreCorto = resolverNombreCorto(dto);
        entity.setNombreCorto(nombreCorto);
        entity.setCodigo(generarCodigo(dto.getNombre()));
        entity.setEstadoActivo(true);
        entity.setUsuarioCreacion(dto.getUsuarioCreacion() != null ? dto.getUsuarioCreacion() : 1L);
        repository.persist(entity);
        sincronizarTipoEquipo(nombreCorto, dto.getUsuarioCreacion());
        return mapper.toDTO(entity);
    }

    private void sincronizarTipoEquipo(String nombreCorto, Long usuario) {
        if (nombreCorto == null || nombreCorto.isBlank()) return;
        if (tipoEquipoRepository.findByNombre(nombreCorto.trim()).isPresent()) return;
        TipoEquipo tipo = new TipoEquipo();
        tipo.setNombre(nombreCorto.trim());
        tipo.setCodigo(generarCodigo(nombreCorto.trim()));
        tipo.setEstadoActivo(true);
        tipo.setUsuarioCreacion(usuario != null ? usuario : 1L);
        tipoEquipoRepository.persist(tipo);
    }

    @Transactional
    public MotivoPsrDTO actualizar(Long id, MotivoPsrDTO dto) {
        MotivoPsr entity = repository.findById(id);
        if (entity == null) return null;
        if (dto.getNombre() != null) {
            entity.setNombre(dto.getNombre());
            entity.setCodigo(generarCodigo(dto.getNombre()));
        }
        if (dto.getNombreCorto() != null) entity.setNombreCorto(dto.getNombreCorto());
        if (dto.getEstadoActivo() != null) entity.setEstadoActivo(dto.getEstadoActivo());
        entity.setUsuarioActualizacion(dto.getUsuarioActualizacion() != null ? dto.getUsuarioActualizacion() : 1L);
        entity.setFechaActualizacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
        return mapper.toDTO(entity);
    }

    @Transactional
    public boolean eliminar(Long id) {
        MotivoPsr entity = repository.findById(id);
        if (entity == null) return false;
        if (!psrRepository.listByMotivoId(id).isEmpty()) {
            throw new WebApplicationException(
                    "No se puede eliminar el motivo porque tiene PSRs asociados",
                    Response.Status.CONFLICT);
        }
        repository.delete(entity);
        return true;
    }
}