package com.routinetracker.service;

import com.routinetracker.dto.ProgresoPuntoResponse;
import com.routinetracker.entity.Sesion;
import com.routinetracker.entity.Usuario;
import com.routinetracker.exception.EjercicioNoEncontradoException;
import com.routinetracker.repository.EjercicioRepository;
import com.routinetracker.repository.SesionRepository;
import com.routinetracker.security.AuthenticatedUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgresoService {

    private final SesionRepository sesionRepository;
    private final EjercicioRepository ejercicioRepository;
    private final AuthenticatedUserProvider authenticatedUserProvider;

    public List<ProgresoPuntoResponse> obtenerProgreso(Long ejercicioId, LocalDate inicio, LocalDate fin) {
        if (!ejercicioRepository.existsById(ejercicioId)) {
            throw new EjercicioNoEncontradoException(ejercicioId);
        }

        Usuario usuario = authenticatedUserProvider.getUsuarioActual();

        List<Sesion> sesiones;
        if (inicio != null && fin != null) {
            sesiones = sesionRepository.findByUsuarioIdAndFechaBetweenOrderByFechaDesc(
                    usuario.getId(), inicio.atStartOfDay(), fin.atTime(LocalTime.MAX));
        } else {
            sesiones = sesionRepository.findByUsuarioIdOrderByFechaDesc(usuario.getId());
        }

        return sesiones.stream()
                .flatMap(sesion -> sesion.getEjercicios().stream()
                        .filter(se -> se.getEjercicio().getId().equals(ejercicioId))
                        .map(se -> new ProgresoPuntoResponse(
                                sesion.getFecha(), se.getPeso(), se.getRepeticiones(), se.getSeries())))
                .sorted(Comparator.comparing(ProgresoPuntoResponse::getFecha))
                .collect(Collectors.toList());
    }
}
