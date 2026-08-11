package com.apilamiento.control.controller;

import com.apilamiento.control.dto.ApiResponse;
import com.apilamiento.control.dto.AveriaDTO;
import com.apilamiento.control.entity.EvidenciaAveria;
import com.apilamiento.control.security.SecurityUtil;
import com.apilamiento.control.service.AveriaService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.SecurityContext;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;
import java.io.IOException;
import java.nio.file.Files;

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
    public Response listar() {
        return Response.ok(ApiResponse.ok(service.listarTodas())).build();
    }

    @GET
    @Path("/{id}")
    public Response buscar(@PathParam("id") Long id) {
        AveriaDTO dto = service.buscarPorId(id);
        if (dto == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Avería no encontrada", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok(dto)).build();
    }

    @GET
    @Path("/por-equipo/{equipoId}")
    public Response listarPorEquipo(@PathParam("equipoId") Long equipoId) {
        return Response.ok(ApiResponse.ok(service.listarPorEquipo(equipoId))).build();
    }

    @GET
    @Path("/por-estado/{estadoAveria}")
    public Response listarPorEstado(@PathParam("estadoAveria") String estadoAveria) {
        return Response.ok(ApiResponse.ok(service.listarPorEstado(estadoAveria))).build();
    }

    @POST
    public Response crear(@Valid AveriaDTO dto, @Context SecurityContext context) {
        dto.setUsuarioCreacion(SecurityUtil.getUsuarioId(context));
        AveriaDTO creado = service.crear(dto);
        return Response.status(Response.Status.CREATED)
                .entity(ApiResponse.ok("Avería reportada correctamente", creado)).build();
    }

    @PUT
    @Path("/{id}")
    public Response actualizar(@PathParam("id") Long id, AveriaDTO dto, @Context SecurityContext context) {
        dto.setUsuarioActualizacion(SecurityUtil.getUsuarioId(context));
        AveriaDTO actualizado = service.actualizar(id, dto);
        if (actualizado == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Avería no encontrada", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok("Avería actualizada correctamente", actualizado)).build();
    }

    @DELETE
    @Path("/{id}")
    public Response eliminar(@PathParam("id") Long id) {
        boolean resultado = service.eliminar(id);
        if (!resultado) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error("Avería no encontrada", "NOT_FOUND")).build();
        }
        return Response.ok(ApiResponse.ok("Avería eliminada correctamente", null)).build();
    }

    @PUT
    @Path("/{averiaId}/evidencias/{numero}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response subirEvidencia(@PathParam("averiaId") Long averiaId, @PathParam("numero") Short numero,
            @RestForm("archivo") FileUpload archivo, @Context SecurityContext context) throws IOException {
        if (archivo == null) throw new BadRequestException("La fotografía es obligatoria");
        byte[] content = Files.readAllBytes(archivo.uploadedFile());
        return Response.ok(ApiResponse.ok("Evidencia guardada",
                service.guardarEvidencia(averiaId, numero, archivo.fileName(),
                        archivo.contentType(), content, SecurityUtil.getUsuarioId(context)))).build();
    }

    @GET
    @Path("/{averiaId}/evidencias")
    public Response listarEvidencias(@PathParam("averiaId") Long averiaId) {
        return Response.ok(ApiResponse.ok(service.listarEvidencias(averiaId))).build();
    }

    @GET
    @Path("/{averiaId}/evidencias/{numero}/archivo")
    @Produces({"image/jpeg", "image/png"})
    public Response archivo(@PathParam("averiaId") Long averiaId, @PathParam("numero") Short numero) {
        EvidenciaAveria item = service.obtenerArchivo(averiaId, numero);
        return Response.ok(item.getContenido(), item.getTipoMime())
                .header("Content-Disposition", "inline; filename=\"" + item.getNombreArchivo() + "\"").build();
    }
}
