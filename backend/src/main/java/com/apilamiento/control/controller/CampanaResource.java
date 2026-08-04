package com.apilamiento.control.controller;

import com.apilamiento.control.dto.ApiResponse;
import com.apilamiento.control.dto.CampanaDTO;
import com.apilamiento.control.service.CampanaService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/campanas")
@RolesAllowed({"Super Admin", "Admin", "Usuario"})
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CampanaResource {

    private final CampanaService service;

    public CampanaResource(CampanaService service) {
        this.service = service;
    }

    @GET
    public Response listar() {
        return Response.ok(ApiResponse.ok(service.listarTodas())).build();
    }

    @GET
    @Path("/{id}")
    public Response buscar(@PathParam("id") Long id) {
        CampanaDTO dto = service.buscarPorId(id);
        if (dto == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Campaña no encontrada", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok(dto)).build();
    }

    @POST
    @RolesAllowed({"Super Admin", "Admin"})
    public Response crear(@Valid CampanaDTO dto) {
        CampanaDTO creado = service.crear(dto);
        return Response.status(Response.Status.CREATED)
                .entity(ApiResponse.ok("Campaña creada correctamente", creado)).build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"Super Admin", "Admin"})
    public Response actualizar(@PathParam("id") Long id, @Valid CampanaDTO dto) {
        CampanaDTO actualizado = service.actualizar(id, dto);
        if (actualizado == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Campaña no encontrada", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok("Campaña actualizada correctamente", actualizado)).build();
    }

    @POST
    @Path("/{id}/activar")
    @RolesAllowed({"Super Admin", "Admin"})
    public Response activar(@PathParam("id") Long id) {
        service.activar(id);
        return Response.ok(ApiResponse.ok("Campaña activada correctamente", null)).build();
    }

    @POST
    @Path("/{id}/cerrar")
    @RolesAllowed({"Super Admin", "Admin"})
    public Response cerrar(@PathParam("id") Long id) {
        service.cerrar(id);
        return Response.ok(ApiResponse.ok("Campaña cerrada correctamente", null)).build();
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed({"Super Admin", "Admin"})
    public Response eliminar(@PathParam("id") Long id) {
        boolean resultado = service.eliminar(id);
        if (!resultado) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Campaña no encontrada", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok("Campaña eliminada correctamente", null)).build();
    }
}
