import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import InquiryForm from "../components/InquiryForm";
import HeroFigure from "../components/eidolon/HeroFigure";
import SignalFigure from "../components/eidolon/SignalFigure";
import CrowdFigure from "../components/eidolon/CrowdFigure";
import LanesFigure from "../components/eidolon/LanesFigure";
import KeepFigure from "../components/eidolon/KeepFigure";
import DayFigure from "../components/eidolon/DayFigure";
import "../styles/engineering-pages.css";
import "../styles/eng-visuals.css";
// This page's own styles travel with the page, as text, and are not added to
// the stylesheet every other page loads.
import pageStyles from "../styles/eidolon.css?inline";

// Eidolon, shown rather than described: an unlisted page reached by direct
// link. Every figure is complete in the prerendered HTML. Motion is added
// after first paint and the page reads the same without it.
const CAPTION = "Illustrative model, not measured traffic or performance.";

const CHAPTERS = [
  ["top", "Eidolon"],
  ["signal", "The signal"],
  ["crowd", "The crowd"],
  ["lanes", "Many lanes"],
  ["keeping-up", "Keeping up"],
  ["full-day", "A full day"],
  ["status", "Where it stands"],
  ["request", "Request"],
];

const STATUS = [
  {
    name: "Decoy behavior engine",
    state: "Runs today",
    tone: "run",
    detail:
      "Each decoy keeps its own daily rhythm (commuter, shift worker, traveler, resident) and re-plans as the device's place, motion and time of day change. In the runs so far those came from a simulated route, not from the device's sensors.",
  },
  {
    name: "Phone agent",
    state: "Run on a test phone",
    tone: "run",
    detail:
      "It has run full 24-hour plans on a test phone at the bench, taking no instructions once a run started.",
  },
  {
    name: "Operator console",
    state: "Runs in test",
    tone: "run",
    detail:
      "It plans a window, assigns decoys and produces a report afterwards. It runs today against simulated devices and one test phone.",
  },
  {
    name: "Traffic splitting",
    state: "Proven in the lab",
    tone: "lab",
    detail:
      "Splitting a protected phone's traffic across several decoy lanes works in the lab. It has not run on a device.",
  },
  {
    name: "Detector challenge",
    state: "Before any claim",
    tone: "lab",
    detail:
      "Decoys are challenged with our own detectors before any protection claim is made.",
  },
  {
    name: "Device hardware",
    state: "In design",
    tone: "design",
    detail: "The device hardware is in design. Nothing has shipped.",
  },
];

// The form reuses the site's one inquiry intake and its delivery path. The
// request type travels inside the existing "needs" field.
const REQUEST_TYPES = [
  { value: "Eidolon pilot", label: "A pilot conversation" },
  { value: "Eidolon updates", label: "Progress updates" },
];
const SUPPORT = "hello@whoffagents.com";
const REQUEST_COPY = {
  legend: "What are you asking for?",
  businessLabel: "Organization",
  businessRequired: true,
  needsLabel: "Your organization, and what you would want Eidolon to do",
  submitLabel: "Send request",
  topic: "request",
  emailPlaceholder: "you@organization.org",
  phonePlaceholder: "Phone number",
  messages: {
    blocked: `We could not submit this form. Please email ${SUPPORT} and we will pick it up from there.`,
    sent: `Sent. Requests are reviewed before any reply. To reach us directly, email ${SUPPORT}.`,
    sendFailed: `We could not send that just now. Your details are still here, so you can try again. If it keeps failing, email ${SUPPORT}.`,
    sendTimeout: `That request timed out before it went through. Your details are still here. Please email ${SUPPORT} to check before submitting again.`,
    received:
      "Your request was received. Requests are reviewed before any reply.",
    notDelivered: `We could not deliver that just now. Your details are still here, so you can try again. If it keeps failing, email ${SUPPORT}.`,
    unconfirmed: `We could not confirm receipt. Your details are still here. Please email ${SUPPORT} to check before submitting again.`,
    unconfirmedTimeout: `We could not confirm receipt before the request timed out. Your details are still here. Please email ${SUPPORT} to check before submitting again.`,
  },
};

// Scroll-driven motion, loaded after first paint. If it cannot load, the page
// drops the tall scroll-through layout and stays as the still frames.
function useEidolonMotion() {
  const root = useRef(null);
  useEffect(() => {
    const page = root.current;
    const made = [];
    let dead = false;
    const keep = (motion) => {
      if (dead) motion?.dispose();
      else made.push(motion);
    };
    // The scenes.
    import("../components/eidolon/eidolonMotion")
      .then(({ createEidolonMotion }) => createEidolonMotion(page))
      .then(keep)
      .catch(() => {
        if (!dead) page.setAttribute("data-eid-static", "");
      });
    // The site's usual reveals, for the sections below the scenes.
    import("../components/eng/engMotion")
      .then(({ createEngMotion }) => createEngMotion(page))
      .then(keep)
      .catch(() => {});
    return () => {
      dead = true;
      made.splice(0).forEach((motion) => motion?.dispose());
      page.removeAttribute("data-eid-static");
    };
  }, []);
  return root;
}

// Labels and hairlines inside a figure keep one size on screen however large
// the figure is drawn: each stage is told how many drawing units make a pixel.
function useFigureScale(root) {
  useEffect(() => {
    if (typeof ResizeObserver !== "function") return undefined;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        if (width > 0) {
          entry.target.style.setProperty("--eid-u", Math.min(1.25, Math.max(0.62, 400 / width)).toFixed(3));
        }
      }
    });
    root.current.querySelectorAll(".eid-stage").forEach((stage) => observer.observe(stage));
    return () => observer.disconnect();
  }, [root]);
}

// A row of marks that shows how far down the page a scene sits.
function Kicker({ at, children }) {
  return (
    <p className="eid-kicker">
      <span className="eid-kicker-scale" aria-hidden="true">
        {CHAPTERS.map(([id], index) => (
          <i key={id} className={index === at ? "is-here" : undefined} />
        ))}
      </span>
      {children}
    </p>
  );
}

function Scene({ id, at, name, label, proof, title, lede, describe, figure, children }) {
  return (
    <section className="eid-scene" id={id} data-eid-scene={name} aria-labelledby={`${id}-title`}>
      <div className="eid-scene-stick">
        <div className="eng-shell eid-scene-grid">
          <div className="eid-scene-head">
            <Kicker at={at}>{label}</Kicker>
            <h2 id={`${id}-title`}>{title}</h2>
            {proof && <p className="eid-proof">{proof}</p>}
            <p className="eid-lede">{lede}</p>
          </div>
          <figure className="eid-figure" data-live="false">
            <div className="eid-stage" role="img" aria-label={describe}>
              {figure}
            </div>
            <figcaption className="eid-caption">{CAPTION}</figcaption>
          </figure>
          <div className="eid-scene-beats">{children}</div>
        </div>
        <span className="eid-meter" aria-hidden="true">
          <i />
        </span>
      </div>
    </section>
  );
}

function Beat({ name, children }) {
  return (
    <li data-beat="" data-on="true">
      <span className="eid-beat-name">{name}</span>
      <span>{children}</span>
    </li>
  );
}

function Chip({ children }) {
  return (
    <li data-beat="" data-on="true">
      {children}
    </li>
  );
}

export default function EidolonPage() {
  const root = useEidolonMotion();
  useFigureScale(root);
  return (
    <article className="eng-page eid-page" ref={root}>
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />
      <noscript>
        <style>{".eid-page .eid-scene{height:auto!important}.eid-page .eid-scene-stick{position:static!important;height:auto!important}"}</style>
      </noscript>

      <header className="eid-hero" id="top" data-live="true">
        <div className="eid-hero-visual">
          <HeroFigure />
        </div>
        <div className="eng-shell eid-hero-grid">
          <div className="eid-hero-copy">
            <p className="eng-label eid-hero-label">
              <span className="eng-index">Whoff Agents</span>
              Research and development
            </p>
            <h1 className="eid-title" data-text="Eidolon">
              Eidolon
            </h1>
            <p className="eid-hero-line">
              Realistic decoy phone activity around one protected phone, built
              so the pattern an outside observer can see stops pointing at one
              person.
            </p>
            <p className="eng-status eid-hero-status">
              <span aria-hidden="true" />
              In development
            </p>
            <div className="eid-actions">
              <a className="eid-button" href="#request">
                Request a pilot conversation
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <a className="eid-textlink" href="#signal">
                See what it does
                <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
          <dl className="eid-hero-facts">
            <div>
              <dt>What it is</dt>
              <dd>A small carry-along device plus an operator console.</dd>
            </div>
            <div>
              <dt>Where it stands</dt>
              <dd>In development. The device hardware is in design and nothing has shipped.</dd>
            </div>
          </dl>
        </div>
        <p className="eid-caption eid-hero-caption">{CAPTION}</p>
      </header>

      <Scene
        id="signal"
        at={1}
        name="signal"
        label="The signal"
        title={<>Encryption hides the content. It does not hide the pattern.</>}
        lede="A phone going about its day gives an outside observer plenty to read, without opening a single message."
        describe="Illustration. One phone's activity resolves into a clear pattern of where, when and how much, and a reticle locks onto the phone."
        figure={<SignalFigure />}
      >
        <ul className="eid-beats">
          <Beat name="Where">The places it returns to.</Beat>
          <Beat name="When">Its daily rhythm, across 24 hours.</Beat>
          <Beat name="How much">The shape of its traffic.</Beat>
          <Beat name="Lock">Put together, the pattern points at one person.</Beat>
        </ul>
      </Scene>

      <Scene
        id="crowd"
        at={2}
        name="crowd"
        label="The crowd"
        title="Now give that phone a crowd."
        lede="Eidolon is built to surround the protected phone with realistic decoy phone activity. Each decoy keeps a daily rhythm of its own. The aim is a pattern that stops pointing at one person, while that person stays connected."
        describe="Illustration. Decoy phones appear around the protected phone, each with its own daily rhythm, and the reticle moves between them without settling on one."
        figure={<CrowdFigure />}
      >
        <p className="eid-chips-title">Each decoy keeps a rhythm of its own</p>
        <ul className="eid-chips">
          <Chip>Commuter</Chip>
          <Chip>Shift worker</Chip>
          <Chip>Traveler</Chip>
          <Chip>Resident</Chip>
        </ul>
        <p className="eid-aside" data-beat="" data-on="true">
          In this model the reticle hunts and cannot settle.
        </p>
      </Scene>

      <Scene
        id="lanes"
        at={3}
        name="lanes"
        label="One stream, many lanes"
        proof="Proven in the lab"
        title="Following one identity shows only a fraction."
        lede="The protected phone's traffic fans out across the decoys' lanes. An observer who follows any one identity sees a fraction of the stream. Splitting works in the lab. It has not run on a device yet."
        describe="Illustration. The phone's single stream of traffic fans out across several decoy lanes. An observer following one lane sees a fraction of the stream."
        figure={<LanesFigure />}
      >
        <ul className="eid-beats">
          <Beat name="One stream">It leaves the phone as a single flow.</Beat>
          <Beat name="Many lanes">It fans out across the decoys' lanes.</Beat>
          <Beat name="A fraction">Any one lane carries only part of it.</Beat>
        </ul>
      </Scene>

      <Scene
        id="keeping-up"
        at={4}
        name="keep"
        label="They keep up with you"
        title="Move, and every decoy re-plans in its own time."
        lede="The decoy behavior engine re-plans as the device's place, motion and time of day change. Each decoy changes what it is doing at a different moment, so they never move in step."
        describe="Illustration. A device moves from home to work to a store. After each change, each decoy changes what it is doing at a different moment."
        figure={<KeepFigure />}
      >
        <p className="eid-chips-title">Re-planned as these change</p>
        <ul className="eid-chips">
          <Chip>Place</Chip>
          <Chip>Motion</Chip>
          <Chip>Time of day</Chip>
        </ul>
        <p className="eid-aside" data-beat="" data-on="true">
          Each decoy in its own time. They never move in step. In the runs so
          far the device's movements came from a simulated route, not from its
          sensors.
        </p>
      </Scene>

      <Scene
        id="full-day"
        at={5}
        name="day"
        label="A full day, no link"
        proof="24-hour plans run on a cabled test phone"
        title="Plan at the dock. Then 24 hours dark."
        lede="The operator console plans a window and assigns the decoys. Undocked, the phone agent is built to carry the plan on its own, with no link to the operator. Docked again, the console produces the report."
        describe="Illustration. The designed routine: a plan is loaded at the dock, the device undocks and is meant to run for 24 hours with no link, then docks again and the operator console shows a report."
        figure={<DayFigure />}
      >
        <p className="eid-chips-title">One day, start to finish</p>
        <ol className="eid-chips eid-chips--steps">
          <Chip>Plan at the dock</Chip>
          <Chip>Undock</Chip>
          <Chip>24 hours dark</Chip>
          <Chip>Dock again</Chip>
          <Chip>Read the report</Chip>
        </ol>
        <p className="eid-aside">
          The phone agent has run full 24-hour plans on a test phone at the
          bench. It took no instructions once a run started. It stayed on its
          cable and on Wi-Fi the whole time. The console runs today against
          simulated devices and one test phone. The device hardware is in
          design.
        </p>
      </Scene>

      <section className="eid-status" id="status" aria-labelledby="status-title">
        <div className="eng-shell eid-status-grid">
          <div className="eid-status-head">
            <Kicker at={6}>Where it stands</Kicker>
            <h2 id="status-title" data-split="">
              What runs today,
              <br />
              and what does not yet.
            </h2>
            <p className="eid-lede" data-reveal="">
              Eidolon is in development. This is each part as it stands, in
              plain terms.
            </p>
            <div className="eng-research-note eid-status-note" data-reveal="">
              <span className="eng-small-label">Current maturity</span>
              <p>
                Protection effectiveness has not been established. The scenes
                on this page are an illustrative model, not measured traffic
                or performance.
              </p>
            </div>
          </div>
          <div className="eid-board">
            <span className="eid-board-head" aria-hidden="true">
              <span>Status board</span>
              <span>In development</span>
            </span>
            <ul data-reveal-group="">
              {STATUS.map((row) => (
                <li key={row.name} className={`eid-board-row is-${row.tone}`}>
                  <span className="eid-board-lamp" aria-hidden="true" />
                  <h3>{row.name}</h3>
                  <p className="eid-board-state">{row.state}</p>
                  <p className="eid-board-detail">{row.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="eid-request" id="request" aria-labelledby="request-title">
        <div className="eng-shell eid-request-grid">
          <div className="eid-request-head">
            <Kicker at={7}>Request</Kicker>
            <h2 id="request-title" data-split="">
              Ask for a pilot
              <br />
              conversation.
            </h2>
            <p className="eid-lede" data-reveal="">
              Tell us who you are and what you would want Eidolon to do. If
              you would rather follow along for now, ask for progress updates
              instead.
            </p>
            <ul className="eid-terms" data-reveal-group="">
              <li>Organizations only.</li>
              <li>United States only for now.</li>
              <li>Requests are reviewed before any reply.</li>
              <li>
                Eidolon is in development, and nothing here is a performance
                guarantee.
              </li>
            </ul>
          </div>
          <div className="eid-request-form">
            <InquiryForm
              initialService="Eidolon pilot"
              services={REQUEST_TYPES}
              copy={REQUEST_COPY}
            />
          </div>
        </div>
      </section>

      {/* A rail of the page's sections, shown on wide screens. It sits last in
          the document so the keyboard reaches the page's own links first. */}
      <nav className="eid-rail" aria-label="On this page">
        <ol>
          {CHAPTERS.map(([id, name]) => (
            <li key={id}>
              <a href={`#${id}`} data-eid-chapter={id}>
                <span className="eid-rail-name">{name}</span>
                <span className="eid-rail-mark" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </article>
  );
}
