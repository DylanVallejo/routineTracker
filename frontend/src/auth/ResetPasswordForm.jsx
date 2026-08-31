import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { restablecerPassword } from '../api/authService'

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [listo, setListo] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!token) {
      setError('El enlace no es válido')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (password !== confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }

    setCargando(true)
    try {
      await restablecerPassword({ token, password })
      setListo(true)
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo actualizar la contraseña')
    } finally {
      setCargando(false)
    }
  }

  if (listo) {
    return (
      <div className="auth-form">
        <h1>Contraseña actualizada</h1>
        <p className="auth-info">Ya puedes iniciar sesión con tu nueva contraseña.</p>
        <p className="auth-switch">
          <Link to="/login">Ir a iniciar sesión</Link>
        </p>
      </div>
    )
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h1>Nueva contraseña</h1>

      <label htmlFor="password">Nueva contraseña</label>
      <div className="password-field">
        <input
          id="password"
          type={mostrarPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setMostrarPassword((valor) => !valor)}
          aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {mostrarPassword ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>

      <label htmlFor="confirmar">Confirmar contraseña</label>
      <input
        id="confirmar"
        type={mostrarPassword ? 'text' : 'password'}
        value={confirmar}
        onChange={(e) => setConfirmar(e.target.value)}
        required
      />

      {error && <p className="auth-error">{error}</p>}

      <button type="submit" disabled={cargando}>
        {cargando ? 'Guardando...' : 'Guardar contraseña'}
      </button>

      <p className="auth-switch">
        <Link to="/login">Volver a iniciar sesión</Link>
      </p>
    </form>
  )
}
