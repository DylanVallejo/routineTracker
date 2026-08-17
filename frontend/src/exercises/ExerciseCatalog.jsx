import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { agregarEjercicioDesdeCatalogo, listarCatalogoEjercicios } from '../api/ejercicioService'
import { etiquetaGrupoMuscular } from '../constants/gruposMusculares'
import VideoPlayer from '../components/VideoPlayer'

export default function ExerciseCatalog() {
  const [catalogo, setCatalogo] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [agregando, setAgregando] = useState(null)
  const [agregados, setAgregados] = useState(new Set())

  useEffect(() => {
    listarCatalogoEjercicios()
      .then(setCatalogo)
      .catch(() => setError('No se pudo cargar el catalogo de ejercicios'))
      .finally(() => setCargando(false))
  }, [])

  async function handleAgregar(item) {
    setMensaje('')
    setError('')
    setAgregando(item.id)
    try {
      await agregarEjercicioDesdeCatalogo(item.id)
      setAgregados((prev) => new Set(prev).add(item.id))
      setMensaje(`"${item.nombre}" se agrego a tus ejercicios`)
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo agregar el ejercicio')
    } finally {
      setAgregando(null)
    }
  }

  const grupos = catalogo.reduce((acc, item) => {
    const lista = acc.get(item.grupoMuscular) || []
    lista.push(item)
    acc.set(item.grupoMuscular, lista)
    return acc
  }, new Map())

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Catalogo de ejercicios</h1>
        <Link className="btn-secondary" to="/ejercicios">
          Volver a mis ejercicios
        </Link>
      </div>

      <p className="catalogo-intro">
        Ejercicios predefinidos por grupo muscular, con video demostrativo. Agrega los que quieras a tu propio
        listado, o crea uno personalizado desde cero.
      </p>

      {error && <p className="auth-error">{error}</p>}
      {mensaje && <p className="auth-info">{mensaje}</p>}

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        Array.from(grupos.entries()).map(([grupo, items]) => (
          <section key={grupo} className="catalogo-grupo">
            <h2>{etiquetaGrupoMuscular(grupo)}</h2>
            <div className="catalogo-grid">
              {items.map((item) => (
                <article key={item.id} className="catalogo-card">
                  <VideoPlayer url={item.videoUrl} titulo={item.nombre} />
                  <h3>{item.nombre}</h3>
                  {item.descripcion && <p className="catalogo-card-descripcion">{item.descripcion}</p>}
                  <button
                    type="button"
                    className="btn-primary"
                    disabled={agregando === item.id || agregados.has(item.id)}
                    onClick={() => handleAgregar(item)}
                  >
                    {agregados.has(item.id)
                      ? 'Agregado'
                      : agregando === item.id
                        ? 'Agregando...'
                        : 'Agregar a mis ejercicios'}
                  </button>
                </article>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  )
}
