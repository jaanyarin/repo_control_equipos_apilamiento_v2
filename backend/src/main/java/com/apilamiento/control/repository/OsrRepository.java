package com.apilamiento.control.repository;

import com.apilamiento.control.entity.Osr;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;
import jakarta.persistence.LockModeType;

@ApplicationScoped
public class OsrRepository implements PanacheRepository<Osr> {

    public Optional<Osr> findByPsrId(Long psrId) {
        return find("psrId", psrId).firstResultOptional();
    }

    public List<Osr> listByPsrId(Long psrId) {
        return list("psrId", psrId);
    }

    public Optional<Osr> findByNumeroOsr(String numeroOsr) {
        return find("numeroOsr", numeroOsr).firstResultOptional();
    }

    public Optional<Osr> findByPsrIdForUpdate(Long psrId) {
        return find("psrId", psrId).withLock(LockModeType.PESSIMISTIC_WRITE).firstResultOptional();
    }

    public List<Osr> listByPsrIdForUpdate(Long psrId) {
        return find("psrId", psrId).withLock(LockModeType.PESSIMISTIC_WRITE).list();
    }

    public Optional<Osr> findByEquipoId(Long equipoId) {
        return find("equipoId", equipoId).firstResultOptional();
    }

    public long countByPsrId(Long psrId) {
        return count("psrId", psrId);
    }
}
