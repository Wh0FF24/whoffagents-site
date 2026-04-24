export async function subscribeToBeehiiv(email, utmMedium = 'website', tags = []) {
  const res = await fetch('/api/beehiiv-subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, utmMedium, ...(tags.length > 0 && { tags }) }),
  })

  const ct = res.headers.get('content-type') || ''
  if (!ct.includes('application/json')) {
    throw new Error(`Beehiiv proxy not reachable (got ${res.status} ${ct || 'no content-type'})`)
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error || body?.message || `Beehiiv error ${res.status}`)
  }
}
