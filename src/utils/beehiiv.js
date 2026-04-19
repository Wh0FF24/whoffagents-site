export async function subscribeToBeehiiv(email, utmMedium = 'website') {
  const res = await fetch('/api/beehiiv-subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, utmMedium }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error || body?.message || `Beehiiv error ${res.status}`)
  }
}
