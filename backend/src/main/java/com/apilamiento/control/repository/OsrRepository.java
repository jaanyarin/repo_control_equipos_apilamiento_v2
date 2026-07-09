package com.apilamiento.control.repository;

import com.apilamiento.control.entity.Osr;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;

@ApplicationScoped
public class OsrRepository implements PanacheRepository<Osr> {

    public Optional<Osr> findByPsrId(Long psrId) {
        return find("psrId", psrId).firstResultOptional();
    }
}
