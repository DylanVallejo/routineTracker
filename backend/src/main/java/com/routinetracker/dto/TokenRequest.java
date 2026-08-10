package com.routinetracker.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TokenRequest {

    @NotBlank(message = "El token es obligatorio")
    private String token;
}
