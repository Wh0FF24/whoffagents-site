const techs = ['Claude Code', 'MCP Protocol', 'Anthropic', 'React', 'Tailwind', 'Stripe', 'AWS Amplify', 'Vite', 'Python', 'Node.js']

export default function TechStrip() {
  // Double the items for seamless loop
  const items = [...techs, ...techs]

  return (
    <div className="relative py-8 overflow-hidden border-t border-brand-border">
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-brand-dark to-transparent" />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-brand-dark to-transparent" />

      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((tech, i) => (
          <span key={i} className="mx-4 text-xs uppercase tracking-widest text-gray-500 select-none">
            {tech}
            <span className="ml-8 text-gray-700">&middot;</span>
          </span>
        ))}
      </div>
    </div>
  )
}
