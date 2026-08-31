export default function LoadingSpinner({ texto = 'Cargando...', contenedor = true, alto }) {
  const spinner = (
    <div className="loading-spinner" role="status" aria-label={texto}>
      <span className="loading-spinner-dot" />
      <span className="loading-spinner-dot" />
      <span className="loading-spinner-dot" />
    </div>
  )

  if (!contenedor) {
    return (
      <div className="loading-spinner-inline" style={alto ? { minHeight: alto } : undefined}>
        {spinner}
      </div>
    )
  }

  return <div className="page-container loading-spinner-container">{spinner}</div>
}
