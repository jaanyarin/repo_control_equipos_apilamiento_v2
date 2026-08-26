package com.apilamiento.control.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;

@Entity
@Table(name = "fac_osr")
public class Osr {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "psr_id", nullable = false, unique = true)
    private Long psrId;

    @Column(name = "equipo_id")
    private Long equipoId;

    @Column(name = "numero_osr", unique = true, length = 100)
    private String numeroOsr;

    @Column(name = "fecha_osr")
    private LocalDateTime fechaOsr;

    @Column(name = "costo_unitario", precision = 14, scale = 2)
    private BigDecimal costoUnitario;

    @Column(name = "tipo_moneda", length = 3)
    private String tipoMoneda;

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

    public Long getPsrId() { return psrId; }
    public void setPsrId(Long psrId) { this.psrId = psrId; }

    public Long getEquipoId() { return equipoId; }
    public void setEquipoId(Long equipoId) { this.equipoId = equipoId; }

    public String getNumeroOsr() { return numeroOsr; }
    public void setNumeroOsr(String numeroOsr) { this.numeroOsr = numeroOsr; }

    public LocalDateTime getFechaOsr() { return fechaOsr; }
    public void setFechaOsr(LocalDateTime fechaOsr) { this.fechaOsr = fechaOsr; }

    public BigDecimal getCostoUnitario() { return costoUnitario; }
    public void setCostoUnitario(BigDecimal costoUnitario) { this.costoUnitario = costoUnitario; }

    public String getTipoMoneda() { return tipoMoneda; }
    public void setTipoMoneda(String tipoMoneda) { this.tipoMoneda = tipoMoneda; }

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
