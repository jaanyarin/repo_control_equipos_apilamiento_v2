package com.apilamiento.control.repository;

import com.apilamiento.control.entity.Rol;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;

@ApplicationScoped
public class RolRepository implements PanacheRepository<Rol> {

    public Optional<Rol> findByNombre(String nombre) {
        return find("nombre", nombre).firstResultOptional();
    }
}
