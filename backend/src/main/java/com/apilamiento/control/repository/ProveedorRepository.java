package com.apilamiento.control.repository;

import com.apilamiento.control.entity.Proveedor;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;

@ApplicationScoped
public class ProveedorRepository implements PanacheRepository<Proveedor> {

    public Optional<Proveedor> findByCodigo(String codigo) {
        return find("codigo", codigo).firstResultOptional();
    }
}
