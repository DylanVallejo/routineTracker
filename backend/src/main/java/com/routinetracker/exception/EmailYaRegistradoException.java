package com.routinetracker.exception;

public class EmailYaRegistradoException extends RuntimeException {
    public EmailYaRegistradoException(String correo) {
        super("El correo ya esta registrado: " + correo);
    }
}
