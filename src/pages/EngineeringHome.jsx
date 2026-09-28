import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight, Download, Pause, Play } from 'lucide-react';
import CoreHud from '../components/core/CoreHud';
import { LOOP_STAGES } from '../components/core/coreChapters';
import { createCoreDirector } from '../components/core/coreDirector';
import '../styles/core-home.css';

const CHAPTERS = [
  { id: 'core', n: '00', label: 'The core' },
  { id: 'capabilities', n: '01', label: 'Capabilities' },
  { id: 'method', n: '02', label: 'How we work' },
  { id: 'research', n: '03', label: 'Research' },
  { id: 'company', n: '04', label: 'Company' },
  { id: 'contact', n: '05', label: 'Contact' },
];

const CAPABILITIES = [
  ['Software engineering', 'Applications and tools shaped around the people who use them.'],
  ['AI agents & automation', 'Clear intent turned into useful action, with people at the decision points.'],
  ['Systems integration', 'Interfaces and data flows that make separate tools work as one.'],
  ['Testing & evaluation', 'Checks built around the outcome that matters, failure cases included.'],
];

const motionQuery = '(prefers-reduced-motion: reduce)';
const subscribeMotion = (callback) => {
  const media = window.matchMedia(motionQuery);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
};
const getMotion = () => window.matchMedia(motionQuery).matches;
const getServerMotion = () => false;
const subscribeNothing = () => () => {};

// A tiny store so only the chapter rail re-renders when the chapter changes.
function createChapterStore() {
  let value = 0;
  const listeners = new Set();
  return {
    get: () => value,
    set(next) {
      if (next === value) return;
      value = next;
      listeners.forEach((listener) => listener());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

function ChapterRail({ store, onJump }) {
  const active = useSyncExternalStore(store.subscribe, store.get, () => 0);
  return (
    <nav className="ch-rail" aria-label="Homepage chapters">
      <ol>
        {CHAPTERS.map((chapter, index) => (
          <li key={chapter.id}>
            <a
              href={`#${chapter.id}`}
              aria-current={index === active ? 'true' : undefined}
              onClick={(event) => {
                if (!onJump) return;
                event.preventDefault();
                onJump(`#${chapter.id}`);
              }}
            >
              <span className="ch-rail-label">{chapter.label}</span>
              <span className="ch-rail-number">{chapter.n}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Kicker({ n, children }) {
  return (
    <p className="ch-kicker">
      {n && <span className="ch-kicker-n">{n}</span>}
      <span className="ch-kicker-text">{children}</span>
    </p>
  );
}

export default function EngineeringHome() {
  const root = useRef(null);
  const layer = useRef(null);
  const stage = useRef(null);
  const hud = useRef(null);
  const poster = useRef(null);
  const dots = useRef(null);
  const director = useRef(null);
  const motion = useRef(null);
  const store = useRef(null);
  if (!store.current) store.current = createChapterStore();
  const reduced = useSyncExternalStore(subscribeMotion, getMotion, getServerMotion);
  const [paused, setPaused] = useState(false);
  const [jump, setJump] = useState(null);
  // False in the server HTML and during hydration: the pause control only
  // means something once the scripts are running.
  const mounted = useSyncExternalStore(subscribeNothing, () => true, () => false);

  // Hold the intro copy for the boot sequence (the inline script in
  // index.html does this for full page loads; this covers in-app navigation).
  useLayoutEffect(() => {
    if (!getMotion()) document.documentElement.classList.add('core-boot');
  }, []);

  useEffect(() => {
    let cancelled = false;
    const sections = [...root.current.querySelectorAll('[data-chapter-section]')];
    const instance = createCoreDirector({
      layer: layer.current,
      stage: stage.current,
      hud: hud.current,
      poster: poster.current,
      sections,
      reduced: getMotion(),
      onChapter: (index) => {
        store.current.set(index);
        motion.current?.chapter(index);
      },
      onFrame: (frame) => motion.current?.frame(frame),
    });
    director.current = instance;
    import('../components/core/coreMotion')
      .then(({ createCoreMotion }) => createCoreMotion({
        root: root.current,
        layer: layer.current,
        hud: hud.current,
        dotsCanvas: dots.current,
        director: instance,
        reduced: getMotion(),
      }))
      .then((created) => {
        if (cancelled) {
          created.dispose();
          return;
        }
        motion.current = created;
        setJump(() => (target) => created.scrollTo(target));
        instance.wake();
      })
      .catch(() => {
        document.documentElement.classList.remove('core-boot');
      });
    return () => {
      cancelled = true;
      motion.current?.dispose();
      motion.current = null;
      instance.dispose();
      director.current = null;
    };
  }, []);

  useEffect(() => {
    director.current?.setStill(reduced);
  }, [reduced]);

  function togglePaused() {
    const next = !paused;
    setPaused(next);
    director.current?.setPaused(next);
    motion.current?.setPaused(next);
  }

  return (
    <div className="ch" ref={root}>
      <div className="ch-layer" ref={layer} data-chapter="core" data-scene="poster" data-stage="1" aria-hidden="true">
        <div className="ch-canvas" ref={stage} />
        <div className="ch-poster" ref={poster}>
          <img src="/brand/whoff-core-poster.webp" alt="" width="1000" height="1000" decoding="async" />
        </div>
        <canvas className="ch-dots" ref={dots} />
        <CoreHud ref={hud} />
        <ol className="ch-loop-labels">
          {LOOP_STAGES.map((stage, index) => (
            <li key={stage.n} data-tone={stage.tone} data-index={index + 1} style={{ '--a': `${(index / LOOP_STAGES.length) * 360 - 90}deg` }}>
              <span>{stage.n}</span>
              <strong>{stage.name}</strong>
              <em>{stage.role}</em>
            </li>
          ))}
        </ol>
        <div className="ch-shade" />
        <div className="ch-vignette" />
      </div>

      <ChapterRail store={store.current} onJump={jump} />

      <section className="ch-chapter ch-intro" id="core" data-chapter-section="core" aria-labelledby="ch-title">
        <Kicker>Whoff Agents LLC · AI‑native engineering</Kicker>
        <h1 className="ch-title" id="ch-title">
          <span className="ch-title-line ch-title-a">Human intent.</span>{' '}
          <span className="ch-title-line ch-title-b">Intelligent action.</span>
        </h1>
        <div className="ch-intro-foot">
          <p className="ch-lede ch-reveal">We build software and autonomous systems. Then we measure whether they work.</p>
          <div className="ch-actions ch-reveal">
            <Link to="/contact" className="ch-button">Start a conversation <ArrowUpRight size={16} aria-hidden="true" /></Link>
            <a
              href="#capabilities"
              className="ch-textlink"
              onClick={(event) => {
                if (!jump) return;
                event.preventDefault();
                jump('#capabilities');
              }}
            >
              Explore the core <ArrowDown size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="ch-intro-readout ch-reveal" aria-hidden="true">
          <span>Input · human intent</span>
          <i />
          <span>Output · tested result</span>
        </div>
      </section>

      <section className="ch-chapter ch-side ch-side--left" id="capabilities" data-chapter-section="capabilities" aria-labelledby="ch-capabilities-title">
        <div className="ch-panel">
          <Kicker n="01">Capabilities</Kicker>
          <h2 className="ch-heading" id="ch-capabilities-title">Make the possible <span>useful.</span></h2>
          <p className="ch-lede ch-reveal">From an early question to a working system. We connect ideas, tools and disciplines, then work through the details.</p>
          <ol className="ch-list">
            {CAPABILITIES.map(([title, text], index) => (
              <li key={title} className="ch-reveal" data-core-anchor="">
                <span className="ch-list-n">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link to="/capabilities" className="ch-textlink ch-reveal">All capabilities <ArrowUpRight size={15} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="ch-chapter ch-method" id="method" data-chapter-section="method" aria-labelledby="ch-method-title">
        <div className="ch-method-sticky">
          <div className="ch-panel ch-method-lead">
            <Kicker n="02">How we work</Kicker>
            <h2 className="ch-heading" id="ch-method-title">From intent to <span>tested result.</span></h2>
            <p className="ch-lede ch-reveal">AI does much of the planning, building and checking. People set the intent, own the judgment and make the final call.</p>
          </div>
          <div className="ch-panel ch-method-principle ch-reveal">
            <p className="ch-principle">Verification over trust.</p>
            <p>We don’t ask anyone to trust an AI, a developer or a demo. A working system should produce its own evidence.</p>
            <p className="ch-principle-pair">Outcome over ceremony <i /> Leverage over toil</p>
          </div>
          <ol className="ch-loop-list" aria-label="Our working loop">
            {LOOP_STAGES.map((stage) => (
              <li key={stage.n} data-tone={stage.tone}>
                <span>{stage.n}</span>
                <strong>{stage.name}</strong>
                <em>{stage.role}</em>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="ch-chapter ch-side ch-side--right" id="research" data-chapter-section="research" aria-labelledby="ch-research-title">
        <div className="ch-panel">
          <Kicker n="03">Research & development</Kicker>
          <h2 className="ch-heading" id="ch-research-title">Stay curious. <span>Build to find out.</span></h2>
          <p className="ch-lede ch-reveal">Prototypes, experiments and questions that deserve a closer look. Progress starts with learning what holds up.</p>
          <div className="ch-programs">
            <Link to="/research/persona-fleet" className="ch-program ch-reveal" data-core-anchor="">
              <span className="ch-program-meta"><i aria-hidden="true" /> In development · Cellular privacy</span>
              <strong>Persona Fleet <ArrowUpRight size={15} aria-hidden="true" /></strong>
              <span>Can realistic decoy activity make observed communications less informative? We test our own decoys against our own detectors.</span>
              <span className="ch-program-standard">Protection is measured, not asserted.</span>
            </Link>
            <Link to="/research#autonomy" className="ch-program ch-reveal" data-core-anchor="">
              <span className="ch-program-meta ch-program-meta--blue"><i aria-hidden="true" /> Research direction · Agent systems</span>
              <strong>Useful autonomy <ArrowUpRight size={15} aria-hidden="true" /></strong>
              <span>Systems that carry context forward, act reliably and stay accountable to the people they serve.</span>
            </Link>
          </div>
          <Link to="/research" className="ch-textlink ch-reveal">Inside our research <ArrowUpRight size={15} aria-hidden="true" /></Link>
        </div>
        <p className="ch-figure-note">Illustration: four plausible signatures, one source.</p>
      </section>

      <section className="ch-chapter ch-side ch-side--left" id="company" data-chapter-section="company" aria-labelledby="ch-company-title">
        <div className="ch-panel">
          <Kicker n="04">Whoff Agents LLC</Kicker>
          <h2 className="ch-heading" id="ch-company-title">Independent minds. <span>Useful systems.</span></h2>
          <p className="ch-lede ch-reveal">We believe technology should understand intent, carry work forward and earn trust through what it does. AI expands our reach. People decide what matters and stay accountable for the result.</p>
          <div className="ch-people">
            <div className="ch-person ch-reveal" data-core-anchor="">
              <span className="ch-person-role">CEO & Managing Member</span>
              <strong>Bill</strong>
              <span>Forty years in defense and intelligence program management.</span>
            </div>
            <div className="ch-person ch-reveal" data-core-anchor="">
              <span className="ch-person-role">President & CTO</span>
              <strong>Will</strong>
              <span>Electrical and computer engineer. Leads technical direction.</span>
            </div>
          </div>
          <dl className="ch-facts ch-reveal">
            <div><dt>Entity</dt><dd>Virginia LLC</dd></div>
            <div><dt>Ownership</dt><dd>Veteran-owned small business</dd></div>
            <div><dt>UEI</dt><dd>HV62R8JGP7Z8</dd></div>
            <div><dt>CAGE</dt><dd>Pending</dd></div>
          </dl>
          <div className="ch-actions ch-reveal">
            <Link to="/about" className="ch-textlink">Meet the company <ArrowUpRight size={15} aria-hidden="true" /></Link>
            <a href="/downloads/whoff-capabilities.pdf" className="ch-textlink" download>Capability statement <Download size={15} aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <section className="ch-chapter ch-contact" id="contact" data-chapter-section="contact" aria-labelledby="ch-contact-title">
        <div className="ch-panel ch-contact-panel">
          <Kicker n="05">Contact</Kicker>
          <h2 className="ch-heading" id="ch-contact-title">Start with <span>the problem.</span></h2>
          <p className="ch-lede ch-reveal">Tell us what you are trying to make possible, what needs to work, and what is getting in the way.</p>
          <a className="ch-email ch-reveal" href="mailto:will@whoffagents.com">
            will@whoffagents.com <ArrowUpRight size={26} aria-hidden="true" />
          </a>
          <p className="ch-contact-meta ch-reveal">Engineering, research and partnerships · Will, President & CTO</p>
          <div className="ch-contact-links ch-reveal">
            <a href="mailto:hello@whoffagents.com">Existing products & support</a>
            <Link to="/studio">Services & tools</Link>
            <a href="/downloads/whoff-capabilities.pdf" download>Capability statement</a>
          </div>
        </div>
      </section>

      {mounted && !reduced && (
        <button type="button" className="ch-motion" aria-pressed={paused} onClick={togglePaused}>
          {paused ? <Play size={12} aria-hidden="true" /> : <Pause size={12} aria-hidden="true" />}
          {paused ? 'Resume motion' : 'Pause motion'}
        </button>
      )}
    </div>
  );
}
