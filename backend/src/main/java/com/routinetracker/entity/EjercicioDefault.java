package com.routinetracker.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ejercicio_default")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EjercicioDefault {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(name = "grupo_muscular", nullable = false, length = 30)
    private GrupoMuscular grupoMuscular;

    @Column(length = 500)
    private String descripcion;

    @Column(name = "video_url", length = 500)
    private String videoUrl;
}
