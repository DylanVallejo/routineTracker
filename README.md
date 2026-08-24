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
    F[Gmail SMTP]

    A <--> B
    B <-- "HTTP/JSON + JWT" --> C
    C --> D
    D --> E
    C --> E
    C -- "verificación de cuenta /<br/>recuperación de contraseña" --> F
```

El frontend es una SPA en React que consume la API REST del backend por HTTP, autenticando cada request con un JWT emitido en el login. El backend valida y persiste todo contra MySQL, y envía correos reales (verificación de cuenta, recuperación de contraseña) vía SMTP de Gmail.

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

## Stack

- **Backend**: Java 17, Spring Boot 3.3, Spring Security + JWT, Spring Data JPA, Spring Mail
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

Para envío real de correo (verificación/recuperación), configurar `MAIL_ENABLED=true`, `MAIL_USERNAME` y `MAIL_PASSWORD` (App Password de Gmail) como variables de entorno, o en un `application-local.properties` local (no versionado). Sin esto, el envío queda en modo desarrollo: el enlace se escribe en el log en vez de enviarse.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Corre en `http://localhost:5173`. La URL de la API se configura en `frontend/.env` (`VITE_API_URL`), ver `frontend/.env.example`.

## Metodología

El desarrollo sigue Scrum, organizado en 6 Sprints (uno por Historia de Usuario), cada uno en su propia rama (`sprint-1-autenticacion`, `sprint-2-ejercicios`, etc.), más ramas adicionales para mejoras posteriores (rangos de entrenamiento, verificación por correo, catálogo de ejercicios, rediseño visual, entre otras).
