package com.apilamiento.control.controller;

import com.apilamiento.control.dto.ApiResponse;
import com.apilamiento.control.dto.IngresoEquipoRequest;
import com.apilamiento.control.entity.EvidenciaIngresoEquipo;
import com.apilamiento.control.security.SecurityUtil;
import com.apilamiento.control.service.IngresoEquipoService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;
import java.io.IOException;
import java.nio.file.Files;

@Path("/ingresos-equipo")
@RolesAllowed({"Super Admin", "Admin", "Usuario"})
@Produces(MediaType.APPLICATION_JSON)
public class IngresoEquipoResource {
    private final IngresoEquipoService service;

    public IngresoEquipoResource(IngresoEquipoService service) {
        this.service = service;
    }

    @GET
    @Path("/psr-pendientes")
    public Response pendientes() {
        return Response.ok(ApiResponse.ok(service.listarPsrPendientes())).build();
    }

    @POST
    @Path("/borradores")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response crear(@Valid IngresoEquipoRequest request, @Context SecurityContext context) {
        return Response.status(Response.Status.CREATED)
                .entity(ApiResponse.ok("Ingreso en proceso",
                        service.crearBorrador(request, SecurityUtil.getUsuarioId(context)))).build();
    }

    @PUT
    @Path("/{equipoId}/evidencias/{tipo}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response evidencia(@PathParam("equipoId") Long equipoId, @PathParam("tipo") String tipo,
            @RestForm("archivo") FileUpload archivo, @Context SecurityContext context) throws IOException {
        if (archivo == null) throw new BadRequestException("La fotografía es obligatoria");
        byte[] content = Files.readAllBytes(archivo.uploadedFile());
        return Response.ok(ApiResponse.ok("Evidencia guardada",
                service.guardarEvidencia(equipoId, tipo, archivo.fileName(),
                        archivo.contentType(), content, SecurityUtil.getUsuarioId(context)))).build();
    }

    @GET
    @Path("/{equipoId}/evidencias")
    public Response listarEvidencias(@PathParam("equipoId") Long equipoId) {
        return Response.ok(ApiResponse.ok(service.listarEvidencias(equipoId))).build();
    }

    @GET
    @Path("/{equipoId}/evidencias/{tipo}/archivo")
    @Produces({"image/jpeg", "image/png"})
    public Response archivo(@PathParam("equipoId") Long equipoId, @PathParam("tipo") String tipo) {
        EvidenciaIngresoEquipo item = service.obtenerArchivo(equipoId, tipo);
        return Response.ok(item.getContenido(), item.getTipoMime())
                .header("Content-Disposition", "inline; filename=\"" + item.getNombreArchivo() + "\"").build();
    }

    @POST
    @Path("/{equipoId}/finalizar")
    public Response finalizar(@PathParam("equipoId") Long equipoId, @Context SecurityContext context) {
        return Response.ok(ApiResponse.ok("Ingreso finalizado",
                service.finalizar(equipoId, SecurityUtil.getUsuarioId(context)))).build();
    }

    @DELETE
    @Path("/{equipoId}/borrador")
    public Response cancelar(@PathParam("equipoId") Long equipoId) {
        service.cancelarBorrador(equipoId);
        return Response.ok(ApiResponse.ok("Ingreso cancelado", null)).build();
    }
}
