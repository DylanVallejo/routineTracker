export const PERIODOS = [
  { value: '7', label: 'Ultimos 7 dias' },
  { value: '30', label: 'Ultimos 30 dias' },
  { value: '90', label: 'Ultimos 90 dias' },
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
