package com.apilamiento.control.config;

import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@ApplicationScoped
public class AppConfig {

    @ConfigProperty(name = "app.timezone", defaultValue = "America/Lima")
    String timezone;

    @ConfigProperty(name = "app.api.version", defaultValue = "v1")
    String apiVersion;

    @ConfigProperty(name = "app.jwt.expiration", defaultValue = "3600")
    Long jwtExpiration;

    public String getTimezone() { return timezone; }
    public String getApiVersion() { return apiVersion; }
    public Long getJwtExpiration() { return jwtExpiration; }
}
