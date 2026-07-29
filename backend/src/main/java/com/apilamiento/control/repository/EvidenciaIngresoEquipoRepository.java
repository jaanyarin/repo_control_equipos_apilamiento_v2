package com.apilamiento.control.repository;

import com.apilamiento.control.entity.EvidenciaIngresoEquipo;
import com.apilamiento.control.entity.TipoEvidenciaIngreso;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class EvidenciaIngresoEquipoRepository implements PanacheRepository<EvidenciaIngresoEquipo> {
    public List<EvidenciaIngresoEquipo> listByEquipo(Long equipoId) {
        return list("equipoId", equipoId);
    }

    public Optional<EvidenciaIngresoEquipo> findByEquipoAndTipo(Long equipoId, TipoEvidenciaIngreso tipo) {
        return find("equipoId = ?1 and tipo = ?2", equipoId, tipo).firstResultOptional();
    }

    public long deleteByEquipo(Long equipoId) {
        return delete("equipoId", equipoId);
    }
}
