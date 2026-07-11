package com.routinetracker.controller;

import com.routinetracker.dto.ProgresoPuntoResponse;
import com.routinetracker.service.ProgresoService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProgresoController {

    private final ProgresoService progresoService;

    @GetMapping("/api/progreso/{ejercicioId}")
    public ResponseEntity<List<ProgresoPuntoResponse>> obtenerProgreso(
            @PathVariable Long ejercicioId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(progresoService.obtenerProgreso(ejercicioId, inicio, fin));
    }
}
