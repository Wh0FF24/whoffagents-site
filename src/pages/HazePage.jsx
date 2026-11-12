import { useEffect, useRef } from "react";
import { ArrowDown, Check, Minus } from "lucide-react";
import HazeWaitlistForm from "../components/haze/HazeWaitlistForm";
import OpeningFigure from "../components/haze/OpeningFigure";
import PatternFigure from "../components/haze/PatternFigure";
import CrowdFigure from "../components/haze/CrowdFigure";
import TestedFigure from "../components/haze/TestedFigure";
import ScoreFigure from "../components/haze/ScoreFigure";
import * as hazeData from "../components/haze/hazeData";
// This page's styles travel with the page, as text in its own HTML. They are
// not added to the stylesheet every other page loads.
import pageStyles from "../styles/haze.css?inline";

// Haze: a waitlist page for an app that is still in design. It stands on its
// own, with its own top bar and footer, and no other page links to it. Every
// figure is complete in the HTML the server sends. Motion is added after the
// first paint, and the page reads the same without it.
const CAPTION = "Illustrative model. Not measured performance.";

const RULES = [
  "It will run on your device. Your real activity will stay there.",
  "No fake ad clicks. That costs other people money.",
  "Decoys will stick to ordinary, everyday content.",
  "You will set the limits: data, battery and hours.",
];

const LIMITS = [
  "It will not make you anonymous.",
  "It will not change what a service learns while you are signed in to it.",
  "It is not a VPN or an ad blocker. It will work beside them.",
  "We do not know yet how much it will help. Finding out is the point of building it, and we will publish what we measure.",
];

// The motion is loaded after first paint. If it cannot load, the page drops
// the tall scroll-through layout and stays as its still frames.
function useHazeMotion() {
  const root = useRef(null);
  useEffect(() => {
    const page = root.current;
    let motion = null;
    let gone = false;
    import("../components/haze/hazeMotion")
      .then(({ createHazeMotion }) => createHazeMotion(page, hazeData))
      .then((made) => {
        if (gone) made.dispose();
        else motion = made;
      })
      .catch(() => {
        if (!gone) page.setAttribute("data-hz-static", "");
      });
    return () => {
      gone = true;
      motion?.dispose();
      page.removeAttribute("data-hz-static");
    };
  }, []);
  return root;
}

function Figure({ describe, opening = false, children }) {
  return (
    <figure className={opening ? "hz-figure hz-figure--opening" : "hz-figure"} data-live="false">
      <div className="hz-stage" role="img" aria-label={describe}>
        {children}
      </div>
      <figcaption className="hz-caption">{CAPTION}</figcaption>
    </figure>
  );
}

function Scene({ id, name, title, describe, figure, children }) {
  return (
    <section className="hz-scene" id={id} data-hz-scene={name} aria-labelledby={`${id}-title`}>
      <div className="hz-scene-stick">
        <div className="hz-shell hz-scene-grid">
          <div className="hz-scene-copy">
            <h2 id={`${id}-title`}>{title}</h2>
            {children}
          </div>
          <Figure describe={describe}>{figure}</Figure>
        </div>
      </div>
    </section>
  );
}

export default function HazePage() {
  const root = useHazeMotion();
  return (
    <article className="hz-page" ref={root}>
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />
      <noscript>
        <style>{".hz-page .hz-scene{height:auto!important}.hz-page .hz-scene-stick{position:static!important;height:auto!important}"}</style>
      </noscript>

      <header className="hz-bar">
        <div className="hz-shell hz-bar-row">
          <p className="hz-bar-name">Haze</p>
          <a className="hz-button hz-button--small" href="#waitlist">
            Join the waitlist
          </a>
        </div>
      </header>

      <section className="hz-opening" id="top" aria-labelledby="top-title">
        <div className="hz-shell hz-opening-grid">
          <div className="hz-opening-copy">
            <p className="hz-label">In design. Not available yet.</p>
            <h1 className="hz-title" id="top-title">
              Stay online. Stay <span className="hz-title-soft">out of focus</span>.
            </h1>
            <p className="hz-lede">
              Every search, visit and tap adds to a profile of you. Haze will add decoy activity built to behave like real people, so that profile says less
              about the real one.
            </p>
            <div className="hz-actions">
              <a className="hz-button" href="#waitlist">
                Join the waitlist
              </a>
              <a className="hz-textlink" href="#pattern">
                See how it works
                <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
          <Figure opening describe="Illustration. A profile made of points of activity loses its sharp edge as other points drift through it.">
            <OpeningFigure />
          </Figure>
        </div>
      </section>

      <Scene
        id="pattern"
        name="pattern"
        title="Your activity makes a pattern."
        describe="Illustration. Scattered points of activity gather into rows across a day, and a profile of routine and interests comes into focus."
        figure={<PatternFigure />}
      >
        <p className="hz-text">
          When you are online. What you look at. How much, and how often. Put together, it is enough to guess your routine, your interests and a good deal
          more.
        </p>
        <p className="hz-small">
          A VPN hides your traffic from your internet provider. A blocker stops some trackers. Neither changes the pattern you leave with the sites and apps
          you actually use.
        </p>
      </Scene>

      <Scene
        id="crowd"
        name="crowd"
        title="Haze would give them a crowd."
        describe="Illustration. Decoy activity appears beside the real activity, each row with its own timing, and the profile under it goes soft."
        figure={<CrowdFigure />}
      >
        <p className="hz-text">
          Haze will run decoys beside you. Each one has its own interests and its own daily rhythm, and none of them moves in step with you. A profile built
          on the mix is meant to be a blurrier picture of the real you.
        </p>
      </Scene>

      <Scene
        id="tested"
        name="tested"
        title="Tested decoys, not random noise."
        describe="Illustration. Random decoys are caught at a detector and dropped. Tested decoys pass through it."
        figure={<TestedFigure />}
      >
        <p className="hz-text">
          Random noise can be told apart from real behavior and thrown away. So the plan is to test every kind of decoy against a detector built to catch
          fakes, and to keep only what passes.
        </p>
      </Scene>

      <Scene
        id="score"
        name="score"
        title="You would see the result."
        describe="Illustration of a sample screen. A marker on a gauge moves between easy to pick out and hard to pick out."
        figure={<ScoreFigure />}
      >
        <p className="hz-text">
          Haze will show a score: how easily a detector can pick your real activity out of the mix. If it can still pick you out, you will see that.
        </p>
      </Scene>

      <section className="hz-plain" id="rules" aria-labelledby="rules-title">
        <div className="hz-shell hz-plain-grid">
          <h2 id="rules-title" data-hz-rise="">
            Ground rules.
          </h2>
          <ul className="hz-list">
            {RULES.map((rule) => (
              <li key={rule} data-hz-rise="">
                <Check size={18} aria-hidden="true" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="hz-plain hz-plain--limits" id="limits" aria-labelledby="limits-title">
        <div className="hz-shell hz-plain-grid">
          <h2 id="limits-title" data-hz-rise="">
            What it will not do.
          </h2>
          <ul className="hz-list">
            {LIMITS.map((limit) => (
              <li key={limit} data-hz-rise="">
                <Minus size={18} aria-hidden="true" />
                <span>{limit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="hz-waitlist" id="waitlist" aria-labelledby="waitlist-title">
        <div className="hz-shell hz-waitlist-grid">
          <div className="hz-waitlist-copy" data-hz-rise="">
            <h2 id="waitlist-title">Should we build it?</h2>
            <p className="hz-text">
              Haze is not built yet. We have a decoy engine and detectors running in our lab for related work. The app does not exist. Join the list and
              tell us two things. If enough people want it, we build it, and you hear first.
            </p>
          </div>
          <div className="hz-waitlist-form" data-hz-rise="">
            <HazeWaitlistForm />
          </div>
        </div>
      </section>

      <footer className="hz-footer">
        <div className="hz-shell">
          <p>
            Haze is a working name from <a href="/">Whoff Agents</a>.
          </p>
          <p>
            This page loads nothing from other companies and sets no cookies. The hosts that serve this page and take
            your signup keep ordinary request logs, which include your IP address. Those logs do not hold your email or
            your answers.
          </p>
        </div>
      </footer>
    </article>
  );
}
