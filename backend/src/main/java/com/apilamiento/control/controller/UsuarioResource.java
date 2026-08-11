package com.apilamiento.control.controller;

import com.apilamiento.control.dto.ApiResponse;
import com.apilamiento.control.dto.UsuarioDTO;
import com.apilamiento.control.service.AuthService;
import com.apilamiento.control.service.UsuarioService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.SecurityContext;
import com.apilamiento.control.security.SecurityUtil;

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
    public Response listar() {
        return Response.ok(ApiResponse.ok(service.listarTodos())).build();
    }

    @GET
    @Path("/{id}")
    public Response buscar(@PathParam("id") Long id) {
        UsuarioDTO dto = service.buscarPorId(id);
        if (dto == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Usuario no encontrado", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok(dto)).build();
    }

    @POST
    public Response crear(@Valid UsuarioDTO dto, @Context SecurityContext context) {
        dto.setUsuarioCreacion(SecurityUtil.getUsuarioId(context));
        UsuarioDTO creado = service.crear(dto);
        return Response.status(Response.Status.CREATED)
                .entity(ApiResponse.ok("Usuario creado correctamente", creado)).build();
    }

    @PUT
    @Path("/{id}")
    public Response actualizar(@PathParam("id") Long id, @Valid UsuarioDTO dto, @Context SecurityContext context) {
        dto.setUsuarioActualizacion(SecurityUtil.getUsuarioId(context));
        UsuarioDTO actualizado = service.actualizar(id, dto);
        if (actualizado == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Usuario no encontrado", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok("Usuario actualizado correctamente", actualizado)).build();
    }

    @GET
    @Path("/buscar-por-correo")
    public Response buscarPorCorreo(@QueryParam("q") String query) {
        try {
            return Response.ok(ApiResponse.ok(authService.searchUsersByEmail(query))).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(ApiResponse.error(e.getMessage(), "SEARCH_ERROR")).build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response eliminar(@PathParam("id") Long id) {
        boolean resultado = service.eliminar(id);
        if (!resultado) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Usuario no encontrado", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok("Usuario eliminado correctamente", null)).build();
    }
}
