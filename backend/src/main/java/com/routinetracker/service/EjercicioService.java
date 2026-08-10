package com.routinetracker.service;

import com.routinetracker.dto.EjercicioRequest;
import com.routinetracker.dto.EjercicioResponse;
import com.routinetracker.entity.Ejercicio;
import com.routinetracker.entity.Usuario;
import com.routinetracker.exception.EjercicioDuplicadoException;
import com.routinetracker.exception.EjercicioEnUsoException;
import com.routinetracker.exception.EjercicioNoEncontradoException;
import com.routinetracker.repository.EjercicioRepository;
import com.routinetracker.repository.SesionEjercicioRepository;
import com.routinetracker.security.AuthenticatedUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EjercicioService {

    private final EjercicioRepository ejercicioRepository;
    private final SesionEjercicioRepository sesionEjercicioRepository;
    private final AuthenticatedUserProvider authenticatedUserProvider;

    @Transactional
    public EjercicioResponse crear(EjercicioRequest request) {
        Usuario usuario = authenticatedUserProvider.getUsuarioActual();

        if (ejercicioRepository.existsByNombreIgnoreCaseAndUsuarioId(request.getNombre(), usuario.getId())) {
            throw new EjercicioDuplicadoException(request.getNombre());
        }

        Ejercicio ejercicio = Ejercicio.builder()
                .usuario(usuario)
                .nombre(request.getNombre())
                .grupoMuscular(request.getGrupoMuscular())
                .descripcion(request.getDescripcion())
                .build();

        return EjercicioResponse.from(ejercicioRepository.save(ejercicio));
    }

    @Transactional
    public EjercicioResponse actualizar(Long id, EjercicioRequest request) {
        Usuario usuario = authenticatedUserProvider.getUsuarioActual();
        Ejercicio ejercicio = ejercicioRepository.findByIdAndUsuarioId(id, usuario.getId())
                .orElseThrow(() -> new EjercicioNoEncontradoException(id));

        if (ejercicioRepository.existsByNombreIgnoreCaseAndIdNotAndUsuarioId(request.getNombre(), id, usuario.getId())) {
            throw new EjercicioDuplicadoException(request.getNombre());
        }

        ejercicio.setNombre(request.getNombre());
        ejercicio.setGrupoMuscular(request.getGrupoMuscular());
        ejercicio.setDescripcion(request.getDescripcion());

        return EjercicioResponse.from(ejercicioRepository.save(ejercicio));
    }

    public Page<EjercicioResponse> listar(Pageable pageable) {
        Usuario usuario = authenticatedUserProvider.getUsuarioActual();
        return ejercicioRepository.findByUsuarioId(usuario.getId(), pageable).map(EjercicioResponse::from);
    }

    public EjercicioResponse obtener(Long id) {
        Usuario usuario = authenticatedUserProvider.getUsuarioActual();
        Ejercicio ejercicio = ejercicioRepository.findByIdAndUsuarioId(id, usuario.getId())
                .orElseThrow(() -> new EjercicioNoEncontradoException(id));
        return EjercicioResponse.from(ejercicio);
    }

    @Transactional
    public void eliminar(Long id) {
        Usuario usuario = authenticatedUserProvider.getUsuarioActual();
        Ejercicio ejercicio = ejercicioRepository.findByIdAndUsuarioId(id, usuario.getId())
                .orElseThrow(() -> new EjercicioNoEncontradoException(id));

        if (sesionEjercicioRepository.existsByEjercicioId(id)) {
            throw new EjercicioEnUsoException(id);
        }
        ejercicioRepository.delete(ejercicio);
    }
}
