import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { eliminarEjercicio, listarEjercicios } from '../api/ejercicioService'
import { etiquetaGrupoMuscular } from '../constants/gruposMusculares'
import VideoPlayer from '../components/VideoPlayer'
import LoadingSpinner from '../components/LoadingSpinner'
import { IconEditar, IconEliminar } from '../components/icons'
import ConfirmDialog from '../components/ConfirmDialog'

export default function ExerciseList() {
  const [pagina, setPagina] = useState(0)
  const [datos, setDatos] = useState({ content: [], totalPages: 0 })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)
  const [pendienteEliminar, setPendienteEliminar] = useState(null)

  async function cargar() {
    setCargando(true)
    setError('')
    try {
      const resultado = await listarEjercicios({ page: pagina, size: 10 })
      setDatos(resultado)
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo cargar el listado de ejercicios')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina])

  async function confirmarEliminar() {
    const { id } = pendienteEliminar
    setPendienteEliminar(null)
    try {
      await eliminarEjercicio(id)
      cargar()
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo eliminar el ejercicio')
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Ejercicios</h1>
        <div className="page-header-acciones">
          <Link className="btn-secondary" to="/ejercicios/catalogo">
            Ver catálogo
          </Link>
          <Link className="btn-primary" to="/ejercicios/nuevo">
            + Nuevo ejercicio
          </Link>
        </div>
      </div>

      {error && <p className="auth-error">{error}</p>}

      {cargando ? (
        <LoadingSpinner contenedor={false} />
      ) : datos.content.length === 0 ? (
        <div className="dashboard-vacio">
          <p>Aún no tienes ejercicios registrados.</p>
          <p>Elige ejercicios predefinidos con video demostrativo desde el catálogo, o crea uno propio.</p>
          <Link className="btn-primary" to="/ejercicios/catalogo">
            Ver catálogo de ejercicios
          </Link>
        </div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Grupo muscular</th>
                <th>Descripción</th>
                <th>Video</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datos.content.map((ejercicio) => (
                <tr key={ejercicio.id}>
                  <td>{ejercicio.nombre}</td>
                  <td>{etiquetaGrupoMuscular(ejercicio.grupoMuscular)}</td>
                  <td>{ejercicio.descripcion}</td>
                  <td>
                    {ejercicio.videoUrl ? (
                      <VideoPlayer url={ejercicio.videoUrl} titulo={ejercicio.nombre} />
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="table-actions">
                    <Link to={`/ejercicios/${ejercicio.id}/editar`}>
                      <IconEditar /> Editar
                    </Link>
                    <button onClick={() => setPendienteEliminar({ id: ejercicio.id, nombre: ejercicio.nombre })}>
                      <IconEliminar /> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button disabled={pagina === 0} onClick={() => setPagina((p) => p - 1)}>
              Anterior
            </button>
            <span>
              Página {pagina + 1} de {Math.max(datos.totalPages, 1)}
            </span>
            <button
              disabled={pagina + 1 >= datos.totalPages}
              onClick={() => setPagina((p) => p + 1)}
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      <ConfirmDialog
        abierto={!!pendienteEliminar}
        mensaje={`¿Eliminar el ejercicio "${pendienteEliminar?.nombre}"?`}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setPendienteEliminar(null)}
      />
    </div>
  )
}
