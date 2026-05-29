package com.apilamiento.control.controller;

import com.apilamiento.control.dto.CampanaDTO;
import com.apilamiento.control.service.CampanaService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/campanas")
@RolesAllowed({"Super Admin", "Admin", "Usuario"})
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CampanaResource {

    private final CampanaService service;

    public CampanaResource(CampanaService service) {
        this.service = service;
    }

    @GET
    public List<CampanaDTO> listar() {
        return service.listarTodas();
    }

    @GET
    @Path("/{id}")
    public Response buscar(@PathParam("id") Long id) {
        CampanaDTO dto = service.buscarPorId(id);
        if (dto == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(dto).build();
    }

    @POST
    public Response crear(CampanaDTO dto) {
        CampanaDTO creado = service.crear(dto);
        return Response.status(Response.Status.CREATED).entity(creado).build();
    }

    @PUT
    @Path("/{id}")
    public Response actualizar(@PathParam("id") Long id, CampanaDTO dto) {
        CampanaDTO actualizado = service.actualizar(id, dto);
        if (actualizado == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(actualizado).build();
    }

    @POST
    @Path("/{id}/activar")
    public Response activar(@PathParam("id") Long id) {
        service.activar(id);
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/cerrar")
    public Response cerrar(@PathParam("id") Long id) {
        service.cerrar(id);
        return Response.ok().build();
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
