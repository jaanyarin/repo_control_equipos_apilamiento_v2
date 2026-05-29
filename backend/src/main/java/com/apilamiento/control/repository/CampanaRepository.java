package com.apilamiento.control.repository;

import com.apilamiento.control.entity.Campana;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;

@ApplicationScoped
public class CampanaRepository implements PanacheRepository<Campana> {

    public Optional<Campana> findActiva() {
        return find("estadoActivo", true).firstResultOptional();
    }
}
