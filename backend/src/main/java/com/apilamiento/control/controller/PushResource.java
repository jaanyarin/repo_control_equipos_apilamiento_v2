package com.apilamiento.control.controller;

import com.apilamiento.control.dto.ApiResponse;
import com.apilamiento.control.dto.PushTokenRequest;
import com.apilamiento.control.security.SecurityUtil;
import com.apilamiento.control.service.TokenPushService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

@Path("/push/token")
@RolesAllowed({"Super Admin", "Admin", "Usuario"})
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PushResource {

    private final TokenPushService service;

    public PushResource(TokenPushService service) {
        this.service = service;
    }

    @POST
    public Response registrar(@Valid PushTokenRequest request, @Context SecurityContext context) {
        service.registrarToken(SecurityUtil.getUsuarioId(context), request.getToken(), request.getPlataforma());
        return Response.ok(ApiResponse.ok("Token registrado", null)).build();
    }

    @DELETE
    public Response eliminar(@QueryParam("token") String token) {
        service.eliminarToken(token);
        return Response.ok(ApiResponse.ok("Token eliminado", null)).build();
    }
}