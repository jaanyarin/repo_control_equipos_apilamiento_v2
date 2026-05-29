package com.apilamiento.control.controller;

import com.apilamiento.control.dto.SedeDTO;
import com.apilamiento.control.service.SedeService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/sedes")
@RolesAllowed({"Super Admin", "Admin", "Usuario"})
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SedeResource {

    private final SedeService service;

    public SedeResource(SedeService service) {
        this.service = service;
    }

    @GET
    public List<SedeDTO> listar() {
        return service.listarTodas();
    }

    @GET
    @Path("/{id}")
    public Response buscar(@PathParam("id") Long id) {
        SedeDTO dto = service.buscarPorId(id);
        if (dto == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(dto).build();
    }

    @POST
    public Response crear(SedeDTO dto) {
        SedeDTO creado = service.crear(dto);
        return Response.status(Response.Status.CREATED).entity(creado).build();
    }

    @PUT
    @Path("/{id}")
    public Response actualizar(@PathParam("id") Long id, SedeDTO dto) {
        SedeDTO actualizado = service.actualizar(id, dto);
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
