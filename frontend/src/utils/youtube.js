export function extraerIdYoutube(url) {
  if (!url) return null
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.slice(1) || null
    }
    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname === '/watch') return parsed.searchParams.get('v')
      if (parsed.pathname.startsWith('/embed/')) return parsed.pathname.split('/embed/')[1]
      if (parsed.pathname.startsWith('/shorts/')) return parsed.pathname.split('/shorts/')[1]
    }
  } catch {
    return null
  }
  return null
}

export function urlEmbedYoutube(url) {
  const id = extraerIdYoutube(url)
  return id ? `https://www.youtube.com/embed/${id}` : null
}

export function urlMiniaturaYoutube(url) {
  const id = extraerIdYoutube(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}
