package com.routinetracker.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class SesionEjercicioRequest {

    @NotNull(message = "Debes indicar el ejercicio")
    private Long ejercicioId;

    @NotNull(message = "Las series son obligatorias")
    @Min(value = 1, message = "Las series deben ser al menos 1")
    @Max(value = 6, message = "Las series no deben superar 6 (rango habitual de hipertrofia/resistencia)")
    private Integer series;

    @NotNull(message = "Las repeticiones son obligatorias")
    @Min(value = 1, message = "Las repeticiones deben ser al menos 1")
    @Max(value = 20, message = "Las repeticiones no deben superar 20 (rango habitual de hipertrofia/resistencia)")
    private Integer repeticiones;

    @NotNull(message = "El peso es obligatorio")
    @DecimalMin(value = "0.0", message = "El peso no puede ser negativo")
    private BigDecimal peso;
}
