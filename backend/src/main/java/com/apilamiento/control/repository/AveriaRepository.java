package com.apilamiento.control.repository;

import com.apilamiento.control.entity.Averia;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class AveriaRepository implements PanacheRepository<Averia> {

    public List<Averia> listByEquipoId(Long equipoId) {
        return list("equipoId", equipoId);
    }

    public List<Averia> listByEstadoAveria(String estadoAveria) {
        return list("estadoAveria", estadoAveria);
    }
}
