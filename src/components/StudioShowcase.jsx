import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Pause,
  Play,
} from "lucide-react";

const dimensions = [
  {
    name: "Spindle Creek",
    type: "01 / COMMERCE",
    detail: "A small business. A world of its own.",
    image: "/work/spindle.webp",
    url: "https://spindlecreek.com",
    link: "Visit the website",
    status: "LIVE WEBSITE",
  },
  {
    name: "Island Airporter",
    type: "02 / DIGITAL EXPERIENCE",
    detail: "A clearer journey, before the journey.",
    image: "/work/island.webp",
    url: "https://main.d1v4o3c4563ysj.amplifyapp.com",
    link: "Explore the concept",
    status: "PRIVATE CONCEPT · AWAITING APPROVAL",
  },
  {
    name: "Agents with purpose",
    type: "03 / AUTOMATION",
    detail: "From first conversation to the next step.",
    image: "/work/agent-surface.svg",
    url: "/agents",
    link: "Explore AI agents",
    status: "ILLUSTRATIVE WORKFLOW",
  },
  {
    name: "Tools for the builders",
    type: "04 / DEVELOPER TOOLS",
    detail: "Less setup. More making things happen.",
    image: "/work/tools-surface.svg",
    url: "/products",
    link: "Explore the tools",
    status: "THE TOOL COLLECTION",
  },
];

export default function StudioShowcase({ web = false }) {
  const host = useRef(null);
  const section = useRef(null);
  const scene = useRef(null);
  const selectedRef = useRef(0);
  const [selected, setSelected] = useState(0);
  const [state, setState] = useState("loading");
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [compact, setCompact] = useState(false);
  const active = dimensions[selected];

  useEffect(() => {
    let disposed = false;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.matchMedia("(max-width: 600px)");
    const syncSize = () => setCompact(small.matches);
    syncSize();
    small.addEventListener("change", syncSize);
    const sync = () => {
      setReduced(media.matches);
      scene.current?.setReduced(media.matches);
    };
    sync();
    media.addEventListener("change", sync);
    import("./cubeScene.js")
      .then(({ createCubeScene }) => {
        if (disposed) return;
        scene.current = createCubeScene(
          host.current,
          dimensions,
          media.matches,
          () => setState("fallback"),
        );
        setState(scene.current ? "ready" : "fallback");
      })
      .catch(() => {
        if (!disposed) setState("fallback");
      });
    return () => {
      disposed = true;
      media.removeEventListener("change", sync);
      small.removeEventListener("change", syncSize);
      scene.current?.dispose();
      scene.current = null;
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (reduced || paused || compact || state === "fallback") return;
      const rect = section.current.getBoundingClientRect();
      const travel = rect.height - window.innerHeight + 80;
      const progress = Math.max(
        0,
        Math.min(1, (80 - rect.top) / Math.max(1, travel)),
      );
      scene.current?.setTurn(selectedRef.current);
      const index = Math.min(3, Math.round(progress * 3));
      scene.current?.setTurn(progress * 3);
      section.current.style.setProperty("--journey", progress);
      if (index !== selectedRef.current) {
        selectedRef.current = index;
        setSelected(index);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced, paused, compact, state]);

  function choose(index) {
    const next = (index + dimensions.length) % dimensions.length;
    selectedRef.current = next;
    setSelected(next);
    scene.current?.setTurn(next);
  }
  function toggleMotion() {
    setPaused(!paused);
    scene.current?.setPaused(!paused);
  }

  return (
    <section
      ref={section}
      className={`dx-experience ${reduced || state === "fallback" ? "dx-static" : ""}`}
      aria-label="Explore the dimensions of Whoff"
      data-scene={state}
    >
      <div className="dx-sticky">
        <div className="dx-coordinate dx-coordinate-top">
          <span>INDEPENDENT THINKING. EXTRA DIMENSION.</span>
          <span>PROVO, UT / WORLDWIDE</span>
        </div>
        <div className="dx-backdrop" aria-hidden="true">
          <span>W / A</span>
          <div />
        </div>
        <div className="dx-copy">
          <p className="dx-eyebrow">
            <i /> WEBSITES + INTELLIGENT SYSTEMS
          </p>
          <h1>
            {web ? "Websites." : "Ideas."} <br />
            Given
            <br />
            <span>dimension.</span>
          </h1>
          <p className="dx-intro">
            {web
              ? "Give people a reason to stop. Then a reason to stay. Websites made to feel unmistakably yours."
              : "Distinctive websites. Useful AI. We build the next version of your business, one good idea at a time."}
          </p>
          <Link className="dx-cta" to={web ? "/web#lead-form" : "/#lead-form"}>
            Let’s build something <ArrowUpRight size={19} />
          </Link>
        </div>
        <div className="dx-object" ref={host} aria-hidden="true" />
        {state !== "ready" && (
          <div className="dx-fallback" aria-hidden="true">
            <img src={active.image} alt="" />
            <span>{active.name}</span>
          </div>
        )}
        <div className="dx-object-note" aria-hidden="true">
          <span>WHOFF / EXPLORER</span>
          <span>0{selected + 1} — 04</span>
        </div>
        <div className="dx-bottom">
          <div className="dx-scroll">
            <span className="dx-scroll-icon">
              <ArrowDown size={17} />
            </span>
            <span>
              {reduced || compact || state === "fallback"
                ? "CHOOSE A DIMENSION"
                : "SCROLL TO TURN THE CUBE"}
              <a href="#work">
                Or go straight to the work <ArrowUpRight size={12} />
              </a>
            </span>
          </div>
          <div className="dx-project" aria-live="polite" aria-atomic="true">
            <span className="dx-project-type">{active.type}</span>
            <h2>{active.name}</h2>
            <p>{active.detail}</p>
            {active.url.startsWith("/") ? (
              <Link to={active.url}>
                {active.link} <ArrowUpRight size={14} />
              </Link>
            ) : (
              <a href={active.url} target="_blank" rel="noopener noreferrer">
                {active.link} <ArrowUpRight size={14} />
              </a>
            )}
            <span className="dx-project-status">{active.status}</span>
          </div>
          <div className="dx-controls">
            <div className="dx-arrows">
              <button
                aria-label="Previous dimension"
                onClick={() => choose(selected - 1)}
              >
                <ArrowLeft size={19} />
              </button>
              <button
                aria-label="Next dimension"
                onClick={() => choose(selected + 1)}
              >
                <ArrowRight size={19} />
              </button>
            </div>
            <div
              className="dx-dots"
              role="group"
              aria-label="Choose a dimension"
            >
              {dimensions.map((item, index) => (
                <button
                  key={item.name}
                  aria-label={item.name}
                  aria-pressed={selected === index}
                  onClick={() => choose(index)}
                >
                  <span />
                </button>
              ))}
            </div>
            {state === "ready" && !reduced && (
              <button className="dx-motion" onClick={toggleMotion}>
                {paused ? <Play size={11} /> : <Pause size={11} />}
                {paused ? "Resume motion" : "Pause motion"}
              </button>
            )}
          </div>
        </div>
        <div className="dx-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
