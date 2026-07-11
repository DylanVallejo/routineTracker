import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { eliminarSesion, listarSesiones } from '../api/sesionService'

function formatearFecha(fechaIso) {
  const fecha = new Date(fechaIso)
  return fecha.toLocaleString('es-EC', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function SessionList() {
  const [sesiones, setSesiones] = useState([])
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)

  async function cargar() {
    setCargando(true)
    setError('')
    try {
      const data = await listarSesiones()
      setSesiones(data)
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo cargar el listado de sesiones')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  async function handleEliminar(id) {
    if (!window.confirm('¿Eliminar esta sesion de entrenamiento?')) return
    try {
      await eliminarSesion(id)
      cargar()
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo eliminar la sesion')
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Sesiones de entrenamiento</h1>
        <Link className="btn-primary" to="/sesiones/nueva">
          + Nueva sesion
        </Link>
      </div>

      {error && <p className="auth-error">{error}</p>}

      {cargando ? (
        <p>Cargando...</p>
      ) : sesiones.length === 0 ? (
        <p>Aun no has registrado sesiones de entrenamiento.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Ejercicios</th>
              <th>Notas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sesiones.map((sesion) => (
              <tr key={sesion.id}>
                <td>{formatearFecha(sesion.fecha)}</td>
                <td>{sesion.ejercicios.map((e) => e.nombreEjercicio).join(', ')}</td>
                <td>{sesion.notas}</td>
                <td className="table-actions">
                  <Link to={`/sesiones/${sesion.id}/editar`}>Editar</Link>
                  <button onClick={() => handleEliminar(sesion.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
