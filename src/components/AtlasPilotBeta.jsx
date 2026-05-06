export default function AtlasPilotBeta() {
  return (
    <section id="atlas-pilot" className="px-6 py-24" style={{ background: "var(--bg-card)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[3px] uppercase mb-3" style={{ color: "var(--gold)" }}>
            Now in Founder Beta — capped at 3 customers
          </p>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-6">
            <span style={{ background: "linear-gradient(135deg, var(--red) 0%, #E8334D 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Atlas Pilot
            </span>
          </h2>
          <p className="text-xl sm:text-2xl font-semibold mb-3 max-w-3xl mx-auto">
            An AI colleague for your executive team — on premises, on your AI account, on your terms.
          </p>
          <p className="text-base mb-8 max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Atlas Pilot is a dedicated computer that lives at your office, talks to your team through Microsoft Teams, and actually completes work end-to-end. It does not just generate text — it reads your documents, drafts your proposals, compiles them to PDF, sends emails on your team's behalf when authorized, and follows up on tasks. Built for federal contractors and operations-heavy teams who need work done, not chat suggestions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-lg" style={{ border: "1px solid var(--gold)", background: "rgba(0, 0, 0, 0.2)" }}>
            <div className="text-xs font-bold tracking-[2px] uppercase mb-3" style={{ color: "var(--gold)" }}>Does Real Work</div>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Reads RFPs. Drafts proposals. Compiles to PDF. Sends to the right inbox. Schedules follow-ups. End-to-end, not text in a chat window.
            </p>
          </div>
          <div className="p-6 rounded-lg" style={{ border: "1px solid var(--gold)", background: "rgba(0, 0, 0, 0.2)" }}>
            <div className="text-xs font-bold tracking-[2px] uppercase mb-3" style={{ color: "var(--gold)" }}>Lives at Your Office</div>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              On-premises Mac mini on your network. Your data stays at your facility. Your AI provider account, billed direct to you. We never see your conversations or your bill.
            </p>
          </div>
          <div className="p-6 rounded-lg" style={{ border: "1px solid var(--gold)", background: "rgba(0, 0, 0, 0.2)" }}>
            <div className="text-xs font-bold tracking-[2px] uppercase mb-3" style={{ color: "var(--gold)" }}>Learns Your Company</div>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Remembers your team's voice, conventions, client roster, templates. Connects to Box, SharePoint, OneDrive. The Atlas Pilot you have at month 12 knows your business in a way no chatbot can.
            </p>
          </div>
        </div>

        <div className="text-center mb-10">
          <p className="text-sm font-semibold mb-2" style={{ color: "var(--silver)" }}>Founder Beta Pricing — locked for life</p>
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>
            <strong style={{ color: "white" }}>$3,500 upfront</strong> (hardware + setup + onboarding) + <strong style={{ color: "white" }}>$400/month retainer</strong>. Customer brings own AI provider account (typically AWS or Azure on existing cloud contract).
          </p>
          <p className="text-xs mt-2" style={{ color: "var(--text-secondary)" }}>
            Post-beta retail expected $700-900/month. Founding customers locked in at $400/mo permanently.
          </p>
        </div>

        <div className="text-center">
          <a href="mailto:atlas@whoffagents.com?subject=Atlas%20Pilot%20Founder%20Beta%20-%20Interest"
             className="inline-block px-8 py-4 rounded-lg font-bold text-white text-base tracking-wide transition-all"
             style={{ background: "linear-gradient(135deg, var(--red) 0%, #E02040 100%)" }}>
            Request the Founder Beta packet →
          </a>
          <p className="text-xs mt-4" style={{ color: "var(--text-secondary)" }}>
            Reach Atlas directly: <a href="mailto:atlas@whoffagents.com" style={{ color: "var(--gold)" }}>atlas@whoffagents.com</a>
          </p>
        </div>
      </div>
    </section>
  )
}
