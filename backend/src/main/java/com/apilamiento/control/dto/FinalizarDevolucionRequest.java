package com.apilamiento.control.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class FinalizarDevolucionRequest {
    @NotNull(message = "El horómetro final es obligatorio")
    private BigDecimal horometroFin;

    public BigDecimal getHorometroFin() { return horometroFin; }
    public void setHorometroFin(BigDecimal horometroFin) { this.horometroFin = horometroFin; }
}
