export const PERIODOS = [
  { value: '7', label: 'Últimos 7 días' },
  { value: '30', label: 'Últimos 30 días' },
  { value: '90', label: 'Últimos 90 días' },
  { value: 'todo', label: 'Todo el tiempo' },
]

function formatearFecha(fecha) {
  return fecha.toISOString().slice(0, 10)
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
