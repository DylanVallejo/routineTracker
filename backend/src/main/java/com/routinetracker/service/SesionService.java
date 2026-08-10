package com.routinetracker.service;

import com.routinetracker.dto.SesionEjercicioRequest;
import com.routinetracker.dto.SesionRequest;
import com.routinetracker.dto.SesionResponse;
import com.routinetracker.entity.Ejercicio;
import com.routinetracker.entity.Sesion;
import com.routinetracker.entity.SesionEjercicio;
import com.routinetracker.entity.Usuario;
import com.routinetracker.exception.EjercicioNoEncontradoException;
import com.routinetracker.exception.FechaFuturaException;
import com.routinetracker.exception.SesionNoEncontradaException;
import com.routinetracker.repository.EjercicioRepository;
import com.routinetracker.repository.SesionRepository;
import com.routinetracker.security.AuthenticatedUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SesionService {

    private final SesionRepository sesionRepository;
    private final EjercicioRepository ejercicioRepository;
    private final AuthenticatedUserProvider authenticatedUserProvider;

    @Transactional
    public SesionResponse crear(SesionRequest request) {
        validarFecha(request.getFecha());

        Usuario usuario = authenticatedUserProvider.getUsuarioActual();

        Sesion sesion = Sesion.builder()
                .usuario(usuario)
                .fecha(request.getFecha())
                .notas(request.getNotas())
                .build();

        request.getEjercicios().forEach(er -> sesion.agregarEjercicio(construirSesionEjercicio(er, usuario.getId())));

        return SesionResponse.from(sesionRepository.save(sesion));
    }

    @Transactional
    public SesionResponse actualizar(Long id, SesionRequest request) {
        validarFecha(request.getFecha());

        Usuario usuario = authenticatedUserProvider.getUsuarioActual();
        Sesion sesion = obtenerDeUsuarioActual(id);
        sesion.setFecha(request.getFecha());
        sesion.setNotas(request.getNotas());

        sesion.getEjercicios().clear();
        request.getEjercicios().forEach(er -> sesion.agregarEjercicio(construirSesionEjercicio(er, usuario.getId())));

        return SesionResponse.from(sesionRepository.save(sesion));
    }

    public List<SesionResponse> listar(LocalDate inicio, LocalDate fin) {
        Usuario usuario = authenticatedUserProvider.getUsuarioActual();

        List<Sesion> sesiones;
        if (inicio != null && fin != null) {
            sesiones = sesionRepository.findByUsuarioIdAndFechaBetweenOrderByFechaDesc(
                    usuario.getId(), inicio.atStartOfDay(), fin.atTime(LocalTime.MAX));
        } else {
            sesiones = sesionRepository.findByUsuarioIdOrderByFechaDesc(usuario.getId());
        }

        return sesiones.stream()
                .map(SesionResponse::from)
                .collect(Collectors.toList());
    }

    public SesionResponse obtener(Long id) {
        return SesionResponse.from(obtenerDeUsuarioActual(id));
    }

    @Transactional
    public void eliminar(Long id) {
        Sesion sesion = obtenerDeUsuarioActual(id);
        sesionRepository.delete(sesion);
    }

    private Sesion obtenerDeUsuarioActual(Long id) {
        Usuario usuario = authenticatedUserProvider.getUsuarioActual();
        Sesion sesion = sesionRepository.findById(id)
                .orElseThrow(() -> new SesionNoEncontradaException(id));

        if (!sesion.getUsuario().getId().equals(usuario.getId())) {
            throw new SesionNoEncontradaException(id);
        }

        return sesion;
    }

    private SesionEjercicio construirSesionEjercicio(SesionEjercicioRequest request, Long usuarioId) {
        Ejercicio ejercicio = ejercicioRepository.findByIdAndUsuarioId(request.getEjercicioId(), usuarioId)
                .orElseThrow(() -> new EjercicioNoEncontradoException(request.getEjercicioId()));

        return SesionEjercicio.builder()
                .ejercicio(ejercicio)
                .series(request.getSeries())
                .repeticiones(request.getRepeticiones())
                .peso(request.getPeso())
                .build();
    }

    private void validarFecha(LocalDateTime fecha) {
        if (fecha.isAfter(LocalDateTime.now())) {
            throw new FechaFuturaException();
        }
    }
}
