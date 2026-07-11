package com.routinetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ProgresoPuntoResponse {
    private LocalDateTime fecha;
    private BigDecimal peso;
    private Integer repeticiones;
    private Integer series;
}
