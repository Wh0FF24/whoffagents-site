import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, Pause, Play } from "lucide-react";

const films = [
  {
    name: "Breakin Circles",
    short: "Breakin Circles",
    file: "circles",
    discipline: "DANCE / CULTURE / COMMUNITY",
    line: "A studio with\nsomething to say.",
    detail:
      "Battle footage, poster typography, and a clear path into the circle.",
    url: "https://breakincircles-preview.netlify.app",
    number: "01",
  },
  {
    name: "The Forge Gym",
    short: "The Forge Gym",
    file: "forge",
    discipline: "STRENGTH / SPACE / COMMUNITY",
    line: "You can feel\nthe place.",
    detail:
      "A real warehouse, a real community, and a design built from the details.",
    url: "https://utahforgegym-preview.netlify.app",
    number: "02",
  },
];

function AmbientFilm({ film, motionAllowed }) {
  const player = useRef(null);
  const pausedByVisitor = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const el = player.current;
    if (!el) return;
    if (!motionAllowed) {
      el.pause();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !pausedByVisitor.current)
          el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      el.pause();
    };
  }, [film.file, motionAllowed, failed]);
  return (
    <>
      <div className="sr-ambient" aria-hidden="true">
        <img
          src={`/work/${film.file}-ambient.webp`}
          alt=""
          fetchPriority="high"
        />
        {!failed && (
          <video
            ref={player}
            src={`/work/${film.file}-ambient.webm`}
            poster={`/work/${film.file}-ambient.webp`}
            muted
            loop
            playsInline
            preload="metadata"
            tabIndex={-1}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => {
              setFailed(true);
              setPlaying(false);
            }}
          />
        )}
      </div>
      <div className="sr-ambient-caption">
        <span>FROM OUR {film.name.toUpperCase()} CONCEPT</span>
        {!failed && (
          <button
            aria-label={
              playing ? "Pause background film" : "Play background film"
            }
            onClick={() => {
              const el = player.current;
              if (!el) return;
              if (el.paused) {
                pausedByVisitor.current = false;
                el.play().catch(() => {});
              } else {
                pausedByVisitor.current = true;
                el.pause();
              }
            }}
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
            <span>{playing ? "Pause motion" : "Play motion"}</span>
          </button>
        )}
      </div>
    </>
  );
}

export default function StudioShowcase({ web = false }) {
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [available, setAvailable] = useState(true);
  const video = useRef(null);
  const userPaused = useRef(false);
  const stage = useRef(null);
  const active = films[selected];
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotionAllowed(!media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (!motionAllowed) {
      el.pause();
      return;
    }
    // The film only runs while its work is in view; controls always remain available.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused.current)
          el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.15 },
    );
    observer.observe(stage.current);
    return () => {
      observer.disconnect();
      el.pause();
    };
  }, [selected, motionAllowed]);
  function choose(index) {
    setSelected(index);
    setAvailable(true);
  }
  function toggle() {
    const el = video.current;
    if (!el) return;
    if (el.paused) {
      userPaused.current = false;
      el.play().catch(() => setAvailable(false));
    } else {
      userPaused.current = true;
      el.pause();
    }
  }
  return (
    <section className="sr-showcase">
      <div className="sr-masthead st-container">
        <AmbientFilm film={active} motionAllowed={motionAllowed} />
        <div className="sr-masthead-top">
          <span>WHOFF AGENTS / INDEPENDENT DIGITAL STUDIO</span>
          <span>PROVO, UTAH · WORKING EVERYWHERE</span>
        </div>
        <div className="sr-title-row">
          <h1>
            {web ? "Your world." : "Good work."}
            <br />
            <span>
              {web ? "Worth " : "Hard to "}
              <span className="sr-payoff-word">
                {web ? "seeing." : "ignore."}
              </span>
            </span>
          </h1>
          <div className="sr-intro">
            <p>
              {web
                ? "A website should feel unmistakably yours. We design and build it that way."
                : "Websites with a point of view. AI that earns its place. We turn your next idea into something that works."}
            </p>
            <Link
              to={web ? "/web#lead-form" : "/#lead-form"}
              className="sr-project-link"
            >
              Start a project <ArrowUpRight size={22} />
            </Link>
          </div>
        </div>
        <div className="sr-reel-label">
          <span>
            <span className="sr-line-mark" />
            THE WORK, IN MOTION
          </span>
          <a href="#work">
            Explore the studio <ArrowDown size={16} />
          </a>
        </div>
      </div>
      <div className="sr-stage-wrap st-container">
        <div className="sr-stage" ref={stage}>
          <div className="sr-film" key={active.file}>
            <img
              className="sr-film-poster"
              src={`/work/${active.file}-poster.jpg`}
              alt=""
              aria-hidden="true"
              width="1440"
              height="900"
              fetchPriority="high"
            />
            {available && (
              <video
                ref={video}
                className="sr-film-video"
                poster={`/work/${active.file}-poster.jpg`}
                src={`/work/${active.file}-motion.webm`}
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={`Silent screen recording of our ${active.name} website concept`}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onError={() => {
                  setAvailable(false);
                  setPlaying(false);
                }}
              />
            )}
            <div className="sr-film-tools">
              <span>DESIGN CONCEPT / PRIVATE PREVIEW</span>
              {available && (
                <button
                  onClick={toggle}
                  aria-label={
                    playing ? "Pause project film" : "Play project film"
                  }
                >
                  {playing ? <Pause size={15} /> : <Play size={15} />}
                  <span>{playing ? "Pause" : "Play"}</span>
                </button>
              )}
            </div>
          </div>
          <aside className="sr-project-story" key={active.name}>
            <span className="sr-case-number">
              {active.number}
              <span>/ 02</span>
            </span>
            <div>
              <span className="sr-case-type">{active.discipline}</span>
              <h2>
                {active.line.split("\n").map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </h2>
              <p>{active.detail}</p>
            </div>
            <a href={active.url} target="_blank" rel="noopener noreferrer">
              Explore the concept <ArrowUpRight size={21} />
            </a>
          </aside>
        </div>
        <div className="sr-stage-bottom">
          <div
            className="sr-film-selector"
            role="group"
            aria-label="Featured design concepts"
          >
            {films.map((f, i) => (
              <button
                key={f.file}
                onClick={() => choose(i)}
                aria-pressed={selected === i}
              >
                <span>{f.number}</span>
                {f.short}
                <span className="sr-selection-line" />
              </button>
            ))}
          </div>
          <p>Built by our studio. Shown here as private concepts.</p>
        </div>
      </div>
      <div className="sr-signoff st-container">
        <span>Agents do the building.</span>
        <span className="sr-signoff-rule" />
        <span>People own the result.</span>
        <ArrowDown size={22} />
      </div>
    </section>
  );
}
