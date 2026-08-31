import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { iniciarSesion, reenviarVerificacion } from '../api/authService'
import { useAuth } from './AuthContext'

export default function LoginForm() {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [error, setError] = useState('')
  const [noVerificado, setNoVerificado] = useState(false)
  const [avisoReenvio, setAvisoReenvio] = useState('')
  const [cargando, setCargando] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setNoVerificado(false)
    setAvisoReenvio('')
    setCargando(true)
    try {
      const data = await iniciarSesion({ correo, password })
      login(data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Correo o contraseña inválidos')
      setNoVerificado(err.response?.status === 403)
    } finally {
      setCargando(false)
    }
  }

  async function handleReenviar() {
    setAvisoReenvio('')
    try {
      const data = await reenviarVerificacion(correo)
      setAvisoReenvio(data.mensaje)
    } catch {
      setAvisoReenvio('No se pudo reenviar el correo, intenta más tarde')
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h1>Iniciar sesión</h1>

      <label htmlFor="correo">Correo</label>
      <input
        id="correo"
        type="email"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        required
      />

      <label htmlFor="password">Contraseña</label>
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

      {error && <p className="auth-error">{error}</p>}
      {noVerificado && (
        <button type="button" className="auth-link-button" onClick={handleReenviar}>
          Reenviar correo de confirmación
        </button>
      )}
      {avisoReenvio && <p className="auth-info">{avisoReenvio}</p>}

      <button type="submit" disabled={cargando}>
        {cargando ? 'Ingresando...' : 'Ingresar'}
      </button>

      <p className="auth-switch">
        <Link to="/recuperar">¿Olvidaste tu contraseña?</Link>
      </p>
      <p className="auth-switch">
        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
      </p>
    </form>
  )
}
