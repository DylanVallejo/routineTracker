import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { iniciarSesion } from '../api/authService'
import { useAuth } from './AuthContext'

export default function LoginForm() {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setCargando(true)
    try {
      const data = await iniciarSesion({ correo, password })
      login(data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Correo o contrasena invalidos')
    } finally {
      setCargando(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h1>Iniciar sesion</h1>

      <label htmlFor="correo">Correo</label>
      <input
        id="correo"
        type="email"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        required
      />

      <label htmlFor="password">Contrasena</label>
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

      {error && <p className="auth-error">{error}</p>}

      <button type="submit" disabled={cargando}>
        {cargando ? 'Ingresando...' : 'Ingresar'}
      </button>

      <p className="auth-switch">
        ¿No tienes cuenta? <Link to="/register">Registrate</Link>
      </p>
    </form>
  )
}
