import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function NavBar() {
  const { usuario, logout } = useAuth()

  return (
    <nav className="navbar">
      <div className="navbar-brand">Routine Tracker</div>
      <div className="navbar-links">
        <Link to="/">Inicio</Link>
        <Link to="/ejercicios">Ejercicios</Link>
      </div>
      <div className="navbar-user">
        <span>{usuario?.nombre}</span>
        <button onClick={logout}>Cerrar sesion</button>
      </div>
    </nav>
  )
}
