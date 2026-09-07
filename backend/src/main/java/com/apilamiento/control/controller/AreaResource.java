package com.apilamiento.control.controller;

import com.apilamiento.control.dto.ApiResponse;
import com.apilamiento.control.dto.AreaDTO;
import com.apilamiento.control.security.SecurityUtil;
import com.apilamiento.control.service.AreaService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

@Path("/areas")
@RolesAllowed({"Super Admin", "Admin", "Usuario"})
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AreaResource {
    private final AreaService service;

    public AreaResource(AreaService service) { this.service = service; }

    @GET
    public Response listar() { return Response.ok(ApiResponse.ok(service.listarTodas())).build(); }

    @GET
    @Path("/{id}")
    public Response buscar(@PathParam("id") Long id) {
        AreaDTO dto = service.buscarPorId(id);
        return dto == null
                ? Response.status(Response.Status.NOT_FOUND).entity(ApiResponse.error("Área no encontrada", "NOT_FOUND")).build()
                : Response.ok(ApiResponse.ok(dto)).build();
    }

    @POST
    @RolesAllowed({"Super Admin", "Admin"})
    public Response crear(@Valid AreaDTO dto, @Context SecurityContext context) {
        dto.setUsuarioCreacion(SecurityUtil.getUsuarioId(context));
        return Response.status(Response.Status.CREATED).entity(ApiResponse.ok("Área creada correctamente", service.crear(dto))).build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"Super Admin", "Admin"})
    public Response actualizar(@PathParam("id") Long id, @Valid AreaDTO dto, @Context SecurityContext context) {
        dto.setUsuarioActualizacion(SecurityUtil.getUsuarioId(context));
        AreaDTO actualizado = service.actualizar(id, dto);
        return actualizado == null
                ? Response.status(Response.Status.NOT_FOUND).entity(ApiResponse.error("Área no encontrada", "NOT_FOUND")).build()
                : Response.ok(ApiResponse.ok("Área actualizada correctamente", actualizado)).build();
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed({"Super Admin", "Admin"})
    public Response eliminar(@PathParam("id") Long id) {
        return service.eliminar(id)
                ? Response.ok(ApiResponse.ok("Área eliminada correctamente", null)).build()
                : Response.status(Response.Status.NOT_FOUND).entity(ApiResponse.error("Área no encontrada", "NOT_FOUND")).build();
    }
}