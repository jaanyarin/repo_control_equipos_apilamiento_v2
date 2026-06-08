package com.apilamiento.control.repository;

import com.apilamiento.control.entity.Marca;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;

@ApplicationScoped
public class MarcaRepository implements PanacheRepository<Marca> {

    public Optional<Marca> findByCodigo(String codigo) {
        return find("codigo", codigo).firstResultOptional();
    }
}
