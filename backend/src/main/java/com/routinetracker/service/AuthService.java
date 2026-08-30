package com.routinetracker.service;

import com.routinetracker.dto.AuthResponse;
import com.routinetracker.dto.LoginRequest;
import com.routinetracker.dto.RegisterRequest;
import com.routinetracker.entity.Usuario;
import com.routinetracker.exception.CredencialesInvalidasException;
import com.routinetracker.exception.CuentaNoVerificadaException;
import com.routinetracker.exception.EmailYaRegistradoException;
import com.routinetracker.repository.UsuarioRepository;
import com.routinetracker.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CuentaService cuentaService;

    public void register(RegisterRequest request) {
        Optional<Usuario> existente = usuarioRepository.findByCorreo(request.getCorreo());
        if (existente.isPresent()) {
            if (existente.get().isVerificado()) {
                throw new EmailYaRegistradoException(request.getCorreo());
            }
            // Cuenta creada en un intento anterior que nunca llego a verificarse
            // (ej. el correo de confirmacion fallo o nunca se recibio): reintentar
            // el registro reenvia el correo en vez de dejar la cuenta sin salida.
            cuentaService.reenviarVerificacion(request.getCorreo());
            return;
        }

        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .correo(request.getCorreo())
                .password(passwordEncoder.encode(request.getPassword()))
                .verificado(false)
                .build();

        usuarioRepository.save(usuario);
        cuentaService.enviarVerificacion(usuario);
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getCorreo(), request.getPassword())
            );
        } catch (BadCredentialsException ex) {
            throw new CredencialesInvalidasException();
        }

        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo())
                .orElseThrow(CredencialesInvalidasException::new);

        if (!usuario.isVerificado()) {
            throw new CuentaNoVerificadaException();
        }

        String token = jwtService.generateToken(new User(usuario.getCorreo(), usuario.getPassword(), java.util.Collections.emptyList()));
        return new AuthResponse(token, usuario.getNombre(), usuario.getCorreo());
    }
}
