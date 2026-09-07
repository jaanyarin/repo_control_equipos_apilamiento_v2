package com.apilamiento.control.controller;

import com.apilamiento.control.security.SecurityUtil;
import com.apilamiento.control.service.EquipoService;
import com.apilamiento.control.service.ReporteService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import jakarta.ws.rs.core.Response;
import java.time.LocalDate;

@Path("/reportes")
@RolesAllowed({"Super Admin", "Admin", "Usuario"})
public class ReporteResource {

    private final ReporteService reporteService;
    private final EquipoService equipoService;

    public ReporteResource(ReporteService reporteService, EquipoService equipoService) {
        this.reporteService = reporteService;
        this.equipoService = equipoService;
    }

    @GET
    @Path("/equipos/{id}/pdf")
    @Produces("application/pdf")
    public Response descargarPdf(@PathParam("id") Long id, @Context SecurityContext context) {
        if (!equipoService.puedeAcceder(id, SecurityUtil.getUsuarioId(context), context.isUserInRole("Super Admin"))) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Equipo no encontrado").build();
        }
        byte[] pdf = reporteService.generarPdf(id);
        String filename = "Reporte_equipo_" + id + "_" + LocalDate.now() + ".pdf";
        return Response.ok(pdf, "application/pdf")
                .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
                .build();
    }
}
