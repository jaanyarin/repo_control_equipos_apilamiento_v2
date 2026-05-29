package com.apilamiento.control.repository;

import com.apilamiento.control.entity.Rol;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class RolRepository implements PanacheRepository<Rol> {
}
