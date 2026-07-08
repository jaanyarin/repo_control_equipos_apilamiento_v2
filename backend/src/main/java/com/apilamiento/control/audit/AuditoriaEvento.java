package com.apilamiento.control.audit;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.time.ZoneId;

@Entity
@Table(name = "auditoria_eventos")
public class AuditoriaEvento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tipo_evento", nullable = false, length = 50)
    private String tipoEvento;

    @Column(name = "entidad", length = 100)
    private String entidad;

    @Column(name = "entidad_id")
    private Long entidadId;

    @Column(name = "accion", nullable = false, length = 50)
    private String accion;

    @Column(name = "usuario_id")
    private Long usuarioId;

    @Column(name = "usuario_nombre", length = 200)
    private String usuarioNombre;

    @Column(name = "detalle", columnDefinition = "TEXT")
    private String detalle;

    @Column(name = "direccion_ip", length = 50)
    private String direccionIp;

    @Column(name = "fecha_evento", nullable = false)
    private OffsetDateTime fechaEvento = OffsetDateTime.now(ZoneId.of("America/Lima"));

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTipoEvento() { return tipoEvento; }
    public void setTipoEvento(String tipoEvento) { this.tipoEvento = tipoEvento; }
    public String getEntidad() { return entidad; }
    public void setEntidad(String entidad) { this.entidad = entidad; }
    public Long getEntidadId() { return entidadId; }
    public void setEntidadId(Long entidadId) { this.entidadId = entidadId; }
    public String getAccion() { return accion; }
    public void setAccion(String accion) { this.accion = accion; }
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public String getUsuarioNombre() { return usuarioNombre; }
    public void setUsuarioNombre(String usuarioNombre) { this.usuarioNombre = usuarioNombre; }
    public String getDetalle() { return detalle; }
    public void setDetalle(String detalle) { this.detalle = detalle; }
    public String getDireccionIp() { return direccionIp; }
    public void setDireccionIp(String direccionIp) { this.direccionIp = direccionIp; }
    public OffsetDateTime getFechaEvento() { return fechaEvento; }
    public void setFechaEvento(OffsetDateTime fechaEvento) { this.fechaEvento = fechaEvento; }
}
