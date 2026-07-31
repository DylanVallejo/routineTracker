package com.routinetracker.controller;

import com.routinetracker.dto.AnalisisMuscularResponse;
import com.routinetracker.dto.AnalisisVolumenResponse;
import com.routinetracker.service.AnalisisService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class AnalisisController {

    private final AnalisisService analisisService;

    @GetMapping("/api/analisis/muscular")
    public ResponseEntity<List<AnalisisMuscularResponse>> analizarMuscular(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(analisisService.analizarPorGrupoMuscular(inicio, fin));
    }

    @GetMapping("/api/analisis/volumen")
    public ResponseEntity<List<AnalisisVolumenResponse>> analizarVolumen(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(analisisService.analizarVolumenPorGrupoMuscular(inicio, fin));
    }
}
