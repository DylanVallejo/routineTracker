package com.routinetracker.exception;

public class SesionNoEncontradaException extends RuntimeException {
    public SesionNoEncontradaException(Long id) {
        super("No se encontró la sesión con id: " + id);
    }
}
