package com.apilamiento.control.controller;

import com.apilamiento.control.dto.UsuarioDTO;
import com.apilamiento.control.service.AuthService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.JsonWebToken;

@Path("/auth/me")
@RolesAllowed({"Super Admin", "Admin", "Usuario"})
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthMeResource {

    private final AuthService authService;

    @Inject
    JsonWebToken jwt;

    public AuthMeResource(AuthService authService) {
        this.authService = authService;
    }

    @GET
    public Response me() {
        String correo = jwt.getName();
        if (correo == null) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
        UsuarioDTO dto = authService.getAuthenticatedUser(correo);
        if (dto == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(dto).build();
    }
}
