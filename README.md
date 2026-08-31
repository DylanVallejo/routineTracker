# Routine Tracker

Aplicación web para el seguimiento y control de rutinas de entrenamiento en gimnasio: registro de ejercicios (con catálogo predefinido y video demostrativo), sesiones de entrenamiento, historial, análisis por grupo muscular y seguimiento de progreso por ejercicio.

Trabajo de titulación de Dylan Vallejo (Tecnólogo Superior en Desarrollo de Software, Instituto Superior Tecnológico Rumiñahui).

## Capturas

<table>
<tr>
<td width="50%"><b>Login</b><br><img src="docs/screenshots/01-login.png" width="100%"></td>
<td width="50%"><b>Panel de inicio</b><br><img src="docs/screenshots/02-dashboard.png" width="100%"></td>
</tr>
<tr>
<td><b>Mis ejercicios</b><br><img src="docs/screenshots/03-ejercicios.png" width="100%"></td>
<td><b>Catálogo de ejercicios</b><br><img src="docs/screenshots/04-catalogo.png" width="100%"></td>
</tr>
<tr>
<td><b>Historial de sesiones</b><br><img src="docs/screenshots/05-sesiones.png" width="100%"></td>
<td><b>Detalle de sesión</b><br><img src="docs/screenshots/06-sesion-detalle.png" width="100%"></td>
</tr>
<tr>
<td><b>Análisis muscular</b><br><img src="docs/screenshots/07-analisis-muscular.png" width="100%"></td>
<td><b>Progreso por ejercicio</b><br><img src="docs/screenshots/08-progreso.png" width="100%"></td>
</tr>
</table>

<details>
<summary>Vista responsive (móvil)</summary>

<img src="docs/screenshots/09-mobile-dashboard.png" width="360">

</details>

## Cómo funciona

```mermaid
flowchart LR
    subgraph Cliente
        A[Navegador]
    end
    subgraph Frontend["Frontend · React + Vite · :5173"]
        B[SPA con React Router]
    end
    subgraph Backend["Backend · Spring Boot · :8080"]
        C[API REST]
        D[Spring Security + JWT]
    end
    E[(MySQL 8<br/>routine_tracker_db)]
    F[API de correo transaccional]

    A <--> B
    B <-- "HTTP/JSON + JWT" --> C
    C --> D
    D --> E
    C --> E
    C -- "verificación de cuenta /<br/>recuperación de contraseña" --> F
```

El frontend es una SPA en React que consume la API REST del backend por HTTP, autenticando cada request con un JWT emitido en el login. El backend valida y persiste todo contra MySQL, y envía correos reales (verificación de cuenta, recuperación de contraseña) vía la API HTTP de un proveedor de correo transaccional.

### Flujo de uso

```mermaid
flowchart TD
    Reg[Registro] --> Verif[Verificación de correo]
    Verif --> Login[Inicio de sesión]
    Login --> Cat[Catálogo de ejercicios<br/>predefinidos con video]
    Login --> Ej[Mis ejercicios]
    Cat -- "agregar a mi catálogo" --> Ej
    Ej --> Ses[Registrar sesión<br/>de entrenamiento]
    Ses --> Hist[Historial de sesiones]
    Ses --> An[Análisis por<br/>grupo muscular]
    Ses --> Prog[Progreso por<br/>ejercicio]
```

## Funcionalidades

- **Autenticación** — registro, login con JWT, verificación de cuenta y recuperación de contraseña por correo (enlace con token de un solo uso).
- **Ejercicios** — CRUD propio por usuario, con video demostrativo de YouTube embebido; catálogo predefinido de 18 ejercicios agrupados por grupo muscular para agregar al listado propio.
- **Sesiones de entrenamiento** — registro de series/repeticiones/peso por ejercicio, con rangos de referencia (hipertrofia/resistencia) y validación de fecha.
- **Historial** — listado filtrable por rango de fechas, con vista de detalle por sesión.
- **Análisis muscular** — frecuencia de entrenamiento por grupo muscular y volumen semanal (sets) contra referencias MEV/MAV/MRV, filtrable por período y grupo.
- **Progreso** — evolución de peso/repeticiones por ejercicio a lo largo del tiempo, con máximos y mínimos destacados.

## Lógica de negocio y cálculos

Detalle de cómo se calculan las métricas y qué reglas aplica el backend, más allá de lo que se ve en pantalla.

### Frecuencia por grupo muscular (Análisis)

Cuenta **sesiones distintas** en las que aparece cada grupo muscular, no filas de ejercicio: una sesión con tres ejercicios de Pecho suma 1 a la frecuencia de Pecho, no 3. Esto evita que repetir ejercicios de un mismo grupo dentro de una sesión (algo normal en un entrenamiento real) infle artificialmente el conteo.

La app muestra, solo como **dato de referencia informativo** (nunca como veredicto de bien/mal), cuántas veces se recomienda entrenar cada grupo muscular como mínimo — **2 veces por semana**, un valor citado en la ciencia del entrenamiento de fuerza (ej. Schoenfeld et al. 2016), escalado al período elegido:

```
frecuencia_minima = floor(2 × dias_del_periodo / 7)
```

Para el período "Todo el historial" (sin un número de días fijo), los días se calculan desde la fecha de la primera sesión registrada hasta hoy — igual que ya lo hace el backend para el volumen semanal — y esa misma fecha se muestra como el rango del período, en vez del texto genérico "todo el historial".

Las barras se colorean en rojo si el grupo no alcanza esa referencia mínima, y en verde si la alcanza — igual que en Volumen, es una comparación contra un umbral absoluto, no contra el mínimo relativo de los demás grupos. El texto destacado lista además qué grupos no llegan (o confirma que todos llegan). Vale aclarar que no alcanzar esta referencia no es necesariamente un error: un split por grupo muscular entrena cada uno 1 vez por semana de forma intencional, así que el color es una señal de referencia, no un veredicto definitivo sobre la rutina elegida.

### Volumen semanal (sets) y zonas MEV/MAV/MRV

```
sets_por_semana = series_totales_del_grupo_en_el_periodo / semanas_del_periodo
semanas_del_periodo = max(dias_del_periodo / 7, 1)
```

El resultado se clasifica en 5 zonas de referencia (basadas en la ciencia del entrenamiento de fuerza, no personalizadas):

| Zona | Rango (sets/semana) | Color de barra |
|---|---|---|
| Insuficiente | < 6 (MV) | Rojo |
| Mantenimiento | 6 – 10 (MV–MEV) | Amarillo |
| Óptimo | 10 – 20 (MEV–MAV) | Verde |
| Cerca del límite | 20 – 25 (MAV–MRV) | Amarillo |
| Riesgo de sobreentrenamiento | > 25 (MRV) | Rojo |

Cada barra del gráfico toma el color de la zona en la que cae su valor (no un color fijo), coherente con las bandas de fondo. El filtro de fechas de esta sección tiene sus propios presets (7/30/90 días/Todo) y una opción "Personalizado" con Desde/Hasta, **independiente** del filtro de la gráfica de frecuencia de arriba — cambiar uno no afecta al otro.

**Navegación por semana:** los botones "Semana anterior/siguiente" se mueven por **semanas calendario** (lunes a domingo), no por el ancho del período que estuviera activo antes. Cada click recalcula el lunes de la semana correspondiente y la posiciona como rango personalizado; la semana que contiene hoy se corta en el día actual (no se extiende al domingo, que sería futuro), y "Semana siguiente" se deshabilita apenas se llega a esa semana en curso. Todo el cálculo de fechas usa componentes de fecha **local** del navegador (no `toISOString()`, que convierte a UTC) para evitar que el corte de "hoy" quede corrido un día según la zona horaria.

### Progreso por ejercicio

Para el ejercicio y la métrica elegidos (peso o repeticiones), se listan los puntos en el rango de fechas ordenados cronológicamente y se destacan el máximo (verde) y el mínimo (rojo). Cuando la métrica es repeticiones, se dibujan dos bandas de referencia sobre el gráfico: hipertrofia (6-12 reps) y resistencia (13-20 reps).

### Rangos válidos de series y repeticiones

Al registrar una sesión, el backend valida `series` entre 1 y 6, y `repeticiones` entre 1 y 20 — la unión de los rangos habituales de hipertrofia (3-5 series × 6-12 reps) y resistencia (2-4 series × 13-20 reps). No se valida un rango específico según el ejercicio, solo el rango combinado.

### Sugerencia de entrenamiento (panel de inicio)

El dashboard reutiliza el mismo cálculo de frecuencia de los últimos 30 días para sugerir qué grupo muscular entrenar: si no todos los grupos tienen la misma frecuencia, sugiere el de menor frecuencia. Si todos están parejos, no muestra ninguna sugerencia.

### Reglas de integridad de datos

- **Ejercicios por usuario**: cada ejercicio pertenece a quien lo creó (o lo agregó desde el catálogo); nadie ve ni puede referenciar ejercicios de otra cuenta. El nombre debe ser único por usuario, no globalmente.
- **Ejercicio en uso**: no se puede eliminar un ejercicio que esté asociado a una o más sesiones (409) — hay que editar o borrar esas sesiones primero.
- **Fecha de sesión**: no puede ser futura.

### Verificación de cuenta y recuperación de contraseña

- Token aleatorio de 32 bytes (`SecureRandom`), de un solo uso. Verificación de cuenta expira en 24 horas; recuperación de contraseña en 30 minutos.
- Límite de reenvío: 60 segundos de espera entre solicitudes y máximo 3 por ventana de 15 minutos, para evitar abuso.
- La recuperación de contraseña siempre responde el mismo mensaje genérico exista o no la cuenta (anti-enumeración de correos).
- Si el registro se reintenta con un correo que ya existe pero no está verificado, se reenvía el correo de verificación en vez de bloquear con error — así una cuenta que quedó a medio verificar (por ejemplo si el correo nunca llegó) se puede recuperar sin soporte manual.

## Stack

- **Backend**: Java 17, Spring Boot 3.3, Spring Security + JWT, Spring Data JPA
- **Frontend**: React 18, Vite, React Router, Axios, Chart.js
- **Base de datos**: MySQL 8

## Estructura

```
backend/    API REST (Spring Boot)
frontend/   Interfaz de usuario (React)
docs/       Capturas y material de referencia
```

## Requisitos previos

- Java 17+ y Maven
- Node.js 18+ y npm
- MySQL 8 corriendo localmente (el esquema `routine_tracker_db` se crea automáticamente)

## Cómo levantar el proyecto

### Backend

```bash
cd backend
mvn spring-boot:run
```

Corre en `http://localhost:8080`. Las credenciales de la base de datos se configuran con las variables de entorno `DB_USERNAME` y `DB_PASSWORD` (por defecto `root`/`root`, ver `src/main/resources/application.properties`).

Para envío real de correo (verificación/recuperación), configurar `MAIL_ENABLED=true` y `BREVO_API_KEY` (API key de [Brevo](https://www.brevo.com), plan gratuito) como variables de entorno, o en un `application-local.properties` local (no versionado). Sin esto, el envío queda en modo desarrollo: el enlace se escribe en el log en vez de enviarse.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Corre en `http://localhost:5173`. La URL de la API se configura en `frontend/.env` (`VITE_API_URL`), ver `frontend/.env.example`.

## Despliegue

```mermaid
flowchart LR
    U[Usuario] --> V["Frontend · Vercel"]
    V -- "HTTP/JSON + JWT" --> R["Backend · Render<br/>(Docker)"]
    R --> M[("MySQL · Clever Cloud")]
    R -- "verificación / recuperación (API HTTP)" --> G[Brevo]
```

- **Frontend**: desplegado en **Vercel** (build de Vite), apuntando a la API mediante la variable `VITE_API_URL`.
- **Backend**: desplegado en **Render** como Web Service a partir de un `Dockerfile` (`backend/Dockerfile`) — Render no tiene runtime nativo para Java/Maven, por eso se empaqueta en una imagen Docker de dos etapas (build con Maven, ejecución con un JRE liviano). El puerto lo asigna la plataforma en runtime a través de la variable `PORT` (`server.port=${PORT:8080}`), no queda fijo en `8080` como en local.
- **Base de datos**: MySQL gestionada en **Clever Cloud**. El esquema se crea solo (`ddl-auto=update`) contra la base vacía en el primer arranque, incluyendo el catálogo de ejercicios por defecto.

El backend recibe su configuración de entorno íntegramente por variables (nunca hardcodeada), lo que permite que el mismo código corra igual en local (con los valores por defecto de `application.properties`, todos apuntando a `localhost`) y en producción:

| Variable | Uso |
|---|---|
| `DB_URL` | Cadena JDBC completa hacia la MySQL de Clever Cloud |
| `DB_USERNAME` / `DB_PASSWORD` | Credenciales de esa base |
| `JWT_SECRET` | Clave de firma de los tokens JWT (distinta a la de ejemplo del repo) |
| `CORS_ALLOWED_ORIGIN` | Dominio del frontend permitido por CORS (Vercel) |
| `FRONTEND_URL` | Dominio del frontend usado para armar los enlaces de verificación/recuperación en los correos |
| `MAIL_ENABLED` / `BREVO_API_KEY` / `MAIL_FROM` | Envío real de correo vía API HTTP de Brevo (Render bloquea los puertos SMTP salientes en su plan gratis) |
| `PORT` | Puerto HTTP, inyectado automáticamente por Render |

## Metodología

El desarrollo sigue Scrum, organizado en 6 Sprints (uno por Historia de Usuario), cada uno en su propia rama (`sprint-1-autenticacion`, `sprint-2-ejercicios`, etc.), más ramas adicionales para mejoras posteriores (rangos de entrenamiento, verificación por correo, catálogo de ejercicios, rediseño visual, entre otras).
