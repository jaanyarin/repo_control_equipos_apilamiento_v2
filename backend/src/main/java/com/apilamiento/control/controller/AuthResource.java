package com.apilamiento.control.controller;

import com.apilamiento.control.service.AuthService;
import jakarta.annotation.security.PermitAll;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Path("/auth")
@PermitAll
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    private final AuthService authService;

    public AuthResource(AuthService authService) {
        this.authService = authService;
    }

    @GET
    @Path("/login")
    public Response login(@QueryParam("redirect_uri") String redirectUri) {
        if (redirectUri == null || redirectUri.isBlank()) {
            redirectUri = "http://localhost";
        }
        return Response.temporaryRedirect(URI.create(authService.getAuthorizeUrl(redirectUri))).build();
    }

    @GET
    @Path("/callback")
    public Response callback(@QueryParam("code") String code,
                             @QueryParam("error") String error,
                             @QueryParam("state") String state) {
        String base = (state != null && !state.isBlank()) ? state : "http://localhost";
        if (base.endsWith("/")) {
            base = base.substring(0, base.length() - 1);
        }

        if (error != null) {
            return Response.seeOther(URI.create(base + "/login?error=" + URLEncoder.encode(error, StandardCharsets.UTF_8))).build();
        }
        if (code == null || code.isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"message\":\"Código de autorización requerido\"}").build();
        }
        try {
            String jwt = authService.handleCallback(code);
            return Response.seeOther(URI.create(base + "/auth/callback?token=" + jwt)).build();
        } catch (Exception e) {
            return Response.seeOther(
                    URI.create(base + "/login?error=" + URLEncoder.encode(e.getMessage(), StandardCharsets.UTF_8))
            ).build();
        }
    }

    @GET
    @Path("/authorize-url")
    public Response getAuthorizeUrl(@QueryParam("redirect_uri") String redirectUri) {
        if (redirectUri == null || redirectUri.isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"message\":\"redirect_uri requerido\"}").build();
        }
        String authUrl = authService.generateMobileAuthorizeUrl(redirectUri);
        return Response.ok(Map.of("authorizeUrl", authUrl)).build();
    }

    @POST
    @Path("/exchange-code")
    public Response exchangeCode(Map<String, String> body) {
        String code = body != null ? body.get("code") : null;
        String redirectUri = body != null ? body.get("redirect_uri") : null;

        if (code == null || code.isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"message\":\"Código de autorización requerido\"}").build();
        }
        if (redirectUri == null || redirectUri.isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"message\":\"redirect_uri requerido\"}").build();
        }

        try {
            String jwt = authService.handleMobileCallback(code, redirectUri);
            return Response.ok(Map.of("token", jwt)).build();
        } catch (Exception e) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"message\":\"" + e.getMessage() + "\"}").build();
        }
    }
}
