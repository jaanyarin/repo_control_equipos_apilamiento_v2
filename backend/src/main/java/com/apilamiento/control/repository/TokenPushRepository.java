package com.apilamiento.control.repository;

import com.apilamiento.control.entity.TokenPush;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class TokenPushRepository implements PanacheRepository<TokenPush> {

    public Optional<TokenPush> findByToken(String token) {
        return find("token", token).firstResultOptional();
    }

    public List<TokenPush> listAllActivos() {
        return list("activo", true);
    }

    public List<TokenPush> listActivosExcepto(Long usuarioId) {
        return list("activo = ?1 and usuarioId <> ?2", true, usuarioId);
    }

    public List<TokenPush> listActivosDeUsuarioExcluyendo(Long usuarioId, String token) {
        return list("activo = ?1 and usuarioId = ?2 and token <> ?3", true, usuarioId, token);
    }
}