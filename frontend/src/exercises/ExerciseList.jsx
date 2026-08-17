import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { eliminarEjercicio, listarEjercicios } from '../api/ejercicioService'
import { etiquetaGrupoMuscular } from '../constants/gruposMusculares'
import VideoPlayer from '../components/VideoPlayer'

export default function ExerciseList() {
  const [pagina, setPagina] = useState(0)
  const [datos, setDatos] = useState({ content: [], totalPages: 0 })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)

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

  async function handleEliminar(id, nombre) {
    if (!window.confirm(`¿Eliminar el ejercicio "${nombre}"?`)) return
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
            Ver catalogo
          </Link>
          <Link className="btn-primary" to="/ejercicios/nuevo">
            + Nuevo ejercicio
          </Link>
        </div>
      </div>

      {error && <p className="auth-error">{error}</p>}

      {cargando ? (
        <p>Cargando...</p>
      ) : datos.content.length === 0 ? (
        <p>Aun no tienes ejercicios registrados.</p>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Grupo muscular</th>
                <th>Descripcion</th>
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
                    <Link to={`/ejercicios/${ejercicio.id}/editar`}>Editar</Link>
                    <button onClick={() => handleEliminar(ejercicio.id, ejercicio.nombre)}>
                      Eliminar
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
              Pagina {pagina + 1} de {Math.max(datos.totalPages, 1)}
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
    </div>
  )
}
