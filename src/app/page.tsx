import EmailCaptureBanner from "@/components/EmailCaptureBanner";
import EmailCapturePopup from "@/components/EmailCapturePopup";
import InlineEmailFormClient from "@/components/InlineEmailFormClient";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 pointer-events-none"
             style={{
               background: "radial-gradient(ellipse at 30% 20%, rgba(200, 16, 46, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(0, 46, 93, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(255, 184, 28, 0.04) 0%, transparent 40%)"
             }} />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-block px-5 py-1.5 mb-8 rounded-full text-xs font-semibold tracking-[3px] uppercase"
               style={{ border: "1px solid var(--gold)", color: "var(--gold)" }}>
            AI Agent Toolkit
          </div>

          <h1 className="text-5xl sm:text-7xl font-black leading-[1.05] tracking-tight mb-6">
            <span className="block mb-1 text-[0.6em] font-light tracking-[6px] uppercase" style={{ color: "var(--silver)" }}>
              Welcome to
            </span>
            <span style={{ background: "linear-gradient(135deg, var(--red) 0%, #E8334D 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              WHOFF
            </span>
            <span>AGENTS</span>
          </h1>

          <p className="text-lg sm:text-xl mb-10 max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            AI-powered MCP servers, automation tools, and the exact system behind{" "}
            <strong style={{ color: "var(--gold)" }}>Atlas</strong> — an autonomous agent that built 6 products in 48 hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#products"
               className="px-8 py-4 rounded-lg font-bold text-white text-base tracking-wide transition-all"
               style={{ background: "linear-gradient(135deg, var(--red) 0%, #E02040 100%)" }}>
              Browse Products
            </a>
            <a href="#playbook"
               className="px-8 py-4 rounded-lg font-bold text-base tracking-wide transition-all"
               style={{ border: "1px solid var(--gold)", color: "var(--gold)" }}>
              Get the Free Playbook
            </a>
          </div>
        </div>
      </section>

      {/* Atlas Pilot — Coming Soon */}
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

      {/* Products Section */}
      <section id="products" className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-[3px] uppercase mb-3" style={{ color: "var(--gold)" }}>
              Products
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold">
              Built by <span style={{ color: "var(--red)" }}>Atlas</span>, Ready for You
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "AI SaaS Starter Kit", price: "$47", desc: "Production-ready Next.js + Claude + Stripe + Auth boilerplate. Deploy in an afternoon, not a week.", tag: "Best Value", link: "https://buy.stripe.com/8x2bJ39VlgEd2jt2ERaZi0i" },
              { name: "Ship Fast Skill Pack", price: "$49", desc: "Stop rebuilding auth, payments, and CI from scratch on every project. 11 Claude Code skills — battle-tested on whoffagents.com, model-agnostic, MIT-licensed. Drop into .claude/skills/ and ship today. One-time $49.", tag: "Popular", link: "https://buy.stripe.com/5kQ4gB7Nd1Jj3nx1ANaZi0a" },
              { name: "MCP Security Scanner", price: "$49/mo", desc: "Automated security scanning for MCP servers — 22 checks, CVE detection, CI/CD ready.", link: "https://buy.stripe.com/00w00ld7x3Rr3nx4MZaZi0d" },
              { name: "Trading Signals MCP", price: "$29/mo", desc: "Real-time crypto/stock technical analysis — RSI, MACD, Bollinger Bands — directly in Claude Code.", link: "https://buy.stripe.com/28EcN75F5afPcY7bbnaZi0e" },
              { name: "Workflow Automator MCP", price: "$15/mo", desc: "Automate CI/CD, deployment, testing, and project setup via 50+ MCP tool integrations.", link: "https://buy.stripe.com/14AaEZc3t87H4rBgvHaZi0f" },
              { name: "AI Content Repurposer", price: "$19/mo", desc: "Turn any article into LinkedIn posts, Twitter threads, and newsletter content automatically.", link: "https://buy.stripe.com/6oUeVfd7x0Ff4rB5R3aZi0c" },
              { name: "SEO Writer Skill", price: "$19", desc: "Claude Code skill for SEO-optimized blog posts with keyword research and meta tags built in.", link: "https://buy.stripe.com/3cI00lgjJ1Jj8HR5R3aZi0b" },
              { name: "AI Prompt Pack", price: "$9", desc: "25 battle-tested prompts Atlas uses daily. Coding, marketing, automation, strategy. Copy, paste, ship.", tag: "New — $9", link: "https://buy.stripe.com/dRm3cx8Rh87H6zJgvHaZi0k" },
              { name: "Crypto Data MCP", price: "FREE", desc: "Open-source MCP server for live cryptocurrency data and on-chain metrics.", tag: "Open Source", link: "https://github.com/Wh0FF24/crypto-data-mcp" },
            ].map((product) => (
              <div key={product.name}
                   className="relative p-6 rounded-xl transition-all hover:translate-y-[-2px]"
                   style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                {product.tag && (
                  <span className="absolute top-4 right-4 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                        style={{ background: product.price === "FREE" ? "rgba(200, 16, 46, 0.15)" : "rgba(255, 184, 28, 0.15)", color: product.price === "FREE" ? "var(--red)" : "var(--gold)" }}>
                    {product.tag}
                  </span>
                )}
                <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>{product.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-lg" style={{ color: "var(--gold)" }}>{product.price}</span>
                  {product.link && (
                    <a href={product.link} className="px-4 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90"
                       style={{ background: "var(--red)", color: "white" }}>
                      Buy Now
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Magnet Section */}
      <section id="playbook" className="px-6 py-24" style={{ background: "var(--bg-card)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-block px-5 py-1.5 mb-6 rounded-full text-xs font-semibold tracking-[3px] uppercase"
               style={{ border: "1px solid var(--gold)", color: "var(--gold)" }}>
            Free Download
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            The <span style={{ color: "var(--red)" }}>Atlas Playbook</span>
          </h2>
          <p className="text-base mb-8" style={{ color: "var(--text-secondary)" }}>
            The exact system behind a 24/7 AI agent. Includes 5 ready-to-use Claude Code prompts,
            the wake script architecture, and the full content pipeline blueprint.
          </p>

          <InlineEmailFormClient />

          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            {[
              { number: "5", label: "Claude Code Prompts" },
              { number: "6", label: "Product Blueprints" },
              { number: "48hr", label: "Build Timeline" },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-lg" style={{ background: "var(--bg-card-alt)", border: "1px solid var(--border)" }}>
                <div className="font-mono text-2xl font-extrabold" style={{ color: "var(--red)" }}>{stat.number}</div>
                <div className="text-[10px] font-medium tracking-wider uppercase mt-1" style={{ color: "var(--text-muted)" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 text-center text-xs" style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>
        <p className="mb-2">
          <span className="font-semibold tracking-wider">WHOFF<span style={{ color: "var(--red)" }}>AGENTS</span>.COM</span>
        </p>
        <p>Built by Atlas, an AI agent. &copy; 2026 whoffagents.com</p>
        <div className="flex gap-6 justify-center mt-4">
          <a href="https://dev.to/whoffagents" className="transition-colors hover:text-white" style={{ color: "var(--text-muted)" }}>Dev.to</a>
          <a href="https://youtube.com/@TheAIEdge-AW" className="transition-colors hover:text-white" style={{ color: "var(--text-muted)" }}>YouTube</a>
          <a href="https://instagram.com/atlas_whoff" className="transition-colors hover:text-white" style={{ color: "var(--text-muted)" }}>Instagram</a>
          <a href="https://github.com/Wh0FF24" className="transition-colors hover:text-white" style={{ color: "var(--text-muted)" }}>GitHub</a>
        </div>
      </footer>

      {/* Email Capture Components */}
      <EmailCaptureBanner />
      <EmailCapturePopup />

      {/* Bottom padding for sticky banner */}
      <div className="h-16" />
    </>
  );
}
