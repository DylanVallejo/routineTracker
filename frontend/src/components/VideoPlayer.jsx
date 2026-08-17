import { useState } from 'react'
import { urlEmbedYoutube, urlMiniaturaYoutube } from '../utils/youtube'

export default function VideoPlayer({ url, titulo }) {
  const [reproduciendo, setReproduciendo] = useState(false)
  const embedUrl = urlEmbedYoutube(url)

  if (!embedUrl) return null

  if (reproduciendo) {
    return (
      <div className="video-embed">
        <iframe
          src={`${embedUrl}?autoplay=1`}
          title={titulo}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      className="video-thumbnail"
      onClick={() => setReproduciendo(true)}
      aria-label={`Reproducir video de ${titulo}`}
    >
      <img src={urlMiniaturaYoutube(url)} alt="" />
      <span className="video-play-icon">&#9654;</span>
    </button>
  )
}
