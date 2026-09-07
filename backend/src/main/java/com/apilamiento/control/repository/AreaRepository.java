package com.apilamiento.control.repository;

import com.apilamiento.control.entity.Area;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Optional;

@ApplicationScoped
public class AreaRepository implements PanacheRepository<Area> {
    public Optional<Area> findByNombre(String nombre) {
        return find("lower(nombre)", nombre.toLowerCase()).firstResultOptional();
    }
}