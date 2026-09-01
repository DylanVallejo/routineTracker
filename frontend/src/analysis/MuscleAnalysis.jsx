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
import { listarSesiones } from '../api/sesionService'
import { GRUPOS_MUSCULARES, etiquetaGrupoMuscular } from '../constants/gruposMusculares'
import { PERIODOS, calcularRangoPeriodo } from '../constants/periodos'
import { ZONAS_VOLUMEN, TOPE_GRAFICO, clasificarVolumen, colorPorVolumen } from '../constants/zonasVolumen'
import { bandasPlugin } from '../charts/bandasPlugin'
import LoadingSpinner from '../components/LoadingSpinner'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const EXITO = '#409d48'
const ALERTA = '#c53637'

const FRECUENCIA_MINIMA_SEMANAL = 2

function diasDesde(fechaIso) {
  const inicio = new Date(`${fechaIso}T00:00:00`)
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  return Math.round((hoy - inicio) / (1000 * 60 * 60 * 24)) + 1
}

function calcularFrecuenciaMinima(periodo, fechaMasAntigua) {
  let dias
  if (periodo === 'todo') {
    if (!fechaMasAntigua) return null
    dias = diasDesde(fechaMasAntigua)
  } else {
    dias = Number(periodo)
    if (!dias) return null
  }
  const semanas = Math.max(dias / 7, 1)
  return Math.floor(FRECUENCIA_MINIMA_SEMANAL * semanas)
}

function formatearFechaCorta(fechaIso) {
  const fecha = new Date(`${fechaIso}T00:00:00`)
  return fecha.toLocaleDateString('es-EC', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatearRango(rango) {
  if (!rango.inicio || !rango.fin) return 'todo el historial'
  return `${formatearFechaCorta(rango.inicio)} – ${formatearFechaCorta(rango.fin)}`
}

function formatearFechaISO(fecha) {
  // Componentes de fecha local, no toISOString (UTC) -- ver mismo comentario
  // en constants/periodos.js.
  const y = fecha.getFullYear()
  const m = String(fecha.getMonth() + 1).padStart(2, '0')
  const d = String(fecha.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function hoyISO() {
  return formatearFechaISO(new Date())
}

function lunesDeLaSemana(fecha) {
  const d = new Date(fecha)
  const dia = d.getDay()
  const diff = dia === 0 ? -6 : 1 - dia
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
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
  const [fechaMasAntigua, setFechaMasAntigua] = useState(undefined)

  useEffect(() => {
    if (periodo !== 'todo' || fechaMasAntigua !== undefined) return
    let activo = true
    listarSesiones().then((sesiones) => {
      if (!activo) return
      if (sesiones.length === 0) {
        setFechaMasAntigua(null)
        return
      }
      const fechas = sesiones.map((s) => s.fecha.slice(0, 10))
      setFechaMasAntigua(fechas.reduce((min, f) => (f < min ? f : min)))
    })
    return () => {
      activo = false
    }
  }, [periodo, fechaMasAntigua])

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

  function moverSemanaVolumen(delta) {
    // Navega por semanas calendario (lunes a domingo), no por el ancho del
    // periodo activo: asi cada "semana" es siempre un bloque de 7 dias real,
    // y la semana actual llega justo hasta hoy en vez de quedar corta o
    // pasarse hacia el futuro.
    const ancla =
      esPersonalizado && inicioVolumen
        ? lunesDeLaSemana(new Date(`${inicioVolumen}T00:00:00`))
        : lunesDeLaSemana(new Date())

    const nuevoInicio = new Date(ancla)
    nuevoInicio.setDate(nuevoInicio.getDate() + delta * 7)

    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    if (nuevoInicio > hoy) return

    const nuevoFinCompleto = new Date(nuevoInicio)
    nuevoFinCompleto.setDate(nuevoFinCompleto.getDate() + 6)
    const nuevoFin = nuevoFinCompleto > hoy ? hoy : nuevoFinCompleto

    setPeriodoVolumen('personalizado')
    setInicioVolumen(formatearFechaISO(nuevoInicio))
    setFinVolumen(formatearFechaISO(nuevoFin))
  }

  const puedeAvanzarSemanaVolumen = rangoVolumen.fin && rangoVolumen.fin < hoyISO()

  const datosFiltrados =
    grupoMuscular === 'TODOS' ? datos : datos.filter((d) => d.grupoMuscular === grupoMuscular)

  const frecuencias = datosFiltrados.map((d) => d.frecuencia)
  const frecuenciaMinima = calcularFrecuenciaMinima(periodo, fechaMasAntigua)
  const minimo = frecuencias.length > 0 ? Math.min(...frecuencias) : 0
  const grupoMenosTrabajado = datosFiltrados.find((d) => d.frecuencia === minimo)
  const gruposBajoMinimo =
    frecuenciaMinima != null ? datosFiltrados.filter((d) => d.frecuencia < frecuenciaMinima) : []

  const rangoFrecuencia =
    periodo === 'todo'
      ? fechaMasAntigua
        ? { inicio: fechaMasAntigua, fin: hoyISO() }
        : {}
      : calcularRangoPeriodo(periodo)

  const chartData = {
    labels: datosFiltrados.map((d) => etiquetaGrupoMuscular(d.grupoMuscular)),
    datasets: [
      {
        label: 'Veces entrenado',
        data: frecuencias,
        backgroundColor: datosFiltrados.map((d) => {
          const bajoMinimo = frecuenciaMinima != null ? d.frecuencia < frecuenciaMinima : d.frecuencia === minimo
          return bajoMinimo ? ALERTA : EXITO
        }),
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
        <span className="periodo-rango">({formatearRango(rangoFrecuencia)})</span>

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

      <p className="analisis-nota">
        Referencia: se recomienda entrenar cada grupo muscular al menos {FRECUENCIA_MINIMA_SEMANAL} veces por semana
        {frecuenciaMinima != null && ` (~${frecuenciaMinima} veces en este período)`}.
      </p>

      {cargando ? (
        <LoadingSpinner contenedor={false} alto="420px" />
      ) : (
        <>
          {grupoMuscular === 'TODOS' && frecuenciaMinima != null && (
            gruposBajoMinimo.length === 0 ? (
              <p className="analisis-destacado">
                Todos los grupos musculares alcanzan la frecuencia mínima recomendada (
                {frecuenciaMinima} {frecuenciaMinima === 1 ? 'vez' : 'veces'}) en este período.
              </p>
            ) : (
              <p className="analisis-destacado">
                No alcanzan la frecuencia mínima recomendada ({frecuenciaMinima}{' '}
                {frecuenciaMinima === 1 ? 'vez' : 'veces'}):{' '}
                <strong>
                  {gruposBajoMinimo.map((d) => etiquetaGrupoMuscular(d.grupoMuscular)).join(', ')}
                </strong>
                .
              </p>
            )
          )}

          {grupoMuscular === 'TODOS' && frecuenciaMinima == null && grupoMenosTrabajado && (
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
              {grupoMenosTrabajado.frecuencia === 1 ? 'vez' : 'veces'} en este período
              {frecuenciaMinima != null &&
                (grupoMenosTrabajado.frecuencia < frecuenciaMinima
                  ? ` — no alcanza la frecuencia mínima recomendada (${frecuenciaMinima}).`
                  : ` — alcanza la frecuencia mínima recomendada (${frecuenciaMinima}).`)}
              {frecuenciaMinima == null && '.'}
            </p>
          )}

          <div className="chart-container">
            <Bar data={chartData} options={chartOptions} />
          </div>

          {grupoMuscular === 'TODOS' && frecuenciaMinima == null && frecuencias.length > 1 && minimo === Math.max(...frecuencias) && (
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

      <div className="filter-bar filter-bar-volumen">
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

        {periodoVolumen !== 'todo' && (
          <span className="semana-nav">
            <button
              type="button"
              onClick={() => moverSemanaVolumen(-1)}
              aria-label="Retroceder una semana"
            >
              <span className="flecha">←</span> Semana anterior
            </button>
            <button
              type="button"
              onClick={() => moverSemanaVolumen(1)}
              disabled={!puedeAvanzarSemanaVolumen}
              aria-label="Avanzar una semana"
              title={puedeAvanzarSemanaVolumen ? undefined : 'No se puede ver una semana futura'}
            >
              Semana siguiente <span className="flecha">→</span>
            </button>
          </span>
        )}
      </div>

      {esPersonalizado && !rangoVolumenListo && (
        <p className="analisis-nota">Elige "Desde" y "Hasta" para ver ese rango.</p>
      )}

      {errorVolumen && <p className="auth-error">{errorVolumen}</p>}

      {!rangoVolumenListo ? null : cargandoVolumen ? (
        <LoadingSpinner contenedor={false} alto="440px" />
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
