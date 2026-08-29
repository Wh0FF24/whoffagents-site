/**
 * TheGate — the pinned scroll-narrative scene (round 2, "03.5").
 *
 * One idea, compiled into scroll: a job travels the trace from BUILD,
 * pauses at HUMAN REVIEW while the gate blinks amber, gets the green
 * PASS stamp, and only then continues to SHIP. Scroll is the clock:
 * every beat is a pure CSS function of --px (0→1 across the 220vh
 * wrapper's transit, set by utils/fx.js on this [data-scrub] wrapper),
 * so reversing scroll reverses the story exactly. No scroll listeners
 * here — fx.js is the only scrub engine on the site.
 *
 * All Gate CSS lives in index.css under the GATE block.
 * States:
 *   no-JS / prerender  --px = 0 → legible opening frame (card at BUILD)
 *   <1024px            compact static version, no pinning (data-reveal)
 *   reduced motion     composed end-state (card at SHIP, PASS visible),
 *                      wrapper collapses — no dead scroll
 */

const RAIL = { build: '8%', gate: '50%', ship: '92%' }

function Junction({ left }) {
  return (
    <>
      <span className="gate-junction" style={{ left }} />
      <span className="gate-stub" style={{ left }} />
    </>
  )
}

export default function TheGate() {
  return (
    <section aria-label="Every job passes one human review gate: agents build, a person signs off, then it ships.">
      {/* ============ desktop: the pinned scene ============ */}
      <div className="gate-wrap hidden lg:block" data-scrub>
        <div className="gate-stage">
          <div className="gate-stage-inner">
            <p className="eyebrow mb-5">03.5 · every job passes one gate</p>
            <h2 className="gate-display">
              Nothing ships
              <br />
              without <span className="text-brand-red-bright">a human.</span>
            </h2>

            <div className="gate-rail" aria-hidden="true">
              {/* trace + red conductor segments (light behind the card) */}
              <div className="gate-trace" />
              <div className="gate-seg gate-seg-1" />
              <div className="gate-seg gate-seg-2" />
              <Junction left={RAIL.build} />
              <Junction left={RAIL.gate} />
              <Junction left={RAIL.ship} />

              {/* BUILD — green LED, agents at work */}
              <div className="gate-node gate-node--rail" style={{ left: RAIL.build }}>
                <span className="gate-led" style={{ background: '#3ECF6E' }} />
                <div className="gate-node-label">BUILD</div>
                <div className="gate-node-sub">agents · design + code</div>
              </div>

              {/* HUMAN REVIEW — the gate: double ring like ATLAS */}
              <div className="gate-node gate-node--rail gate-node--gate" style={{ left: RAIL.gate }}>
                <span className="gate-ring" />
                <span className="gate-ring-hot" />
                <span className="gate-led" style={{ background: '#3ECF6E' }} />
                {/* amber blink only during the hold window (.35–.58) —
                    window opacity on the wrapper, blink loop on the LED */}
                <span className="gate-hold gate-layer">
                  <span className="gate-led status-blink" style={{ background: '#F5A11C' }} />
                </span>
                <div className="gate-node-label">HUMAN REVIEW</div>
                <div className="gate-node-sub">checked by: Will</div>
                <div className="gate-node-sub gate-hold" style={{ color: '#F5A11C' }}>reviewing…</div>
              </div>

              {/* SHIP — red-tinted, flashes as the released job lands */}
              <div className="gate-node gate-node--rail gate-node--ship" style={{ left: RAIL.ship }}>
                <span className="gate-ship-flash" />
                <span className="gate-led" style={{ background: '#E5484D' }} />
                <div className="gate-node-label">SHIP</div>
                <div className="gate-node-sub">approved work only</div>
              </div>

              {/* PASS stamp — snaps in over the gate at px ≈ .55 */}
              <div className="gate-stamp gate-pass">APPROVED by: Will</div>

              {/* the traveling job card — plateau via two nested wrappers:
                  outer 0→42% over px 0–.35, inner 0→42% over px .62–1 */}
              <div className="gate-run-a">
                <div className="gate-run-b">
                  <div className="gate-card card-surface corner-ticks">
                    <div className="gate-card-label">your website · rev 2</div>
                    <div className="gate-card-sub">in transit · one gate ahead</div>
                  </div>
                </div>
              </div>

              {/* tail annotation — after the ship flash */}
              <div className="gate-tail mono-note">approved · shipped</div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ mobile/tablet: compact static version ============ */}
      <div className="gate-compact lg:hidden" data-reveal>
        <div className="max-w-md mx-auto w-full">
          <p className="eyebrow mb-4">03.5 · every job passes one gate</p>
          <h2 className="gate-display mb-10">
            Nothing ships without <span className="text-brand-red-bright">a human.</span>
          </h2>

          <div aria-hidden="true" className="text-center">
            <div className="gate-node inline-block text-left rv-item" style={{ '--i': 0 }}>
              <span className="gate-led" style={{ background: '#3ECF6E' }} />
              <div className="gate-node-label">BUILD</div>
              <div className="gate-node-sub">agents · design + code</div>
            </div>
            <div className="gate-vline" />
            <div className="gate-vjunction" />

            <div className="gate-node gate-node--gate inline-block text-left rv-item" style={{ '--i': 1 }}>
              <span className="gate-ring" />
              <span className="gate-led" style={{ background: '#3ECF6E' }} />
              <div className="gate-node-label">HUMAN REVIEW</div>
              <div className="gate-node-sub">checked by: Will</div>
              {/* the job, docked at the gate with its stamp */}
              <div className="gate-card-label mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                your website · rev 2
              </div>
              <div className="mt-2">
                <span className="gate-stamp">APPROVED by: Will</span>
              </div>
            </div>
            <div className="gate-vline" />
            <div className="gate-vjunction" />

            <div className="gate-node gate-node--ship inline-block text-left rv-item" style={{ '--i': 2 }}>
              <span className="gate-led" style={{ background: '#E5484D' }} />
              <div className="gate-node-label">SHIP</div>
              <div className="gate-node-sub">approved work only</div>
            </div>
          </div>

          <p className="mono-note mt-8 text-center">approved · shipped · nothing goes live unreviewed</p>
        </div>
      </div>
    </section>
  )
}
