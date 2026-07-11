# Routine Tracker

Aplicación web para el seguimiento y control de rutinas de entrenamiento en gimnasio: registro de ejercicios, series y repeticiones, historial de entrenamientos y análisis de grupos musculares.

## Stack

- **Backend**: Java 17, Spring Boot 3.3, Spring Security + JWT, Spring Data JPA
- **Frontend**: React 18, Vite, React Router, Axios, Chart.js
- **Base de datos**: MySQL 8

## Estructura

```
backend/    API REST (Spring Boot)
frontend/   Interfaz de usuario (React)
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

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Corre en `http://localhost:5173`. La URL de la API se configura en `frontend/.env` (`VITE_API_URL`), ver `frontend/.env.example`.

## Metodología

El desarrollo sigue Scrum, organizado en 6 Sprints (uno por Historia de Usuario), cada uno en su propia rama (`sprint-1-autenticacion`, `sprint-2-ejercicios`, etc.).
