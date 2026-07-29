package com.apilamiento.control.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public class IngresoEquipoRequest {
    @NotNull(message = "El PSR es obligatorio")
    private Long psrId;

    @Valid
    @NotNull(message = "Los datos del equipo son obligatorios")
    private EquipoDTO equipo;

    public Long getPsrId() { return psrId; }
    public void setPsrId(Long psrId) { this.psrId = psrId; }
    public EquipoDTO getEquipo() { return equipo; }
    public void setEquipo(EquipoDTO equipo) { this.equipo = equipo; }
}
