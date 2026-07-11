package com.routinetracker.exception;

public class EjercicioNoEncontradoException extends RuntimeException {
    public EjercicioNoEncontradoException(Long id) {
        super("No se encontro el ejercicio con id: " + id);
    }
}
