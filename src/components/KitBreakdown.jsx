import { motion } from 'framer-motion'
import { FileText, Settings, Bot, BookOpen, Zap, FolderOpen, FlaskConical, Shield } from 'lucide-react'

const fileCategories = [
  { icon: BookOpen, label: 'Setup & Docs', files: 3, detail: 'README.md, QUICKSTART.md, .env.example' },
  { icon: Settings, label: 'Automation', files: 2, detail: 'init.js, package.json' },
  { icon: Bot, label: 'Agent Profiles', files: 2, detail: 'kit-researcher.yaml, kit-writer.yaml' },
  { icon: FileText, label: 'Architecture Docs', files: 2, detail: 'pax-protocol.md, full-pantheon.md' },
  { icon: Zap, label: 'Skills', files: 2, detail: 'agent-handoff/SKILL.md, context-anchor/SKILL.md' },
  { icon: FolderOpen, label: 'Vault Template', files: 6, detail: 'Hub.md + 5 placeholder dirs with README' },
  { icon: FlaskConical, label: 'Examples', files: 2, detail: 'research-001.md, draft-001.md' },
]

const items = [
  {
    title: 'QUICKSTART.md — Your First Agent in 5 Minutes',
    body: 'Step-by-step walkthrough: configure, initialize, run the Researcher, watch it hand off to the Writer. Includes expected terminal output at each step. Troubleshooting table covers the 6 most common setup failures with exact fixes.',
    why: 'Most agent kits ship a README that assumes you already know how everything fits together. This assumes you don\'t — and gets you to a working pipeline anyway.',
  },
  {
    title: '.env.example — 5-Line Config',
    body: 'Copy it to .env, fill in your Anthropic API key and 4 path variables. No YAML, no JSON, no config files nested in config files.',
    why: 'Zero-dependency setup. No dotenv package required — init.js parses it directly. You know exactly what every variable does because there are only 5 of them.',
  },
  {
    title: 'init.js — One-Command Setup',
    body: 'Run node init.js after filling in .env. Creates your output directories, generates coordination.md pre-loaded with TASK-001, and installs both agent profiles to ~/.claude/profiles/. Pure Node.js stdlib. Node 18+.',
    why: 'The single biggest friction point in agent kit setup is "I did all the steps and nothing works." init.js eliminates that.',
  },
  {
    title: 'profiles/kit-researcher.yaml — Ready-to-Run Researcher',
    body: 'A complete Claude Code agent profile. Reads coordination.md for its task, researches the topic, writes structured output to sessions/research-{N}.md with findings, sources, and a handoff recommendation. Includes rules for edge cases: no pending tasks, unavailable sources, fabricated findings prevention.',
    why: 'This profile defines exact operating rules, output format, file naming conventions, and fallback behavior. The difference between an agent that mostly works and one that works reliably.',
  },
  {
    title: 'profiles/kit-writer.yaml — Ready-to-Run Writer',
    body: 'Companion to the Researcher. Polls coordination.md for a completed Researcher task (checks every 30s, times out at 10 minutes). Writes a polished draft to sessions/draft-{N}.md. Quality rules built in: no filler sentences, concrete over vague, thin research gets flagged not padded.',
    why: 'Run the Writer before the Researcher finishes — it waits. Run them simultaneously — no race condition. This is what real pipeline reliability looks like.',
  },
  {
    title: 'docs/pax-protocol.md — Inter-Agent Message Format',
    body: 'PAX (Agent eXchange) Protocol cuts coordination overhead ~70% vs plain English. Full symbol library, standard field reference, 4 worked examples (handoff, blocker escalation, orchestrator dispatch, ack). Goal ancestry format for 4+ agent fleets.',
    why: 'At 2 agents, token efficiency is a nice-to-have. At 4+ agents running in parallel, inter-agent communication becomes a real cost. PAX keeps it tight.',
  },
  {
    title: 'docs/full-pantheon.md — Scale from 2 Agents to 13',
    body: 'Three-tier model: Orchestrators (Opus), Gods (Sonnet, domain ownership), Heroes (Haiku, 5x lower cost). Full 13-agent fleet roster — the exact agents running whoffagents.com. Token cost reference: 2-agent ($5-20/mo), 5-agent ($50-150), 13-agent ($200-500). The crossover point vs managed platforms.',
    why: 'The 2-agent quickstart is the proof of concept. This doc is the growth path. You\'re not buying a toy — you\'re buying the pattern that scales to a fully automated operation.',
  },
  {
    title: 'skills/ — /handoff and /anchor (Install Once, Use Everywhere)',
    body: '/handoff extracts current session state into a structured handoff packet before dispatching any subagent. /anchor prevents cascading context drift — run it when switching tasks, resuming after a break, or handing off between agents.',
    why: 'Subagent failure is almost never a model capability problem. It\'s a context problem. The handoff packet and anchor together fix it.',
  },
  {
    title: 'vault-template/ — File-Based Shared State',
    body: 'Full folder structure for your agent fleet: coordination.md (shared task board), AGENTS.md (fleet roster + PAX codes), per-agent Hub.md + sessions/ dirs, coordination/shared, inbox, outbox. Four operating rules enforced from day one.',
    why: 'Without a consistent structure, agents write output wherever, coordination.md becomes inconsistent, and debugging breaks become archaeology.',
  },
]

const roadmap = [
  { label: 'Day 1', text: 'Run the 2-agent quickstart. Researcher writes research. Writer writes draft. Done in 10 minutes.' },
  { label: 'Week 1', text: 'Add a third agent. Wire in PAX for status reports. Add your first persistent tmux session.' },
  { label: 'Month 1', text: '5-agent god tier. Orchestrator dispatching work. Heroes handling bulk tasks. Coordination at scale using the full vault structure.' },
  { label: 'Month 3', text: '13-agent Pantheon. Same pattern. More agents. Running your business autonomously while you build the next thing.' },
]

export default function KitBreakdown() {
  return (
    <motion.section
      className="mt-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-brand-gold/10 text-brand-gold border border-brand-gold/20 mb-4">
          Atlas Starter Kit v1.0
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">What's Inside</h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          19 files. Every one earns its place. Here's exactly what you get and why it matters.
        </p>
      </div>

      {/* File count grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-14">
        {fileCategories.map((cat) => (
          <div
            key={cat.label}
            className="bg-brand-card border border-brand-border rounded-xl p-4 flex flex-col gap-1.5"
          >
            <div className="flex items-center gap-2 mb-1">
              <cat.icon className="w-4 h-4 text-brand-gold" />
              <span className="text-white text-sm font-semibold">{cat.label}</span>
            </div>
            <span className="text-2xl font-extrabold text-brand-gold leading-none">{cat.files}</span>
            <span className="text-gray-500 text-xs leading-snug">{cat.detail}</span>
          </div>
        ))}
        {/* Total */}
        <div className="bg-brand-red/10 border border-brand-red/30 rounded-xl p-4 flex flex-col gap-1.5 justify-center">
          <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Total</span>
          <span className="text-3xl font-extrabold text-brand-red leading-none">19</span>
          <span className="text-gray-400 text-xs">production files</span>
        </div>
      </div>

      {/* Item breakdown */}
      <div className="space-y-4 mb-14">
        {items.map((item, i) => (
          <details
            key={i}
            className="group bg-brand-card border border-brand-border rounded-xl overflow-hidden"
          >
            <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none select-none">
              <span className="text-white font-medium text-sm md:text-base">{item.title}</span>
              <svg
                className="w-4 h-4 text-gray-500 transition-transform duration-200 group-open:rotate-180 flex-shrink-0 ml-4"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-6 pb-5 border-t border-brand-border pt-4 space-y-3">
              <p className="text-gray-300 text-sm leading-relaxed">{item.body}</p>
              <div className="flex gap-2">
                <span className="text-brand-gold text-xs font-semibold flex-shrink-0">Why it matters:</span>
                <p className="text-gray-400 text-xs leading-relaxed">{item.why}</p>
              </div>
            </div>
          </details>
        ))}
      </div>

      {/* Roadmap */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-8 mb-8">
        <h3 className="text-white font-bold text-lg mb-6">What You Can Build With This</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {roadmap.map((step, i) => (
            <div key={i} className="flex flex-col gap-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-brand-red/10 text-brand-red border border-brand-red/20 w-fit">
                {step.label}
              </span>
              <p className="text-gray-400 text-sm leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-gray-500 text-sm border-t border-brand-border pt-4">
          The kit is the foundation. The pattern is the product. Every agent you add runs the same coordination model —&nbsp;
          <code className="text-brand-gold bg-white/5 px-1.5 py-0.5 rounded text-xs">coordination.md</code> as the task board, files for output, handoff packets for context transfer.{' '}
          <span className="text-white font-medium">This is how Atlas runs whoffagents.com. You're getting the exact infrastructure.</span>
        </p>
      </div>

      {/* Guarantee */}
      <div className="flex items-start gap-4 bg-brand-gold/5 border border-brand-gold/20 rounded-2xl p-6">
        <Shield className="w-6 h-6 text-brand-gold flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-white font-semibold mb-1">The Guarantee</h4>
          <p className="text-gray-400 text-sm leading-relaxed">
            Follow QUICKSTART.md. If you don't have a working pipeline in 24 hours, email{' '}
            <a href="mailto:atlas@whoffagents.com" className="text-brand-gold hover:text-white transition-colors">
              atlas@whoffagents.com
            </a>
            . No ticket system. No chatbot. The agent that built this kit answers directly.
          </p>
        </div>
      </div>
    </motion.section>
  )
}
