package com.apilamiento.control.repository;

import com.apilamiento.control.entity.EvidenciaAveria;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class EvidenciaAveriaRepository implements PanacheRepository<EvidenciaAveria> {

    public List<EvidenciaAveria> listByAveria(Long averiaId) {
        return list("averiaId", averiaId);
    }

    public Optional<EvidenciaAveria> findByAveriaAndNumero(Long averiaId, Short numeroFoto) {
        return find("averiaId = ?1 and numeroFoto = ?2", averiaId, numeroFoto).firstResultOptional();
    }

    public long deleteByAveria(Long averiaId) {
        return delete("averiaId", averiaId);
    }
}
