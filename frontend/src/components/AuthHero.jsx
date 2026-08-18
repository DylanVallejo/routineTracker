import { useEffect, useState } from 'react'

const FRASES = [
  'Controla tus rutinas',
  'Cumple tus metas',
  'Registra tu progreso',
  'Analiza tus resultados',
  'Supera tus limites',
]

export default function AuthHero() {
  const [indice, setIndice] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let cambioId
    const cicloId = setInterval(() => {
      setVisible(false)
      cambioId = setTimeout(() => {
        setIndice((i) => (i + 1) % FRASES.length)
        setVisible(true)
      }, 400)
    }, 2600)

    return () => {
      clearInterval(cicloId)
      clearTimeout(cambioId)
    }
  }, [])

  return (
    <div className="auth-hero">
      <img
        src="/animations/man-running.svg"
        alt=""
        className="auth-hero-animation"
      />
      <div className="auth-hero-content">
        <h1 className="auth-hero-brand">
          Routine<span className="auth-hero-brand-accent">Tracker</span>
        </h1>
        <div className="auth-hero-lower">
          <p className="auth-hero-tagline">Tu progreso, bajo control.</p>
          <div className="auth-hero-frase-wrap">
            <p className={`auth-hero-frase${visible ? ' is-visible' : ''}`}>
              {FRASES[indice]}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
