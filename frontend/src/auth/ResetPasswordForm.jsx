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
      setError('El enlace no es valido')
      return
    }
    if (password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres')
      return
    }
    if (password !== confirmar) {
      setError('Las contrasenas no coinciden')
      return
    }

    setCargando(true)
    try {
      await restablecerPassword({ token, password })
      setListo(true)
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo actualizar la contrasena')
    } finally {
      setCargando(false)
    }
  }

  if (listo) {
    return (
      <div className="auth-form">
        <h1>Contrasena actualizada</h1>
        <p className="auth-info">Ya puedes iniciar sesion con tu nueva contrasena.</p>
        <p className="auth-switch">
          <Link to="/login">Ir a iniciar sesion</Link>
        </p>
      </div>
    )
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h1>Nueva contrasena</h1>

      <label htmlFor="password">Nueva contrasena</label>
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
          aria-label={mostrarPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
        >
          {mostrarPassword ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>

      <label htmlFor="confirmar">Confirmar contrasena</label>
      <input
        id="confirmar"
        type={mostrarPassword ? 'text' : 'password'}
        value={confirmar}
        onChange={(e) => setConfirmar(e.target.value)}
        required
      />

      {error && <p className="auth-error">{error}</p>}

      <button type="submit" disabled={cargando}>
        {cargando ? 'Guardando...' : 'Guardar contrasena'}
      </button>

      <p className="auth-switch">
        <Link to="/login">Volver a iniciar sesion</Link>
      </p>
    </form>
  )
}
