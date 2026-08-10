package com.routinetracker.exception;

public class DemasiadosIntentosException extends RuntimeException {
    public DemasiadosIntentosException() {
        super("Demasiados intentos. Espera unos minutos antes de volver a intentarlo");
    }
}
