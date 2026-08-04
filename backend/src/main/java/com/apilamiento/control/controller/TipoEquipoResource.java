package com.apilamiento.control.controller;

import com.apilamiento.control.dto.ApiResponse;
import com.apilamiento.control.dto.TipoEquipoDTO;
import com.apilamiento.control.service.TipoEquipoService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/tipos-equipo")
@RolesAllowed({"Super Admin", "Admin", "Usuario"})
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TipoEquipoResource {

    private final TipoEquipoService service;

    public TipoEquipoResource(TipoEquipoService service) {
        this.service = service;
    }

    @GET
    public Response listar() {
        return Response.ok(ApiResponse.ok(service.listarTodos())).build();
    }

    @GET
    @Path("/{id}")
    public Response buscar(@PathParam("id") Long id) {
        TipoEquipoDTO dto = service.buscarPorId(id);
        if (dto == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Tipo de equipo no encontrado", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok(dto)).build();
    }

    @POST
    @RolesAllowed({"Super Admin", "Admin"})
    public Response crear(@Valid TipoEquipoDTO dto) {
        TipoEquipoDTO creado = service.crear(dto);
        return Response.status(Response.Status.CREATED)
                .entity(ApiResponse.ok("Tipo de equipo creado correctamente", creado)).build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"Super Admin", "Admin"})
    public Response actualizar(@PathParam("id") Long id, @Valid TipoEquipoDTO dto) {
        TipoEquipoDTO actualizado = service.actualizar(id, dto);
        if (actualizado == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Tipo de equipo no encontrado", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok("Tipo de equipo actualizado correctamente", actualizado)).build();
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed({"Super Admin", "Admin"})
    public Response eliminar(@PathParam("id") Long id) {
        boolean resultado = service.eliminar(id);
        if (!resultado) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Tipo de equipo no encontrado", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok("Tipo de equipo eliminado correctamente", null)).build();
    }
}
