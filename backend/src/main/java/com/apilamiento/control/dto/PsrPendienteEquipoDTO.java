package com.apilamiento.control.dto;

import java.math.BigDecimal;

public class PsrPendienteEquipoDTO {
    private Long psrId;
    private String numeroPsr;
    private String motivo;
    private BigDecimal meses;
    private Long osrId;
    private String numeroOsr;
    private Long borradorEquipoId;

    public Long getPsrId() { return psrId; }
    public void setPsrId(Long psrId) { this.psrId = psrId; }
    public String getNumeroPsr() { return numeroPsr; }
    public void setNumeroPsr(String numeroPsr) { this.numeroPsr = numeroPsr; }
    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
    public BigDecimal getMeses() { return meses; }
    public void setMeses(BigDecimal meses) { this.meses = meses; }
    public Long getOsrId() { return osrId; }
    public void setOsrId(Long osrId) { this.osrId = osrId; }
    public String getNumeroOsr() { return numeroOsr; }
    public void setNumeroOsr(String numeroOsr) { this.numeroOsr = numeroOsr; }
    public Long getBorradorEquipoId() { return borradorEquipoId; }
    public void setBorradorEquipoId(Long borradorEquipoId) { this.borradorEquipoId = borradorEquipoId; }
}
