package com.apilamiento.control.exception;

import com.apilamiento.control.dto.ApiResponse;
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

        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(ApiResponse.error("Error interno del servidor", "INTERNAL_ERROR"))
                .build();
    }
}
