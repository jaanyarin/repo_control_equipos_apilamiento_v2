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
    @Path("/mobile-login")
    @Produces(MediaType.TEXT_HTML)
    public Response mobileLogin(@QueryParam("redirect_uri") String redirectUri) {
        if (redirectUri == null || redirectUri.isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"message\":\"redirect_uri requerido\"}").build();
        }
        String authUrl = authService.generateMobileAuthorizeUrl(redirectUri, null, null);
        return Response.temporaryRedirect(URI.create(authUrl)).build();
    }

    @GET
    @Path("/mobile-login-url")
    public Response mobileLoginUrl(@QueryParam("redirect_uri") String redirectUri,
                                   @QueryParam("code_challenge") String codeChallenge,
                                   @QueryParam("code_challenge_method") String codeChallengeMethod) {
        if (redirectUri == null || redirectUri.isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("message", "redirect_uri requerido")).build();
        }
        return Response.ok(Map.of("authUrl", authService.generateMobileAuthorizeUrl(redirectUri, codeChallenge, codeChallengeMethod))).build();
    }

    @GET
    @Path("/exchange-redirect")
    @Produces(MediaType.TEXT_HTML)
    public Response exchangeRedirect(@QueryParam("code") String code,
                                     @QueryParam("redirect_uri") String redirectUri) {
        if (code == null || code.isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"message\":\"Código de autorización requerido\"}").build();
        }
        if (redirectUri == null || redirectUri.isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"message\":\"redirect_uri requerido\"}").build();
        }

        try {
            String jwt = authService.handleMobileCallback(code, redirectUri, null);
            String redirectTarget = authService.buildMobileRedirectUrl(redirectUri, jwt);
            return Response.temporaryRedirect(URI.create(redirectTarget)).build();
        } catch (Exception e) {
            String base = redirectUri.endsWith("/") ? redirectUri.substring(0, redirectUri.length() - 1) : redirectUri;
            return Response.temporaryRedirect(URI.create(base + "/login?error=" + URLEncoder.encode(e.getMessage(), StandardCharsets.UTF_8))).build();
        }
    }

    @POST
    @Path("/mobile-token")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response mobileToken(Map<String, String> body) {
        String code = body.get("code");
        String redirectUri = body.get("redirectUri");
        String codeVerifier = body.get("codeVerifier");

        if (code == null || code.isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("error", "Código de autorización requerido")).build();
        }

        if (redirectUri == null || redirectUri.isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("error", "redirectUri requerido")).build();
        }
        if (codeVerifier == null || codeVerifier.isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("error", "codeVerifier requerido")).build();
        }

        try {
            String jwt = authService.handleMobileCallback(code, redirectUri, codeVerifier);
            return Response.ok(Map.of("token", jwt)).build();
        } catch (Exception e) {
            return Response.serverError()
                    .entity(Map.of("error", e.getMessage())).build();
        }
    }
}
