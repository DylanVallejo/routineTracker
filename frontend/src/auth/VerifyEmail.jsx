import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { verificarCuenta } from '../api/authService'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [estado, setEstado] = useState('verificando')
  const [mensaje, setMensaje] = useState('')
  const ejecutado = useRef(false)

  useEffect(() => {
    if (ejecutado.current) return
    ejecutado.current = true

    if (!token) {
      setEstado('error')
      setMensaje('El enlace no es válido')
      return
    }
    verificarCuenta(token)
      .then((data) => {
        setEstado('ok')
        setMensaje(data.mensaje)
      })
      .catch((err) => {
        setEstado('error')
        setMensaje(err.response?.data?.mensaje || 'No se pudo confirmar la cuenta')
      })
  }, [token])

  return (
    <div className="auth-form">
      <h1>Confirmación de cuenta</h1>
      {estado === 'verificando' && <p className="auth-info">Confirmando tu cuenta...</p>}
      {estado === 'ok' && <p className="auth-info">{mensaje}</p>}
      {estado === 'error' && <p className="auth-error">{mensaje}</p>}
      <p className="auth-switch">
        <Link to="/login">Ir a iniciar sesión</Link>
      </p>
    </div>
  )
}
