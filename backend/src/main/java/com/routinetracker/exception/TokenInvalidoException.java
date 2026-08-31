package com.routinetracker.exception;

public class TokenInvalidoException extends RuntimeException {
    public TokenInvalidoException() {
        super("El enlace no es válido o ya expiró");
    }
}
