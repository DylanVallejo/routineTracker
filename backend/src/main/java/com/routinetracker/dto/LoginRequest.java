package com.routinetracker.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "El correo es obligatorio")
    private String correo;

    @NotBlank(message = "La contrasena es obligatoria")
    private String password;
}
