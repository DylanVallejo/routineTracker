package com.routinetracker.controller;

import com.routinetracker.dto.SesionRequest;
import com.routinetracker.dto.SesionResponse;
import com.routinetracker.service.SesionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sesiones")
@RequiredArgsConstructor
public class SesionController {

    private final SesionService sesionService;

    @PostMapping
    public ResponseEntity<SesionResponse> crear(@Valid @RequestBody SesionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sesionService.crear(request));
    }

    @GetMapping
    public ResponseEntity<List<SesionResponse>> listar() {
        return ResponseEntity.ok(sesionService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SesionResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(sesionService.obtener(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SesionResponse> actualizar(@PathVariable Long id,
                                                       @Valid @RequestBody SesionRequest request) {
        return ResponseEntity.ok(sesionService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        sesionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
