package com.apilamiento.control.repository;

import com.apilamiento.control.entity.TipoEquipo;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class TipoEquipoRepository implements PanacheRepository