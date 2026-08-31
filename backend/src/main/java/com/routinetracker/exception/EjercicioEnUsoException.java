package com.routinetracker.exception;

public class EjercicioEnUsoException extends RuntimeException {
    public EjercicioEnUsoException(Long id) {
        super("El ejercicio con id " + id + " está asociado a una o más sesiones y no puede eliminarse");
    }
}
