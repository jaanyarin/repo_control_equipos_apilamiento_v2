package com.apilamiento.control.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.Valid;
import java.time.LocalDate;

public class PsrRequest {

    @NotNull(message = "La campaña es obligatoria")
    private Long campanaId;

    @NotNull(message = "La sede es obligatoria")
    private Long sedeId;

    @NotBlank(message = "El número de PSR es obligatorio")
    private String numeroPsr;

    @NotNull(message = "La fecha de PSR es obligatoria")
    private LocalDate fechaPsr;

    @NotNull(message = "El motivo es obligatorio")
    private Long motivoId;

    @NotNull(message = "La fecha de inicio de uso es obligatoria")
    private LocalDate fechaInicioUso;

    @NotNull(message = "La fecha de fin de uso es obligatoria")
    private LocalDate fechaFinUso;

    private String observaciones;

    private Long usuarioCreacion;
    private Long usuarioActualizacion;
    @Valid
    private OsrUpdateRequest osr;

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

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

    public Long getUsuarioCreacion() { return usuarioCreacion; }
    public void setUsuarioCreacion(Long usuarioCreacion) { this.usuarioCreacion = usuarioCreacion; }

    public Long getUsuarioActualizacion() { return usuarioActualizacion; }
    public void setUsuarioActualizacion(Long usuarioActualizacion) { this.usuarioActualizacion = usuarioActualizacion; }

    public OsrUpdateRequest getOsr() { return osr; }
    public void setOsr(OsrUpdateRequest osr) { this.osr = osr; }
}
