import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { crearEjercicio, actualizarEjercicio, obtenerEjercicio } from '../api/ejercicioService'
import { GRUPOS_MUSCULARES } from '../constants/gruposMusculares'
import LoadingSpinner from '../components/LoadingSpinner'

export default function ExerciseForm() {
  const { id } = useParams()
  const esEdicion = Boolean(id)
  const navigate = useNavigate()

  const [nombre, setNombre] = useState('')
  const [grupoMuscular, setGrupoMuscular] = useState(GRUPOS_MUSCULARES[0].value)
  const [descripcion, setDescripcion] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(esEdicion)

  useEffect(() => {
    if (!esEdicion) return
    let activo = true

    obtenerEjercicio(id)
      .then((data) => {
        if (!activo) return
        setNombre(data.nombre)
        setGrupoMuscular(data.grupoMuscular)
        setDescripcion(data.descripcion || '')
        setVideoUrl(data.videoUrl || '')
      })
      .catch(() => {
        if (activo) setError('No se pudo cargar el ejercicio')
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [id, esEdicion])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const datos = { nombre, grupoMuscular, descripcion, videoUrl }

    try {
      if (esEdicion) {
        await actualizarEjercicio(id, datos)
      } else {
        await crearEjercicio(datos)
      }
      navigate('/ejercicios')
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo guardar el ejercicio')
    }
  }

  if (cargando) return <LoadingSpinner />

  return (
    <div className="page-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>{esEdicion ? 'Editar ejercicio' : 'Nuevo ejercicio'}</h1>

        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <label htmlFor="grupoMuscular">Grupo muscular</label>
        <select
          id="grupoMuscular"
          value={grupoMuscular}
          onChange={(e) => setGrupoMuscular(e.target.value)}
        >
          {GRUPOS_MUSCULARES.map((grupo) => (
            <option key={grupo.value} value={grupo.value}>
              {grupo.label}
            </option>
          ))}
        </select>

        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
        />

        <label htmlFor="videoUrl">Video demostrativo (opcional)</label>
        <input
          id="videoUrl"
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit">{esEdicion ? 'Guardar cambios' : 'Crear ejercicio'}</button>
      </form>
    </div>
  )
}
