package com.routinetracker.dto;

import com.routinetracker.entity.Sesion;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
public class SesionResponse {
    private Long id;
    private LocalDateTime fecha;
    private String notas;
    private List<SesionEjercicioResponse> ejercicios;

    public static SesionResponse from(Sesion sesion) {
        List<SesionEjercicioResponse> ejercicios = sesion.getEjercicios().stream()
                .map(SesionEjercicioResponse::from)
                .collect(Collectors.toList());

        return new SesionResponse(sesion.getId(), sesion.getFecha(), sesion.getNotas(), ejercicios);
    }
}
