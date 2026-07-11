import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import ProtectedRoute from '../auth/ProtectedRoute'

export default function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <NavBar />
      <Outlet />
    </ProtectedRoute>
  )
}
