package com.apilamiento.control.repository;

import com.apilamiento.control.entity.EvidenciaDevolucionEquipo;
import com.apilamiento.control.entity.TipoEvidenciaDevolucion;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class EvidenciaDevolucionEquipoRepository implements PanacheRepository<EvidenciaDevolucionEquipo> {
    public List<EvidenciaDevolucionEquipo> listByEquipo(Long equipoId) {
        return list("equipoId", equipoId);
    }

    public Optional<EvidenciaDevolucionEquipo> findByEquipoAndTipo(Long equipoId, TipoEvidenciaDevolucion tipo) {
        return find("equipoId = ?1 and tipo = ?2", equipoId, tipo).firstResultOptional();
    }
}