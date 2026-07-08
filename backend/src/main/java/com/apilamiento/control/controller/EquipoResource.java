package com.apilamiento.control.controller;

import com.apilamiento.control.dto.ApiResponse;
import com.apilamiento.control.dto.EquipoDTO;
import com.apilamiento.control.service.EquipoService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/equipos")
@RolesAllowed({"Super Admin", "Admin", "Usuario"})
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EquipoResource {

    private final EquipoService service;

    public EquipoResource(EquipoService service) {
        this.service = service;
    }

    @GET
    public Response listar() {
        return Response.ok(ApiResponse.ok(service.listarTodos())).build();
    }

    @GET
    @Path("/resumen")
    public Response resumen() {
        return Response.ok(ApiResponse.ok(service.listarResumen())).build();
    }

    @GET
    @Path("/{id}")
    public Response buscar(@PathParam("id") Long id) {
        EquipoDTO dto = service.buscarPorId(id);
        if (dto == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Equipo no encontrado", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok(dto)).build();
    }

    @GET
    @Path("/por-proveedor/{proveedorId}")
    public Response listarPorProveedor(@PathParam("proveedorId") Long proveedorId) {
        return Response.ok(ApiResponse.ok(service.listarPorProveedor(proveedorId))).build();
    }

    @GET
    @Path("/por-marca/{marcaId}")
    public Response listarPorMarca(@PathParam("marcaId") Long marcaId) {
        return Response.ok(ApiResponse.ok(service.listarPorMarca(marcaId))).build();
    }

    @GET
    @Path("/por-tipo/{tipoEquipoId}")
    public Response listarPorTipo(@PathParam("tipoEquipoId") Long tipoEquipoId) {
        return Response.ok(ApiResponse.ok(service.listarPorTipoEquipo(tipoEquipoId))).build();
    }

    @GET
    @Path("/por-estado/{estadoOperativo}")
    public Response listarPorEstado(@PathParam("estadoOperativo") String estadoOperativo) {
        return Response.ok(ApiResponse.ok(service.listarPorEstadoOperativo(estadoOperativo))).build();
    }

    @POST
    public Response crear(@Valid EquipoDTO dto) {
        EquipoDTO creado = service.crear(dto);
        return Response.status(Response.Status.CREATED)
                .entity(ApiResponse.ok("Equipo creado correctamente", creado)).build();
    }

    @PUT
    @Path("/{id}")
    public Response actualizar(@PathParam("id") Long id, @Valid EquipoDTO dto) {
        EquipoDTO actualizado = service.actualizar(id, dto);
        if (actualizado == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Equipo no encontrado", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok("Equipo actualizado correctamente", actualizado)).build();
    }

    @DELETE
    @Path("/{id}")
    public Response eliminar(@PathParam("id") Long id) {
        boolean resultado = service.eliminar(id);
        if (!resultado) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Equipo no encontrado", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok("Equipo eliminado correctamente", null)).build();
    }
}
