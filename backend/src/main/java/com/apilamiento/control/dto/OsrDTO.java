package com.apilamiento.control.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public class OsrDTO {
    private Long id;
    private Long psrId;
    private String numeroOsr;
    private BigDecimal costoUnitario;
    private String tipoMoneda;
    private Boolean estadoActivo;
    private OffsetDateTime fechaCreacion;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPsrId() { return psrId; }
    public void setPsrId(Long psrId) { this.psrId = psrId; }

    public String getNumeroOsr() { return numeroOsr; }
    public void setNumeroOsr(String numeroOsr) { this.numeroOsr = numeroOsr; }

    public BigDecimal getCostoUnitario() { return costoUnitario; }
    public void setCostoUnitario(BigDecimal costoUnitario) { this.costoUnitario = costoUnitario; }

    public String getTipoMoneda() { return tipoMoneda; }
    public void setTipoMoneda(String tipoMoneda) { this.tipoMoneda = tipoMoneda; }

    public Boolean getEstadoActivo() { return estadoActivo; }
    public void setEstadoActivo(Boolean estadoActivo) { this.estadoActivo = estadoActivo; }

    public OffsetDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(OffsetDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}
