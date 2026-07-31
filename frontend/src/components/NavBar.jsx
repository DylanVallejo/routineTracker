import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

function navLinkClass({ isActive }) {
  return isActive ? 'navbar-link-active' : undefined
}

export default function NavBar() {
  const { usuario, logout } = useAuth()

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        Routine<span className="navbar-brand-accent">Tracker</span>
      </div>
      <div className="navbar-links">
        <NavLink to="/" end className={navLinkClass}>
          Inicio
        </NavLink>
        <NavLink to="/ejercicios" className={navLinkClass}>
          Ejercicios
        </NavLink>
        <NavLink to="/sesiones" className={navLinkClass}>
          Sesiones
        </NavLink>
        <NavLink to="/analisis" className={navLinkClass}>
          Analisis
        </NavLink>
        <NavLink to="/progreso" className={navLinkClass}>
          Progreso
        </NavLink>
      </div>
      <div className="navbar-user">
        <span>{usuario?.nombre}</span>
        <button onClick={logout}>Cerrar sesion</button>
      </div>
    </nav>
  )
}
