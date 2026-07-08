package com.apilamiento.control.security;

import jakarta.ws.rs.core.SecurityContext;
import org.eclipse.microprofile.jwt.JsonWebToken;

public class SecurityUtil {

    public static Long getUsuarioId(SecurityContext securityContext) {
        if (securityContext != null && securityContext.getUserPrincipal() instanceof JsonWebToken jwt) {
            String subject = jwt.getSubject();
            if (subject != null) return Long.parseLong(subject);
        }
        return null;
    }

    public static String getUsuarioNombre(SecurityContext securityContext) {
        if (securityContext != null && securityContext.getUserPrincipal() instanceof JsonWebToken jwt) {
            return jwt.getClaim("nombre");
        }
        return null;
    }

    public static String getDireccionIp(jakarta.ws.rs.core.HttpHeaders headers) {
        String ip = headers.getHeaderString("X-Forwarded-For");
        if (ip == null || ip.isEmpty()) {
            ip = headers.getHeaderString("X-Real-IP");
        }
        return ip;
    }
}
