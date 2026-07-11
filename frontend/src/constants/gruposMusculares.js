export const GRUPOS_MUSCULARES = [
  { value: 'PECHO', label: 'Pecho' },
  { value: 'ESPALDA', label: 'Espalda' },
  { value: 'HOMBROS', label: 'Hombros' },
  { value: 'BICEPS', label: 'Biceps' },
  { value: 'TRICEPS', label: 'Triceps' },
  { value: 'PIERNAS', label: 'Piernas' },
  { value: 'GLUTEOS', label: 'Gluteos' },
  { value: 'ABDOMEN', label: 'Abdomen' },
  { value: 'PANTORRILLAS', label: 'Pantorrillas' },
  { value: 'ANTEBRAZO', label: 'Antebrazo' },
]

export function etiquetaGrupoMuscular(value) {
  return GRUPOS_MUSCULARES.find((g) => g.value === value)?.label || value
}
