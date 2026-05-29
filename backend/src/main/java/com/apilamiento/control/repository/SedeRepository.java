package com.apilamiento.control.repository;

import com.apilamiento.control.entity.Sede;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class SedeRepository implements PanacheRepository<Sede> {
}
