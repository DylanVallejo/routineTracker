package com.routinetracker.service;

import com.routinetracker.dto.EjercicioRequest;
import com.routinetracker.dto.EjercicioResponse;
import com.routinetracker.entity.Ejercicio;
import com.routinetracker.exception.EjercicioDuplicadoException;
import com.routinetracker.exception.EjercicioNoEncontradoException;
import com.routinetracker.repository.EjercicioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EjercicioService {

    private final EjercicioRepository ejercicioRepository;

    @Transactional
    public EjercicioResponse crear(EjercicioRequest request) {
        if (ejercicioRepository.existsByNombreIgnoreCase(request.getNombre())) {
            throw new EjercicioDuplicadoException(request.getNombre());
        }

        Ejercicio ejercicio = Ejercicio.builder()
                .nombre(request.getNombre())
                .grupoMuscular(request.getGrupoMuscular())
                .descripcion(request.getDescripcion())
                .build();

        return EjercicioResponse.from(ejercicioRepository.save(ejercicio));
    }

    @Transactional
    public EjercicioResponse actualizar(Long id, EjercicioRequest request) {
        Ejercicio ejercicio = ejercicioRepository.findById(id)
                .orElseThrow(() -> new EjercicioNoEncontradoException(id));

        if (ejercicioRepository.existsByNombreIgnoreCaseAndIdNot(request.getNombre(), id)) {
            throw new EjercicioDuplicadoException(request.getNombre());
        }

        ejercicio.setNombre(request.getNombre());
        ejercicio.setGrupoMuscular(request.getGrupoMuscular());
        ejercicio.setDescripcion(request.getDescripcion());

        return EjercicioResponse.from(ejercicioRepository.save(ejercicio));
    }

    public Page<EjercicioResponse> listar(Pageable pageable) {
        return ejercicioRepository.findAll(pageable).map(EjercicioResponse::from);
    }

    public EjercicioResponse obtener(Long id) {
        Ejercicio ejercicio = ejercicioRepository.findById(id)
                .orElseThrow(() -> new EjercicioNoEncontradoException(id));
        return EjercicioResponse.from(ejercicio);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!ejercicioRepository.existsById(id)) {
            throw new EjercicioNoEncontradoException(id);
        }
        ejercicioRepository.deleteById(id);
    }
}
