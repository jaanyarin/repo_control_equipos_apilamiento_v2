package com.apilamiento.control.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class PushTokenRequest {

    @NotBlank(message = "El token FCM es obligatorio")
    @Size(max = 512, message = "Token FCM inválido")
    private String token;

    @NotNull(message = "plataforma es obligatoria")
    private String plataforma;

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getPlataforma() { return plataforma; }
    public void setPlataforma(String plataforma) { this.plataforma = plataforma; }
}