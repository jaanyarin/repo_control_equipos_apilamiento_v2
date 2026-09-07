package com.apilamiento.control.controller;

import com.apilamiento.control.dto.ApiResponse;
import com.apilamiento.control.dto.EquipoDTO;
import com.apilamiento.control.dto.EquipoTimelineDTO;
import com.apilamiento.control.service.EquipoService;
import com.apilamiento.control.service.EquipoTimelineService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.SecurityContext;
import com.apilamiento.control.security.SecurityUtil;

@Path("/equipos")
@RolesAllowed({"Super Admin", "Admin", "Usuario"})
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EquipoResource {

    private final EquipoService service;
    private final EquipoTimelineService timelineService;

    public EquipoResource(EquipoService service, EquipoTimelineService timelineService) {
        this.service = service;
        this.timelineService = timelineService;
    }

    @GET
    public Response listar(@Context SecurityContext context) {
        return Response.ok(ApiResponse.ok(service.listarTodos(
                SecurityUtil.getUsuarioId(context), context.isUserInRole("Super Admin")))).build();
    }

    @GET
    @Path("/{id}/timeline")
    public Response timeline(@PathParam("id") Long id, @Context SecurityContext context) {
        if (!service.puedeAcceder(id, SecurityUtil.getUsuarioId(context), context.isUserInRole("Super Admin"))) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Equipo no encontrado", "NOT_FOUND")).build();
        }
        EquipoTimelineDTO dto = timelineService.obtenerTimeline(id);
        if (dto == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Equipo no encontrado", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok(dto)).build();
    }

    @GET
    @Path("/resumen")
    public Response resumen(@Context SecurityContext context) {
        return Response.ok(ApiResponse.ok(service.filtrarPorAcceso(service.listarResumen(),
                SecurityUtil.getUsuarioId(context), context.isUserInRole("Super Admin")))).build();
    }

    @GET
    @Path("/{id}")
    public Response buscar(@PathParam("id") Long id, @Context SecurityContext context) {
        EquipoDTO dto = service.buscarPorId(id, SecurityUtil.getUsuarioId(context), context.isUserInRole("Super Admin"));
        if (dto == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Equipo no encontrado", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok(dto)).build();
    }

    @GET
    @Path("/por-proveedor/{proveedorId}")
    public Response listarPorProveedor(@PathParam("proveedorId") Long proveedorId, @Context SecurityContext context) {
        return Response.ok(ApiResponse.ok(service.filtrarPorAcceso(service.listarPorProveedor(proveedorId),
                SecurityUtil.getUsuarioId(context), context.isUserInRole("Super Admin")))).build();
    }

    @GET
    @Path("/por-marca/{marcaId}")
    public Response listarPorMarca(@PathParam("marcaId") Long marcaId, @Context SecurityContext context) {
        return Response.ok(ApiResponse.ok(service.filtrarPorAcceso(service.listarPorMarca(marcaId),
                SecurityUtil.getUsuarioId(context), context.isUserInRole("Super Admin")))).build();
    }

    @GET
    @Path("/por-tipo/{tipoEquipoId}")
    public Response listarPorTipo(@PathParam("tipoEquipoId") Long tipoEquipoId, @Context SecurityContext context) {
        return Response.ok(ApiResponse.ok(service.filtrarPorAcceso(service.listarPorTipoEquipo(tipoEquipoId),
                SecurityUtil.getUsuarioId(context), context.isUserInRole("Super Admin")))).build();
    }

    @GET
    @Path("/por-estado/{estadoOperativo}")
    public Response listarPorEstado(@PathParam("estadoOperativo") String estadoOperativo, @Context SecurityContext context) {
        return Response.ok(ApiResponse.ok(service.filtrarPorAcceso(service.listarPorEstadoOperativo(estadoOperativo),
                SecurityUtil.getUsuarioId(context), context.isUserInRole("Super Admin")))).build();
    }

    @POST
    public Response crear(@Valid EquipoDTO dto, @Context SecurityContext context) {
        dto.setUsuarioCreacion(SecurityUtil.getUsuarioId(context));
        EquipoDTO creado = service.crear(dto);
        return Response.status(Response.Status.CREATED)
                .entity(ApiResponse.ok("Equipo creado correctamente", creado)).build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"Super Admin", "Admin"})
    public Response actualizar(@PathParam("id") Long id, @Valid EquipoDTO dto,
            @Context SecurityContext context) {
        if (!service.puedeAcceder(id, SecurityUtil.getUsuarioId(context), context.isUserInRole("Super Admin"))) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Equipo no encontrado", "NOT_FOUND")).build();
        }
        dto.setUsuarioActualizacion(SecurityUtil.getUsuarioId(context));
        EquipoDTO actualizado = service.actualizar(id, dto);
        if (actualizado == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Equipo no encontrado", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok("Equipo actualizado correctamente", actualizado)).build();
    }

    @DELETE
    @Path("/{id}")
    public Response eliminar(@PathParam("id") Long id, @Context SecurityContext context) {
        if (!service.puedeAcceder(id, SecurityUtil.getUsuarioId(context), context.isUserInRole("Super Admin"))) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Equipo no encontrado", "NOT_FOUND")).build();
        }
        boolean resultado = service.eliminar(id);
        if (!resultado) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Equipo no encontrado", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok("Equipo eliminado correctamente", null)).build();
    }
}
