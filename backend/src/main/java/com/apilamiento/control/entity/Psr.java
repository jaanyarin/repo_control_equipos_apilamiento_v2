package com.apilamiento.control.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;

@Entity
@Table(name = "fac_psr")
public class Psr {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "campana_id", nullable = false)
    private Long campanaId;

    @Column(name = "sede_id", nullable = false)
    private Long sedeId;

    @Column(name = "numero_psr", nullable = false, unique = true, length = 100)
    private String numeroPsr;

    @Column(name = "fecha_psr", nullable = false)
    private LocalDate fechaPsr;

    @Column(name = "motivo_id", nullable = false)
    private Long motivoId;

    @Column(name = "fecha_inicio_uso", nullable = false)
    private LocalDate fechaInicioUso;

    @Column(name = "fecha_fin_uso", nullable = false)
    private LocalDate fechaFinUso;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal meses;

    @Column(columnDefinition = "TEXT")
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