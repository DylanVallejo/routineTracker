import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import {
  IconInicio,
  IconEjercicios,
  IconSesiones,
  IconAnalisis,
  IconProgreso,
  IconCerrarSesion,
} from './icons'

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
          <IconInicio /> Inicio
        </NavLink>
        <NavLink to="/ejercicios" className={navLinkClass}>
          <IconEjercicios /> Ejercicios
        </NavLink>
        <NavLink to="/sesiones" className={navLinkClass}>
          <IconSesiones /> Sesiones
        </NavLink>
        <NavLink to="/analisis" className={navLinkClass}>
          <IconAnalisis /> Análisis
        </NavLink>
        <NavLink to="/progreso" className={navLinkClass}>
          <IconProgreso /> Progreso
        </NavLink>
      </div>
      <div className="navbar-user">
        <span>{usuario?.nombre}</span>
        <button onClick={logout}>
          <IconCerrarSesion /> Cerrar sesión
        </button>
      </div>
    </nav>
  )
}
