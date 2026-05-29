package com.apilamiento.control.controller;

import com.apilamiento.control.entity.Rol;
import com.apilamiento.control.repository.RolRepository;
import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;

@Path("/roles")
@RolesAllowed({"Super Admin", "Admin", "Usuario"})
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RolResource {

    private final RolRepository repository;

    public RolResource(RolRepository repository) {
        this.repository = repository;
    }

    @GET
    @Transactional
    public List<Rol> listar() {
        return repository.listAll();
    }

    @GET
    @Path("/{id}")
    @Transactional
    public Response buscar(@PathParam("id") Long id) {
        Rol rol = repository.findById(id);
        if (rol == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(rol).build();
    }

    @POST
    @Transactional
    public Response crear(Rol rol) {
        rol.setId(null);
        rol.setFechaCreacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
        repository.persist(rol);
        return Response.status(Response.Status.CREATED).entity(rol).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response actualizar(@PathParam("id") Long id, Rol rol) {
        Rol existente = repository.findById(id);
        if (existente == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        existente.setNombre(rol.getNombre());
        existente.setDescripcion(rol.getDescripcion());
        existente.setEstadoActivo(rol.getEstadoActivo());
        existente.setFechaActualizacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
        existente.setUsuarioActualizacion(rol.getUsuarioActualizacion());
        repository.persist(existente);
        return Response.ok(existente).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response eliminar(@PathParam("id") Long id) {
        boolean eliminado = repository.deleteById(id);
        if (!eliminado) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.noContent().build();
    }
}
