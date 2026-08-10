import VerifyEmail from '../auth/VerifyEmail'
import AuthHero from '../components/AuthHero'

export default function VerifyEmailPage() {
  return (
    <div className="auth-page">
      <AuthHero />
      <VerifyEmail />
    </div>
  )
}
