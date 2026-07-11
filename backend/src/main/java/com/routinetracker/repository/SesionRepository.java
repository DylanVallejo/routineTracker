package com.routinetracker.repository;

import com.routinetracker.entity.Sesion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface SesionRepository extends JpaRepository<Sesion, Long> {

    List<Sesion> findByUsuarioIdOrderByFechaDesc(Long usuarioId);

    List<Sesion> findByUsuarioIdAndFechaBetweenOrderByFechaDesc(
            Long usuarioId, LocalDateTime desde, LocalDateTime hasta);
}
