package com.routinetracker.repository;

import com.routinetracker.entity.EjercicioDefault;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EjercicioDefaultRepository extends JpaRepository<EjercicioDefault, Long> {

    List<EjercicioDefault> findAllByOrderByGrupoMuscularAscNombreAsc();
}
