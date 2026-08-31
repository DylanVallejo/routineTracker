package com.routinetracker.service;

import com.routinetracker.entity.TipoToken;
import com.routinetracker.entity.TokenCuenta;
import com.routinetracker.entity.Usuario;
import com.routinetracker.exception.DemasiadosIntentosException;
import com.routinetracker.exception.TokenInvalidoException;
import com.routinetracker.repository.TokenCuentaRepository;
import com.routinetracker.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CuentaService {

    private final UsuarioRepository usuarioRepository;
    private final TokenCuentaRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    private static final SecureRandom RANDOM = new SecureRandom();

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${app.token.verificacion-horas:24}")
    private long verificacionHoras;

    @Value("${app.token.recuperacion-minutos:30}")
    private long recuperacionMinutos;

    @Value("${app.token.cooldown-segundos:60}")
    private long cooldownSegundos;

    @Value("${app.token.max-por-ventana:3}")
    private long maxPorVentana;

    @Value("${app.token.ventana-minutos:15}")
    private long ventanaMinutos;

    @Transactional
    public void enviarVerificacion(Usuario usuario) {
        String token = crearToken(usuario, TipoToken.VERIFICACION, verificacionHoras * 60);
        String enlace = frontendUrl + "/verificar?token=" + token;
        emailService.enviar(usuario.getCorreo(), "Confirma tu cuenta de Routine Tracker",
                "Hola " + usuario.getNombre() + ",\n\n"
                        + "Confirma tu cuenta ingresando al siguiente enlace:\n" + enlace + "\n\n"
                        + "El enlace vence en " + verificacionHoras + " horas.");
    }

    @Transactional
    public void reenviarVerificacion(String correo) {
        Optional<Usuario> encontrado = usuarioRepository.findByCorreo(correo);
        if (encontrado.isEmpty() || encontrado.get().isVerificado()) {
            return;
        }
        enviarVerificacion(encontrado.get());
    }

    @Transactional
    public void verificar(String token) {
        TokenCuenta registro = tokenRepository.findByTokenAndTipo(token, TipoToken.VERIFICACION)
                .orElseThrow(TokenInvalidoException::new);
        if (!registro.esValido()) {
            throw new TokenInvalidoException();
        }
        Usuario usuario = registro.getUsuario();
        usuario.setVerificado(true);
        usuarioRepository.save(usuario);
        registro.setUsado(true);
        tokenRepository.save(registro);
    }

    @Transactional
    public void iniciarRecuperacion(String correo) {
        Optional<Usuario> encontrado = usuarioRepository.findByCorreo(correo);
        if (encontrado.isEmpty() || !encontrado.get().isVerificado()) {
            return;
        }
        Usuario usuario = encontrado.get();
        String token = crearToken(usuario, TipoToken.RECUPERACION, recuperacionMinutos);
        String enlace = frontendUrl + "/restablecer?token=" + token;
        emailService.enviar(usuario.getCorreo(), "Restablece tu contraseña de Routine Tracker",
                "Hola " + usuario.getNombre() + ",\n\n"
                        + "Para elegir una nueva contraseña ingresa al siguiente enlace:\n" + enlace + "\n\n"
                        + "El enlace vence en " + recuperacionMinutos + " minutos. Si no lo solicitaste, ignora este correo.");
    }

    @Transactional
    public void restablecerPassword(String token, String nuevaPassword) {
        TokenCuenta registro = tokenRepository.findByTokenAndTipo(token, TipoToken.RECUPERACION)
                .orElseThrow(TokenInvalidoException::new);
        if (!registro.esValido()) {
            throw new TokenInvalidoException();
        }
        Usuario usuario = registro.getUsuario();
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuarioRepository.save(usuario);
        registro.setUsado(true);
        tokenRepository.save(registro);
    }

    private String crearToken(Usuario usuario, TipoToken tipo, long expiracionMinutos) {
        aplicarLimite(usuario, tipo);
        tokenRepository.invalidarPendientes(usuario, tipo);

        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        String valor = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        LocalDateTime ahora = LocalDateTime.now();
        TokenCuenta token = TokenCuenta.builder()
                .token(valor)
                .tipo(tipo)
                .usuario(usuario)
                .fechaCreacion(ahora)
                .fechaExpiracion(ahora.plusMinutes(expiracionMinutos))
                .usado(false)
                .build();
        tokenRepository.save(token);
        return valor;
    }

    private void aplicarLimite(Usuario usuario, TipoToken tipo) {
        LocalDateTime ahora = LocalDateTime.now();
        tokenRepository.findFirstByUsuarioAndTipoOrderByFechaCreacionDesc(usuario, tipo)
                .ifPresent(ultimo -> {
                    if (ultimo.getFechaCreacion().isAfter(ahora.minusSeconds(cooldownSegundos))) {
                        throw new DemasiadosIntentosException();
                    }
                });
        long recientes = tokenRepository.countByUsuarioAndTipoAndFechaCreacionAfter(
                usuario, tipo, ahora.minusMinutes(ventanaMinutos));
        if (recientes >= maxPorVentana) {
            throw new DemasiadosIntentosException();
        }
    }
}
