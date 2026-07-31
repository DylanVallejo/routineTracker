import RegisterForm from '../auth/RegisterForm'
import AuthHero from '../components/AuthHero'

export default function RegisterPage() {
  return (
    <div className="auth-page">
      <AuthHero />
      <RegisterForm />
    </div>
  )
}
