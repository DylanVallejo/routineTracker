package com.routinetracker.exception;

public class EmailYaRegistradoException extends RuntimeException {
    public EmailYaRegistradoException(String correo) {
        super("El correo ya está registrado: " + correo);
    }
}
