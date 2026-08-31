import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { eliminarSesion, listarSesiones } from '../api/sesionService'
import LoadingSpinner from '../components/LoadingSpinner'
import { IconVerDetalle, IconEditar, IconEliminar } from '../components/icons'
import ConfirmDialog from '../components/ConfirmDialog'

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
  const [inicio, setInicio] = useState('')
  const [fin, setFin] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)
  const [pendienteEliminar, setPendienteEliminar] = useState(null)

  async function cargar(filtro = {}) {
    setCargando(true)
    setError('')
    try {
      const data = await listarSesiones(filtro)
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

  function handleFiltrar(event) {
    event.preventDefault()
    cargar({ inicio: inicio || undefined, fin: fin || undefined })
  }

  function handleLimpiarFiltro() {
    setInicio('')
    setFin('')
    cargar()
  }

  async function confirmarEliminar() {
    const id = pendienteEliminar
    setPendienteEliminar(null)
    try {
      await eliminarSesion(id)
      cargar({ inicio: inicio || undefined, fin: fin || undefined })
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo eliminar la sesión')
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Historial de entrenamientos</h1>
        <Link className="btn-primary" to="/sesiones/nueva">
          + Nueva sesión
        </Link>
      </div>

      <form className="filter-bar" onSubmit={handleFiltrar}>
        <label htmlFor="inicio">Desde</label>
        <input
          id="inicio"
          type="date"
          value={inicio}
          onChange={(e) => setInicio(e.target.value)}
        />
        <label htmlFor="fin">Hasta</label>
        <input id="fin" type="date" value={fin} onChange={(e) => setFin(e.target.value)} />
        <button type="submit" className="btn-primary">
          Filtrar
        </button>
        {(inicio || fin) && (
          <button type="button" onClick={handleLimpiarFiltro}>
            Limpiar
          </button>
        )}
      </form>

      {error && <p className="auth-error">{error}</p>}

      {cargando ? (
        <LoadingSpinner contenedor={false} />
      ) : sesiones.length === 0 ? (
        <p>No hay sesiones registradas para el periodo seleccionado.</p>
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
                  <Link to={`/sesiones/${sesion.id}`}>
                    <IconVerDetalle /> Ver detalle
                  </Link>
                  <Link to={`/sesiones/${sesion.id}/editar`}>
                    <IconEditar /> Editar
                  </Link>
                  <button onClick={() => setPendienteEliminar(sesion.id)}>
                    <IconEliminar /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ConfirmDialog
        abierto={!!pendienteEliminar}
        mensaje="¿Eliminar esta sesión de entrenamiento?"
        onConfirmar={confirmarEliminar}
        onCancelar={() => setPendienteEliminar(null)}
      />
    </div>
  )
}
