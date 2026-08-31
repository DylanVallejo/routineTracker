package com.routinetracker.controller;

import com.routinetracker.dto.AuthResponse;
import com.routinetracker.dto.CorreoRequest;
import com.routinetracker.dto.LoginRequest;
import com.routinetracker.dto.MensajeResponse;
import com.routinetracker.dto.RegisterRequest;
import com.routinetracker.dto.RestablecerPasswordRequest;
import com.routinetracker.dto.TokenRequest;
import com.routinetracker.service.AuthService;
import com.routinetracker.service.CuentaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final String MENSAJE_RECUPERACION =
            "Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña";

    private final AuthService authService;
    private final CuentaService cuentaService;

    @PostMapping("/register")
    public ResponseEntity<MensajeResponse> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MensajeResponse("Registro exitoso. Revisa tu correo para confirmar tu cuenta"));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/verificar")
    public ResponseEntity<MensajeResponse> verificar(@Valid @RequestBody TokenRequest request) {
        cuentaService.verificar(request.getToken());
        return ResponseEntity.ok(new MensajeResponse("Cuenta confirmada. Ya puedes iniciar sesión"));
    }

    @PostMapping("/reenviar-verificacion")
    public ResponseEntity<MensajeResponse> reenviarVerificacion(@Valid @RequestBody CorreoRequest request) {
        cuentaService.reenviarVerificacion(request.getCorreo());
        return ResponseEntity.ok(new MensajeResponse(
                "Si el correo está registrado y sin confirmar, te enviamos un nuevo enlace"));
    }

    @PostMapping("/recuperar")
    public ResponseEntity<MensajeResponse> recuperar(@Valid @RequestBody CorreoRequest request) {
        cuentaService.iniciarRecuperacion(request.getCorreo());
        return ResponseEntity.ok(new MensajeResponse(MENSAJE_RECUPERACION));
    }

    @PostMapping("/restablecer")
    public ResponseEntity<MensajeResponse> restablecer(@Valid @RequestBody RestablecerPasswordRequest request) {
        cuentaService.restablecerPassword(request.getToken(), request.getPassword());
        return ResponseEntity.ok(new MensajeResponse("Contraseña actualizada. Ya puedes iniciar sesión"));
    }
}
