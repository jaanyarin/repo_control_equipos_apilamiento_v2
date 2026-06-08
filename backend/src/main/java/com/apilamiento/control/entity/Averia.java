package com.apilamiento.control.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.time.ZoneId;

@Entity
@Table(name = "fac_averias")
public class Averia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "equipo_id")
    private Long equipoId;

    @Column(name = "descripcion_falla", nullable = false)
    private String descripcionFalla;

    @Column(name = "fecha_hora_averia")
    private OffsetDateTime fechaHoraAveria;

    @Column(name = "fecha_hora_atencion")
    private OffsetDateTime fechaHoraAtencion;

    @Column(name = "accion_realizada")
    private String accionRealizada;

    @Column(name = "dias_inactividad")
    private Integer diasInactividad;

    @Column(name = "estado_averia", nullable = false, length = 30)
    private String estadoAveria = "REPORTADA";

    private String observaciones;

    @Column(name = "estado_activo", nullable = false)
    private Boolean estadoActivo = true;

    @Column(name = "fecha_creacion", nullable = false)
    private OffsetDateTime fechaCreacion = OffsetDateTime.now(ZoneId.of("America/Lima"));

    @Column(name = "fecha_actualizacion")
    private OffsetDateTime fechaActualizacion;

    @Column(name = "usuario_creacion")
    private Long usuarioCreacion;

    @Column(name = "usuario_actualizacion")
    private Long usuarioActualizacion;

    @Version
    private Integer version = 0;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEquipoId() { return equipoId; }
    public void setEquipoId(Long equipoId) { this.equipoId = equipoId; }

    public String getDescripcionFalla() { return descripcionFalla; }
    public void setDescripcionFalla(String descripcionFalla) { this.descripcionFalla = descripcionFalla; }

    public OffsetDateTime getFechaHoraAveria() { return fechaHoraAveria; }
    public void setFechaHoraAveria(OffsetDateTime fechaHoraAveria) { this.fechaHoraAveria = fechaHoraAveria; }

    public OffsetDateTime getFechaHoraAtencion() { return fechaHoraAtencion; }
    public void setFechaHoraAtencion(OffsetDateTime fechaHoraAtencion) { this.fechaHoraAtencion = fechaHoraAtencion; }

    public String getAccionRealizada() { return accionRealizada; }
    public void setAccionRealizada(String accionRealizada) { this.accionRealizada = accionRealizada; }

    public Integer getDiasInactividad() { return diasInactividad; }
    public void setDiasInactividad(Integer diasInactividad) { this.diasInactividad = diasInactividad; }

    public String getEstadoAveria() { return estadoAveria; }
    public void setEstadoAveria(String estadoAveria) { this.estadoAveria = estadoAveria; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

    public Boolean getEstadoActivo() { return estadoActivo; }
    public void setEstadoActivo(Boolean estadoActivo) { this.estadoActivo = estadoActivo; }

    public OffsetDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(OffsetDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public OffsetDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(OffsetDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }

    public Long getUsuarioCreacion() { return usuarioCreacion; }
    public void setUsuarioCreacion(Long usuarioCreacion) { this.usuarioCreacion = usuarioCreacion; }

    public Long getUsuarioActualizacion() { return usuarioActualizacion; }
    public void setUsuarioActualizacion(Long usuarioActualizacion) { this.usuarioActualizacion = usuarioActualizacion; }

    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
}
