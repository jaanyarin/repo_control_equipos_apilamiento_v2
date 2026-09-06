package com.apilamiento.control.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

public class PsrDTO {
    private Long id;
    private Long campanaId;
    private String campanaNombre;
    private Long sedeId;
    private String sedeNombre;
    private String numeroPsr;
    private LocalDateTime fechaPsr;
    private Long motivoId;
    private String motivoNombre;
    private String motivoNombreCorto;
    private LocalDateTime fechaInicioUso;
    private LocalDateTime fechaFinUso;
    private BigDecimal meses;
    private String observaciones;
    private Boolean estadoActivo;
    private Boolean finalizado;
    private String estadoPsr;
    private Integer osrsTotal;
    private Integer osrsFinalizadas;
    private Long usuarioCreacion;
    private Long usuarioActualizacion;
    private OffsetDateTime fechaCreacion;
    private OffsetDateTime fechaActualizacion;
    private OsrDTO osr;
    private List<OsrDTO> osrs = new ArrayList<>();
    private String marca;
    private String modelo;
    private String grr;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCampanaId() { return campanaId; }
    public void setCampanaId(Long campanaId) { this.campanaId = campanaId; }

    public String getCampanaNombre() { return campanaNombre; }
    public void setCampanaNombre(String campanaNombre) { this.campanaNombre = campanaNombre; }

    public Long getSedeId() { return sedeId; }
    public void setSedeId(Long sedeId) { this.sedeId = sedeId; }

    public String getSedeNombre() { return sedeNombre; }
    public void setSedeNombre(String sedeNombre) { this.sedeNombre = sedeNombre; }

    public String getNumeroPsr() { return numeroPsr; }
    public void setNumeroPsr(String numeroPsr) { this.numeroPsr = numeroPsr; }

    public LocalDateTime getFechaPsr() { return fechaPsr; }
    public void setFechaPsr(LocalDateTime fechaPsr) { this.fechaPsr = fechaPsr; }
    public void setFechaPsr(LocalDate fechaPsr) { this.fechaPsr = fechaPsr != null ? fechaPsr.atStartOfDay() : null; }

    public Long getMotivoId() { return motivoId; }
    public void setMotivoId(Long motivoId) { this.motivoId = motivoId; }

    public String getMotivoNombre() { return motivoNombre; }
    public void setMotivoNombre(String motivoNombre) { this.motivoNombre = motivoNombre; }

    public String getMotivoNombreCorto() { return motivoNombreCorto; }
    public void setMotivoNombreCorto(String motivoNombreCorto) { this.motivoNombreCorto = motivoNombreCorto; }

    public LocalDateTime getFechaInicioUso() { return fechaInicioUso; }
    public void setFechaInicioUso(LocalDateTime fechaInicioUso) { this.fechaInicioUso = fechaInicioUso; }
    public void setFechaInicioUso(LocalDate fechaInicioUso) { this.fechaInicioUso = fechaInicioUso != null ? fechaInicioUso.atStartOfDay() : null; }

    public LocalDateTime getFechaFinUso() { return fechaFinUso; }
    public void setFechaFinUso(LocalDateTime fechaFinUso) { this.fechaFinUso = fechaFinUso; }
    public void setFechaFinUso(LocalDate fechaFinUso) { this.fechaFinUso = fechaFinUso != null ? fechaFinUso.atStartOfDay() : null; }

    public BigDecimal getMeses() { return meses; }
    public void setMeses(BigDecimal meses) { this.meses = meses; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

    public Boolean getEstadoActivo() { return estadoActivo; }
    public void setEstadoActivo(Boolean estadoActivo) { this.estadoActivo = estadoActivo; }

    public Boolean getFinalizado() { return finalizado; }
    public void setFinalizado(Boolean finalizado) { this.finalizado = finalizado; }

    public Long getUsuarioCreacion() { return usuarioCreacion; }
    public void setUsuarioCreacion(Long usuarioCreacion) { this.usuarioCreacion = usuarioCreacion; }

    public Long getUsuarioActualizacion() { return usuarioActualizacion; }
    public void setUsuarioActualizacion(Long usuarioActualizacion) { this.usuarioActualizacion = usuarioActualizacion; }

    public OffsetDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(OffsetDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public OffsetDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(OffsetDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }

    public OsrDTO getOsr() { return osr; }
    public void setOsr(OsrDTO osr) {
        this.osr = osr;
        if (osr != null && (osrs == null || osrs.isEmpty())) {
            if (osrs == null) osrs = new ArrayList<>();
            osrs.add(osr);
        }
    }

    public List<OsrDTO> getOsrs() { return osrs; }
    public void setOsrs(List<OsrDTO> osrs) {
        this.osrs = osrs != null ? osrs : new ArrayList<>();
        this.osr = (this.osrs != null && !this.osrs.isEmpty()) ? this.osrs.get(0) : null;
    }

    public String getEstadoPsr() { return estadoPsr; }
    public void setEstadoPsr(String estadoPsr) { this.estadoPsr = estadoPsr; }

    public Integer getOsrsTotal() { return osrsTotal; }
    public void setOsrsTotal(Integer osrsTotal) { this.osrsTotal = osrsTotal; }

    public Integer getOsrsFinalizadas() { return osrsFinalizadas; }
    public void setOsrsFinalizadas(Integer osrsFinalizadas) { this.osrsFinalizadas = osrsFinalizadas; }

    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }

    public String getModelo() { return modelo; }
    public void setModelo(String modelo) { this.modelo = modelo; }

    public String getGrr() { return grr; }
    public void setGrr(String grr) { this.grr = grr; }
}
