import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const nombre = localStorage.getItem('nombre')
    const correo = localStorage.getItem('correo')
    return nombre && correo ? { nombre, correo } : null
  })

  const login = ({ token, nombre, correo }) => {
    localStorage.setItem('token', token)
    localStorage.setItem('nombre', nombre)
    localStorage.setItem('correo', correo)
    setUsuario({ nombre, correo })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('nombre')
    localStorage.removeItem('correo')
    setUsuario(null)
  }

  const value = useMemo(() => ({ usuario, login, logout }), [usuario])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
