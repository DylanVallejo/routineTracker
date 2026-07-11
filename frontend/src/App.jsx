import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import ProtectedLayout from './components/ProtectedLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ExercisesPage from './pages/ExercisesPage'
import ExerciseFormPage from './pages/ExerciseFormPage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/ejercicios" element={<ExercisesPage />} />
          <Route path="/ejercicios/nuevo" element={<ExerciseFormPage />} />
          <Route path="/ejercicios/:id/editar" element={<ExerciseFormPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
