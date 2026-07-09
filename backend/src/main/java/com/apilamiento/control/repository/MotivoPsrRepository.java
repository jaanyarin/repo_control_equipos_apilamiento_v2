package com.apilamiento.control.repository;

import com.apilamiento.control.entity.MotivoPsr;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;

@ApplicationScoped
public class MotivoPsrRepository implements PanacheRepository<MotivoPsr> {

    public Optional<MotivoPsr> findByCodigo(String codigo) {
        return find("codigo", codigo).firstResultOptional();
    }
}