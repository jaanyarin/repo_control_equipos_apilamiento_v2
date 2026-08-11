package com.apilamiento.control.controller;

import com.apilamiento.control.dto.ApiResponse;
import com.apilamiento.control.dto.SedeDTO;
import com.apilamiento.control.service.SedeService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.SecurityContext;
import com.apilamiento.control.security.SecurityUtil;

@Path("/sedes")
@RolesAllowed({"Super Admin", "Admin", "Usuario"})
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SedeResource {

    private final SedeService service;

    public SedeResource(SedeService service) {
        this.service = service;
    }

    @GET
    public Response listar() {
        return Response.ok(ApiResponse.ok(service.listarTodas())).build();
    }

    @GET
    @Path("/{id}")
    public Response buscar(@PathParam("id") Long id) {
        SedeDTO dto = service.buscarPorId(id);
        if (dto == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Sede no encontrada", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok(dto)).build();
    }

    @POST
    @RolesAllowed({"Super Admin", "Admin"})
    public Response crear(@Valid SedeDTO dto, @Context SecurityContext context) {
        dto.setUsuarioCreacion(SecurityUtil.getUsuarioId(context));
        SedeDTO creado = service.crear(dto);
        return Response.status(Response.Status.CREATED)
                .entity(ApiResponse.ok("Sede creada correctamente", creado)).build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"Super Admin", "Admin"})
    public Response actualizar(@PathParam("id") Long id, @Valid SedeDTO dto, @Context SecurityContext context) {
        dto.setUsuarioActualizacion(SecurityUtil.getUsuarioId(context));
        SedeDTO actualizado = service.actualizar(id, dto);
        if (actualizado == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Sede no encontrada", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok("Sede actualizada correctamente", actualizado)).build();
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed({"Super Admin", "Admin"})
    public Response eliminar(@PathParam("id") Long id) {
        boolean resultado = service.eliminar(id);
        if (!resultado) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Sede no encontrada", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok("Sede eliminada correctamente", null)).build();
    }
}
