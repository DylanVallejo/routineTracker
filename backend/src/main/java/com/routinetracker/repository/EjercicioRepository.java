package com.routinetracker.repository;

import com.routinetracker.entity.Ejercicio;
import com.routinetracker.entity.GrupoMuscular;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EjercicioRepository extends JpaRepository<Ejercicio, Long> {

    boolean existsByNombreIgnoreCaseAndUsuarioId(String nombre, Long usuarioId);

    boolean existsByNombreIgnoreCaseAndIdNotAndUsuarioId(String nombre, Long id, Long usuarioId);

    Page<Ejercicio> findByUsuarioId(Long usuarioId, Pageable pageable);

    Page<Ejercicio> findByUsuarioIdAndGrupoMuscular(Long usuarioId, GrupoMuscular grupoMuscular, Pageable pageable);

    Optional<Ejercicio> findByIdAndUsuarioId(Long id, Long usuarioId);
}
