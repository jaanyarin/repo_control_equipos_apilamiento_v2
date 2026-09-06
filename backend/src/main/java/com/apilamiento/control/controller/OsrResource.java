package com.apilamiento.control.controller;

import com.apilamiento.control.dto.ApiResponse;
import com.apilamiento.control.dto.OsrDTO;
import com.apilamiento.control.dto.OsrRequest;
import com.apilamiento.control.dto.OsrUpdateRequest;
import com.apilamiento.control.service.OsrService;
import com.apilamiento.control.security.SecurityUtil;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import java.util.List;

@Path("/osr")
@RolesAllowed({"Super Admin", "Admin"})
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class OsrResource {

    private final OsrService service;

    public OsrResource(OsrService service) {
        this.service = service;
    }

    @GET
    @Path("/{id}")
    public Response buscarPorId(@PathParam("id") Long id) {
        OsrDTO dto = service.buscarPorId(id);
        return dto == null
                ? Response.status(Response.Status.NOT_FOUND).entity(ApiResponse.error("OSR no encontrada", "NOT_FOUND")).build()
                : Response.ok(ApiResponse.ok(dto)).build();
    }

    @GET
    @Path("/por-psr/{psrId}")
    public Response buscarPorPsr(@PathParam("psrId") Long psrId) {
        List<OsrDTO> list = service.listarPorPsrId(psrId);
        return Response.ok(ApiResponse.ok(list)).build();
    }

    @GET
    @Path("/por-psr/{psrId}/unica")
    public Response buscarUnicaPorPsr(@PathParam("psrId") Long psrId) {
        OsrDTO dto = service.buscarPorPsrId(psrId);
        return dto == null
                ? Response.status(Response.Status.NOT_FOUND).entity(ApiResponse.error("OSR no encontrada", "NOT_FOUND")).build()
                : Response.ok(ApiResponse.ok(dto)).build();
    }

    @POST
    public Response crear(@Valid OsrRequest request, @Context SecurityContext context) {
        request.setUsuarioCreacion(SecurityUtil.getUsuarioId(context));
        return Response.status(Response.Status.CREATED).entity(ApiResponse.ok("OSR creada correctamente", service.crear(request))).build();
    }

    @PUT
    @Path("/{id}")
    public Response actualizar(@PathParam("id") Long id, @Valid OsrUpdateRequest request, @Context SecurityContext context) {
        Long usuarioId = SecurityUtil.getUsuarioId(context);
        return Response.ok(ApiResponse.ok("OSR actualizada correctamente", service.actualizar(id, request, usuarioId))).build();
    }

    @DELETE
    @Path("/{id}")
    public Response eliminar(@PathParam("id") Long id) {
        boolean ok = service.eliminar(id);
        return ok ? Response.ok(ApiResponse.ok("OSR eliminada correctamente", null)).build()
                : Response.status(Response.Status.NOT_FOUND).entity(ApiResponse.error("OSR no encontrada", "NOT_FOUND")).build();
    }
}
