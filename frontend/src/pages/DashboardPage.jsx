import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function DashboardPage() {
  const { usuario } = useAuth()

  return (
    <div className="dashboard-page">
      <h1>Hola, {usuario?.nombre}</h1>
      <p>Sesion iniciada con: {usuario?.correo}</p>
      <p>
        Gestiona tu catalogo de <Link to="/ejercicios">ejercicios</Link>, registra tus{' '}
        <Link to="/sesiones">sesiones de entrenamiento</Link>, revisa tu{' '}
        <Link to="/analisis">analisis de grupos musculares</Link> y sigue tu{' '}
        <Link to="/progreso">progreso por ejercicio</Link>.
      </p>
    </div>
  )
}
