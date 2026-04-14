import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You — WhoffAgents",
  description: "Your Atlas Playbook is on the way.",
};

export default function ThankYou() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-xl mx-auto text-center">
          {/* Success indicator */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-2xl font-bold text-white"
               style={{ background: "linear-gradient(135deg, var(--red) 0%, #E02040 100%)" }}>
            &#10003;
          </div>

          <h1 className="text-4xl font-extrabold mb-4">
            You are <span style={{ color: "var(--gold)" }}>in</span>.
          </h1>

          <p className="text-lg mb-2" style={{ color: "var(--text-secondary)" }}>
            The Atlas Playbook is on its way to your inbox.
          </p>
          <p className="text-sm mb-10" style={{ color: "var(--text-muted)" }}>
            Check your email (and spam folder, just in case). The PDF will be attached.
          </p>

          {/* Divider */}
          <div className="w-16 h-0.5 mx-auto mb-10"
               style={{ background: "linear-gradient(90deg, var(--red), var(--gold))" }} />

          {/* Upsell: Starter Kit */}
          <div className="p-8 rounded-2xl text-left"
               style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>

            <p className="text-xs font-bold tracking-[3px] uppercase mb-3" style={{ color: "var(--gold)" }}>
              Recommended Next Step
            </p>

            <h2 className="text-2xl font-extrabold mb-3">
              The Atlas <span style={{ color: "var(--red)" }}>Starter Kit</span>
            </h2>

            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              The Playbook shows you the system. The Starter Kit gives you everything to build it yourself:
            </p>

            <ul className="space-y-3 mb-8">
              {[
                "Complete wake script setup (launchd + bash + Claude Code)",
                "5 production-ready MCP server templates (TypeScript)",
                "The full content pipeline codebase (Python + Node.js)",
                "Video walkthrough: \"Build Your Jarvis\" (45 min)",
                "Private Discord access — direct support from Atlas",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 w-5 h-5 flex-shrink-0 rounded flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ background: "var(--red)" }}>
                    &#10003;
                  </span>
                  <span style={{ color: "var(--text-secondary)" }}>{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a href="https://whoffagents.com"
                 className="inline-block px-8 py-4 rounded-lg font-bold text-white text-base tracking-wide transition-all animate-pulse-glow"
                 style={{ background: "linear-gradient(135deg, var(--red) 0%, #E02040 100%)" }}>
                Get the Starter Kit — $99
              </a>
              <div>
                <span className="line-through text-sm" style={{ color: "var(--text-muted)" }}>$149</span>
                <span className="ml-2 text-sm font-bold" style={{ color: "var(--gold)" }}>Save $50</span>
              </div>
            </div>

            <p className="text-xs mt-4" style={{ color: "var(--text-muted)" }}>
              One-time purchase. Lifetime updates. 30-day money-back guarantee.
            </p>
          </div>

          {/* Secondary CTAs */}
          <div className="mt-10 grid grid-cols-2 gap-4">
            <a href="https://dev.to/whoffagents"
               className="p-4 rounded-xl text-center transition-all hover:translate-y-[-2px]"
               style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <p className="text-sm font-bold mb-1">Read the Blog</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>600+ articles on dev.to</p>
            </a>
            <a href="https://youtube.com/@TheAIEdge-AW"
               className="p-4 rounded-xl text-center transition-all hover:translate-y-[-2px]"
               style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <p className="text-sm font-bold mb-1">Watch Atlas Build</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>YouTube Shorts</p>
            </a>
          </div>

          {/* Back to home */}
          <a href="/" className="inline-block mt-8 text-sm font-medium transition-colors"
             style={{ color: "var(--text-muted)" }}>
            &larr; Back to whoffagents.com
          </a>
        </div>
      </main>
    </div>
  );
}
