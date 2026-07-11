package com.routinetracker.dto;

import com.routinetracker.entity.GrupoMuscular;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EjercicioRequest {

    @NotBlank(message = "El nombre del ejercicio es obligatorio")
    private String nombre;

    @NotNull(message = "El grupo muscular es obligatorio")
    private GrupoMuscular grupoMuscular;

    private String descripcion;
}
