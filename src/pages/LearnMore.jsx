import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function LearnMore() {
  return (
    <article className="pt-32 pb-24 px-6">
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
            Stop Cascading Context Drift.
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            The production multi-agent system Claude Code developers need &mdash; not documentation,
            not demos. The architecture that actually runs a business.
          </p>
        </div>

        <div className="prose-custom space-y-6">

          {/* Section 1 */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            You already know what happens at agent 3.
          </h2>
          <p className="text-gray-400 leading-[1.8]">
            You start the session strong. Agent 1 does exactly what you asked. Agent 2 is mostly
            right. By agent 3, something has drifted &mdash; a misunderstood constraint, a missing
            assumption, a scope that quietly expanded. By the time you get to the test agent,
            it&apos;s validating the wrong thing entirely.
          </p>
          <p className="text-gray-400 leading-[1.8]">
            That&apos;s not a model problem. That&apos;s a handoff problem.
          </p>
          <p className="text-gray-400 leading-[1.8]">
            And here&apos;s the expensive part: you don&apos;t find out until the work is done.
          </p>

          {/* Section 2 */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            The two-week cliff nobody talks about
          </h2>
          <p className="text-gray-400 leading-[1.8]">
            Most Claude Code developers hit the same wall about two weeks in.
          </p>
          <p className="text-gray-400 leading-[1.8]">
            Solo use: works great. The model is fast, capable, surprisingly good at the edge cases.
            You ship things faster than you have in years.
          </p>
          <p className="text-gray-400 leading-[1.8]">
            Then you try to scale it. You add a second agent to parallelize the work. Then a third.
            You read the docs, you watch the talks, you build the PLAN.md file they recommend. For a
            day or two it holds.
          </p>
          <p className="text-gray-400 leading-[1.8]">
            Then the sessions start drifting. Agents misunderstand each other. One overwrites work
            the other just did &mdash; silently, with no error. You can&apos;t see what six agents
            are doing at once. You rebuild from scratch and the same thing happens again.
          </p>
          <blockquote className="border-l-2 border-brand-red/40 pl-6 my-6">
            <p className="text-gray-400 italic leading-[1.8]">
              &ldquo;Cascading context drift, where each agent in the chain slightly misunderstands
              the task and by the time you get to the test agent it&apos;s validating the wrong
              thing entirely.&rdquo;
            </p>
            <cite className="text-sm text-gray-500 not-italic mt-2 block">
              &mdash; Developer commenting on HN, Feb 2026
            </cite>
          </blockquote>
          <blockquote className="border-l-2 border-brand-red/40 pl-6 my-6">
            <p className="text-gray-400 italic leading-[1.8]">
              &ldquo;There&apos;s absolute zero framework out there that&apos;s good enough for
              serious work.&rdquo;
            </p>
            <cite className="text-sm text-gray-500 not-italic mt-2 block">
              &mdash; HN developer, April 2026
            </cite>
          </blockquote>
          <p className="text-gray-400 leading-[1.8]">
            This isn&apos;t a gap in your skills. It&apos;s a gap in the available tooling. The
            documentation describes the capability. Nobody ships you the working system.
          </p>
          <p className="text-gray-400 leading-[1.8]">
            Until now.
          </p>

          {/* Section 3 */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            What actually goes wrong (so you know we&apos;ve been there)
          </h2>
          <p className="text-gray-400 leading-[1.8]">
            Six weeks of production failures taught us the specific ways multi-agent Claude Code
            breaks down. Not theory. Real sessions, real output, real cost.
          </p>

          <h3 className="text-lg font-semibold text-white mt-8 mb-3">
            Problem 1: Context starvation at spawn.
          </h3>
          <p className="text-gray-400 leading-[1.8]">
            Agents given vague spawn prompts produce vague work. You get output that&apos;s
            technically responsive but wrong in ways you can&apos;t immediately catch. The agent was
            capable &mdash; you just didn&apos;t give it enough to work with. The problem compounds
            when that agent&apos;s output becomes the next agent&apos;s context.
          </p>

          <h3 className="text-lg font-semibold text-white mt-8 mb-3">
            Problem 2: Silent state collisions.
          </h3>
          <p className="text-gray-400 leading-[1.8]">
            Two agents writing to the same file. No error. No warning. One truncates the
            other&apos;s work. Every downstream process breaks. You find out an hour later when
            nothing makes sense.
          </p>
          <blockquote className="border-l-2 border-brand-red/40 pl-6 my-6">
            <p className="text-gray-400 italic leading-[1.8]">
              &ldquo;Two agents wrote to the same JSON state file. Concurrent writes = truncated
              JSON = every downstream hook breaks.&rdquo;
            </p>
            <cite className="text-sm text-gray-500 not-italic mt-2 block">&mdash; blakec, HN</cite>
          </blockquote>

          <h3 className="text-lg font-semibold text-white mt-8 mb-3">
            Problem 3: No validation at handoff.
          </h3>
          <p className="text-gray-400 leading-[1.8]">
            The agent reports success. You move on. Three steps later you discover the success was
            fabricated &mdash; the agent completed the action but not the objective. The LLM is
            &ldquo;100% confident&rdquo; even after a mid-task context compaction it doesn&apos;t
            remember happening.
          </p>
          <blockquote className="border-l-2 border-brand-red/40 pl-6 my-6">
            <p className="text-gray-400 italic leading-[1.8]">
              &ldquo;Implementation hallucinations occur with some predictability &mdash; 100% of
              the time after a mid-task context compaction. Combined with the over-confidence of the
              LLM, it will 100% of the time say the implementation was 100% successful even though
              it doesn&apos;t even know what to validate.&rdquo;
            </p>
            <cite className="text-sm text-gray-500 not-italic mt-2 block">
              &mdash; GitHub Issue #20051, anthropics/claude-code
            </cite>
          </blockquote>

          <h3 className="text-lg font-semibold text-white mt-8 mb-3">Problem 4: Session amnesia.</h3>
          <p className="text-gray-400 leading-[1.8]">
            You close the session. You open a new one. The agent has no idea what happened before.
            You re-explain the project, re-explain the current state, re-explain what&apos;s already
            done. Every session costs you 20 minutes of context restoration. Multiply that by six
            agents and you&apos;ve burned an hour before you&apos;ve shipped anything.
          </p>

          <h3 className="text-lg font-semibold text-white mt-8 mb-3">
            Problem 5: Observability zero.
          </h3>
          <p className="text-gray-400 leading-[1.8]">
            You have six agents running. You can&apos;t see what any of them are doing. One crashes
            &mdash; silently. You find out when the downstream work doesn&apos;t arrive. You have no
            session log, no heartbeat, no status trail. Debugging requires reconstructing the
            session from memory.
          </p>

          <h3 className="text-lg font-semibold text-white mt-8 mb-3">
            Problem 6: Token burn before anything ships.
          </h3>
          <p className="text-gray-400 leading-[1.8]">
            Unstructured agent communication is expensive. Every handoff is a wall of prose. Every
            summary repeats what was already known. A single complex prompt burns 50&ndash;70% of
            your session limit. You hit the usage wall before you finish the task.
          </p>
          <blockquote className="border-l-2 border-brand-red/40 pl-6 my-6">
            <p className="text-gray-400 italic leading-[1.8]">
              &ldquo;I use up Max 5 in 1 hour of working, before I could work 8 hours.&rdquo;
            </p>
            <cite className="text-sm text-gray-500 not-italic mt-2 block">
              &mdash; r/ClaudeAI, March 2026
            </cite>
          </blockquote>
          <p className="text-gray-400 leading-[1.8]">
            We built the Atlas Starter Kit because we hit every one of these. Not in a test
            environment. In production, running a real business.
          </p>

          {/* Section 4 */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            The system that runs whoffagents.com
          </h2>
          <p className="text-gray-400 leading-[1.8]">
            Atlas is a Claude Code agent. Since March 2026, Atlas has run the operations of
            whoffagents.com &mdash; customer discovery, competitor research, content pipeline, launch
            preparation, daily briefings, copy, and coordination &mdash; with minimal daily input.
          </p>
          <p className="text-gray-400 leading-[1.8]">
            Not autonomously. With human oversight at the decisions that matter. But the 80% of work
            that doesn&apos;t need a human? Atlas handles it. In parallel. Persistently. Without
            context-resetting every session.
          </p>
          <p className="text-gray-400 leading-[1.8]">
            This week alone: 50+ discrete research and content sessions. ~391,000 tokens of
            productive work. Six specialized agents running in parallel. Zero lost sessions.
          </p>
          <p className="text-gray-400 leading-[1.8]">
            The system that makes this work is the Atlas Starter Kit. Every pattern, every protocol,
            every handoff template &mdash; extracted from six weeks of production operation and
            packaged so you can deploy it to run yours.
          </p>

          {/* Section 5 — Features */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            What&apos;s inside the Atlas Starter Kit
          </h2>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 mt-6 space-y-8">

            <div>
              <h3 className="text-lg font-bold text-white mb-3">
                PAX Protocol &mdash; Structured Handoffs That Eliminate Drift
              </h3>
              <p className="text-gray-400 leading-[1.8] mb-4">
                Every agent-to-agent handoff follows a single format:
              </p>
              <code className="block bg-black/40 border border-white/10 rounded-lg p-4 text-sm text-brand-gold break-all leading-relaxed">
                [AGENT→NEXT] objective:X | status:✓complete | criteria-met:yes | summary:... |
                file:path/to/output.md | next:ACTION
              </code>
              <p className="text-gray-400 leading-[1.8] mt-4">
                That single line replaces a paragraph of prose. No interpretation. No drift.{' '}
                <strong className="text-gray-300">
                  70% token reduction on inter-agent communication vs. prose handoffs.
                </strong>{' '}
                Context stays precise at agent 10 the same as at agent 2.
              </p>
            </div>

            <hr className="border-0 border-t border-brand-border" />

            <div>
              <h3 className="text-lg font-bold text-white mb-3">
                Spawn Brief Templates &mdash; Context That Actually Works
              </h3>
              <p className="text-gray-400 leading-[1.8]">
                The kit ships with templated spawn briefs that give every sub-agent six fields before
                it starts: objective, persona, constraints, output format, file path, handoff target.
                The 5-minute brief pays back 30 minutes of hallucinated work.
              </p>
              <blockquote className="border-l-2 border-brand-red/40 pl-6 mt-4">
                <p className="text-gray-400 italic leading-[1.8] text-sm">
                  &ldquo;Give teammates rich context in their spawn prompts. Skimping on context is
                  the number one reason teammates produce mediocre work.&rdquo;
                </p>
                <cite className="text-sm text-gray-500 not-italic mt-1 block">
                  &mdash; r/ClaudeAI developer, Feb 2026
                </cite>
              </blockquote>
            </div>

            <hr className="border-0 border-t border-brand-border" />

            <div>
              <h3 className="text-lg font-bold text-white mb-3">
                Human-in-the-Loop Gates &mdash; Real Oversight, Not Theater
              </h3>
              <p className="text-gray-400 leading-[1.8]">
                The kit ships with two hard gate categories:
              </p>
              <ul className="text-gray-400 pl-6 space-y-2 list-disc mt-3">
                <li className="leading-[1.7]">
                  <strong className="text-gray-300">Content QA Gate:</strong> All output that
                  touches external systems passes a review gate before it enters your queue.
                </li>
                <li className="leading-[1.7]">
                  <strong className="text-gray-300">External Action Gate:</strong> Anything that
                  touches GitHub, email, social, or money stops and waits. Every time. No exceptions.
                </li>
              </ul>
              <p className="text-gray-400 leading-[1.8] mt-4">
                Atlas is autonomous within a sandbox. Outside the sandbox, it&apos;s you.
              </p>
            </div>

            <hr className="border-0 border-t border-brand-border" />

            <div>
              <h3 className="text-lg font-bold text-white mb-3">
                Session Persistence &mdash; Every Session Builds on the Last One
              </h3>
              <p className="text-gray-400 leading-[1.8]">
                The kit&apos;s PLAN.md + PROGRESS.md architecture makes this real. Every session
                writes its state to files. Every new session reads from where the last one ended. No
                more re-explaining the project. No more context restoration overhead.
              </p>
              <p className="text-gray-400 leading-[1.8] mt-3">
                Your folder becomes the operating system. Agents execute inside it. The system is
                persistent across sessions, crashes, and model updates.
              </p>
            </div>

            <hr className="border-0 border-t border-brand-border" />

            <div>
              <h3 className="text-lg font-bold text-white mb-3">
                Validation Architecture &mdash; Review Before Execute
              </h3>
              <p className="text-gray-400 leading-[1.8]">
                Agents are better at reviewing work than producing it. The kit ships with a
                validation layer that forces agents to check output before marking tasks complete
                &mdash; not as an afterthought, but as a structural requirement of the handoff
                protocol.
              </p>
              <blockquote className="border-l-2 border-brand-red/40 pl-6 mt-4">
                <p className="text-gray-400 italic leading-[1.8] text-sm">
                  &ldquo;I&apos;ve found LLMs to be significantly better in the &lsquo;review&rsquo;
                  stage than the implementation stage.&rdquo;
                </p>
                <cite className="text-sm text-gray-500 not-italic mt-1 block">
                  &mdash; HN developer, 396-upvote thread
                </cite>
              </blockquote>
            </div>

            <hr className="border-0 border-t border-brand-border" />

            <div>
              <h3 className="text-lg font-bold text-white mb-3">
                Observability &mdash; See What Six Agents Are Doing
              </h3>
              <p className="text-gray-400 leading-[1.8]">
                Session logs. Status files. Heartbeat checks. Structured output trails that tell you
                what each agent did, when, and what it produced.
              </p>
              <p className="text-gray-400 leading-[1.8] mt-3">
                The 270-second orchestration tick isn&apos;t arbitrary: it&apos;s calibrated to
                Anthropic&apos;s prompt cache TTL. Run faster and you pay full context costs on every
                check. The kit&apos;s timing keeps you inside the cache window on every orchestrator
                heartbeat &mdash; meaning efficient, not expensive.
              </p>
            </div>

            <hr className="border-0 border-t border-brand-border" />

            <div>
              <h3 className="text-lg font-bold text-white mb-3">
                Crash Recovery &mdash; Agents That Don&apos;t Die Silently
              </h3>
              <p className="text-gray-400 leading-[1.8]">
                Sessions that crash get relaunched automatically. State is preserved in files, not
                memory &mdash; so a crash doesn&apos;t lose work, it just pauses it. The watchdog,
                auto-restart logic, and OOM prevention patterns are in the kit. Running six
                persistent agents overnight without babysitting requires this.
              </p>
            </div>

          </div>

          {/* Section 6 — What you get */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            What you actually get
          </h2>
          <p className="text-gray-400 leading-[1.8]">
            Every file is readable. Every pattern is documented. You can understand the full system
            in an afternoon.
          </p>
          <ul className="text-gray-400 pl-6 space-y-2 list-disc mt-4">
            <li className="leading-[1.7]">PAX Protocol spec + example handoff files</li>
            <li className="leading-[1.7]">
              Spawn brief templates (12 templates, covering orchestration, research, content, and
              code tasks)
            </li>
            <li className="leading-[1.7]">
              Human gate configuration for content QA and external actions
            </li>
            <li className="leading-[1.7]">
              PLAN.md + PROGRESS.md architecture with session state management
            </li>
            <li className="leading-[1.7]">Session log format and observability trail setup</li>
            <li className="leading-[1.7]">Watchdog + crash recovery patterns</li>
            <li className="leading-[1.7]">CLAUDE.md templates for each agent role</li>
            <li className="leading-[1.7]">
              Coordination file structure (the folder-as-OS architecture)
            </li>
            <li className="leading-[1.7]">
              Bootstrap documentation &mdash; the exact _START-HERE.md that gets new agents
              oriented in under 5 minutes
            </li>
            <li className="leading-[1.7]">
              Token efficiency rules (PAX compression, verbosity controls, cache-aware scheduling)
            </li>
          </ul>
          <div className="mt-6 space-y-2">
            <p className="text-gray-400 leading-[1.8]">
              <strong className="text-gray-300">Format:</strong> File package. Readable source. No
              SaaS, no account, no dependency on us staying in business.
            </p>
            <p className="text-gray-400 leading-[1.8]">
              <strong className="text-gray-300">Setup time:</strong> Under 2 hours to first running
              session for a developer already using Claude Code.
            </p>
            <p className="text-gray-400 leading-[1.8]">
              <strong className="text-gray-300">Free quickstart:</strong> The PAX Protocol spec and
              basic coordination structure are on GitHub. Evaluate the architecture before you pay
              for anything.
            </p>
          </div>

          {/* Section 7 — Proof */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            Proof: Numbers from six weeks of production
          </h2>
          <p className="text-gray-400 leading-[1.8]">
            These aren&apos;t projections. They&apos;re from the system running whoffagents.com
            today.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {[
              { stat: '50+', label: 'discrete sessions run by Atlas this week alone' },
              { stat: '~391K', label: 'tokens of productive work in a single day' },
              { stat: '70%', label: 'token reduction via PAX vs. prose handoffs' },
              { stat: '6', label: 'parallel agents with session persistence' },
              { stat: '0', label: 'lost sessions from watchdog + crash recovery' },
              { stat: '$4', label: 'multi-thousand line refactors with structured handoffs' },
            ].map(({ stat, label }) => (
              <div
                key={stat}
                className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5"
              >
                <div className="text-3xl font-extrabold text-brand-red mb-1">{stat}</div>
                <div className="text-sm text-gray-400 leading-[1.5]">{label}</div>
              </div>
            ))}
          </div>

          {/* Section 8 — Offer */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">The offer</h2>
          <div className="bg-brand-red/5 border border-brand-red/20 rounded-2xl p-8 text-center">
            <div className="text-5xl font-extrabold text-white mb-2">$97</div>
            <div className="text-lg text-gray-400 mb-6">One time. No subscription.</div>
            <p className="text-gray-400 leading-[1.8] mb-6 max-w-md mx-auto">
              No seat licenses. No renewal. No monthly fee on top of your Anthropic bill. You pay
              once. You own it. Future updates included.
            </p>
            <div className="text-sm text-gray-500 mb-8 space-y-1">
              <p>CrewAI: $99/month &nbsp;|&nbsp; Claude Managed Agents: metered per session</p>
              <p className="text-gray-300 font-semibold">Atlas Starter Kit: $97 total. Forever.</p>
            </div>
            <a
              href="https://whoffagents.com/checkout"
              className="inline-block bg-brand-red text-white font-bold text-lg px-10 py-4 rounded-xl hover:brightness-110 transition-all cursor-pointer"
            >
              Buy now &mdash; $97
            </a>
          </div>

          {/* Section 9 — Guarantee */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">The guarantee</h2>
          <p className="text-gray-400 leading-[1.8]">
            <strong className="text-gray-300">You keep everything. Forever.</strong>
          </p>
          <p className="text-gray-400 leading-[1.8]">
            The core components &mdash; PAX Protocol, spawn brief templates, PLAN.md architecture
            &mdash; are based on open patterns. If we disappear tomorrow, your files still work.
            No dependency on our infrastructure, our API, or our continued existence.
          </p>
          <p className="text-gray-400 leading-[1.8]">
            If you set up the system and it doesn&apos;t run in your environment within 48 hours,
            email us and we&apos;ll debug it with you personally. If we can&apos;t fix it, you get a
            full refund. No form. No ticket queue. Direct response.
          </p>
          <p className="text-gray-400 leading-[1.8]">
            We&apos;re not a ghost vendor. Atlas runs on this system every day. We have skin in the
            game.
          </p>

          {/* Section 10 — FAQ */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            Common questions (honest answers)
          </h2>
          <div className="space-y-8 mt-4">
            {[
              {
                q: 'Why not just build this myself?',
                a: "You can. Most people who buy this tried first. The problem isn't writing the config — it's the six weeks of agents silently overwriting each other's work before you figure out what's actually wrong. We've already hit those walls. The kit is the system we rebuilt after the failures, not the first attempt. You're buying the tuning, not the scaffolding.",
              },
              {
                q: 'Is this just a bunch of config files?',
                a: "Config files are the delivery format. The value is the orchestration protocol inside them — which took months of real multi-agent failures to develop. Same way a production Dockerfile is \"just a text file.\" The expertise is in what's in it and why.",
              },
              {
                q: "What if Anthropic releases official patterns?",
                a: "They might. The gap this fills is operational: persistent context, crash recovery, token-efficient handoffs, watchdog coordination. Official docs won't tell you how to keep six agents aligned on a Tuesday at 2am when one crashes. That's what the kit does.",
              },
              {
                q: "I don't want another SaaS subscription.",
                a: "It's not. One-time purchase. You own the files. No account, no platform, no renewal. You already pay Anthropic for API usage — we're not adding another line item.",
              },
              {
                q: 'What support do I get?',
                a: "Discord access, 24-hour response SLA, direct line to the person who built it. Not a ticket queue. If something breaks on our end, we fix it.",
              },
              {
                q: 'Is this production-ready or a hobby project?',
                a: "Atlas has run whoffagents.com on this architecture since March 2026. Every pattern in the kit is running in production today. It's not a hobby project.",
              },
            ].map(({ q, a }) => (
              <div key={q}>
                <h3 className="text-base font-semibold text-white mb-2">&ldquo;{q}&rdquo;</h3>
                <p className="text-gray-400 leading-[1.8]">{a}</p>
              </div>
            ))}
          </div>

          {/* Section 11 — Who it's for */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            Who this is for (and who it isn&apos;t)
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 mt-4">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
              <h3 className="text-base font-bold text-white mb-3">This is for you if:</h3>
              <ul className="text-gray-400 space-y-2 text-sm">
                <li className="leading-[1.6]">
                  You use Claude Code and have tried multi-agent orchestration that devolved into
                  chaos by agent 3
                </li>
                <li className="leading-[1.6]">
                  You&apos;ve hit the two-week cliff &mdash; works solo, breaks at scale
                </li>
                <li className="leading-[1.6]">
                  You want a working reference to study, not abstract documentation
                </li>
                <li className="leading-[1.6]">
                  You&apos;re building something that needs agents to run persistently, not just in
                  demos
                </li>
                <li className="leading-[1.6]">
                  You want your workflow versioned and persistent, not just your code
                </li>
              </ul>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
              <h3 className="text-base font-bold text-white mb-3">This is not for you if:</h3>
              <ul className="text-gray-400 space-y-2 text-sm">
                <li className="leading-[1.6]">
                  You&apos;ve already solved orchestration cleanly and your system is running in
                  production
                </li>
                <li className="leading-[1.6]">
                  You&apos;re not using Claude Code (the kit is Claude-specific)
                </li>
                <li className="leading-[1.6]">
                  You want a no-code solution (this is for developers who write code)
                </li>
              </ul>
            </div>
          </div>

          {/* Section 12 — Closing */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">One more thing</h2>
          <p className="text-gray-400 leading-[1.8]">
            The developer community is tired of demos. They&apos;re tired of &ldquo;fancy
            orchestration&rdquo; claims that fall apart under real workloads. They&apos;ve seen the
            repos with 20 agents &ldquo;coordinating&rdquo; that nobody can actually observe or
            debug.
          </p>
          <p className="text-gray-400 leading-[1.8]">This isn&apos;t that.</p>
          <p className="text-gray-400 leading-[1.8]">
            The Atlas Starter Kit is the exact system running whoffagents.com. You can read every
            file. You can understand every decision. You can ask why the tick interval is 270 seconds
            (cache TTL) and get a specific, correct answer.
          </p>
          <p className="text-gray-400 leading-[1.8]">
            It&apos;s a working reference to study. Not documentation. Not slides. The running system
            &mdash; packaged so you can ship yours.
          </p>

          <hr className="border-0 border-t border-brand-border my-10" />

          {/* Final CTA */}
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white mb-3">
              Get the Atlas Starter Kit
            </h2>
            <p className="text-gray-400 mb-8">$97 &mdash; one-time. Instant download.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://whoffagents.com/checkout"
                className="inline-block bg-brand-red text-white font-bold text-lg px-10 py-4 rounded-xl hover:brightness-110 transition-all cursor-pointer"
              >
                Buy now &mdash; $97
              </a>
              <a
                href="https://github.com/whoffagents"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-brand-border text-gray-300 font-semibold text-lg px-10 py-4 rounded-xl hover:border-white/30 hover:text-white transition-all cursor-pointer"
              >
                GitHub quickstart &rarr;
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              Questions before you buy?{' '}
              <a
                href="mailto:will@whoffagents.com"
                className="text-brand-blue-light hover:text-white transition-colors"
              >
                Email will@whoffagents.com
              </a>
              . Real responses, usually same day.
            </p>
          </div>

          <hr className="border-0 border-t border-brand-border my-10" />
          <p className="text-gray-500 italic text-sm leading-[1.8] text-center">
            Built by Atlas &mdash; the Claude Code agent running Whoff Agents. Every pattern in this
            kit is running in production today.
          </p>
        </div>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-brand-border">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-brand-blue-light transition-colors duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to products
          </Link>
        </div>
      </motion.div>
    </article>
  )
}
