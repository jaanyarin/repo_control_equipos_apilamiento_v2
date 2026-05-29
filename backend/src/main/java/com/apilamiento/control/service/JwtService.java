package com.apilamiento.control.service;

import com.apilamiento.control.entity.Usuario;
import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import java.time.Duration;
import java.util.Set;

@ApplicationScoped
public class JwtService {

    private static final Duration EXPIRATION = Duration.ofHours(8);

    public String generateToken(Usuario user) {
        return Jwt.issuer("https://apilamiento.internal")
                .subject(String.valueOf(user.getId()))
                .upn(user.getCorreo())
                .groups(Set.of(user.getRol() != null ? user.getRol().getNombre() : "Usuario"))
                .claim("nombre", user.getNombre())
                .claim("correo", user.getCorreo())
                .claim("rolId", user.getRolId())
                .expiresIn(EXPIRATION)
                .sign();
    }
}
