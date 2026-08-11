package com.apilamiento.control.controller;

import com.apilamiento.control.dto.ApiResponse;
import com.apilamiento.control.dto.FinalizarDevolucionRequest;
import com.apilamiento.control.entity.EvidenciaDevolucionEquipo;
import com.apilamiento.control.security.SecurityUtil;
import com.apilamiento.control.service.DevolucionEquipoService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;

@Path("/devolucion-equipos")
@RolesAllowed({"Super Admin", "Admin", "Usuario"})
@Produces(MediaType.APPLICATION_JSON)
public class DevolucionEquipoResource {
    private final DevolucionEquipoService service;

    public DevolucionEquipoResource(DevolucionEquipoService service) {
        this.service = service;
    }

    @PUT
    @Path("/{equipoId}/evidencias/{tipo}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response evidencia(@PathParam("equipoId") Long equipoId, @PathParam("tipo") String tipo,
            @RestForm("archivo") FileUpload archivo, @Context SecurityContext context) throws IOException {
        if (archivo == null) throw new BadRequestException("La fotografía es obligatoria");
        byte[] content = Files.readAllBytes(archivo.uploadedFile());
        return Response.ok(ApiResponse.ok("Evidencia de devolución guardada",
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
        EvidenciaDevolucionEquipo item = service.obtenerArchivo(equipoId, tipo);
        return Response.ok(item.getContenido(), item.getTipoMime())
                .header("Content-Disposition", "inline; filename=\"" + item.getNombreArchivo() + "\"").build();
    }

    @POST
    @Path("/{equipoId}/finalizar")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response finalizar(@PathParam("equipoId") Long equipoId, FinalizarDevolucionRequest request,
            @Context SecurityContext context) {
        BigDecimal horometroFin = request == null ? null : request.getHorometroFin();
        return Response.ok(ApiResponse.ok("Devolución finalizada",
                service.finalizar(equipoId, horometroFin, SecurityUtil.getUsuarioId(context)))).build();
    }
}