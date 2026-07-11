import { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { obtenerAnalisisMuscular } from '../api/analisisService'
import { etiquetaGrupoMuscular } from '../constants/gruposMusculares'
import { PERIODOS, calcularRangoPeriodo } from '../constants/periodos'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const VERDE = '#22c55e'
const ROJO = '#ef4444'

export default function MuscleAnalysis() {
  const [periodo, setPeriodo] = useState('30')
  const [datos, setDatos] = useState([])
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)

  async function cargar(valorPeriodo) {
    setCargando(true)
    setError('')
    try {
      const rango = calcularRangoPeriodo(valorPeriodo)
      const resultado = await obtenerAnalisisMuscular(rango)
      setDatos(resultado)
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo cargar el analisis muscular')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar(periodo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodo])

  const frecuencias = datos.map((d) => d.frecuencia)
  const minimo = frecuencias.length > 0 ? Math.min(...frecuencias) : 0
  const grupoMenosTrabajado = datos.find((d) => d.frecuencia === minimo)

  const chartData = {
    labels: datos.map((d) => etiquetaGrupoMuscular(d.grupoMuscular)),
    datasets: [
      {
        label: 'Veces entrenado',
        data: frecuencias,
        backgroundColor: datos.map((d) => (d.frecuencia === minimo ? ROJO : VERDE)),
        borderRadius: 4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, precision: 0 },
      },
    },
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Analisis de grupos musculares</h1>
      </div>

      <div className="filter-bar">
        <label htmlFor="periodo">Periodo</label>
        <select id="periodo" value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
          {PERIODOS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="auth-error">{error}</p>}

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <>
          {grupoMenosTrabajado && (
            <p className="analisis-destacado">
              Grupo muscular menos trabajado:{' '}
              <strong>{etiquetaGrupoMuscular(grupoMenosTrabajado.grupoMuscular)}</strong> (
              {grupoMenosTrabajado.frecuencia}{' '}
              {grupoMenosTrabajado.frecuencia === 1 ? 'vez' : 'veces'})
            </p>
          )}

          <div className="chart-container">
            <Bar data={chartData} options={chartOptions} />
          </div>

          {minimo === Math.max(...frecuencias) && (
            <p className="analisis-nota">
              Todos los grupos musculares tienen la misma frecuencia en este periodo.
            </p>
          )}
        </>
      )}
    </div>
  )
}
