package com.routinetracker.controller;

import com.routinetracker.dto.EjercicioRequest;
import com.routinetracker.dto.EjercicioResponse;
import com.routinetracker.service.EjercicioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ejercicios")
@RequiredArgsConstructor
public class EjercicioController {

    private final EjercicioService ejercicioService;

    @PostMapping
    public ResponseEntity<EjercicioResponse> crear(@Valid @RequestBody EjercicioRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ejercicioService.crear(request));
    }

    @GetMapping
    public ResponseEntity<Page<EjercicioResponse>> listar(
            @PageableDefault(size = 10, sort = "nombre") Pageable pageable) {
        return ResponseEntity.ok(ejercicioService.listar(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EjercicioResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(ejercicioService.obtener(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EjercicioResponse> actualizar(@PathVariable Long id,
                                                         @Valid @RequestBody EjercicioRequest request) {
        return ResponseEntity.ok(ejercicioService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        ejercicioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
