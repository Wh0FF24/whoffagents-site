import { useState } from 'react'
import { motion } from 'framer-motion'
import { Coins, TrendingUp, BarChart3, Info, Clock, Check, Copy, ExternalLink, Code2 } from 'lucide-react'
import Newsletter from '../components/Newsletter'

const STRIPE_PRO_LINK = 'https://buy.stripe.com/8x26oJ6J9gEd7DN4MZaZi03'
const GITHUB_LINK = 'https://github.com/Wh0FF24/crypto-data-mcp'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
}

const tools = [
  {
    name: 'get_price',
    description: 'Current price, 24h change, market cap, volume for any token',
    icon: Coins,
  },
  {
    name: 'get_prices',
    description: 'Batch price lookup for multiple tokens at once',
    icon: TrendingUp,
  },
  {
    name: 'get_market_overview',
    description: 'Top movers, total market cap, BTC dominance, Fear & Greed',
    icon: BarChart3,
  },
  {
    name: 'get_token_info',
    description: 'Detailed metadata: ATH, supply, rank, description, website',
    icon: Info,
  },
  {
    name: 'get_historical_prices',
    description: 'Historical price data for charting and analysis',
    icon: Clock,
  },
]

const freeTierFeatures = [
  'All 5 tools included',
  'CoinGecko free tier data',
  '60s cache refresh',
  'Community support',
]

const proTierFeatures = [
  'Everything in Free',
  'WebSocket real-time feeds',
  'DEX / on-chain data',
  '5s cache refresh',
  'Priority support',
]

const configSnippet = `{
  "mcpServers": {
    "crypto-data": {
      "command": "uvx",
      "args": ["crypto-data-mcp"]
    }
  }
}`

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all duration-200 cursor-pointer"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-brand-gold" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

export default function CryptoDataMCP() {
  return (
    <div className="pt-28 pb-0 px-6">
      <div className="max-w-5xl mx-auto">

        {/* ─── Hero ─── */}
        <motion.section
          className="text-center mb-28"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.span
            variants={fadeUp}
            className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-brand-blue/20 text-white border border-brand-blue/30 mb-6"
          >
            MCP Server &middot; Free + Pro
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6"
          >
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #C0C0C0 0%, #0062B8 100%)' }}>
              Crypto Data MCP
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Real-time cryptocurrency data piped directly into your AI coding tools.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#install"
              className="text-white font-semibold px-8 py-3.5 rounded-lg hover:opacity-90 transition-opacity duration-200 text-center cursor-pointer bg-brand-red"
            >
              Install Free
            </a>
            <a
              href={STRIPE_PRO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white font-medium px-8 py-3.5 rounded-lg border border-brand-border hover:border-brand-gold/40 transition-all duration-200 text-center cursor-pointer"
            >
              Get Pro &mdash; $19/mo
            </a>
          </motion.div>
        </motion.section>

        {/* ─── What it does ─── */}
        <section className="mb-28">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What it does</h2>
            <p className="text-gray-400 max-w-lg mx-auto">Five tools that give your AI assistant full crypto market awareness.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((tool, i) => (
              <motion.div
                key={tool.name}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative group bg-brand-card border border-brand-border rounded-xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(0,46,93,0.15)]"
              >
                <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-brand-blue-light/40 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="w-10 h-10 rounded-lg bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center mb-4">
                  <tool.icon className="w-5 h-5 text-brand-blue-light" />
                </div>

                <h3 className="text-sm font-mono font-semibold text-brand-gold mb-2">{tool.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{tool.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── Installation ─── */}
        <section id="install" className="mb-28 scroll-mt-24">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Installation</h2>
            <p className="text-gray-400 max-w-lg mx-auto">Add one JSON block to your Claude Code config and you're live.</p>
          </motion.div>

          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Claude Code config */}
            <div className="bg-[#0d0d0d] border border-brand-border rounded-xl overflow-hidden mb-6">
              <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border">
                <span className="text-xs text-gray-500 font-mono">claude_desktop_config.json</span>
                <CopyButton text={configSnippet} />
              </div>
              <pre className="p-5 overflow-x-auto text-sm leading-relaxed">
                <code>
                  <span className="text-gray-500">{'{'}</span>{'\n'}
                  {'  '}<span className="text-brand-gold">"mcpServers"</span><span className="text-gray-500">: {'{'}</span>{'\n'}
                  {'    '}<span className="text-brand-gold">"crypto-data"</span><span className="text-gray-500">: {'{'}</span>{'\n'}
                  {'      '}<span className="text-brand-gold">"command"</span><span className="text-gray-500">:</span> <span className="text-green-400">"uvx"</span><span className="text-gray-500">,</span>{'\n'}
                  {'      '}<span className="text-brand-gold">"args"</span><span className="text-gray-500">:</span> <span className="text-gray-500">[</span><span className="text-green-400">"crypto-data-mcp"</span><span className="text-gray-500">]</span>{'\n'}
                  {'    '}<span className="text-gray-500">{'}'}</span>{'\n'}
                  {'  '}<span className="text-gray-500">{'}'}</span>{'\n'}
                  <span className="text-gray-500">{'}'}</span>
                </code>
              </pre>
            </div>

            {/* Manual install */}
            <div className="bg-[#0d0d0d] border border-brand-border rounded-xl overflow-hidden mb-6">
              <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border">
                <span className="text-xs text-gray-500 font-mono">Manual install</span>
                <CopyButton text="pip install crypto-data-mcp" />
              </div>
              <pre className="p-5 overflow-x-auto text-sm leading-relaxed">
                <code>
                  <span className="text-gray-500">$</span> <span className="text-white">pip install</span> <span className="text-green-400">crypto-data-mcp</span>
                </code>
              </pre>
            </div>

            {/* GitHub link */}
            <div className="flex justify-center">
              <a
                href={`https://${GITHUB_LINK}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Code2 className="w-4 h-4" />
                {GITHUB_LINK}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        </section>

        {/* ─── Pricing ─── */}
        <section className="mb-28">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Pricing</h2>
            <p className="text-gray-400 max-w-lg mx-auto">Start free. Upgrade when you need real-time data.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free tier */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative group bg-brand-card border border-brand-border rounded-xl p-8 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-brand-silver/30 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-300" />

              <h3 className="text-xl font-bold text-white mb-1">Free</h3>
              <p className="text-3xl font-extrabold text-white mb-6">
                $0<span className="text-base font-normal text-gray-500">/forever</span>
              </p>

              <ul className="space-y-3 mb-8">
                {freeTierFeatures.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5 text-sm text-gray-400">
                    <Check className="w-4 h-4 text-brand-silver shrink-0 mt-0.5" />
                    {feat}
                  </li>
                ))}
              </ul>

              <a
                href="#install"
                className="block w-full text-center text-white font-semibold px-6 py-3 rounded-lg border border-brand-border hover:border-brand-silver/40 transition-all duration-200 cursor-pointer"
              >
                Install Free
              </a>
            </motion.div>

            {/* Pro tier */}
            <motion.div
              custom={1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative group bg-brand-card border border-brand-gold/30 rounded-xl p-8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(255,184,28,0.08)]"
            >
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-bold text-white">Pro</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
                  Popular
                </span>
              </div>
              <p className="text-3xl font-extrabold text-white mb-6">
                $19<span className="text-base font-normal text-gray-500">/mo</span>
              </p>

              <ul className="space-y-3 mb-8">
                {proTierFeatures.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5 text-sm text-gray-400">
                    <Check className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                    {feat}
                  </li>
                ))}
              </ul>

              <a
                href={STRIPE_PRO_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center text-white font-semibold px-6 py-3 rounded-lg bg-brand-red hover:brightness-110 transition-all duration-200 cursor-pointer"
              >
                Get Pro
              </a>
            </motion.div>
          </div>
        </section>

        {/* ─── Newsletter ─── */}
        <Newsletter />
      </div>
    </div>
  )
}
