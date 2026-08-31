package com.routinetracker.service;

import com.routinetracker.dto.AnalisisMuscularResponse;
import com.routinetracker.dto.AnalisisVolumenResponse;
import com.routinetracker.entity.GrupoMuscular;
import com.routinetracker.entity.Sesion;
import com.routinetracker.entity.SesionEjercicio;
import com.routinetracker.entity.Usuario;
import com.routinetracker.repository.SesionRepository;
import com.routinetracker.security.AuthenticatedUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalisisService {

    private static final double SEMANAS_MINIMAS = 1.0;

    private final SesionRepository sesionRepository;
    private final AuthenticatedUserProvider authenticatedUserProvider;

    public List<AnalisisMuscularResponse> analizarPorGrupoMuscular(LocalDate inicio, LocalDate fin) {
        Usuario usuario = authenticatedUserProvider.getUsuarioActual();
        List<Sesion> sesiones = obtenerSesiones(usuario.getId(), inicio, fin);

        // Cuenta dias/sesiones distintas en las que aparece cada grupo, no cada fila de ejercicio:
        // una sesion con 3 ejercicios de Pecho debe sumar 1 a la frecuencia de Pecho, no 3.
        Map<GrupoMuscular, Long> frecuenciaPorGrupo = sesiones.stream()
                .flatMap(sesion -> sesion.getEjercicios().stream()
                        .map(se -> se.getEjercicio().getGrupoMuscular())
                        .distinct())
                .collect(Collectors.groupingBy(grupo -> grupo, Collectors.counting()));

        return Arrays.stream(GrupoMuscular.values())
                .map(grupo -> new AnalisisMuscularResponse(grupo, frecuenciaPorGrupo.getOrDefault(grupo, 0L)))
                .collect(Collectors.toList());
    }

    public List<AnalisisVolumenResponse> analizarVolumenPorGrupoMuscular(LocalDate inicio, LocalDate fin) {
        Usuario usuario = authenticatedUserProvider.getUsuarioActual();
        List<Sesion> sesiones = obtenerSesiones(usuario.getId(), inicio, fin);

        Map<GrupoMuscular, Long> seriesPorGrupo = sesiones.stream()
                .flatMap(sesion -> sesion.getEjercicios().stream())
                .collect(Collectors.groupingBy(
                        se -> se.getEjercicio().getGrupoMuscular(),
                        Collectors.summingLong(SesionEjercicio::getSeries)));

        double semanas = calcularSemanas(sesiones, inicio, fin);

        return Arrays.stream(GrupoMuscular.values())
                .map(grupo -> {
                    long series = seriesPorGrupo.getOrDefault(grupo, 0L);
                    double setsPorSemana = Math.round((series / semanas) * 10.0) / 10.0;
                    return new AnalisisVolumenResponse(grupo, series, setsPorSemana);
                })
                .collect(Collectors.toList());
    }

    private List<Sesion> obtenerSesiones(Long usuarioId, LocalDate inicio, LocalDate fin) {
        if (inicio != null && fin != null) {
            return sesionRepository.findByUsuarioIdAndFechaBetweenOrderByFechaDesc(
                    usuarioId, inicio.atStartOfDay(), fin.atTime(LocalTime.MAX));
        }
        return sesionRepository.findByUsuarioIdOrderByFechaDesc(usuarioId);
    }

    private double calcularSemanas(List<Sesion> sesiones, LocalDate inicio, LocalDate fin) {
        if (inicio != null && fin != null) {
            long dias = ChronoUnit.DAYS.between(inicio, fin) + 1;
            return Math.max(dias / 7.0, SEMANAS_MINIMAS);
        }

        LocalDateTime masAntigua = sesiones.stream()
                .map(Sesion::getFecha)
                .min(Comparator.naturalOrder())
                .orElse(null);

        if (masAntigua == null) {
            return SEMANAS_MINIMAS;
        }

        long dias = ChronoUnit.DAYS.between(masAntigua.toLocalDate(), LocalDate.now()) + 1;
        return Math.max(dias / 7.0, SEMANAS_MINIMAS);
    }
}
