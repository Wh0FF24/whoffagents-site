export const products = [
  {
    id: 13,
    title: "AI Receptionist — Done-For-You Setup",
    description:
      "A 24/7 AI receptionist for your business: answers every call, qualifies the job, captures contact details, emails you summaries. Fixed-scope setup: number provisioning, custom greeting + business knowledge, routing rules, and a live test call with you before launch. Want proof first? Ask for a live demo call and talk to an agent before you spend a dollar.",
    category: "agent",
    price: "$500",
    timeline: "Setup — $500 one-time",
    buyLink: "https://buy.stripe.com/cNi7sN6J987H4rB0wJaZi0q",
    buttonLabel: "Get Set Up",
    featured: true,
  },
  {
    id: 12,
    title: "Fable 5 Skill Auditor",
    description:
      "Claude Fable 5 dropped June 9 — and Anthropic's own docs say skills written for prior models \"can degrade output quality\" on it. Some legacy patterns now trigger silent refusal-fallbacks or hard API rejections. This CLI scans your .claude/skills against 12 rules grounded in Anthropic's migration guide, flags every violation with line numbers, and auto-rewrites flagged skills lean via your local claude CLI. We ran it on our own 31-skill fleet first.",
    category: "skill",
    price: "$19",
    timeline: "NEW — Fable 5 ready",
    buyLink: "https://buy.stripe.com/4gM6oJ6J973D4rBfrDaZi0p",
    demoGif: "/demos/fable5-audit-demo.gif",
    featured: true,
  },
  {
    id: 2,
    title: "Ship Fast Skill Pack",
    description:
      "11 Claude Code skills for the unfun layer of shipping a SaaS: auth-setup, stripe-payments, deploy-config, api-builder, database-setup, testing-suite, ui-components, email-system, monitoring, seo-meta — plus context-anchor to prevent context drift mid-build. v2.0: rewritten Fable 5-lean per Anthropic's migration guide, verified clean by our own auditor (0 findings). Free updates forever. Copy into .claude/commands/ship-fast/ and go.",
    category: "skill",
    price: "$49",
    timeline: "v2.0 — Fable 5 ready",
    buyLink: "https://buy.stripe.com/5kQ4gB7Nd1Jj3nx1ANaZi0a",
    learnMoreLink: "/products/ship-fast-skill-pack",
    demoGif: "/demos/shipfast-demo.gif",
  },
  {
    id: 1,
    title: "AI SaaS Starter Kit",
    description:
      "Next.js boilerplate for AI SaaS: NextAuth (GitHub + Google OAuth), Stripe billing with 3-tier pricing + customer portal + webhooks, streaming Claude chat with per-plan limits, dashboard, Prisma (SQLite dev / Postgres prod), shadcn/ui-style components, dark mode, full TypeScript. Clone, set your keys, launch.",
    category: "kit",
    price: "$47",
    timeline: "Starter Kit — $47",
    buyLink: "https://buy.stripe.com/8x2bJ39VlgEd2jt2ERaZi0i",
    learnMoreLink: "/products/ai-saas-starter",
  },
  {
    id: 14,
    title: "context-anchor",
    description:
      "One free skill that stops your agents from starting cold. Drops a compact working reference before handoffs, breaks, or context switches. MIT licensed, no email gate — download it and go.",
    category: "skill",
    price: "Free",
    timeline: "Free — no email gate",
    learnMoreLink: "/free-skill",
  },
  {
    id: 3,
    title: "AI Prompt Pack",
    description:
      "25 battle-tested Claude Code prompts packaged as slash commands. Drop into .claude/commands/ and use immediately. Includes prompts for architecture review, debugging, code review, test generation, refactoring, and SEO content.",
    category: "skill",
    price: "$9",
    timeline: "25 prompts — $9",
    buyLink: "https://buy.stripe.com/dRm3cx8Rh87H6zJgvHaZi0k",
  },
  {
    id: 4,
    title: "SEO Writer Skill",
    description:
      'One Claude Code skill that rewrites any draft for search intent, keyword density, and linkable structure. Activates on "write SEO content" or "optimize for search."',
    category: "skill",
    price: "$19",
    timeline: "Single Skill — $19",
    buyLink: "https://buy.stripe.com/3cI00lgjJ1Jj8HR5R3aZi0b",
  },
  {
    id: 5,
    title: "Workflow Automator MCP Server",
    description:
      "Run multi-step workflows as Claude Code tool calls — trigger webhooks, chain API actions, branch on conditions. Perfect for replacing ad-hoc Zapier recipes with something your agent can reason about.",
    category: "mcp",
    price: "$15",
    timeline: "MCP Server — $15",
    buyLink: "https://buy.stripe.com/14AaEZc3t87H4rBgvHaZi0f",
  },
  {
    id: 9,
    title: "MCP Security Scanner",
    description:
      "Scan any MCP server for unsafe patterns, insecure defaults, and common misconfigurations. One-command scan, JSON output. Free tier covers the basics; Pro adds the advanced ruleset.",
    category: "mcp",
    price: "$49",
    timeline: "Scanner — $49",
    buyLink: "https://buy.stripe.com/00w00ld7x3Rr3nx4MZaZi0d",
  },
  {
    id: 10,
    title: "MCP Security Scanner Pro",
    description:
      "The Pro tier of MCP Security Scanner — full ruleset, priority signatures, and integration-ready reports. Same install, richer findings. For teams scanning at scale.",
    category: "mcp",
    price: "$149",
    timeline: "Pro Tier — $149",
    buyLink: "https://buy.stripe.com/3cIaEZ7Nd9bL1fpfrDaZi07",
  },
  {
    id: 11,
    title: "Grand Slam Offer Generator",
    description:
      "You have a product. You need an offer. Answer 8 questions. Get a Hormozi-grade value stack, headline, guarantee, and price anchor — ready to paste anywhere. 5 minutes. Free. Open source.",
    category: "skill",
    price: "Free",
    timeline: "Start Here — Free",
    githubLink: "https://github.com/Wh0FF24/grand-slam-offer-generator",
  },
];
