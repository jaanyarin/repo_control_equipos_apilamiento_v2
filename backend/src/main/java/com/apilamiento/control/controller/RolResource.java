package com.apilamiento.control.controller;

import com.apilamiento.control.dto.ApiResponse;
import com.apilamiento.control.dto.RolDTO;
import com.apilamiento.control.service.RolService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.SecurityContext;
import com.apilamiento.control.security.SecurityUtil;

@Path("/roles")
@RolesAllowed({"Super Admin", "Admin", "Usuario"})
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RolResource {

    private final RolService service;

    public RolResource(RolService service) {
        this.service = service;
    }

    @GET
    public Response listar() {
        return Response.ok(ApiResponse.ok(service.listarTodos())).build();
    }

    @GET
    @Path("/{id}")
    public Response buscar(@PathParam("id") Long id) {
        RolDTO dto = service.buscarPorId(id);
        if (dto == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Rol no encontrado", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok(dto)).build();
    }

    @POST
    public Response crear(@Valid RolDTO dto, @Context SecurityContext context) {
        dto.setUsuarioCreacion(SecurityUtil.getUsuarioId(context));
        RolDTO creado = service.crear(dto);
        return Response.status(Response.Status.CREATED)
                .entity(ApiResponse.ok("Rol creado correctamente", creado)).build();
    }

    @PUT
    @Path("/{id}")
    public Response actualizar(@PathParam("id") Long id, @Valid RolDTO dto, @Context SecurityContext context) {
        dto.setUsuarioActualizacion(SecurityUtil.getUsuarioId(context));
        RolDTO actualizado = service.actualizar(id, dto);
        if (actualizado == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Rol no encontrado", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok("Rol actualizado correctamente", actualizado)).build();
    }

    @DELETE
    @Path("/{id}")
    public Response eliminar(@PathParam("id") Long id) {
        boolean resultado = service.eliminar(id);
        if (!resultado) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Rol no encontrado", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok("Rol eliminado correctamente", null)).build();
    }
}
