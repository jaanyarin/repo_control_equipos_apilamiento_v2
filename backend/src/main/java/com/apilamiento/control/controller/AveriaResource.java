package com.apilamiento.control.controller;

import com.apilamiento.control.dto.AveriaDTO;
import com.apilamiento.control.service.AveriaService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/averias")
@RolesAllowed({"Super Admin", "Admin", "Usuario"})
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AveriaResource {

    private final AveriaService service;

    public AveriaResource(AveriaService service) {
        this.service = service;
    }

    @GET
    public List<AveriaDTO> listar() {
        return service.listarTodas();
    }

    @GET
    @Path("/{id}")
    public Response buscar(@PathParam("id") Long id) {
        AveriaDTO dto = service.buscarPorId(id);
        if (dto == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(dto).build();
    }

    @GET
    @Path("/por-equipo/{equipoId}")
    public List<AveriaDTO> listarPorEquipo(@PathParam("equipoId") Long equipoId) {
        return service.listarPorEquipo(equipoId);
    }

    @GET
    @Path("/por-estado/{estadoAveria}")
    public List<AveriaDTO> listarPorEstado(@PathParam("estadoAveria") String estadoAveria) {
        return service.listarPorEstado(estadoAveria);
    }

    @POST
    public Response crear(AveriaDTO dto) {
        AveriaDTO creado = service.crear(dto);
        return Response.status(Response.Status.CREATED).entity(creado).build();
    }

    @PUT
    @Path("/{id}")
    public Response actualizar(@PathParam("id") Long id, AveriaDTO dto) {
        AveriaDTO actualizado = service.actualizar(id, dto);
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
