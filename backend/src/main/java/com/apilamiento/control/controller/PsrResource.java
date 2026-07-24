package com.apilamiento.control.controller;

import com.apilamiento.control.dto.ApiResponse;
import com.apilamiento.control.dto.PsrDTO;
import com.apilamiento.control.dto.PsrRequest;
import com.apilamiento.control.service.PsrService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/psr")
@RolesAllowed({"Super Admin", "Admin", "Usuario"})
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PsrResource {

    private final PsrService service;

    public PsrResource(PsrService service) {
        this.service = service;
    }

    @GET
    public Response listar() {
        return Response.ok(ApiResponse.ok(service.listarTodas())).build();
    }

    @GET
    @Path("/{id}")
    public Response buscar(@PathParam("id") Long id) {
        PsrDTO dto = service.buscarPorId(id);
        if (dto == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("PSR no encontrado", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok(dto)).build();
    }

    @POST
    public Response crear(@Valid PsrRequest request) {
        PsrDTO creado = service.crear(request);
        return Response.status(Response.Status.CREATED)
                .entity(ApiResponse.ok("PSR creado correctamente", creado)).build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"Super Admin", "Admin"})
    public Response actualizar(@PathParam("id") Long id, @Valid PsrRequest request) {
        PsrDTO actualizado = service.actualizar(id, request);
        if (actualizado == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("PSR no encontrado", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok("PSR actualizado correctamente", actualizado)).build();
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed({"Super Admin", "Admin"})
    public Response eliminar(@PathParam("id") Long id) {
        boolean resultado = service.eliminar(id);
        if (!resultado) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("PSR no encontrado", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok("PSR eliminado correctamente", null)).build();
    }
}
