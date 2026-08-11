package com.apilamiento.control.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class ChangePasswordRequest {

    @NotBlank(message = "La nueva contraseña es obligatoria")
    @Pattern(regexp = "^\\d{8}$", message = "La nueva contraseña debe tener exactamente 8 dígitos numéricos")
    private String newPassword;

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}
