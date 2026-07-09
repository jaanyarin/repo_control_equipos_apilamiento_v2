package com.apilamiento.control.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

public class PsrDTO {
    private Long id;
    private Long campanaId;
    private Long sedeId;
    private String numeroPsr;
    private LocalDate fechaPsr;
    private Long motivoId;
    private String motivoNombre;
    private String motivoNombreCorto;
    private LocalDate fechaInicioUso;
    private LocalDate fechaFinUso;
    private BigDecimal meses;
    private String observaciones;
    private Boolean estadoActivo;
    private Long usuarioCreacion;
    private Long usuarioActualizacion;
    private OffsetDateTime fechaCreacion;
    private OffsetDateTime fechaActualizacion;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCampanaId() { return campanaId; }
    public void setCampanaId(Long campanaId) { this.campanaId = campanaId; }

    public Long getSedeId() { return sedeId; }
    public void setSedeId(Long sedeId) { this.sedeId = sedeId; }

    public String getNumeroPsr() { return numeroPsr; }
    public void setNumeroPsr(String numeroPsr) { this.numeroPsr = numeroPsr; }

    public LocalDate getFechaPsr() { return fechaPsr; }
    public void setFechaPsr(LocalDate fechaPsr) { this.fechaPsr = fechaPsr; }

    public Long getMotivoId() { return motivoId; }
    public void setMotivoId(Long motivoId) { this.motivoId = motivoId; }

    public String getMotivoNombre() { return motivoNombre; }
    public void setMotivoNombre(String motivoNombre) { this.motivoNombre = motivoNombre; }

    public String getMotivoNombreCorto() { return motivoNombreCorto; }
    public void setMotivoNombreCorto(String motivoNombreCorto) { this.motivoNombreCorto = motivoNombreCorto; }

    public LocalDate getFechaInicioUso() { return fechaInicioUso; }
    public void setFechaInicioUso(LocalDate fechaInicioUso) { this.fechaInicioUso = fechaInicioUso; }

    public LocalDate getFechaFinUso() { return fechaFinUso; }
    public void setFechaFinUso(LocalDate fechaFinUso) { this.fechaFinUso = fechaFinUso; }

    public BigDecimal getMeses() { return meses; }
    public void setMeses(BigDecimal meses) { this.meses = meses; }

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