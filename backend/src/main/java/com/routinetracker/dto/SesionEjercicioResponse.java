package com.routinetracker.dto;

import com.routinetracker.entity.GrupoMuscular;
import com.routinetracker.entity.SesionEjercicio;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class SesionEjercicioResponse {
    private Long id;
    private Long ejercicioId;
    private String nombreEjercicio;
    private GrupoMuscular grupoMuscular;
    private Integer series;
    private Integer repeticiones;
    private BigDecimal peso;

    public static SesionEjercicioResponse from(SesionEjercicio se) {
        return new SesionEjercicioResponse(
                se.getId(),
                se.getEjercicio().getId(),
                se.getEjercicio().getNombre(),
                se.getEjercicio().getGrupoMuscular(),
                se.getSeries(),
                se.getRepeticiones(),
                se.getPeso()
        );
    }
}
