import { useState } from 'react'
import { Link } from 'react-router-dom'
import { registrarUsuario } from '../api/authService'

export default function RegisterForm() {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [registrado, setRegistrado] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setCargando(true)
    try {
      await registrarUsuario({ nombre, correo, password })
      setRegistrado(true)
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo completar el registro')
    } finally {
      setCargando(false)
    }
  }

  if (registrado) {
    return (
      <div className="auth-form">
        <h1>Revisa tu correo</h1>
        <p className="auth-info">
          Te enviamos un enlace a <strong>{correo}</strong> para confirmar tu cuenta.
          Abrilo para activarla y poder iniciar sesión.
        </p>
        <p className="auth-switch">
          <Link to="/login">Volver a iniciar sesión</Link>
        </p>
      </div>
    )
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h1>Crear cuenta</h1>

      <label htmlFor="nombre">Nombre</label>
      <input
        id="nombre"
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

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

      <button type="submit" disabled={cargando}>
        {cargando ? 'Creando cuenta...' : 'Registrarme'}
      </button>

      <p className="auth-switch">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </form>
  )
}
