package com.apilamiento.control.repository;

import com.apilamiento.control.entity.Psr;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class PsrRepository implements PanacheRepository<Psr> {

    public List<Psr> listByCampanaId(Long campanaId) {
        return list("campanaId", campanaId);
    }

    public List<Psr> listBySedeId(Long sedeId) {
        return list("sedeId", sedeId);
    }
}
