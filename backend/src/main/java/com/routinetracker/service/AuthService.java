package com.routinetracker.service;

import com.routinetracker.dto.AuthResponse;
import com.routinetracker.dto.LoginRequest;
import com.routinetracker.dto.RegisterRequest;
import com.routinetracker.entity.Usuario;
import com.routinetracker.exception.CredencialesInvalidasException;
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

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByCorreo(request.getCorreo())) {
            throw new EmailYaRegistradoException(request.getCorreo());
        }

        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .correo(request.getCorreo())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        usuarioRepository.save(usuario);

        String token = jwtService.generateToken(new User(usuario.getCorreo(), usuario.getPassword(), java.util.Collections.emptyList()));
        return new AuthResponse(token, usuario.getNombre(), usuario.getCorreo());
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

        String token = jwtService.generateToken(new User(usuario.getCorreo(), usuario.getPassword(), java.util.Collections.emptyList()));
        return new AuthResponse(token, usuario.getNombre(), usuario.getCorreo());
    }
}
