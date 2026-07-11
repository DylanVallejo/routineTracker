package com.routinetracker.dto;

import com.routinetracker.entity.Ejercicio;
import com.routinetracker.entity.GrupoMuscular;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EjercicioResponse {
    private Long id;
    private String nombre;
    private GrupoMuscular grupoMuscular;
    private String descripcion;

    public static EjercicioResponse from(Ejercicio ejercicio) {
        return new EjercicioResponse(
                ejercicio.getId(),
                ejercicio.getNombre(),
                ejercicio.getGrupoMuscular(),
                ejercicio.getDescripcion()
        );
    }
}
