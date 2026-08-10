import ForgotPasswordForm from '../auth/ForgotPasswordForm'
import AuthHero from '../components/AuthHero'

export default function ForgotPasswordPage() {
  return (
    <div className="auth-page">
      <AuthHero />
      <ForgotPasswordForm />
    </div>
  )
}
