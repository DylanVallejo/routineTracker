import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import ProtectedLayout from './components/ProtectedLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import DashboardPage from './pages/DashboardPage'
import ExercisesPage from './pages/ExercisesPage'
import ExerciseFormPage from './pages/ExerciseFormPage'
import SessionsPage from './pages/SessionsPage'
import SessionFormPage from './pages/SessionFormPage'
import SessionDetailPage from './pages/SessionDetailPage'
import MuscleAnalysisPage from './pages/MuscleAnalysisPage'
import ProgressPage from './pages/ProgressPage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/recuperar" element={<ForgotPasswordPage />} />
        <Route path="/restablecer" element={<ResetPasswordPage />} />
        <Route path="/verificar" element={<VerifyEmailPage />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/ejercicios" element={<ExercisesPage />} />
          <Route path="/ejercicios/nuevo" element={<ExerciseFormPage />} />
          <Route path="/ejercicios/:id/editar" element={<ExerciseFormPage />} />
          <Route path="/sesiones" element={<SessionsPage />} />
          <Route path="/sesiones/nueva" element={<SessionFormPage />} />
          <Route path="/sesiones/:id" element={<SessionDetailPage />} />
          <Route path="/sesiones/:id/editar" element={<SessionFormPage />} />
          <Route path="/analisis" element={<MuscleAnalysisPage />} />
          <Route path="/progreso" element={<ProgressPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
