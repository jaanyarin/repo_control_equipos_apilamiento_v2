package com.apilamiento.control.controller;

import com.apilamiento.control.dto.ApiResponse;
import com.apilamiento.control.dto.AveriaDTO;
import com.apilamiento.control.service.AveriaService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/averias")
@RolesAllowed({"Super Admin", "Admin", "Usuario"})
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AveriaResource {

    private final AveriaService service;

    public AveriaResource(AveriaService service) {
        this.service = service;
    }

    @GET
    public Response listar() {
        return Response.ok(ApiResponse.ok(service.listarTodas())).build();
    }

    @GET
    @Path("/{id}")
    public Response buscar(@PathParam("id") Long id) {
        AveriaDTO dto = service.buscarPorId(id);
        if (dto == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Avería no encontrada", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok(dto)).build();
    }

    @GET
    @Path("/por-equipo/{equipoId}")
    public Response listarPorEquipo(@PathParam("equipoId") Long equipoId) {
        return Response.ok(ApiResponse.ok(service.listarPorEquipo(equipoId))).build();
    }

    @GET
    @Path("/por-estado/{estadoAveria}")
    public Response listarPorEstado(@PathParam("estadoAveria") String estadoAveria) {
        return Response.ok(ApiResponse.ok(service.listarPorEstado(estadoAveria))).build();
    }

    @POST
    public Response crear(@Valid AveriaDTO dto) {
        AveriaDTO creado = service.crear(dto);
        return Response.status(Response.Status.CREATED)
                .entity(ApiResponse.ok("Avería reportada correctamente", creado)).build();
    }

    @PUT
    @Path("/{id}")
    public Response actualizar(@PathParam("id") Long id, @Valid AveriaDTO dto) {
        AveriaDTO actualizado = service.actualizar(id, dto);
        if (actualizado == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Avería no encontrada", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok("Avería actualizada correctamente", actualizado)).build();
    }

    @DELETE
    @Path("/{id}")
    public Response eliminar(@PathParam("id") Long id) {
        boolean resultado = service.eliminar(id);
        if (!resultado) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Avería no encontrada", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok("Avería eliminada correctamente", null)).build();
    }
}
