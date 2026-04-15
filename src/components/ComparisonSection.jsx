export default function ComparisonSection() {
  const tdBase = { padding: '18px 20px', color: '#CBD5E1', fontSize: '14px', fontWeight: 600 }
  const tdGray = { padding: '18px 20px', textAlign: 'center', color: '#64748B', fontSize: '14px' }
  const tdHighlight = { padding: '18px 20px', textAlign: 'center', background: 'rgba(220,38,38,0.04)' }
  const rowBorder = { borderBottom: '1px solid #1E293B' }

  return (
    <section
      id="compare"
      style={{
        background: '#0F172A',
        padding: '80px 24px',
        fontFamily: "'Inter',system-ui,sans-serif",
        marginTop: '64px',
        borderRadius: '16px',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ color: '#F59E0B', fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 12px' }}>
            What you&apos;re actually buying instead of
          </p>
          <h2 style={{ color: '#FFFFFF', fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, margin: '0 0 16px', lineHeight: 1.15 }}>
            Three paths to running AI agents.<br />One price that ends.
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '17px', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
            CrewAI charges $99/month to use a framework you still have to build.
            Hiring a team costs $8k–$20k/month and takes weeks to start.
            The Atlas Starter Kit is $97. Once.
          </p>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr>
                <th style={{ padding: '16px 20px', textAlign: 'left', color: '#475569', fontSize: '13px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid #1E293B', width: '28%' }} />
                <th style={{ padding: '16px 20px', textAlign: 'center', color: '#64748B', fontSize: '14px', fontWeight: 700, borderBottom: '1px solid #1E293B', width: '24%' }}>
                  Build It Yourself
                </th>
                <th style={{ padding: '16px 20px', textAlign: 'center', color: '#64748B', fontSize: '14px', fontWeight: 700, borderBottom: '1px solid #1E293B', width: '24%' }}>
                  CrewAI<br />
                  <span style={{ fontSize: '12px', fontWeight: 400, color: '#475569' }}>Python framework</span>
                </th>
                <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '14px', fontWeight: 800, borderBottom: '2px solid #DC2626', width: '24%', background: 'rgba(220,38,38,0.06)', borderRadius: '12px 12px 0 0' }}>
                  <span style={{ color: '#F59E0B' }}>★</span>
                  <span style={{ color: '#FFFFFF' }}> Atlas Starter Kit</span><br />
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#DC2626' }}>$97 one-time</span>
                </th>
              </tr>
            </thead>
            <tbody>

              {/* Price */}
              <tr style={rowBorder}>
                <td style={tdBase}>Price</td>
                <td style={tdGray}>Engineer time<br /><span style={{ color: '#475569', fontSize: '12px' }}>+ ongoing API costs</span></td>
                <td style={tdGray}>$99 / month<br /><span style={{ color: '#475569', fontSize: '12px' }}>billed forever</span></td>
                <td style={tdHighlight}>
                  <span style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 800 }}>$97</span><br />
                  <span style={{ color: '#F59E0B', fontSize: '12px', fontWeight: 600 }}>one-time · no subscription</span>
                </td>
              </tr>

              {/* Setup time */}
              <tr style={rowBorder}>
                <td style={tdBase}>Time to first agent running</td>
                <td style={tdGray}>4–12 weeks</td>
                <td style={tdGray}>Days to weeks<br /><span style={{ color: '#475569', fontSize: '12px' }}>Python required</span></td>
                <td style={tdHighlight}>
                  <span style={{ color: '#4ADE80', fontSize: '15px', fontWeight: 700 }}>&lt; 1 day</span>
                </td>
              </tr>

              {/* Coding required */}
              <tr style={rowBorder}>
                <td style={tdBase}>Coding required</td>
                <td style={tdGray}>Yes — you build everything</td>
                <td style={tdGray}>Yes — Python<br /><span style={{ color: '#475569', fontSize: '12px' }}>framework expertise needed</span></td>
                <td style={tdHighlight}>
                  <span style={{ color: '#FFFFFF', fontSize: '14px' }}>No</span><br />
                  <span style={{ color: '#94A3B8', fontSize: '12px' }}>Claude Code config files</span>
                </td>
              </tr>

              {/* What you get */}
              <tr style={rowBorder}>
                <td style={tdBase}>What you get</td>
                <td style={tdGray}>A blank repo and a problem</td>
                <td style={tdGray}>A framework.<br /><span style={{ color: '#475569', fontSize: '12px' }}>You design the system.</span></td>
                <td style={tdHighlight}>
                  <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600, lineHeight: 1.7 }}>
                    Complete working architecture<br />
                    <span style={{ color: '#94A3B8', fontWeight: 400 }}>CLAUDE.md · coordination.md<br />spawn briefs · PAX Protocol<br />bootstrap docs · PLAN.md</span>
                  </span>
                </td>
              </tr>

              {/* Coordination protocol */}
              <tr style={rowBorder}>
                <td style={tdBase}>Agent coordination protocol</td>
                <td style={tdGray}>You design it<br /><span style={{ color: '#475569', fontSize: '12px' }}>(context drift is your problem)</span></td>
                <td style={tdGray}>Python class definitions</td>
                <td style={tdHighlight}>
                  <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600 }}>PAX Protocol included</span><br />
                  <span style={{ color: '#F59E0B', fontSize: '12px' }}>~70% token savings vs prose</span>
                </td>
              </tr>

              {/* Crash recovery */}
              <tr style={rowBorder}>
                <td style={tdBase}>Crash recovery</td>
                <td style={tdGray}>You build it</td>
                <td style={tdGray}>Not included</td>
                <td style={tdHighlight}>
                  <span style={{ color: '#4ADE80', fontSize: '13px', fontWeight: 600 }}>Watchdog pattern included</span><br />
                  <span style={{ color: '#94A3B8', fontSize: '12px' }}>auto-restart &lt;60s. tested Apr 14.</span>
                </td>
              </tr>

              {/* Scale */}
              <tr style={rowBorder}>
                <td style={tdBase}>Scale to 13+ agents</td>
                <td style={tdGray}>Needs architect</td>
                <td style={tdGray}>Possible, complex</td>
                <td style={tdHighlight}>
                  <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600 }}>Documented. Running.</span><br />
                  <span style={{ color: '#94A3B8', fontSize: '12px' }}>Pantheon god/hero hierarchy included</span>
                </td>
              </tr>

              {/* Production tested */}
              <tr style={rowBorder}>
                <td style={tdBase}>Production tested</td>
                <td style={{ ...tdGray, textAlign: 'center' }}><span style={{ color: '#EF4444', fontSize: '18px' }}>✕</span></td>
                <td style={{ textAlign: 'center', padding: '18px 20px' }}>
                  <span style={{ color: '#EF4444', fontSize: '18px' }}>✕</span><br />
                  <span style={{ color: '#475569', fontSize: '12px' }}>framework, not a running system</span>
                </td>
                <td style={tdHighlight}>
                  <span style={{ color: '#4ADE80', fontSize: '18px' }}>✓</span><br />
                  <span style={{ color: '#94A3B8', fontSize: '12px' }}>Atlas runs whoffagents.com on this kit daily</span>
                </td>
              </tr>

              {/* Failure docs */}
              <tr style={rowBorder}>
                <td style={tdBase}>Named failures + fixes included</td>
                <td style={{ textAlign: 'center', padding: '18px 20px' }}><span style={{ color: '#EF4444', fontSize: '18px' }}>✕</span></td>
                <td style={{ textAlign: 'center', padding: '18px 20px' }}><span style={{ color: '#EF4444', fontSize: '18px' }}>✕</span></td>
                <td style={tdHighlight}>
                  <span style={{ color: '#4ADE80', fontSize: '18px' }}>✓</span><br />
                  <span style={{ color: '#94A3B8', fontSize: '12px' }}>what broke, when, how we fixed it</span>
                </td>
              </tr>

              {/* Outcome framing */}
              <tr>
                <td style={tdBase}>Business outcome framing</td>
                <td style={tdGray}>None — you figure it out</td>
                <td style={tdGray}>None — developer tool</td>
                <td style={{ ...tdHighlight, borderRadius: '0 0 12px 0' }}>
                  <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600 }}>How to run a business</span><br />
                  <span style={{ color: '#94A3B8', fontSize: '12px' }}>not just how to run an agent</span>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '56px' }}>
          <p style={{ color: '#94A3B8', fontSize: '15px', margin: '0 0 8px' }}>
            CrewAI = <strong style={{ color: '#64748B' }}>$99/mo</strong> &nbsp;·&nbsp;
            DIY = <strong style={{ color: '#64748B' }}>weeks + engineer salary</strong> &nbsp;·&nbsp;
            Atlas Starter Kit = <strong style={{ color: '#F59E0B' }}>$97, once</strong>
          </p>
          <p style={{ color: '#475569', fontSize: '13px', margin: '0 0 32px' }}>After 1 month of CrewAI you&apos;ve already spent more.</p>
          <a
            href="/products"
            style={{ display: 'inline-block', background: '#DC2626', color: '#FFFFFF', fontSize: '16px', fontWeight: 700, padding: '16px 40px', borderRadius: '8px', textDecoration: 'none', letterSpacing: '0.02em' }}
          >
            Get the Atlas Starter Kit — $97
          </a>
          <p style={{ color: '#475569', fontSize: '12px', margin: '16px 0 0' }}>One-time payment. Instant download. No subscription.</p>
        </div>

      </div>
    </section>
  )
}
