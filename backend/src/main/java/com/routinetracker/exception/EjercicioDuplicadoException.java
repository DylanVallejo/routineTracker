package com.routinetracker.exception;

public class EjercicioDuplicadoException extends RuntimeException {
    public EjercicioDuplicadoException(String nombre) {
        super("Ya existe un ejercicio con el nombre: " + nombre);
    }
}
