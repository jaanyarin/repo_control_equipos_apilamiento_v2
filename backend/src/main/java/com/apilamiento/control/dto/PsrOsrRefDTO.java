package com.apilamiento.control.dto;

public class PsrOsrRefDTO {
    private Long psrId;
    private String numeroPsr;
    private String numeroOsr;
    private String sedeNombre;
    private String campanaNombre;

    public Long getPsrId() { return psrId; }
    public void setPsrId(Long psrId) { this.psrId = psrId; }

    public String getNumeroPsr() { return numeroPsr; }
    public void setNumeroPsr(String numeroPsr) { this.numeroPsr = numeroPsr; }

    public String getNumeroOsr() { return numeroOsr; }
    public void setNumeroOsr(String numeroOsr) { this.numeroOsr = numeroOsr; }

    public String getSedeNombre() { return sedeNombre; }
    public void setSedeNombre(String sedeNombre) { this.sedeNombre = sedeNombre; }

    public String getCampanaNombre() { return campanaNombre; }
    public void setCampanaNombre(String campanaNombre) { this.campanaNombre = campanaNombre; }
}
