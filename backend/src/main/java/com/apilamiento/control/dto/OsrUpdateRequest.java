package com.apilamiento.control.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.math.BigDecimal;

public class OsrUpdateRequest {

    @NotNull(message = "El costo unitario es obligatorio")
    @DecimalMin(value = "0.01", message = "El costo unitario debe ser mayor a cero")
    @Digits(integer = 12, fraction = 2, message = "El costo unitario admite hasta dos decimales")
    private BigDecimal costoUnitario;

    @NotBlank(message = "El tipo de moneda es obligatorio")
    @Pattern(regexp = "PEN|USD|EUR", message = "El tipo de moneda debe ser PEN, USD o EUR")
    private String tipoMoneda;

    public BigDecimal getCostoUnitario() { return costoUnitario; }
    public void setCostoUnitario(BigDecimal costoUnitario) { this.costoUnitario = costoUnitario; }

    public String getTipoMoneda() { return tipoMoneda; }
    public void setTipoMoneda(String tipoMoneda) { this.tipoMoneda = tipoMoneda; }
}
