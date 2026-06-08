package com.apilamiento.control.repository;

import com.apilamiento.control.entity.Equipo;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class EquipoRepository implements PanacheRepository<Equipo> {

    public Optional<Equipo> findByCodigo(String codigo) {
        return find("codigo", codigo).firstResultOptional();
    }

    public Optional<Equipo> findByNumeroSerie(String numeroSerie) {
        return find("numeroSerie", numeroSerie).firstResultOptional();
    }

    public List<Equipo> listByProveedorId(Long proveedorId) {
        return list("proveedorId", proveedorId);
    }

    public List<Equipo> listByMarcaId(Long marcaId) {
        return list("marcaId", marcaId);
    }

    public List<Equipo> listByTipoEquipoId(Long tipoEquipoId) {
        return list("tipoEquipoId", tipoEquipoId);
    }

    public List<Equipo> listByEstadoOperativo(String estadoOperativo) {
        return list("estadoOperativo", estadoOperativo);
    }
}
