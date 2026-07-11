package com.routinetracker.service;

import com.routinetracker.dto.AnalisisMuscularResponse;
import com.routinetracker.entity.GrupoMuscular;
import com.routinetracker.entity.Sesion;
import com.routinetracker.entity.SesionEjercicio;
import com.routinetracker.entity.Usuario;
import com.routinetracker.repository.SesionRepository;
import com.routinetracker.security.AuthenticatedUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalisisService {

    private final SesionRepository sesionRepository;
    private final AuthenticatedUserProvider authenticatedUserProvider;

    public List<AnalisisMuscularResponse> analizarPorGrupoMuscular(LocalDate inicio, LocalDate fin) {
        Usuario usuario = authenticatedUserProvider.getUsuarioActual();

        List<Sesion> sesiones;
        if (inicio != null && fin != null) {
            sesiones = sesionRepository.findByUsuarioIdAndFechaBetweenOrderByFechaDesc(
                    usuario.getId(), inicio.atStartOfDay(), fin.atTime(LocalTime.MAX));
        } else {
            sesiones = sesionRepository.findByUsuarioIdOrderByFechaDesc(usuario.getId());
        }

        Map<GrupoMuscular, Long> frecuenciaPorGrupo = sesiones.stream()
                .flatMap(sesion -> sesion.getEjercicios().stream())
                .map(SesionEjercicio::getEjercicio)
                .collect(Collectors.groupingBy(com.routinetracker.entity.Ejercicio::getGrupoMuscular, Collectors.counting()));

        return Arrays.stream(GrupoMuscular.values())
                .map(grupo -> new AnalisisMuscularResponse(grupo, frecuenciaPorGrupo.getOrDefault(grupo, 0L)))
                .collect(Collectors.toList());
    }
}
