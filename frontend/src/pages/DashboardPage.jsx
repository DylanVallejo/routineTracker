import { useAuth } from '../auth/AuthContext'

export default function DashboardPage() {
  const { usuario, logout } = useAuth()

  return (
    <div className="dashboard-page">
      <h1>Hola, {usuario?.nombre}</h1>
      <p>Sesion iniciada con: {usuario?.correo}</p>
      <p>Aqui iran las rutinas, el historial y el analisis muscular en los proximos sprints.</p>
      <button onClick={logout}>Cerrar sesion</button>
    </div>
  )
}
