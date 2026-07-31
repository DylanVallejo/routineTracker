package com.routinetracker.dto;

import com.routinetracker.entity.GrupoMuscular;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AnalisisVolumenResponse {
    private GrupoMuscular grupoMuscular;
    private long series;
    private double setsPorSemana;
}
