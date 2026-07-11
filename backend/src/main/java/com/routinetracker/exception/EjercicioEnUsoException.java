package com.routinetracker.exception;

public class EjercicioEnUsoException extends RuntimeException {
    public EjercicioEnUsoException(Long id) {
        super("El ejercicio con id " + id + " esta asociado a una o mas sesiones y no puede eliminarse");
    }
}
