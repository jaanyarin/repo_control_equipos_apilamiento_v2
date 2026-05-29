package com.apilamiento.control.controller;

import com.apilamiento.control.dto.UsuarioDTO;
import com.apilamiento.control.service.AuthService;
import com.apilamiento.control.service.UsuarioService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/usuarios")
@RolesAllowed({"Super Admin", "Admin", "Usuario"})
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UsuarioResource {

    private final UsuarioService service;
    private final AuthService authService;

    public UsuarioResource(UsuarioService service, AuthService authService) {
        this.service = service;
        this.authService = authService;
    }

    @GET
    public List<UsuarioDTO> listar() {
        return service.listarTodos();
    }

    @GET
    @Path("/{id}")
    public Response buscar(@PathParam("id") Long id) {
        UsuarioDTO dto = service.buscarPorId(id);
        if (dto == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(dto).build();
    }

    @POST
    public Response crear(UsuarioDTO dto) {
        UsuarioDTO creado = service.crear(dto);
        return Response.status(Response.Status.CREATED).entity(creado).build();
    }

    @PUT
    @Path("/{id}")
    public Response actualizar(@PathParam("id") Long id, UsuarioDTO dto) {
        UsuarioDTO actualizado = service.actualizar(id, dto);
        if (actualizado == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(actualizado).build();
    }

    @GET
    @Path("/buscar-por-correo")
    public Response buscarPorCorreo(@QueryParam("q") String query) {
        try {
            List<String> resultados = authService.searchUsersByEmail(query);
            return Response.ok(resultados).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(java.util.Map.of("error", e.getMessage()))
                    .build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response eliminar(@PathParam("id") Long id) {
        boolean resultado = service.eliminar(id);
        if (!resultado) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.noContent().build();
    }
}
