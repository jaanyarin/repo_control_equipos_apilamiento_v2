package com.apilamiento.control.service;

import com.apilamiento.control.audit.AuditoriaEvento;
import com.apilamiento.control.audit.AuditoriaRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;

@ApplicationScoped
public class AuditoriaService {

    private final AuditoriaRepository repository;

    public AuditoriaService(AuditoriaRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public void registrar(String tipoEvento, String entidad, Long entidadId,
                          String accion, Long usuarioId, String usuarioNombre,
                          String detalle, String direccionIp) {
        AuditoriaEvento evento = new AuditoriaEvento();
        evento.setTipoEvento(tipoEvento);
        evento.setEntidad(entidad);
        evento.setEntidadId(entidadId);
        evento.setAccion(accion);
        evento.setUsuarioId(usuarioId);
        evento.setUsuarioNombre(usuarioNombre);
        evento.setDetalle(detalle);
        evento.setDireccionIp(direccionIp);
        evento.setFechaEvento(OffsetDateTime.now(ZoneId.of("America/Lima")));
        repository.persist(evento);
    }

    public List<AuditoriaEvento> listarRecientes(int limite) {
        return repository.listarRecientes(limite);
    }

    public List<AuditoriaEvento> listarPorEntidad(String entidad, Long entidadId) {
        return repository.listarPorEntidad(entidad, entidadId);
    }

    public List<AuditoriaEvento> listarPorTipo(String tipoEvento) {
        return repository.listarPorTipo(tipoEvento);
    }
}
