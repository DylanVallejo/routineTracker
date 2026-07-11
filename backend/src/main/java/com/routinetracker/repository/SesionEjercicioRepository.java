package com.routinetracker.repository;

import com.routinetracker.entity.SesionEjercicio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SesionEjercicioRepository extends JpaRepository<SesionEjercicio, Long> {

    boolean existsByEjercicioId(Long ejercicioId);
}
