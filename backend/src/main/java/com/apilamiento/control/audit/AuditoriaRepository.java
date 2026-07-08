package com.apilamiento.control.audit;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class AuditoriaRepository implements PanacheRepository<AuditoriaEvento> {

    public List<AuditoriaEvento> listarPorTipo(String tipoEvento) {
        return list("tipoEvento", tipoEvento);
    }

    public List<AuditoriaEvento> listarPorEntidad(String entidad, Long entidadId) {
        return list("entidad = ?1 and entidadId = ?2", entidad, entidadId);
    }

    public List<AuditoriaEvento> listarRecientes(int limite) {
        return find("ORDER BY fechaEvento DESC").page(0, limite).list();
    }
}
