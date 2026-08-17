package com.routinetracker.dto;

import com.routinetracker.entity.EjercicioDefault;
import com.routinetracker.entity.GrupoMuscular;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EjercicioDefaultResponse {
    private Long id;
    private String nombre;
    private GrupoMuscular grupoMuscular;
    private String descripcion;
    private String videoUrl;

    public static EjercicioDefaultResponse from(EjercicioDefault ejercicio) {
        return new EjercicioDefaultResponse(
                ejercicio.getId(),
                ejercicio.getNombre(),
                ejercicio.getGrupoMuscular(),
                ejercicio.getDescripcion(),
                ejercicio.getVideoUrl()
        );
    }
}
