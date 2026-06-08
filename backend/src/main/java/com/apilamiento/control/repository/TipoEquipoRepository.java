package com.apilamiento.control.repository;

import com.apilamiento.control.entity.TipoEquipo;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;

@ApplicationScoped
public class TipoEquipoRepository implements PanacheRepository<TipoEquipo> {

    public Optional<TipoEquipo> findByCodigo(String codigo) {
        return find("codigo", codigo).firstResultOptional();
