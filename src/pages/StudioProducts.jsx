import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Code2, Package, Shield, Terminal } from "lucide-react";
import { products } from "../data/products";
import { ToolsIntro, Contact } from "./StudioPages";
import { buildStripeURL } from "../utils/utm";
import { track } from "../utils/analytics";
const summaries = {
  12: "Scan Claude Code skills for unsafe or outdated patterns, with specific findings you can act on.",
  2: "11 skills for authentication, payments, APIs, testing, and the practical work of shipping.",
  1: "An AI SaaS starting point with authentication, billing, streaming chat, and a database.",
  14: "Save a compact working reference so your agents can pick up where they left off.",
  3: "25 reusable prompts for planning, debugging, reviews, and everyday development.",
  4: "Turn a draft into a structured article with search intent and useful metadata.",
  5: "Connect webhooks and multi-step workflows to the tools your agent can use.",
  9: "Check MCP servers for unsafe patterns and configuration problems.",
  10: "The advanced MCP scanner with broader checks and priority signatures.",
  11: "Work through eight questions to shape a clearer product offer.",
};
export default function StudioProducts() {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const list = products.filter(
    (p) =>
      p.category !== "agent" &&
      (filter === "all" || p.category === filter) &&
      `${p.title} ${p.description}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="studio-page dp-tools-page">
      <ToolsIntro
        selection={["all", "skill", "mcp", "kit"].indexOf(filter)}
        onSelect={(index) => setFilter(["all", "skill", "mcp", "kit"][index])}
      />
      <section className="st-tool-catalog st-container" id="catalog">
        <div className="st-tool-controls">
          <div aria-label="Product category">
            {[
              ["all", "All tools"],
              ["skill", "Skills"],
              ["mcp", "MCP servers"],
              ["kit", "Starter kits"],
            ].map(([id, label]) => (
              <button
                key={id}
                aria-pressed={filter === id}
                onClick={() => setFilter(id)}
              >
                {label}
              </button>
            ))}
          </div>
          <label>
            <span className="st-sr-only">Search tools</span>
            <input
              type="search"
              placeholder="Find a tool…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>
        <p className="st-tool-count" aria-live="polite">
          {list.length} tools · One-time prices · 30-day refunds
        </p>
        <div className="st-tool-grid">
          {list.map((p) => {
            const Icon =
              p.category === "mcp"
                ? Shield
                : p.category === "kit"
                  ? Package
                  : p.id === 14
                    ? Terminal
                    : Code2;
            return (
              <article className="st-tool-card" key={p.id}>
                <div className="st-tool-card-top">
                  <Icon size={24} />
                  <span>{p.price}</span>
                </div>
                <span className="st-small-label">
                  {p.category === "mcp"
                    ? "MCP SERVER"
                    : p.category === "kit"
                      ? "STARTER KIT"
                      : "CLAUDE CODE SKILL"}
                </span>
                <h2>{p.title}</h2>
                <p>{summaries[p.id] || p.description}</p>
                <div className="st-tool-actions">
                  {p.learnMoreLink ? (
                    <Link to={p.learnMoreLink}>
                      See what’s inside
                      <ArrowUpRight size={17} />
                    </Link>
                  ) : p.githubLink ? (
                    <a
                      href={p.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get on GitHub
                      <ArrowUpRight size={17} />
                    </a>
                  ) : (
                    <a
                      href={buildStripeURL(p.buyLink)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get it — {p.price}
                      <ArrowUpRight size={17} />
                    </a>
                  )}
                  {p.learnMoreLink && p.buyLink && (
                    <a
                      className="st-tool-buy"
                      href={buildStripeURL(p.buyLink)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Buy ↗
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        {list.length === 0 && (
          <div className="st-tool-empty">
            No tools match that search.{" "}
            <button
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
            >
              Show all tools
            </button>
          </div>
        )}
        <div className="st-tool-service">
          <div>
            <h2>Looking for someone to build it for you?</h2>
            <p>
              Our custom AI work is a service. We scope it, build it, and help
              run it.
            </p>
          </div>
          <Link to="/agents">
            Explore custom agents
            <ArrowUpRight size={20} />
          </Link>
        </div>
      </section>
      <section className="st-container st-newsletter" id="newsletter">
        <div>
          <h2>Notes from the studio.</h2>
          <p>Build notes, useful tools, and what we learn along the way.</p>
        </div>
        <a
          className="st-text-link"
          href="https://whoffagents.beehiiv.com/subscribe"
          onClick={() => {
            if (import.meta.env.VITE_PRIVATE_PREVIEW !== "true") {
              track("Newsletter-Click", { destination: "beehiiv_hosted" });
            }
          }}
          target="_blank"
          rel="noopener noreferrer"
        >
          Subscribe free <ArrowUpRight size={18} />
        </a>
      </section>
      <Contact service="Developer tools" />
    </div>
  );
}
