package com.routinetracker.exception;

public class TokenInvalidoException extends RuntimeException {
    public TokenInvalidoException() {
        super("El enlace no es valido o ya expiro");
    }
}
