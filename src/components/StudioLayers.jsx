import { deferScene } from "../utils/deferScene";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Pause,
  Play,
} from "lucide-react";
import { dimensions } from "../data/showcaseProjects";
import StudioShowcase from "./StudioShowcase";
import StudioPyramid from "./StudioPyramid";
import "../styles/studio-layers.css";

export default function ShowcaseChoice({ web = false }) {
  const { search } = useLocation();
  const concept = new URLSearchParams(search).get("concept");
  return concept === "layers" || (web && concept !== "cube") ? (
    <StudioLayers web={web} />
  ) : (
    concept === "cube" ? <StudioShowcase web={web} /> : <StudioPyramid />
  );
}

function StudioLayers({ web }) {
  const section = useRef(null),
    host = useRef(null),
    scene = useRef(null),
    progressRef = useRef(0);
  const [state, setState] = useState("loading"),
    [progress, setProgress] = useState(0);
  const [staticMode, setStaticMode] = useState(false),
    [paused, setPaused] = useState(false);
  const activeIndex = Math.max(0, Math.min(3, Math.round(progress) - 1));
  const active = dimensions[activeIndex];
  useEffect(() => {
    scene.current?.setPaused(paused);
  }, [paused, state]);
  useLayoutEffect(() => {
    let dead = false;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)"),
      compact = matchMedia("(max-width: 700px), (max-height: 650px)");
    const sync = () => {
      const simple = reduced.matches || compact.matches;
      setStaticMode(simple);
      scene.current?.setReduced(reduced.matches);
      if (simple && progressRef.current < 1) {
        progressRef.current = 1;
        setProgress(1);
        scene.current?.setProgress(1, true);
      }
    };
    sync();
    reduced.addEventListener("change", sync);
    compact.addEventListener("change", sync);
    const cancelLoad = deferScene(() =>
      import("./layerScene")
        .then(({ createLayerScene }) => {
          if (dead) return;
          scene.current = createLayerScene(
            host.current,
            dimensions,
            reduced.matches,
            () => setState("fallback"),
          );
          scene.current?.setProgress(progressRef.current, true);
          setState(scene.current ? "ready" : "fallback");
        })
        .catch(() => {
          if (!dead) setState("fallback");
        }),
    );
    return () => {
      cancelLoad();
      dead = true;
      reduced.removeEventListener("change", sync);
      compact.removeEventListener("change", sync);
      scene.current?.dispose();
      scene.current = null;
    };
  }, []);
  useEffect(() => {
    if (staticMode || paused || state !== "ready") return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.current.getBoundingClientRect();
      const p = Math.max(
        0,
        Math.min(
          4,
          ((86 - rect.top) / Math.max(1, rect.height - innerHeight + 86)) * 4,
        ),
      );
      progressRef.current = p;
      setProgress(p);
      scene.current?.setProgress(p);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
    };
  }, [staticMode, paused, state]);
  function choose(index) {
    const p = ((index + 4) % 4) + 1;
    progressRef.current = p;
    setProgress(p);
    scene.current?.setProgress(p, true);
    if (!staticMode && !paused && state === "ready") {
      const rect = section.current.getBoundingClientRect();
      window.scrollTo({
        top:
          scrollY + rect.top - 86 + ((rect.height - innerHeight + 86) * p) / 4,
        behavior: "instant",
      });
    }
  }
  const simple = staticMode || state === "fallback";
  return (
    <section
      ref={section}
      className={`lp-experience ${simple ? "lp-static" : ""}`}
      data-scene={state}
      aria-label="Layered portfolio prototype"
      style={{ "--lp-open": Math.min(1, progress) }}
    >
      <div className="lp-stage">
        <div className="lp-top">
          <span>{web ? "WHOFF / WEB STUDIO" : "WHOFF / OPEN DIMENSIONS"}</span>
          <Link to="/">
            Explore the studio <ArrowUpRight size={13} />
          </Link>
        </div>
        <div
          className="lp-copy"
          inert={!simple && progress > 0.45}
          style={
            simple
              ? undefined
              : {
                  opacity: Math.max(0, 1 - progress * 2),
                  transform: `translateY(${-Math.min(progress, 1) * 35}px)`,
                  pointerEvents: progress > 0.45 ? "none" : undefined,
                }
          }
        >
          <p>{web ? "CUSTOM WEBSITES. DISTINCT BY DESIGN." : "ONE STUDIO. MORE POSSIBILITIES."}</p>
          <h1>
            {web ? "Your world." : "Ideas."}
            <br />
            {web ? "On the web." : "Opened up."}
          </h1>
          <p className="lp-intro">
            Websites, useful AI, and the tools behind them. Explore what we
            make, layer by layer.
          </p>
          <button onClick={() => choose(0)}>
            Open the work <ArrowUpRight size={17} />
          </button>
        </div>
        <div className="lp-halo" aria-hidden="true" />
        <div className="lp-canvas" ref={host} aria-hidden="true" />
        {state !== "ready" && (
          <img className="lp-fallback" src={active.image} alt="" />
        )}
        <div className="lp-bottom">
          <div className="lp-caption" aria-live="polite" aria-atomic="true">
            <span>{active.type}</span>
            <h2>{active.name}</h2>
            <p>{active.detail}</p>
            <a
              href={active.url}
              target={active.url.startsWith("/") ? undefined : "_blank"}
              rel={
                active.url.startsWith("/") ? undefined : "noopener noreferrer"
              }
            >
              {active.link}
              <ArrowUpRight size={14} />
            </a>
            <small>{active.status}</small>
          </div>
          <div className="lp-navigation">
            <div
              className="lp-tabs"
              role="group"
              aria-label="Choose a portfolio layer"
            >
              {dimensions.map((item, i) => (
                <button
                  key={item.name}
                  onClick={() => choose(i)}
                  aria-label={item.name}
                  aria-pressed={i === activeIndex}
                >
                  0{i + 1}
                </button>
              ))}
            </div>
            <div className="lp-arrows">
              <button
                aria-label="Previous layer"
                onClick={() => choose(activeIndex - 1)}
              >
                <ArrowLeft size={18} />
              </button>
              <button
                aria-label="Next layer"
                onClick={() => choose(activeIndex + 1)}
              >
                <ArrowRight size={18} />
              </button>
              {!staticMode && state === "ready" && (
                <button
                  onClick={() => {
                    setPaused(!paused);
                    scene.current?.setPaused(!paused);
                  }}
                >
                  {paused ? <Play size={12} /> : <Pause size={12} />}{" "}
                  {paused ? "Resume journey" : "Pause journey"}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="lp-foot">
          <span>
            <ArrowDown size={12} />{" "}
            {simple ? "CHOOSE A LAYER" : "SCROLL TO OPEN THE WORK"}
          </span>
          <a href="#work">
            Continue to the details <ArrowDown size={12} />
          </a>
        </div>
      </div>
    </section>
  );
}
