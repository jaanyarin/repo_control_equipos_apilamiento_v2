package com.apilamiento.control.controller;

import com.apilamiento.control.dto.ApiResponse;
import com.apilamiento.control.service.AuditoriaService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/auditoria")
@RolesAllowed({"Super Admin", "Admin"})
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuditoriaResource {

    private final AuditoriaService service;

    public AuditoriaResource(AuditoriaService service) {
        this.service = service;
    }

    @GET
    @Path("/recientes")
    public Response listarRecientes(@QueryParam("limite") @DefaultValue("50") int limite) {
        return Response.ok(ApiResponse.ok(service.listarRecientes(limite))).build();
    }

    @GET
    @Path("/por-entidad/{entidad}/{entidadId}")
    public Response listarPorEntidad(@PathParam("entidad") String entidad,
                                                   @PathParam("entidadId") Long entidadId) {
        return Response.ok(ApiResponse.ok(service.listarPorEntidad(entidad, entidadId))).build();
    }

    @GET
    @Path("/por-tipo/{tipoEvento}")
    public Response listarPorTipo(@PathParam("tipoEvento") String tipoEvento) {
        return Response.ok(ApiResponse.ok(service.listarPorTipo(tipoEvento))).build();
    }

    @GET
    @Path("/{id}")
    public Response buscar(@PathParam("id") Long id) {
        var evento = service.listarRecientes(200).stream()
                .filter(e -> e.getId().equals(id))
                .findFirst().orElse(null);
        if (evento == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Evento no encontrado", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok(evento)).build();
    }
}
