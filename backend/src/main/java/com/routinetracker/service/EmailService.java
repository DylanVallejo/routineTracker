package com.routinetracker.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${app.mail.enabled:false}")
    private boolean envioHabilitado;

    @Value("${app.mail.from:Routine Tracker <noreply@routinetracker>}")
    private String remitente;

    public void enviar(String destinatario, String asunto, String cuerpo) {
        if (!envioHabilitado) {
            log.info("[EMAIL modo-dev] Para: {} | Asunto: {}\n{}", destinatario, asunto, cuerpo);
            return;
        }
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setFrom(remitente);
        mensaje.setTo(destinatario);
        mensaje.setSubject(asunto);
        mensaje.setText(cuerpo);
        mailSender.send(mensaje);
        log.info("Correo enviado a {}", destinatario);
    }
}
