package com.routinetracker.exception;

public class FechaFuturaException extends RuntimeException {
    public FechaFuturaException() {
        super("La fecha de la sesion no puede ser futura");
    }
}
