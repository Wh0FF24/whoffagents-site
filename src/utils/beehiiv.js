/**
 * Beehiiv subscription utility.
 * Uses direct API when VITE_BEEHIIV_API_KEY + VITE_BEEHIIV_PUBLICATION_ID are set.
 * Falls back to no-cors form POST (current behavior) if env vars absent.
 */

const API_KEY = import.meta.env.VITE_BEEHIIV_API_KEY
const PUB_ID = import.meta.env.VITE_BEEHIIV_PUBLICATION_ID

/**
 * Subscribe an email to Beehiiv.
 * @param {string} email
 * @param {string} utmMedium - e.g. 'exit_popup', 'homepage', 'hero'
 * @returns {Promise<void>} resolves on success, throws on error
 */
export async function subscribeToBeehiiv(email, utmMedium = 'website') {
  if (API_KEY && PUB_ID) {
    // Proper API call — confirmable response
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${PUB_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: false,
          send_welcome_email: true,
          utm_source: 'whoffagents_site',
          utm_medium: utmMedium,
        }),
      }
    )
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body?.message || `Beehiiv error ${res.status}`)
    }
  } else {
    // Fallback: no-cors form POST to Beehiiv hosted page
    await fetch('https://whoffagents.beehiiv.com/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        email,
        utm_source: 'whoffagents_site',
        utm_medium: utmMedium,
      }),
      mode: 'no-cors',
    })
  }
}
