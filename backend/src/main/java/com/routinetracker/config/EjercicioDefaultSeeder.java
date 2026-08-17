package com.routinetracker.config;

import com.routinetracker.entity.EjercicioDefault;
import com.routinetracker.entity.GrupoMuscular;
import com.routinetracker.repository.EjercicioDefaultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class EjercicioDefaultSeeder implements ApplicationRunner {

    private final EjercicioDefaultRepository ejercicioDefaultRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (ejercicioDefaultRepository.count() > 0) {
            return;
        }

        ejercicioDefaultRepository.saveAll(List.of(
                EjercicioDefault.builder()
                        .nombre("Press de banca con barra")
                        .grupoMuscular(GrupoMuscular.PECHO)
                        .descripcion("Ejercicio compuesto basico para pecho, con barra en banco plano.")
                        .videoUrl("https://www.youtube.com/watch?v=uEtiwYaT3d0")
                        .build(),
                EjercicioDefault.builder()
                        .nombre("Press inclinado con mancuernas")
                        .grupoMuscular(GrupoMuscular.PECHO)
                        .descripcion("Trabaja la parte superior del pecho en banco inclinado.")
                        .videoUrl("https://www.youtube.com/watch?v=sL6xN9EVDfE")
                        .build(),
                EjercicioDefault.builder()
                        .nombre("Dominadas")
                        .grupoMuscular(GrupoMuscular.ESPALDA)
                        .descripcion("Ejercicio de peso corporal para espalda ancha y biceps.")
                        .videoUrl("https://www.youtube.com/watch?v=1s6Bwx6GchI")
                        .build(),
                EjercicioDefault.builder()
                        .nombre("Remo con barra")
                        .grupoMuscular(GrupoMuscular.ESPALDA)
                        .descripcion("Ejercicio compuesto para espalda media, inclinado hacia adelante.")
                        .videoUrl("https://www.youtube.com/watch?v=OXH-ecu-Obw")
                        .build(),
                EjercicioDefault.builder()
                        .nombre("Press militar con barra")
                        .grupoMuscular(GrupoMuscular.HOMBROS)
                        .descripcion("Press vertical de pie o sentado para deltoides.")
                        .videoUrl("https://www.youtube.com/watch?v=OHxSwnkSxB8")
                        .build(),
                EjercicioDefault.builder()
                        .nombre("Elevaciones laterales con mancuernas")
                        .grupoMuscular(GrupoMuscular.HOMBROS)
                        .descripcion("Aislamiento para deltoides medio.")
                        .videoUrl("https://www.youtube.com/watch?v=V3LaKO8iZUE")
                        .build(),
                EjercicioDefault.builder()
                        .nombre("Curl de biceps con barra")
                        .grupoMuscular(GrupoMuscular.BICEPS)
                        .descripcion("Ejercicio clasico de aislamiento para biceps.")
                        .videoUrl("https://www.youtube.com/watch?v=SLkmE9hBTLc")
                        .build(),
                EjercicioDefault.builder()
                        .nombre("Curl martillo con mancuernas")
                        .grupoMuscular(GrupoMuscular.BICEPS)
                        .descripcion("Agarre neutro, trabaja biceps y antebrazo.")
                        .videoUrl("https://www.youtube.com/watch?v=de4AdSz4gcU")
                        .build(),
                EjercicioDefault.builder()
                        .nombre("Press frances")
                        .grupoMuscular(GrupoMuscular.TRICEPS)
                        .descripcion("Extension de triceps con barra o mancuerna, acostado o sentado.")
                        .videoUrl("https://www.youtube.com/watch?v=36V5Y6Bq7_8")
                        .build(),
                EjercicioDefault.builder()
                        .nombre("Fondos en paralelas")
                        .grupoMuscular(GrupoMuscular.TRICEPS)
                        .descripcion("Ejercicio de peso corporal para triceps y pecho.")
                        .videoUrl("https://www.youtube.com/watch?v=1Vm1ATIi0AE")
                        .build(),
                EjercicioDefault.builder()
                        .nombre("Sentadilla con barra")
                        .grupoMuscular(GrupoMuscular.PIERNAS)
                        .descripcion("Ejercicio compuesto fundamental para piernas.")
                        .videoUrl("https://www.youtube.com/watch?v=BWtKHMyU8_I")
                        .build(),
                EjercicioDefault.builder()
                        .nombre("Prensa de piernas")
                        .grupoMuscular(GrupoMuscular.PIERNAS)
                        .descripcion("Ejercicio en maquina para cuadriceps y gluteos.")
                        .videoUrl("https://www.youtube.com/watch?v=T-koHmW1HSs")
                        .build(),
                EjercicioDefault.builder()
                        .nombre("Hip thrust")
                        .grupoMuscular(GrupoMuscular.GLUTEOS)
                        .descripcion("Ejercicio de activacion y fuerza para gluteos, con barra sobre la cadera.")
                        .videoUrl("https://www.youtube.com/watch?v=3aTb9Megbuo")
                        .build(),
                EjercicioDefault.builder()
                        .nombre("Peso muerto rumano")
                        .grupoMuscular(GrupoMuscular.GLUTEOS)
                        .descripcion("Trabaja gluteos e isquiotibiales con enfasis en la bisagra de cadera.")
                        .videoUrl("https://www.youtube.com/watch?v=NIng2JWF1Rs")
                        .build(),
                EjercicioDefault.builder()
                        .nombre("Plancha abdominal")
                        .grupoMuscular(GrupoMuscular.ABDOMEN)
                        .descripcion("Ejercicio isometrico para core, mantiene el cuerpo en linea recta.")
                        .videoUrl("https://www.youtube.com/watch?v=nmX0DysvqcQ")
                        .build(),
                EjercicioDefault.builder()
                        .nombre("Crunch abdominal")
                        .grupoMuscular(GrupoMuscular.ABDOMEN)
                        .descripcion("Ejercicio clasico de flexion de tronco para recto abdominal.")
                        .videoUrl("https://www.youtube.com/watch?v=hl9Yu7UZqHU")
                        .build(),
                EjercicioDefault.builder()
                        .nombre("Elevacion de talones de pie")
                        .grupoMuscular(GrupoMuscular.PANTORRILLAS)
                        .descripcion("Ejercicio para gemelos, de pie con o sin peso adicional.")
                        .videoUrl("https://www.youtube.com/watch?v=_R3TOH-vnF8")
                        .build(),
                EjercicioDefault.builder()
                        .nombre("Curl de muneca con barra")
                        .grupoMuscular(GrupoMuscular.ANTEBRAZO)
                        .descripcion("Aislamiento para flexores del antebrazo.")
                        .videoUrl("https://www.youtube.com/watch?v=s5lhlt5FeP4")
                        .build()
        ));
    }
}
