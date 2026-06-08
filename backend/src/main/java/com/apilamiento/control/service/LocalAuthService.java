package com.apilamiento.control.service;

import com.apilamiento.control.entity.Rol;
import com.apilamiento.control.entity.Usuario;
import com.apilamiento.control.repository.RolRepository;
import com.apilamiento.control.repository.UsuarioRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import org.mindrot.jbcrypt.BCrypt;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class LocalAuthService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final JwtService jwtService;

    public LocalAuthService(UsuarioRepository usuarioRepository, RolRepository rolRepository, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.jwtService = jwtService;
    }

    public List<Rol> getRolesActivos() {
        return rolRepository.list("estadoActivo", true);
    }

    public List<Map<String, Object>> getUsuariosByRol(Long rolId) {
        return usuarioRepository.findByRolId(rolId).stream()
                .map(u -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", u.getId());
                    m.put("nombre", u.getNombre());
                    m.put("area", u.getArea());
                    m.put("rolId", u.getRolId());
                    return m;
                })
                .toList();
    }

    @Transactional
    public Map<String, Object> loginLocal(Long usuarioId, String password) {
        Usuario user = usuarioRepository.findById(usuarioId);
        if (user == null) {
            throw new RuntimeException("Usuario no encontrado");
        }
        if (!Boolean.TRUE.equals(user.getEstadoActivo())) {
            throw new RuntimeException("Usuario no activo");
        }

        String storedHash = user.getPasswordHash();
        if (storedHash == null || storedHash.isBlank()) {
            throw new RuntimeException("Usuario sin contraseña configurada");
        }

        if (!BCrypt.checkpw(password, storedHash)) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        user.setUltimoAcceso(OffsetDateTime.now(ZoneId.of("America/Lima")));
        user.setFechaActualizacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
        usuarioRepository.persist(user);

        String token = jwtService.generateToken(user);
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("passwordResetRequired", user.getPasswordResetRequired());
        return result;
    }

    @Transactional
    public Map<String, Object> changePassword(Long usuarioId, String newPassword) {
        if (newPassword == null || newPassword.length() < 6) {
            throw new RuntimeException("La nueva contraseña debe tener al menos 6 caracteres");
        }

        Usuario user = usuarioRepository.findById(usuarioId);
        if (user == null) {
            throw new RuntimeException("Usuario no encontrado");
        }
        if (!Boolean.TRUE.equals(user.getEstadoActivo())) {
            throw new RuntimeException("Usuario no activo");
        }

        String hashed = BCrypt.hashpw(newPassword, BCrypt.gensalt());
        user.setPasswordHash(hashed);
        user.setPasswordResetRequired(false);
        user.setFechaActualizacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
        usuarioRepository.persist(user);

        String token = jwtService.generateToken(user);
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("message", "Contraseña actualizada correctamente");
        return result;
    }
}
