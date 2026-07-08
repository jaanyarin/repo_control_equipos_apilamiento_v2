package com.apilamiento.control.exception;

import com.apilamiento.control.dto.ApiResponse;
import io.smallrye.jwt.auth.principal.ParseException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import org.jboss.logging.Logger;

@Provider
public class ManejadorGlobalExcepciones implements ExceptionMapper<Throwable> {

    private static final Logger LOG = Logger.getLogger(ManejadorGlobalExcepciones.class);

    @Override
    public Response toResponse(Throwable exception) {
        LOG.error("Error no manejado", exception);

        if (exception instanceof WebApplicationException webEx) {
            return Response.status(webEx.getResponse().getStatus())
                    .entity(ApiResponse.error(webEx.getMessage(), "WEB_" + webEx.getResponse().getStatus()))
                    .build();
        }

        if (exception instanceof jakarta.validation.ValidationException) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(ApiResponse.error("Error de validación: " + exception.getMessage(), "VALIDATION_ERROR"))
                    .build();
        }

        if (exception instanceof EntidadNoEncontradaException ene) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(ApiResponse.error(ene.getMessage(), "NOT_FOUND_" + ene.getEntidad().toUpperCase()))
                    .build();
        }

        if (exception instanceof ParseException) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(ApiResponse.error("Token JWT inválido o expirado", "JWT_INVALID"))
                    .build();
        }

        if (exception instanceof jakarta.ws.rs.ForbiddenException) {
            return Response.status(Response.Status.FORBIDDEN)
                    .entity(ApiResponse.error("Acceso denegado", "FORBIDDEN"))
                    .build();
        }

        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(ApiResponse.error("Error interno del servidor", "INTERNAL_ERROR"))
                .build();
    }
}
