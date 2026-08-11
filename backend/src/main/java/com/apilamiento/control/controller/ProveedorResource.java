package com.apilamiento.control.controller;

import com.apilamiento.control.dto.ApiResponse;
import com.apilamiento.control.dto.ProveedorDTO;
import com.apilamiento.control.service.ProveedorService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.SecurityContext;
import com.apilamiento.control.security.SecurityUtil;

@Path("/proveedores")
@RolesAllowed({"Super Admin", "Admin", "Usuario"})
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProveedorResource {

    private final ProveedorService service;

    public ProveedorResource(ProveedorService service) {
        this.service = service;
    }

    @GET
    public Response listar() {
        return Response.ok(ApiResponse.ok(service.listarTodos())).build();
    }

    @GET
    @Path("/{id}")
    public Response buscar(@PathParam("id") Long id) {
        ProveedorDTO dto = service.buscarPorId(id);
        if (dto == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Proveedor no encontrado", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok(dto)).build();
    }

    @POST
    @RolesAllowed({"Super Admin", "Admin"})
    public Response crear(@Valid ProveedorDTO dto, @Context SecurityContext context) {
        dto.setUsuarioCreacion(SecurityUtil.getUsuarioId(context));
        ProveedorDTO creado = service.crear(dto);
        return Response.status(Response.Status.CREATED)
                .entity(ApiResponse.ok("Proveedor creado correctamente", creado)).build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"Super Admin", "Admin"})
    public Response actualizar(@PathParam("id") Long id, @Valid ProveedorDTO dto, @Context SecurityContext context) {
        dto.setUsuarioActualizacion(SecurityUtil.getUsuarioId(context));
        ProveedorDTO actualizado = service.actualizar(id, dto);
        if (actualizado == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Proveedor no encontrado", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok("Proveedor actualizado correctamente", actualizado)).build();
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed({"Super Admin", "Admin"})
    public Response eliminar(@PathParam("id") Long id) {
        boolean resultado = service.eliminar(id);
        if (!resultado) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Proveedor no encontrado", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok("Proveedor eliminado correctamente", null)).build();
    }
}
