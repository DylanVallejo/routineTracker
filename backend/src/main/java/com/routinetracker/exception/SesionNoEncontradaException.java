package com.routinetracker.exception;

public class SesionNoEncontradaException extends RuntimeException {
    public SesionNoEncontradaException(Long id) {
        super("No se encontro la sesion con id: " + id);
    }
}
