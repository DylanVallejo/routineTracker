import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { obtenerSesion } from '../api/sesionService'
import { etiquetaGrupoMuscular } from '../constants/gruposMusculares'

function formatearFecha(fechaIso) {
  const fecha = new Date(fechaIso)
  return fecha.toLocaleString('es-EC', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function SessionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [sesion, setSesion] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true
    obtenerSesion(id)
      .then((data) => {
        if (activo) setSesion(data)
      })
      .catch(() => {
        if (activo) setError('No se pudo cargar el detalle de la sesion')
      })
    return () => {
      activo = false
    }
  }, [id])

  if (error) {
    return (
      <div className="page-container">
        <p className="auth-error">{error}</p>
        <button onClick={() => navigate('/sesiones')}>Volver al historial</button>
      </div>
    )
  }

  if (!sesion) {
    return <p className="page-container">Cargando...</p>
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Detalle de la sesion</h1>
        <Link className="btn-primary" to={`/sesiones/${id}/editar`}>
          Editar
        </Link>
      </div>

      <p className="session-detail-fecha">{formatearFecha(sesion.fecha)}</p>
      {sesion.notas && <p className="session-detail-notas">{sesion.notas}</p>}

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
          {sesion.ejercicios.map((ejercicio) => (
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

      <Link to="/sesiones" className="volver-link">
        &larr; Volver al historial
      </Link>
    </div>
  )
}
