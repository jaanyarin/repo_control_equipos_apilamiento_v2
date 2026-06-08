package com.apilamiento.control.repository;

import com.apilamiento.control.entity.Usuario;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class UsuarioRepository implements PanacheRepository<Usuario> {

    public Optional<Usuario> findByCorreo(String correo) {
        return find("correo", correo).firstResultOptional();
    }

    public Optional<Usuario> findByIdMicrosoft(String idMicrosoft) {
        return find("idMicrosoft", idMicrosoft).firstResultOptional();
    }

    public List<Usuario> findByRolId(Long rolId) {
        return list("rolId = ?1 and estadoActivo = true", rolId);
    }

    public List<Usuario> findAllActivos() {
        return list("estadoActivo", true);
    }
}
