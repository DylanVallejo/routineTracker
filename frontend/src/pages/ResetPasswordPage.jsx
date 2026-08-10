import ResetPasswordForm from '../auth/ResetPasswordForm'
import AuthHero from '../components/AuthHero'

export default function ResetPasswordPage() {
  return (
    <div className="auth-page">
      <AuthHero />
      <ResetPasswordForm />
    </div>
  )
}
