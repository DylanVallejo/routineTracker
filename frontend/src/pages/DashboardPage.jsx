import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { listarSesiones } from '../api/sesionService'
import { listarEjercicios } from '../api/ejercicioService'
import { etiquetaGrupoMuscular } from '../constants/gruposMusculares'

function formatearFechaLarga(fechaIso) {
  const fecha = new Date(fechaIso)
  return fecha.toLocaleDateString('es-EC', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function formatearFechaCorta(fechaIso) {
  const fecha = new Date(fechaIso)
  return fecha.toLocaleDateString('es-EC', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function diasDesde(fechaIso) {
  const fecha = new Date(fechaIso)
  const inicioFecha = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate())
  const inicioHoy = new Date()
  inicioHoy.setHours(0, 0, 0, 0)
  const dias = Math.round((inicioHoy - inicioFecha) / (1000 * 60 * 60 * 24))
  if (dias <= 0) return 'Hoy'
  if (dias === 1) return 'Ayer'
  return `Hace ${dias} dias`
}

export default function DashboardPage() {
  const { usuario } = useAuth()
  const [sesiones, setSesiones] = useState([])
  const [totalEjercicios, setTotalEjercicios] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true
    Promise.all([listarSesiones(), listarEjercicios({ page: 0, size: 1 })])
      .then(([sesionesData, ejerciciosData]) => {
        if (!activo) return
        setSesiones(sesionesData)
        setTotalEjercicios(ejerciciosData.totalElements)
      })
      .catch(() => {
        if (activo) setError('No se pudo cargar el resumen de tu actividad')
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [])

  const ultimaSesion = sesiones[0]
  const recientes = sesiones.slice(1, 5)

  return (
    <div className="page-container dashboard-page">
      <div className="page-header">
        <h1>Hola, {usuario?.nombre}</h1>
        <Link className="btn-primary" to="/sesiones/nueva">
          + Nueva sesion
        </Link>
      </div>

      {error && <p className="auth-error">{error}</p>}

      {cargando ? (
        <p>Cargando...</p>
      ) : sesiones.length === 0 ? (
        <div className="dashboard-vacio">
          <p>Aun no registras entrenamientos.</p>
          <p>
            Empieza por dar de alta tus <Link to="/ejercicios">ejercicios</Link> y luego{' '}
            <Link to="/sesiones/nueva">registra tu primera sesion</Link>.
          </p>
        </div>
      ) : (
        <>
          <div className="dashboard-stats">
            <div className="stat-card">
              <span className="stat-valor">{sesiones.length}</span>
              <span className="stat-etiqueta">Entrenamientos totales</span>
            </div>
            <div className="stat-card">
              <span className="stat-valor">{totalEjercicios ?? '-'}</span>
              <span className="stat-etiqueta">Ejercicios en tu catalogo</span>
            </div>
            <div className="stat-card">
              <span className="stat-valor">{diasDesde(ultimaSesion.fecha)}</span>
              <span className="stat-etiqueta">Ultimo entrenamiento</span>
            </div>
          </div>

          <section className="dashboard-seccion">
            <div className="page-header">
              <h2>Ultimo entrenamiento</h2>
              <Link to={`/sesiones/${ultimaSesion.id}`}>Ver detalle</Link>
            </div>
            <p className="session-detail-fecha">{formatearFechaLarga(ultimaSesion.fecha)}</p>
            {ultimaSesion.notas && <p className="session-detail-notas">{ultimaSesion.notas}</p>}
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ejercicio</th>
                  <th>Grupo muscular</th>
                  <th>Series</th>
                  <th>Repeticiones</th>
                  <th>Peso (kg)</th>
                </tr>
              </thead>
              <tbody>
                {ultimaSesion.ejercicios.map((ejercicio) => (
                  <tr key={ejercicio.id}>
                    <td>{ejercicio.nombreEjercicio}</td>
                    <td>{etiquetaGrupoMuscular(ejercicio.grupoMuscular)}</td>
                    <td>{ejercicio.series}</td>
                    <td>{ejercicio.repeticiones}</td>
                    <td>{ejercicio.peso}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {recientes.length > 0 && (
            <section className="dashboard-seccion">
              <div className="page-header">
                <h2>Entrenamientos recientes</h2>
                <Link to="/sesiones">Ver historial completo</Link>
              </div>
              <ul className="dashboard-recientes-lista">
                {recientes.map((sesion) => (
                  <li key={sesion.id}>
                    <Link to={`/sesiones/${sesion.id}`} className="dashboard-reciente-item">
                      <span className="dashboard-reciente-fecha">
                        {formatearFechaCorta(sesion.fecha)}
                      </span>
                      <span className="dashboard-reciente-ejercicios">
                        {sesion.ejercicios.map((e) => e.nombreEjercicio).join(', ')}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  )
}
