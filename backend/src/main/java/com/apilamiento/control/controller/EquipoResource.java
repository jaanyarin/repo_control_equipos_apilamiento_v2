package com.apilamiento.control.controller;

import com.apilamiento.control.dto.EquipoDTO;
import com.apilamiento.control.service.EquipoService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

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
    public List<EquipoDTO> listar() {
        return service.listarTodos();
    }

    @GET
    @Path("/resumen")
    public List<EquipoDTO> resumen() {
        return service.listarResumen();
    }

    @GET
    @Path("/{id}")
    public Response buscar(@PathParam("id") Long id) {
        EquipoDTO dto = service.buscarPorId(id);
        if (dto == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(dto).build();
    }

    @GET
    @Path("/por-proveedor/{proveedorId}")
    public List<EquipoDTO> listarPorProveedor(@PathParam("proveedorId") Long proveedorId) {
        return service.listarPorProveedor(proveedorId);
    }

    @GET
    @Path("/por-marca/{marcaId}")
    public List<EquipoDTO> listarPorMarca(@PathParam("marcaId") Long marcaId) {
        return service.listarPorMarca(marcaId);
    }

    @GET
    @Path("/por-tipo/{tipoEquipoId}")
    public List<EquipoDTO> listarPorTipo(@PathParam("tipoEquipoId") Long tipoEquipoId) {
        return service.listarPorTipoEquipo(tipoEquipoId);
    }

    @GET
    @Path("/por-estado/{estadoOperativo}")
    public List<EquipoDTO> listarPorEstado(@PathParam("estadoOperativo") String estadoOperativo) {
        return service.listarPorEstadoOperativo(estadoOperativo);
    }

    @POST
    public Response crear(EquipoDTO dto) {
        EquipoDTO creado = service.crear(dto);
        return Response.status(Response.Status.CREATED).entity(creado).build();
    }

    @PUT
    @Path("/{id}")
    public Response actualizar(@PathParam("id") Long id, EquipoDTO dto) {
        EquipoDTO actualizado = service.actualizar(id, dto);
        if (actualizado == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(actualizado).build();
    }

    @DELETE
    @Path("/{id}")
    public Response eliminar(@PathParam("id") Long id) {
        boolean resultado = service.eliminar(id);
        if (!resultado) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.noContent().build();
    }
}
