package com.routinetracker.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class SesionRequest {

    @NotNull(message = "La fecha es obligatoria")
    private LocalDateTime fecha;

    private String notas;

    @NotEmpty(message = "Debes agregar al menos un ejercicio a la sesión")
    @Valid
    private List<SesionEjercicioRequest> ejercicios;
}
