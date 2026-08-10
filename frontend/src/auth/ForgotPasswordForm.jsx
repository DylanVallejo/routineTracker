import { useState } from 'react'
import { Link } from 'react-router-dom'
import { recuperarPassword } from '../api/authService'

export default function ForgotPasswordForm() {
  const [correo, setCorreo] = useState('')
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMensaje('')
    setCargando(true)
    try {
      const data = await recuperarPassword(correo)
      setMensaje(data.mensaje)
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo procesar la solicitud')
    } finally {
      setCargando(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h1>Recuperar contrasena</h1>
      <p className="auth-info">Ingresa tu correo y te enviaremos un enlace para elegir una nueva contrasena.</p>

      <label htmlFor="correo">Correo</label>
      <input
        id="correo"
        type="email"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        required
      />

      {error && <p className="auth-error">{error}</p>}
      {mensaje && <p className="auth-info">{mensaje}</p>}

      <button type="submit" disabled={cargando}>
        {cargando ? 'Enviando...' : 'Enviar enlace'}
      </button>

      <p className="auth-switch">
        <Link to="/login">Volver a iniciar sesion</Link>
      </p>
    </form>
  )
}
