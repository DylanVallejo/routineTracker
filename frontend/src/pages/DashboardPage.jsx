import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function DashboardPage() {
  const { usuario } = useAuth()

  return (
    <div className="dashboard-page">
      <h1>Hola, {usuario?.nombre}</h1>
      <p>Sesion iniciada con: {usuario?.correo}</p>
      <p>
        Ya puedes gestionar tu catalogo de <Link to="/ejercicios">ejercicios</Link>,
        registrar tus <Link to="/sesiones">sesiones de entrenamiento</Link> y revisar tu{' '}
        <Link to="/analisis">analisis de grupos musculares</Link>. El seguimiento de
        progreso por ejercicio llega en el proximo sprint.
      </p>
    </div>
  )
}
