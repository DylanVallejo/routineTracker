import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { crearSesion, actualizarSesion, obtenerSesion } from '../api/sesionService'
import { listarEjercicios } from '../api/ejercicioService'

function fechaActualParaInput() {
  const ahora = new Date()
  ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset())
  return ahora.toISOString().slice(0, 16)
}

function filaVacia() {
  return { ejercicioId: '', series: '', repeticiones: '', peso: '' }
}

export default function SessionForm() {
  const { id } = useParams()
  const esEdicion = Boolean(id)
  const navigate = useNavigate()

  const [fecha, setFecha] = useState(fechaActualParaInput())
  const [notas, setNotas] = useState('')
  const [filas, setFilas] = useState([filaVacia()])
  const [ejerciciosDisponibles, setEjerciciosDisponibles] = useState([])
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let activo = true

    async function cargarDatosIniciales() {
      try {
        const ejercicios = await listarEjercicios({ page: 0, size: 100 })
        if (!activo) return
        setEjerciciosDisponibles(ejercicios.content)

        if (esEdicion) {
          const sesion = await obtenerSesion(id)
          if (!activo) return
          setFecha(sesion.fecha.slice(0, 16))
          setNotas(sesion.notas || '')
          setFilas(
            sesion.ejercicios.map((se) => ({
              ejercicioId: String(se.ejercicioId),
              series: String(se.series),
              repeticiones: String(se.repeticiones),
              peso: String(se.peso),
            }))
          )
        }
      } catch {
        if (activo) setError('No se pudieron cargar los datos de la sesion')
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargarDatosIniciales()
    return () => {
      activo = false
    }
  }, [id, esEdicion])

  function actualizarFila(indice, campo, valor) {
    setFilas((prev) =>
      prev.map((fila, i) => (i === indice ? { ...fila, [campo]: valor } : fila))
    )
  }

  function agregarFila() {
    setFilas((prev) => [...prev, filaVacia()])
  }

  function quitarFila(indice) {
    setFilas((prev) => prev.filter((_, i) => i !== indice))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const ejercicios = filas.map((f) => ({
      ejercicioId: Number(f.ejercicioId),
      series: Number(f.series),
      repeticiones: Number(f.repeticiones),
      peso: Number(f.peso),
    }))

    if (ejercicios.some((e) => !e.ejercicioId)) {
      setError('Selecciona un ejercicio en cada fila')
      return
    }

    const datos = { fecha, notas, ejercicios }

    try {
      if (esEdicion) {
        await actualizarSesion(id, datos)
      } else {
        await crearSesion(datos)
      }
      navigate('/sesiones')
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo guardar la sesion')
    }
  }

  if (cargando) return <p className="page-container">Cargando...</p>

  return (
    <div className="page-container">
      <form className="auth-form session-form" onSubmit={handleSubmit}>
        <h1>{esEdicion ? 'Editar sesion' : 'Nueva sesion'}</h1>

        <label htmlFor="fecha">Fecha y hora</label>
        <input
          id="fecha"
          type="datetime-local"
          value={fecha}
          max={fechaActualParaInput()}
          onChange={(e) => setFecha(e.target.value)}
          required
        />

        <label htmlFor="notas">Notas</label>
        <textarea id="notas" value={notas} onChange={(e) => setNotas(e.target.value)} rows={2} />

        <h2>Ejercicios</h2>
        {ejerciciosDisponibles.length === 0 ? (
          <p>
            No tienes ejercicios registrados. Crea uno primero en la seccion Ejercicios.
          </p>
        ) : (
          filas.map((fila, indice) => (
            <div className="session-row" key={indice}>
              <select
                value={fila.ejercicioId}
                onChange={(e) => actualizarFila(indice, 'ejercicioId', e.target.value)}
                required
              >
                <option value="">Selecciona un ejercicio</option>
                {ejerciciosDisponibles.map((ej) => (
                  <option key={ej.id} value={ej.id}>
                    {ej.nombre}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                placeholder="Series"
                value={fila.series}
                onChange={(e) => actualizarFila(indice, 'series', e.target.value)}
                required
              />
              <input
                type="number"
                min="1"
                placeholder="Repeticiones"
                value={fila.repeticiones}
                onChange={(e) => actualizarFila(indice, 'repeticiones', e.target.value)}
                required
              />
              <input
                type="number"
                min="0"
                step="0.5"
                placeholder="Peso (kg)"
                value={fila.peso}
                onChange={(e) => actualizarFila(indice, 'peso', e.target.value)}
                required
              />
              {filas.length > 1 && (
                <button type="button" onClick={() => quitarFila(indice)}>
                  Quitar
                </button>
              )}
            </div>
          ))
        )}

        <button type="button" onClick={agregarFila} className="btn-secondary">
          + Agregar ejercicio
        </button>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit">{esEdicion ? 'Guardar cambios' : 'Registrar sesion'}</button>
      </form>
    </div>
  )
}
