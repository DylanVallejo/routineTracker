export default function LoadingSpinner({ texto = 'Cargando...', contenedor = true }) {
  const spinner = (
    <div className="loading-spinner" role="status" aria-label={texto}>
      <span className="loading-spinner-dot" />
      <span className="loading-spinner-dot" />
      <span className="loading-spinner-dot" />
    </div>
  )

  if (!contenedor) return spinner

  return <div className="page-container loading-spinner-container">{spinner}</div>
}
