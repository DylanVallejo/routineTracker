package com.routinetracker.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

    private final RestClient restClient = RestClient.create();

    @Value("${app.mail.enabled:false}")
    private boolean envioHabilitado;

    @Value("${app.mail.from:Routine Tracker <noreply@routinetracker>}")
    private String remitente;

    @Value("${app.mail.brevo-api-key:}")
    private String brevoApiKey;

    public void enviar(String destinatario, String asunto, String cuerpo) {
        if (!envioHabilitado) {
            log.info("[EMAIL modo-dev] Para: {} | Asunto: {}\n{}", destinatario, asunto, cuerpo);
            return;
        }

        Map<String, Object> body = Map.of(
                "sender", Map.of("name", "Routine Tracker", "email", extraerCorreoRemitente()),
                "to", List.of(Map.of("email", destinatario)),
                "subject", asunto,
                "textContent", cuerpo
        );

        restClient.post()
                .uri(BREVO_API_URL)
                .header("api-key", brevoApiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .toBodilessEntity();

        log.info("Correo enviado a {} via Brevo", destinatario);
    }

    private String extraerCorreoRemitente() {
        int inicio = remitente.indexOf('<');
        int fin = remitente.indexOf('>');
        if (inicio >= 0 && fin > inicio) {
            return remitente.substring(inicio + 1, fin);
        }
        return remitente;
    }
}
