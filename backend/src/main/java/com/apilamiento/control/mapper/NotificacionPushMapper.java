package com.apilamiento.control.mapper;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class NotificacionPushMapper {

    private final ObjectMapper objectMapper;

    public NotificacionPushMapper() {
        this.objectMapper = new ObjectMapper();
    }

    public com.fasterxml.jackson.databind.JsonNode mensajeIngreso(String token, String codigo,
            String marca, String modelo, Long equipoId) {
        ObjectNode root = objectMapper.createObjectNode();
        ObjectNode message = root.putObject("message");
        message.put("token", token);

        String body = "Equipo " + codigo
                + (marca == null || marca.isBlank() ? "" : " (" + marca + " " + (modelo == null ? "" : modelo) + ")")
                + " registrado";

        ObjectNode notification = message.putObject("notification");
        notification.put("title", "Nuevo ingreso de equipo");
        notification.put("body", body);

        ObjectNode data = message.putObject("data");
        data.put("tipo", "INGRESO_EQUIPO");
        data.put("entidadId", String.valueOf(equipoId));

        ObjectNode android = message.putObject("android");
        android.put("priority", "HIGH");
        return root;
    }
}