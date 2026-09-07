import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, Pause, Play } from "lucide-react";

const identities = {
  agents: {
    index: "02",
    label: "CUSTOM AI AGENTS",
    monogram: "AI",
    title: ["Off your list.", "Into motion."],
    intro:
      "An extra set of hands for calls, inboxes, and repeat work. Built around your business, with you in control.",
    cta: "Find your first use case",
    href: "/agents#lead-form",
    anchor: "#agent-demo",
    anchorText: "Walk through an example",
    note: "WORKFLOW STUDY / ILLUSTRATIVE, NOT A LIVE AGENT",
    options: [
      {
        label: "01 / Calls",
        title: "Catch the first hello.",
        detail:
          "Answer common questions, collect the details, and give your team a clear next step.",
      },
      {
        label: "02 / Email",
        title: "An inbox with a next step.",
        detail:
          "Find the relevant information and prepare a useful reply for your review.",
      },
      {
        label: "03 / Repeat work",
        title: "Take the repeat out of routine.",
        detail:
          "Bring the information together. Flag the exceptions. Leave the decisions with you.",
      },
    ],
  },
  tools: {
    index: "03",
    label: "THE DEVELOPER COLLECTION",
    monogram: "</>",
    title: ["Less setup.", "More making."],
    intro:
      "Skills, connections, and starting points from our own workbench. Choose the pieces that move your next build forward.",
    cta: "Explore the collection",
    href: "/products#catalog",
    anchor: "#catalog",
    anchorText: "Find your next tool",
    note: "SKILLS / MCP SERVERS / STARTER KITS",
    options: [
      {
        label: "The full stack",
        title: "Good tools. More possibilities.",
        detail:
          "Explore the collection below. Free downloads and straightforward, one-time purchases.",
      },
      {
        label: "01 / Skills",
        title: "Know-how, ready to run.",
        detail:
          "Reusable instructions for the practical work of building with Claude Code.",
      },
      {
        label: "02 / MCP",
        title: "Connect the moving parts.",
        detail:
          "Give your agent useful connections and specialized capabilities.",
      },
      {
        label: "03 / Kits",
        title: "Start further along.",
        detail:
          "A foundation for authentication, billing, and the rest of your next application.",
      },
    ],
  },
  studio: {
    index: "04",
    label: "INDEPENDENT BY DESIGN",
    monogram: "W/A",
    title: ["Agents build.", "People care."],
    intro:
      "A small studio in Provo, Utah. Human direction and agent execution, working together on something worth putting into the world.",
    cta: "Meet the way we work",
    href: "/about#studio-story",
    anchor: "#studio-story",
    anchorText: "Inside the studio",
    note: "HUMAN DIRECTION / AGENT EXECUTION / SHARED PURPOSE",
    options: [
      {
        label: "Together",
        title: "Two strengths. One studio.",
        detail:
          "The speed to explore an idea. The judgment to know when it is ready.",
      },
      {
        label: "Human direction",
        title: "A person owns the result.",
        detail:
          "Will sets the direction, reviews the work, and stays responsible for what reaches you.",
      },
      {
        label: "Agent execution",
        title: "More room to explore.",
        detail:
          "Atlas coordinates the agents that research, draft, and build. People make the final call.",
      },
    ],
  },
};

function ArtFallback({ kind }) {
  return (
    <svg viewBox="0 0 500 400" className="dp-fallback" aria-hidden="true">
      {kind === "agents" ? (
        <g fill="none" stroke="#b8c7dd">
          <circle cx="250" cy="200" r="135" strokeWidth="7" />
          <circle cx="250" cy="200" r="111" stroke="#003da5" strokeWidth="20" />
          {[50, 90, 125, 65, 145, 90, 55].map((h, i) => (
            <path
              key={i}
              d={`M${172 + i * 26} ${200 - h / 2}v${h}`}
              strokeWidth="10"
              strokeLinecap="round"
            />
          ))}
        </g>
      ) : kind === "tools" ? (
        <g fill="#881127" stroke="#e1bd70" strokeWidth="2">
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${70 + i * 18},${75 + i * 86})`}>
              <rect width="315" height="63" rx="12" />
              <text
                x="25"
                y="39"
                fill="#e1bd70"
                stroke="none"
                fontFamily="monospace"
                fontSize="22"
              >
                {["01  SKILLS", "02  MCP", "03  KITS"][i]}
              </text>
            </g>
          ))}
        </g>
      ) : (
        <g strokeLinejoin="miter">
          <path d="M48 90h56l58 174 62-131h26v85l-67 99h-55Z" fill="#a60c26" />
          <path
            d="M452 90h-56l-58 174-62-131h-26v85l67 99h55Z"
            fill="#003da5"
          />
          <g fill="none" strokeWidth="2">
            <path d="m74 106 87 188 77-145" stroke="#e1bd70" />
            <path d="m426 106-87 188-77-145" stroke="#c0c0c0" />
          </g>
        </g>
      )}
    </svg>
  );
}

export default function StudioIdentity({ kind, selection, onSelect }) {
  const data = identities[kind];
  const [localSelection, setLocalSelection] = useState(0);
  const choice = selection ?? localSelection;
  const selectedRef = useRef(choice);
  const host = useRef(null),
    scene = useRef(null);
  const [status, setStatus] = useState("loading");
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let disposed = false;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReduced(media.matches);
      scene.current?.setReduced(media.matches);
    };
    sync();
    media.addEventListener("change", sync);
    import("./identityScene.js")
      .then(({ createIdentityScene }) => {
        if (disposed) return;
        scene.current = createIdentityScene(
          host.current,
          kind,
          media.matches,
          () => setStatus("fallback"),
        );
        scene.current?.select(selectedRef.current);
        setStatus(scene.current ? "ready" : "fallback");
      })
      .catch(() => {
        if (!disposed) setStatus("fallback");
      });
    return () => {
      disposed = true;
      media.removeEventListener("change", sync);
      scene.current?.dispose();
      scene.current = null;
    };
  }, [kind]);
  useEffect(() => {
    selectedRef.current = choice;
    scene.current?.select(choice);
  }, [choice]);
  function choose(index) {
    if (onSelect) onSelect(index);
    else setLocalSelection(index);
  }
  const active = data.options[choice];
  return (
    <section
      className={`dp-hero dp-${kind}`}
      data-identity={kind}
      data-scene={status}
    >
      <div className="dp-topline">
        <span>WHOFF / {data.label}</span>
        <span>DIMENSION {data.index}</span>
      </div>
      <div className="dp-copy">
        <p className="dp-kicker">
          <span /> {data.label}
        </p>
        <h1>
          {data.title[0]}
          <br />
          <span>{data.title[1]}</span>
        </h1>
        <p className="dp-intro">{data.intro}</p>
        <Link className="dp-cta" to={data.href}>
          {data.cta}
          <ArrowUpRight size={18} />
        </Link>
      </div>
      <div className="dp-art">
        <span className="dp-monogram" aria-hidden="true">
          {data.monogram}
        </span>
        <div ref={host} className="dp-canvas" aria-hidden="true" />
        {status !== "ready" && <ArtFallback kind={kind} />}
        <span className="dp-object-label" aria-hidden="true">
          {kind === "agents"
            ? "SIGNAL / CORE"
            : kind === "tools"
              ? "MODULAR / TOOLSET"
              : "TWO PARTS / ONE PURPOSE"}
        </span>
      </div>
      <div className="dp-explorer">
        <div
          className="dp-options"
          role="group"
          aria-label={
            kind === "tools"
              ? "Explore tool families"
              : kind === "agents"
                ? "Explore agent workflows"
                : "Explore how the studio works"
          }
        >
          {data.options.map((option, index) => (
            <button
              key={option.label}
              onClick={() => choose(index)}
              aria-pressed={choice === index}
            >
              {option.label}
              <span />
            </button>
          ))}
        </div>
        <div className="dp-caption" aria-live="polite" aria-atomic="true">
          <h2>{active.title}</h2>
          <p>{active.detail}</p>
        </div>
      </div>
      <div className="dp-bottom">
        <a href={data.anchor}>
          <ArrowDown size={15} />
          {data.anchorText}
        </a>
        <span>{data.note}</span>
        {status === "ready" && !reduced && (
          <button
            onClick={() => {
              setPaused(!paused);
              scene.current?.setPaused(!paused);
            }}
          >
            {paused ? <Play size={12} /> : <Pause size={12} />}{" "}
            {paused ? "Resume sculpture" : "Pause sculpture"}
          </button>
        )}
      </div>
    </section>
  );
}
