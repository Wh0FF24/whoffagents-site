// UTM capture and Stripe passthrough utility
// Athena | 2026-04-14

export function captureUTMs() {
  const params = new URLSearchParams(window.location.search)
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']
  const captured = {}
  utmKeys.forEach(key => {
    const val = params.get(key)
    if (val) captured[key] = val
  })
  if (Object.keys(captured).length > 0) {
    sessionStorage.setItem('whoff_utms', JSON.stringify(captured))
  }
}

export function getStoredUTMs() {
  try {
    return JSON.parse(sessionStorage.getItem('whoff_utms') || '{}')
  } catch {
    return {}
  }
}

export function buildStripeURL(baseURL) {
  const utms = getStoredUTMs()
  const source = utms.utm_source || 'direct'
  const content = utms.utm_content || ''
  const id = [source, content].filter(Boolean).join('-').slice(0, 200)
  return id ? `${baseURL}?client_reference_id=${encodeURIComponent(id)}` : baseURL
}
