package com.apilamiento.control.mapper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class NotificacionPushMapper {

    public static final String TIPO_INGRESO_EQUIPO = "INGRESO_EQUIPO";
    public static final String TIPO_AVERIA_REPORTADA = "AVERIA_REPORTADA";
    public static final String TIPO_AVERIA_ATENDIDA = "AVERIA_ATENDIDA";
    public static final String TIPO_SERVICIO_FINALIZADO = "SERVICIO_FINALIZADO";

    private final ObjectMapper objectMapper;

    public NotificacionPushMapper() {
        this.objectMapper = new ObjectMapper();
    }

    public JsonNode mensajeIngreso(String token, String proveedor, String codigo, String usuario, Long equipoId) {
        return mensaje(token, "Nuevo ingreso de Equipo", "Nuevo ingreso de equipo",
                TIPO_INGRESO_EQUIPO, proveedor, codigo, usuario, equipoId);
    }

    public JsonNode mensajeAveriaReportada(String token, String proveedor, String codigo, String usuario, Long equipoId) {
        return mensaje(token, "Avería reportada", "Nueva avería reportada",
                TIPO_AVERIA_REPORTADA, proveedor, codigo, usuario, equipoId);
    }

    public JsonNode mensajeAveriaAtendida(String token, String proveedor, String codigo, String usuario, Long equipoId) {
        return mensaje(token, "Avería atendida", "Avería atendida",
                TIPO_AVERIA_ATENDIDA, proveedor, codigo, usuario, equipoId);
    }

    public JsonNode mensajeServicioFinalizado(String token, String proveedor, String codigo, String usuario, Long equipoId) {
        return mensaje(token, "Servicio finalizado", "Servicio finalizado",
                TIPO_SERVICIO_FINALIZADO, proveedor, codigo, usuario, equipoId);
    }

    private JsonNode mensaje(String token, String evento, String titulo, String tipo,
            String proveedor, String codigo, String usuario, Long entidadId) {
        ObjectNode root = objectMapper.createObjectNode();
        ObjectNode message = root.putObject("message");
        message.put("token", token);

        String body = "Evento: " + (evento == null ? "" : evento) + "\n"
                + "Proveedor: " + (proveedor == null || proveedor.isBlank() ? "-" : proveedor)
                + " - Codigo: " + (codigo == null ? "" : codigo) + "\n"
                + "Registrado por: " + (usuario == null ? "" : usuario);

        ObjectNode notification = message.putObject("notification");
        notification.put("title", titulo);
        notification.put("body", body);

        ObjectNode data = message.putObject("data");
        data.put("tipo", tipo);
        data.put("entidadId", String.valueOf(entidadId));

        ObjectNode android = message.putObject("android");
        android.put("priority", "HIGH");
        ObjectNode androidNotification = android.putObject("notification");
        androidNotification.put("channel_id", "apilamiento-alertas");
        androidNotification.put("sound", "default");
        return root;
    }
}
