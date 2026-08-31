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
import { obtenerAnalisisMuscular, obtenerAnalisisVolumen } from '../api/analisisService'
import { GRUPOS_MUSCULARES, etiquetaGrupoMuscular } from '../constants/gruposMusculares'
import { PERIODOS, calcularRangoPeriodo } from '../constants/periodos'
import { ZONAS_VOLUMEN, TOPE_GRAFICO, clasificarVolumen, colorPorVolumen } from '../constants/zonasVolumen'
import { bandasPlugin } from '../charts/bandasPlugin'
import LoadingSpinner from '../components/LoadingSpinner'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const EXITO = '#409d48'
const ALERTA = '#c53637'

function formatearFechaCorta(fechaIso) {
  const fecha = new Date(`${fechaIso}T00:00:00`)
  return fecha.toLocaleDateString('es-EC', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatearRango(rango) {
  if (!rango.inicio || !rango.fin) return 'todo el historial'
  return `${formatearFechaCorta(rango.inicio)} – ${formatearFechaCorta(rango.fin)}`
}

export default function MuscleAnalysis() {
  const [periodo, setPeriodo] = useState('30')
  const [grupoMuscular, setGrupoMuscular] = useState('TODOS')
  const [datos, setDatos] = useState([])
  const [datosVolumen, setDatosVolumen] = useState([])
  const [periodoVolumen, setPeriodoVolumen] = useState('30')
  const [inicioVolumen, setInicioVolumen] = useState('')
  const [finVolumen, setFinVolumen] = useState('')
  const [mostrarInfoVolumen, setMostrarInfoVolumen] = useState(false)
  const [error, setError] = useState('')
  const [errorVolumen, setErrorVolumen] = useState('')
  const [cargando, setCargando] = useState(true)
  const [cargandoVolumen, setCargandoVolumen] = useState(true)

  useEffect(() => {
    let activo = true

    async function cargar() {
      setCargando(true)
      setError('')
      try {
        const resultado = await obtenerAnalisisMuscular(calcularRangoPeriodo(periodo))
        if (!activo) return
        setDatos(resultado)
      } catch (err) {
        if (activo) setError(err.response?.data?.mensaje || 'No se pudo cargar el análisis muscular')
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargar()
    return () => {
      activo = false
    }
  }, [periodo])

  const esPersonalizado = periodoVolumen === 'personalizado'
  const rangoVolumenListo = !esPersonalizado || (inicioVolumen && finVolumen)
  const rangoVolumen = esPersonalizado
    ? { inicio: inicioVolumen, fin: finVolumen }
    : calcularRangoPeriodo(periodoVolumen)

  useEffect(() => {
    if (!rangoVolumenListo) return
    let activo = true

    async function cargarVolumen() {
      setCargandoVolumen(true)
      setErrorVolumen('')
      try {
        const resultado = await obtenerAnalisisVolumen(rangoVolumen)
        if (!activo) return
        setDatosVolumen(resultado)
      } catch (err) {
        if (activo) setErrorVolumen(err.response?.data?.mensaje || 'No se pudo cargar el volumen semanal')
      } finally {
        if (activo) setCargandoVolumen(false)
      }
    }

    cargarVolumen()
    return () => {
      activo = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodoVolumen, inicioVolumen, finVolumen])

  function handleCambiarPeriodoVolumen(valor) {
    setPeriodoVolumen(valor)
    if (valor !== 'personalizado') {
      setInicioVolumen('')
      setFinVolumen('')
    }
  }

  const datosFiltrados =
    grupoMuscular === 'TODOS' ? datos : datos.filter((d) => d.grupoMuscular === grupoMuscular)

  const frecuencias = datosFiltrados.map((d) => d.frecuencia)
  const minimo = frecuencias.length > 0 ? Math.min(...frecuencias) : 0
  const grupoMenosTrabajado = datosFiltrados.find((d) => d.frecuencia === minimo)

  const chartData = {
    labels: datosFiltrados.map((d) => etiquetaGrupoMuscular(d.grupoMuscular)),
    datasets: [
      {
        label: 'Veces entrenado',
        data: frecuencias,
        backgroundColor: datosFiltrados.map((d) => (d.frecuencia === minimo ? ALERTA : EXITO)),
        borderRadius: 2,
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

  const volumenFiltrado =
    grupoMuscular === 'TODOS'
      ? datosVolumen
      : datosVolumen.filter((d) => d.grupoMuscular === grupoMuscular)

  const volumenChartData = {
    labels: volumenFiltrado.map((d) => etiquetaGrupoMuscular(d.grupoMuscular)),
    datasets: [
      {
        label: 'Sets por semana',
        data: volumenFiltrado.map((d) => d.setsPorSemana),
        backgroundColor: volumenFiltrado.map((d) => colorPorVolumen(d.setsPorSemana)),
        borderRadius: 2,
      },
    ],
  }

  const volumenChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          afterLabel: (item) => clasificarVolumen(item.parsed.y),
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: TOPE_GRAFICO,
      },
    },
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Análisis de grupos musculares</h1>
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
        <span className="periodo-rango">({formatearRango(calcularRangoPeriodo(periodo))})</span>

        <label htmlFor="grupoMuscular">Grupo muscular</label>
        <select
          id="grupoMuscular"
          value={grupoMuscular}
          onChange={(e) => setGrupoMuscular(e.target.value)}
        >
          <option value="TODOS">Todos</option>
          {GRUPOS_MUSCULARES.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="auth-error">{error}</p>}

      {cargando ? (
        <LoadingSpinner contenedor={false} />
      ) : (
        <>
          {grupoMuscular === 'TODOS' && grupoMenosTrabajado && (
            <p className="analisis-destacado">
              Grupo muscular menos trabajado:{' '}
              <strong>{etiquetaGrupoMuscular(grupoMenosTrabajado.grupoMuscular)}</strong> (
              {grupoMenosTrabajado.frecuencia}{' '}
              {grupoMenosTrabajado.frecuencia === 1 ? 'vez' : 'veces'})
            </p>
          )}

          {grupoMuscular !== 'TODOS' && grupoMenosTrabajado && (
            <p className="analisis-destacado">
              <strong>{etiquetaGrupoMuscular(grupoMenosTrabajado.grupoMuscular)}</strong>{' '}
              entrenado {grupoMenosTrabajado.frecuencia}{' '}
              {grupoMenosTrabajado.frecuencia === 1 ? 'vez' : 'veces'} en este periodo.
            </p>
          )}

          <div className="chart-container">
            <Bar data={chartData} options={chartOptions} />
          </div>

          {grupoMuscular === 'TODOS' && frecuencias.length > 1 && minimo === Math.max(...frecuencias) && (
            <p className="analisis-nota">
              Todos los grupos musculares tienen la misma frecuencia en este periodo.
            </p>
          )}
        </>
      )}

      <div className="page-header analisis-subheader">
        <h2>Volumen semanal (sets)</h2>
        <button
          type="button"
          className="info-toggle"
          onClick={() => setMostrarInfoVolumen((valor) => !valor)}
          aria-expanded={mostrarInfoVolumen}
          aria-label="Qué significa MV, MEV, MAV y MRV"
        >
          i
        </button>
      </div>

      {mostrarInfoVolumen && (
        <div className="info-panel">
          <p>
            Estas siglas indican cuántas series ("sets") por semana necesita un grupo muscular
            para crecer, según la ciencia del entrenamiento de fuerza:
          </p>
          <ul>
            <li>
              <strong>MV</strong> (Volumen de mantenimiento): lo mínimo para no perder músculo,
              sin buscar crecer.
            </li>
            <li>
              <strong>MEV</strong> (Volumen mínimo efectivo): a partir de aquí el músculo
              empieza a crecer.
            </li>
            <li>
              <strong>MAV</strong> (Volumen adaptativo máximo): el rango donde más crece la
              mayoría de personas.
            </li>
            <li>
              <strong>MRV</strong> (Volumen máximo recuperable): el límite antes de que el
              cuerpo ya no pueda recuperarse a tiempo entre entrenamientos.
            </li>
          </ul>
          <p>
            Son valores generales de referencia (no personalizados a tu experiencia o
            genética), pensados para orientar cuántas series por semana conviene sumar por
            grupo muscular.
          </p>
        </div>
      )}

      <div className="filter-bar">
        <label htmlFor="periodoVolumen">Periodo</label>
        <select
          id="periodoVolumen"
          value={periodoVolumen}
          onChange={(e) => handleCambiarPeriodoVolumen(e.target.value)}
        >
          {PERIODOS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
          <option value="personalizado">Personalizado</option>
        </select>

        {esPersonalizado ? (
          <>
            <label htmlFor="inicioVolumen">Desde</label>
            <input
              id="inicioVolumen"
              type="date"
              value={inicioVolumen}
              onChange={(e) => setInicioVolumen(e.target.value)}
            />
            <label htmlFor="finVolumen">Hasta</label>
            <input
              id="finVolumen"
              type="date"
              value={finVolumen}
              onChange={(e) => setFinVolumen(e.target.value)}
            />
          </>
        ) : (
          <span className="periodo-rango">({formatearRango(rangoVolumen)})</span>
        )}
      </div>

      <p className="analisis-nota">
        Este período es independiente del filtro de arriba — cambiar uno no afecta al otro.
      </p>

      {esPersonalizado && !rangoVolumenListo && (
        <p className="analisis-nota">Elegí "Desde" y "Hasta" para ver ese rango.</p>
      )}

      {errorVolumen && <p className="auth-error">{errorVolumen}</p>}

      {!rangoVolumenListo ? null : cargandoVolumen ? (
        <LoadingSpinner contenedor={false} />
      ) : (
        <>
          <div className="zonas-leyenda">
            {ZONAS_VOLUMEN.map((zona) => (
              <span key={zona.nombre}>
                <span className="swatch" style={{ backgroundColor: zona.swatch }} />
                {zona.nombre}
              </span>
            ))}
          </div>

          <div className="chart-container">
            <Bar data={volumenChartData} options={volumenChartOptions} plugins={[bandasPlugin(ZONAS_VOLUMEN)]} />
          </div>
        </>
      )}
    </div>
  )
}
