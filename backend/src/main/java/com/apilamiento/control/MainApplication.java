package com.apilamiento.control;

import jakarta.ws.rs.core.Application;
import org.eclipse.microprofile.openapi.annotations.OpenAPIDefinition;
import org.eclipse.microprofile.openapi.annotations.info.Contact;
import org.eclipse.microprofile.openapi.annotations.info.Info;
import org.eclipse.microprofile.openapi.annotations.info.License;

@OpenAPIDefinition(
    info = @Info(
        title = "Control de Equipos de Apilamiento API",
        version = "1.0.0",
        description = "API REST para el Sistema de Control Operativo de Equipos de Apilamiento",
        contact = @Contact(name = "Soporte", email = "soporte@apilamiento.com"),
        license = @License(name = "MIT")
    )
)
public class MainApplication extends Application {
}
