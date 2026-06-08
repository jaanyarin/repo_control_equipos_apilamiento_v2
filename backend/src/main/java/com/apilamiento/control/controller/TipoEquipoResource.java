package com.apilamiento.control.controller;

import com.apilamiento.control.dto.TipoEquipoDTO;
import com.apilamiento.control.service.TipoEquipoService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

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
    public List<TipoEquipoDTO> listar() {
        return service.listarTodos();
    }

    @GET
    @Path("/{id}")
    public Response buscar(@PathParam("id") Long id) {
        TipoEquipoDTO dto = service.buscarPorId(id);
        if (dto == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(dto).build();
    }

    @POST
    public Response crear(TipoEquipoDTO dto) {
        TipoEquipoDTO creado = service.crear(dto);
        return Response.status(Response.Status.CREATED).entity(creado).build();
    }

    @PUT
    @Path("/{id}")
    public Response actualizar(@PathParam("id") Long id, TipoEquipoDTO dto) {
        TipoEquipoDTO actualizado = service.actualizar(id, dto);
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
