package com.apilamiento.control.dto;

import java.time.OffsetDateTime;

public class AveriaDTO {
    private Long id;
    private Long equipoId;
    private String descripcionFalla;
    private OffsetDateTime fechaHoraAveria;
    private OffsetDateTime fechaHoraAtencion;
    private String accionRealizada;
    private Integer diasInactividad;
    private String estadoAveria;
    private String observaciones;
    private Boolean estadoActivo;
    private Long usuarioCreacion;
    private Long usuarioActualizacion;
    private OffsetDateTime fechaCreacion;
    private OffsetDateTime fechaActualizacion;

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

    public Long getUsuarioCreacion() { return usuarioCreacion; }
    public void setUsuarioCreacion(Long usuarioCreacion) { this.usuarioCreacion = usuarioCreacion; }

    public Long getUsuarioActualizacion() { return usuarioActualizacion; }
    public void setUsuarioActualizacion(Long usuarioActualizacion) { this.usuarioActualizacion = usuarioActualizacion; }

    public OffsetDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(OffsetDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public OffsetDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(OffsetDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
}
