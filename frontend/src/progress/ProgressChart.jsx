import { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { listarEjercicios } from '../api/ejercicioService'
import { obtenerProgreso } from '../api/progresoService'
import { bandasPlugin } from '../charts/bandasPlugin'
import LoadingSpinner from '../components/LoadingSpinner'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const ACENTO = '#d33b36'
const EXITO = '#409d48'
const ALERTA = '#c53637'

const ZONAS_REPETICIONES = [
  { nombre: 'Hipertrofia (6-12 reps)', min: 6, max: 12, color: 'rgba(217, 165, 20, 0.14)', swatch: '#d9a514' },
  { nombre: 'Resistencia (13-20 reps)', min: 13, max: 20, color: 'rgba(22, 132, 133, 0.14)', swatch: '#168485' },
]

function formatearFechaCorta(fechaIso) {
  const fecha = new Date(fechaIso)
  return fecha.toLocaleDateString('es-EC', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

export default function ProgressChart() {
  const [ejerciciosDisponibles, setEjerciciosDisponibles] = useState([])
  const [ejercicioId, setEjercicioId] = useState('')
  const [metrica, setMetrica] = useState('peso')
  const [inicio, setInicio] = useState('')
  const [fin, setFin] = useState('')
  const [puntos, setPuntos] = useState([])
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    listarEjercicios({ page: 0, size: 100 }).then((data) => {
      setEjerciciosDisponibles(data.content)
      if (data.content.length > 0) {
        setEjercicioId(String(data.content[0].id))
      }
    })
  }, [])

  useEffect(() => {
    if (!ejercicioId) return

    let activo = true
    setCargando(true)
    setError('')

    obtenerProgreso(ejercicioId, { inicio: inicio || undefined, fin: fin || undefined })
      .then((data) => {
        if (activo) setPuntos(data)
      })
      .catch((err) => {
        if (activo) setError(err.response?.data?.mensaje || 'No se pudo cargar el progreso')
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [ejercicioId, inicio, fin])

  const valores = puntos.map((p) => Number(metrica === 'peso' ? p.peso : p.repeticiones))
  const indiceMax = valores.length > 0 ? valores.indexOf(Math.max(...valores)) : -1
  const indiceMin = valores.length > 0 ? valores.indexOf(Math.min(...valores)) : -1

  const chartData = {
    labels: puntos.map((p) => formatearFechaCorta(p.fecha)),
    datasets: [
      {
        label: metrica === 'peso' ? 'Peso (kg)' : 'Repeticiones',
        data: valores,
        borderColor: ACENTO,
        backgroundColor: ACENTO,
        pointBackgroundColor: valores.map((_, i) =>
          i === indiceMax ? EXITO : i === indiceMin ? ALERTA : ACENTO
        ),
        pointRadius: valores.map((_, i) => (i === indiceMax || i === indiceMin ? 7 : 4)),
        tension: 0.2,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Seguimiento del progreso</h1>
      </div>

      <div className="filter-bar">
        <label htmlFor="ejercicio">Ejercicio</label>
        <select id="ejercicio" value={ejercicioId} onChange={(e) => setEjercicioId(e.target.value)}>
          {ejerciciosDisponibles.map((ej) => (
            <option key={ej.id} value={ej.id}>
              {ej.nombre}
            </option>
          ))}
        </select>

        <label htmlFor="metrica">Métrica</label>
        <select id="metrica" value={metrica} onChange={(e) => setMetrica(e.target.value)}>
          <option value="peso">Peso</option>
          <option value="repeticiones">Repeticiones</option>
        </select>

        <label htmlFor="inicio">Desde</label>
        <input id="inicio" type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} />

        <label htmlFor="fin">Hasta</label>
        <input id="fin" type="date" value={fin} onChange={(e) => setFin(e.target.value)} />
      </div>

      {error && <p className="auth-error">{error}</p>}

      {ejerciciosDisponibles.length === 0 ? (
        <p>No tienes ejercicios registrados todavía.</p>
      ) : cargando ? (
        <LoadingSpinner contenedor={false} alto="420px" />
      ) : puntos.length === 0 ? (
        <p>No hay registros de este ejercicio en el periodo seleccionado.</p>
      ) : (
        <>
          <p className="analisis-destacado">
            Máximo: <strong>{valores[indiceMax]}</strong>{' '}
            {metrica === 'peso' ? 'kg' : 'repeticiones'} ({formatearFechaCorta(puntos[indiceMax].fecha)})
            {' · '}
            Mínimo: <strong>{valores[indiceMin]}</strong>{' '}
            {metrica === 'peso' ? 'kg' : 'repeticiones'} ({formatearFechaCorta(puntos[indiceMin].fecha)})
          </p>

          {metrica === 'repeticiones' && (
            <div className="zonas-leyenda">
              {ZONAS_REPETICIONES.map((zona) => (
                <span key={zona.nombre}>
                  <span className="swatch" style={{ backgroundColor: zona.swatch }} />
                  {zona.nombre}
                </span>
              ))}
            </div>
          )}

          <div className="chart-container">
            <Line
              data={chartData}
              options={chartOptions}
              plugins={metrica === 'repeticiones' ? [bandasPlugin(ZONAS_REPETICIONES)] : []}
            />
          </div>
        </>
      )}
    </div>
  )
}
