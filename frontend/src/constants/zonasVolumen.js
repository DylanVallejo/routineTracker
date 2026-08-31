export const MV = 6
export const MEV = 10
export const MAV = 20
export const MRV = 25
export const TOPE_GRAFICO = 30

export const ZONAS_VOLUMEN = [
  { nombre: 'Insuficiente (< MV)', min: 0, max: MV, color: 'rgba(197, 54, 55, 0.14)', swatch: '#c53637' },
  { nombre: 'Mantenimiento (MV-MEV)', min: MV, max: MEV, color: 'rgba(217, 165, 20, 0.14)', swatch: '#d9a514' },
  { nombre: 'Óptimo (MEV-MAV)', min: MEV, max: MAV, color: 'rgba(64, 157, 72, 0.14)', swatch: '#409d48' },
  { nombre: 'Cerca del límite (MAV-MRV)', min: MAV, max: MRV, color: 'rgba(217, 165, 20, 0.14)', swatch: '#d9a514' },
  { nombre: 'Riesgo de sobreentrenamiento (> MRV)', min: MRV, max: TOPE_GRAFICO, color: 'rgba(197, 54, 55, 0.14)', swatch: '#c53637' },
]

export function clasificarVolumen(setsPorSemana) {
  if (setsPorSemana < MV) return 'Insuficiente'
  if (setsPorSemana < MEV) return 'Mantenimiento'
  if (setsPorSemana <= MAV) return 'Óptimo'
  if (setsPorSemana <= MRV) return 'Cerca del límite'
  return 'Riesgo de sobreentrenamiento'
}

export function colorPorVolumen(setsPorSemana) {
  if (setsPorSemana < MV) return ZONAS_VOLUMEN[0].swatch
  if (setsPorSemana < MEV) return ZONAS_VOLUMEN[1].swatch
  if (setsPorSemana <= MAV) return ZONAS_VOLUMEN[2].swatch
  if (setsPorSemana <= MRV) return ZONAS_VOLUMEN[3].swatch
  return ZONAS_VOLUMEN[4].swatch
}
