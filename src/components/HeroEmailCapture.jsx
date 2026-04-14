"use client";

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { subscribeToBeehiiv } from '../utils/beehiiv'
import { track } from '../utils/analytics'

export default function HeroEmailCapture() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await subscribeToBeehiiv(email, 'hero_inline')
      track('Email-Capture', { source: 'hero_inline' })
      setStatus('success')
      setTimeout(() => navigate('/thank-you'), 800)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="text-sm font-semibold" style={{ color: 'var(--gold, #FFB81C)' }}>
        You&apos;re in — check your inbox.
      </p>
    )
  }

  return (
    <div className="mt-10 flex flex-col items-center gap-2">
      <p className="text-xs font-semibold tracking-widest uppercase text-gray-500">
        or get the free guide first
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full max-w-sm">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 px-4 py-2.5 rounded-lg text-sm bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-all"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white border border-brand-gold/50 hover:border-brand-gold hover:bg-brand-gold/10 transition-all duration-200 whitespace-nowrap cursor-pointer disabled:opacity-50"
        >
          {status === 'loading' ? 'Sending...' : '5-Step Guide — Free'}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-xs text-brand-red">Something went wrong. Try again.</p>
      )}
    </div>
  )
}
