export async function subscribeToBeehiiv(email, utmMedium = 'website') {
  const res = await fetch('https://ndqjaaz5y6ddawmk6e642i4muu0eezuk.lambda-url.us-east-1.on.aws/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, utmMedium }),
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
