package com.routinetracker.exception;

public class CuentaNoVerificadaException extends RuntimeException {
    public CuentaNoVerificadaException() {
        super("Debes confirmar tu correo antes de iniciar sesión");
    }
}
