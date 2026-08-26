package com.apilamiento.control.service;

import com.apilamiento.control.entity.TokenPush;
import com.apilamiento.control.repository.TokenPushRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Locale;

@ApplicationScoped
public class TokenPushService {

    private static final int MAX_TOKEN_LENGTH = 512;

    private final TokenPushRepository tokenPushRepository;

    public TokenPushService(TokenPushRepository tokenPushRepository) {
        this.tokenPushRepository = tokenPushRepository;
    }

    @Transactional
    public void registrarToken(Long usuarioId, String token, String plataforma) {
        if (usuarioId == null) {
            throw error("Usuario no autenticado", Response.Status.UNAUTHORIZED);
        }
        if (token == null || token.isBlank()) {
            throw error("El token FCM es obligatorio", Response.Status.BAD_REQUEST);
        }
        String normalized = token.trim();
        if (normalized.length() > MAX_TOKEN_LENGTH) {
            throw error("Token FCM inválido", Response.Status.BAD_REQUEST);
        }
        String platform = plataforma == null || plataforma.isBlank()
                ? "ANDROID" : plataforma.trim().toUpperCase(Locale.ROOT);

        TokenPush existing = tokenPushRepository.findByToken(normalized).orElse(null);
        OffsetDateTime now = OffsetDateTime.now(ZoneId.of("America/Lima"));
        if (existing == null) {
            TokenPush push = new TokenPush();
            push.setUsuarioId(usuarioId);
            push.setToken(normalized);
            push.setPlataforma(platform);
            push.setActivo(true);
            push.setUsuarioCreacion(usuarioId);
            push.setFechaCreacion(now);
            tokenPushRepository.persist(push);
        } else {
            existing.setUsuarioId(usuarioId);
            existing.setActivo(true);
            existing.setPlataforma(platform);
            existing.setUsuarioActualizacion(usuarioId);
            existing.setFechaActualizacion(now);
        }
        desactivarOtrosTokensDelUsuario(usuarioId, normalized, now);
    }

    @Transactional
    public void desactivarToken(Long id) {
        if (id == null) return;
        TokenPush push = tokenPushRepository.findById(id);
        if (push != null && Boolean.TRUE.equals(push.getActivo())) {
            push.setActivo(false);
            push.setFechaActualizacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
        }
    }

    private void desactivarOtrosTokensDelUsuario(Long usuarioId, String tokenConservar, OffsetDateTime now) {
        List<TokenPush> otros = tokenPushRepository.listActivosDeUsuarioExcluyendo(usuarioId, tokenConservar);
        for (TokenPush otro : otros) {
            otro.setActivo(false);
            otro.setFechaActualizacion(now);
        }
    }

    @Transactional
    public void eliminarToken(String token) {
        if (token == null || token.isBlank()) return;
        OffsetDateTime now = OffsetDateTime.now(ZoneId.of("America/Lima"));
        tokenPushRepository.findByToken(token.trim())
                .ifPresent(push -> {
                    push.setActivo(false);
                    push.setFechaActualizacion(now);
                });
    }

    private WebApplicationException error(String message, Response.Status status) {
        return new WebApplicationException(message, status);
    }
}