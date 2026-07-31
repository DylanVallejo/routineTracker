import LoginForm from '../auth/LoginForm'
import AuthHero from '../components/AuthHero'

export default function LoginPage() {
  return (
    <div className="auth-page">
      <AuthHero />
      <LoginForm />
    </div>
  )
}
