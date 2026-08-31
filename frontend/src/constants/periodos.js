export const PERIODOS = [
  { value: '7', label: 'Últimos 7 días' },
  { value: '30', label: 'Últimos 30 días' },
  { value: '90', label: 'Últimos 90 días' },
  { value: 'todo', label: 'Todo el tiempo' },
]

function formatearFecha(fecha) {
  // Usa componentes de fecha local (no toISOString, que convierte a UTC y
  // puede quedar un dia adelante o atras segun la zona horaria del navegador).
  const y = fecha.getFullYear()
  const m = String(fecha.getMonth() + 1).padStart(2, '0')
  const d = String(fecha.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function calcularRangoPeriodo(valorPeriodo) {
  if (valorPeriodo === 'todo') {
    return { inicio: undefined, fin: undefined }
  }

  const dias = Number(valorPeriodo)
  const fin = new Date()
  const inicio = new Date()
  inicio.setDate(inicio.getDate() - dias)

  return { inicio: formatearFecha(inicio), fin: formatearFecha(fin) }
}
