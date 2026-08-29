/**
 * ReceiptsStrip — true operational facts as texture.
 * Every fragment here is verifiable: the build stamp is injected at build
 * time, the brief/report cadence is the org's standing schedule, and the
 * demo line is a real number answered by an agent.
 */

const receipts = [
  { k: 'build', v: typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : '—', note: 'agents built · human reviewed' },
  { k: 'cadence', v: 'am-brief 07:30', note: 'pm-report 17:00' },
  { k: 'demo line', v: '(540) 584-1986', note: 'answered by an agent, 24/7', href: 'tel:+15405841986' },
  { k: 'base', v: 'provo, utah', note: 'veteran-owned · $0 VC' },
]

export default function ReceiptsStrip() {
  return (
    <div className="relative border-y border-white/[0.06] overflow-hidden">
      {/* faint circuit band behind */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage: 'url(/art/divider-texture.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="relative max-w-6xl mx-auto px-6 py-5 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4 font-mono">
        {receipts.map(({ k, v, note, href }) => (
          <div key={k} className="min-w-0">
            <div className="text-[9px] uppercase tracking-[0.2em] text-gray-600 mb-1">[{k}]</div>
            {href ? (
              <a href={href} className="text-[12px] text-gray-200 hover:text-brand-red-bright transition-colors whitespace-nowrap">{v}</a>
            ) : (
              <div className="text-[12px] text-gray-200 whitespace-nowrap">{v}</div>
            )}
            <div className="text-[9.5px] text-gray-600 truncate">{note}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
