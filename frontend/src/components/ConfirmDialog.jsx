export default function ConfirmDialog({ abierto, mensaje, textoConfirmar = 'Eliminar', onConfirmar, onCancelar }) {
  if (!abierto) return null

  return (
    <div className="confirm-overlay" onClick={onCancelar}>
      <div
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-label={mensaje}
        onClick={(e) => e.stopPropagation()}
      >
        <p>{mensaje}</p>
        <div className="confirm-dialog-acciones">
          <button type="button" className="btn-secondary" onClick={onCancelar}>
            Cancelar
          </button>
          <button type="button" className="confirm-dialog-peligro" onClick={onConfirmar}>
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  )
}
