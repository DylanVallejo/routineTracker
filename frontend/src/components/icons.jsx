const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export function IconInicio(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1v-9" />
    </svg>
  )
}

export function IconEjercicios(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8v8M2 10v4M22 10v4M20 8v8" />
      <path d="M7 12h10" strokeWidth={4} />
    </svg>
  )
}

export function IconSesiones(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="4.5" width="17" height="16" rx="1.5" />
      <path d="M3.5 9.5h17M8 3v3M16 3v3M7.5 13h3M7.5 16.5h6" />
    </svg>
  )
}

export function IconAnalisis(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20V10M11 20V4M18 20v-7" />
    </svg>
  )
}

export function IconProgreso(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 17 9.5 10l4 4L21 6" />
      <path d="M15 6h6v6" />
    </svg>
  )
}

export function IconEditar(props) {
  return (
    <svg {...base} width={15} height={15} {...props}>
      <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
      <path d="M14.5 5.5l4 4" />
    </svg>
  )
}

export function IconEliminar(props) {
  return (
    <svg {...base} width={15} height={15} {...props}>
      <path d="M4.5 7h15M9.5 7V4.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V7M18.5 7l-.7 12.15a1.5 1.5 0 0 1-1.5 1.35H7.7a1.5 1.5 0 0 1-1.5-1.35L5.5 7" />
    </svg>
  )
}

export function IconVerDetalle(props) {
  return (
    <svg {...base} width={15} height={15} {...props}>
      <path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  )
}

export function IconCerrarSesion(props) {
  return (
    <svg {...base} width={16} height={16} {...props}>
      <path d="M9 4.5H6a1.5 1.5 0 0 0-1.5 1.5v12A1.5 1.5 0 0 0 6 19.5h3" />
      <path d="M16 15.5 21 12l-5-3.5M21 12H9" />
    </svg>
  )
}
