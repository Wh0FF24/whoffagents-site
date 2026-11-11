import { CROWD_CENTER, CROWD_REST, CROWD_ROUND, CROWD_TRAIL } from './crowdLayout';
import { KEEP_END, KEEP_START, KEEP_STOPS, keepSegmentAt } from './keepLayout';

// Motion for the Eidolon page (GSAP and ScrollTrigger, the libraries the rest
// of the site already uses). The page is complete without this module: each
// figure is drawn finished in the HTML. Here every scene gets a timeline that
// starts from its opening state and is played through by the scroll, plus a
// few loops that run only while that scene is on screen. Reduced motion skips
// all of it and keeps the finished frames.
//
// Two rules keep the scenes exact at any scroll position:
//  - a part's opening state is set outright when the scene is built, never
//    left to a tween's first render;
//  - anything that scales or turns is driven by a plain number and written
//    as an SVG transform here, so its centre is never in doubt.

const PINNED = '(min-width: 900px) and (min-height: 600px)';
const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
const mix = (from, to, amount) => from + (to - from) * amount;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const QUIET = '#aab2ba';
const UNLIT = '#3b4850';
const CRIMSON = '#e2445f';

function tools(gsap, timeline, undo) {
  // Put parts in their opening state now, then play them to how the page
  // draws them (opacity returns to the stylesheet's value, offsets to zero).
  const enter = (targets, from, to, position) => {
    const list = gsap.utils.toArray(targets);
    if (!list.length) return;
    const drawn = 'opacity' in from ? list.map((element) => Number(window.getComputedStyle(element).opacity)) : null;
    gsap.set(list, from);
    const end = { ...to };
    if (drawn && !('opacity' in end)) end.opacity = (index) => drawn[index];
    if ('x' in from && !('x' in end)) end.x = 0;
    if ('y' in from && !('y' in end)) end.y = 0;
    if ('drawSVG' in from && !('drawSVG' in end)) end.drawSVG = '100%';
    if ('fill' in from && !('fill' in end)) end.fill = CRIMSON;
    timeline.to(list, end, position);
  };
  // Grow bars (or rows) from other sizes to the ones in the markup.
  const resize = (targets, opening, to, position) => {
    const list = gsap.utils.toArray(targets);
    const opened = list.map((element, index) => opening(element, index));
    const names = Object.keys(opened[0]);
    const drawn = list.map((element) => Object.fromEntries(names.map((name) => [name, element.getAttribute(name)])));
    gsap.set(list, { attr: Object.fromEntries(names.map((name) => [name, (index) => opened[index][name]])) });
    timeline.to(list, { attr: Object.fromEntries(names.map((name) => [name, (index) => drawn[index][name]])), ...to }, position);
    undo(() => list.forEach((element, index) => names.forEach((name) => element.setAttribute(name, drawn[index][name]))));
  };
  // Play a plain number between two values and repaint as it moves.
  const run = (state, from, to, position, paint) => {
    timeline.fromTo(state, from, { ...to, immediateRender: false, onUpdate: paint }, position);
  };
  // Light a scene's lines of copy one at a time as the timeline passes them.
  const cue = (beats, times) => {
    gsap.set(beats, { attr: { 'data-on': 'false' } });
    times.forEach((time, index) => {
      if (beats[index]) timeline.set(beats[index], { attr: { 'data-on': 'true' } }, time);
    });
    undo(() => beats.forEach((beat) => beat.setAttribute('data-on', 'true')));
  };
  return { enter, resize, run, cue };
}

/* ---------------------------------------------------------------- scenes */

// Noise resolves into where, when and how much; then the reticle locks.
function buildSignal({ q, beats, undo, enter, resize, run, cue }) {
  const reticle = { scale: 1.7, alpha: 0.5, drift: 1 };
  const drift = q('.sig-reticle-drift')[0];
  const body = q('.sig-reticle-scale')[0];
  const paint = () => {
    body.setAttribute('transform', `scale(${reticle.scale.toFixed(4)})`);
    body.style.opacity = reticle.alpha.toFixed(3);
  };
  const settle = { duration: 0.8, ease: 'power3.out' };
  const quiet = (bar) => Number(bar.dataset.noise);

  // where
  enter(q('.eid-stray'), { opacity: 0.8 }, { duration: 0.8, stagger: { each: 0.035, from: 'random' } }, 0.7);
  enter(q('.sig-track'), { drawSVG: '0%' }, { duration: 1.3, ease: 'power1.inOut' }, 0.9);
  enter(q('.sig-dwell'), { opacity: 0 }, { duration: 0.4, stagger: 0.3 }, 1.5);
  enter(q('.sig-lamp-where'), { fill: UNLIT }, { duration: 0.2 }, 2.3);
  enter(q('.sig-feed-where'), { drawSVG: '0%' }, { duration: 0.6, ease: 'power1.in' }, 2.3);
  run(reticle, { scale: 1.7, alpha: 0.5 }, { scale: 1.44, alpha: 0.68, ...settle }, 2.8, paint);
  // when
  resize(q('.sig-when-bar'), (bar) => {
    const height = Number(bar.getAttribute('height')) * quiet(bar);
    return { y: 338 - height, height };
  }, { duration: 0.7, stagger: 0.035, ease: 'power3.out' }, 3.3);
  enter(q('.sig-when-bar'), { fill: QUIET }, { duration: 0.7, stagger: 0.035 }, 3.3);
  enter(q('.sig-lamp-when'), { fill: UNLIT }, { duration: 0.2 }, 4.7);
  enter(q('.sig-feed-when'), { drawSVG: '0%' }, { duration: 0.5, ease: 'power1.in' }, 4.7);
  run(reticle, { scale: 1.44, alpha: 0.68 }, { scale: 1.2, alpha: 0.85, ...settle }, 5.1, paint);
  // how much
  resize(q('.sig-much-bar'), (bar) => {
    const height = Number(bar.getAttribute('height')) * quiet(bar);
    return { y: 312 - height / 2, height };
  }, { duration: 0.7, stagger: 0.04, ease: 'power3.out' }, 5.6);
  enter(q('.sig-much-bar'), { fill: QUIET }, { duration: 0.7, stagger: 0.04 }, 5.6);
  enter(q('.sig-lamp-much'), { fill: UNLIT }, { duration: 0.2 }, 6.9);
  enter(q('.sig-feed-much'), { drawSVG: '0%' }, { duration: 0.6, ease: 'power1.in' }, 6.9);
  // lock
  run(reticle, { drift: 1 }, { drift: 0, duration: 0.35, ease: 'power2.in' }, 7.3);
  run(reticle, { scale: 1.2, alpha: 0.85 }, { scale: 1, alpha: 1, duration: 0.45, ease: 'back.out(2.4)' }, 7.5, paint);
  enter(q('.sig-lock'), { opacity: 0, x: -6 }, { duration: 0.3 }, 7.8);
  enter(q('.sig-exposed'), { opacity: 0, x: 8 }, { duration: 0.4 }, 7.9);
  cue(beats, [0.9, 3.3, 5.6, 7.6]);

  paint();
  undo(() => {
    body.removeAttribute('transform');
    body.style.removeProperty('opacity');
    drift.removeAttribute('transform');
  });
  return {
    paint,
    // Until it locks, the reticle wanders a little: it has nothing to hold.
    tick(time) {
      const amount = reticle.drift;
      if (amount <= 0) {
        if (drift.hasAttribute('transform')) drift.removeAttribute('transform');
        return;
      }
      const x = Math.sin(time * 0.9) * 7 * amount;
      const y = Math.cos(time * 0.7) * 5 * amount;
      drift.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${(Math.sin(time * 0.5) * 5 * amount).toFixed(2)})`);
    },
  };
}

// Decoys bloom out of the phone; the reticle starts hunting between them.
function buildCrowd({ q, beats, undo, enter, run, cue }) {
  const state = { hunt: 0 };
  const reticle = q('.crowd-reticle')[0];
  const reticleScale = q('.crowd-reticle-scale')[0];
  const trail = q('.crowd-trail')[0];
  const tethers = q('.crowd-tether');
  const labels = q('.crowd-label');
  const near = q('.crowd-node:not(.crowd-node--far)');
  const far = q('.crowd-node--far');

  enter(q('.crowd-lock'), { opacity: 1 }, { duration: 0.5 }, 1.5);
  enter(q('.crowd-reticle-before'), { opacity: 1 }, { duration: 0.3 }, 1.5);
  enter(q('.crowd-reticle-after'), { opacity: 0 }, { duration: 0.3 }, 1.8);
  run(state, { hunt: 0 }, { hunt: 1, duration: 0.7 }, 1.6);
  enter(q('.crowd-status-before'), { opacity: 1 }, { duration: 0.3 }, 4.5);
  enter(q('.crowd-status-after'), { opacity: 0 }, { duration: 0.4 }, 4.8);

  // Each decoy leaves the phone and grows as it goes. Tethers are in the
  // same order as the nodes: the four decoys, then the two further off.
  const blooms = [...near, ...far].map((node, index) => {
    const at = index < near.length ? 1 + index * 0.8 : 4.3 + (index - near.length) * 0.5;
    const out = { amount: 0 };
    const dx = CROWD_CENTER.x - Number(node.dataset.x);
    const dy = CROWD_CENTER.y - Number(node.dataset.y);
    const drawn = Number(window.getComputedStyle(node).opacity);
    const paint = () => {
      const back = 1 - out.amount;
      node.setAttribute('transform', `translate(${(dx * back).toFixed(2)} ${(dy * back).toFixed(2)}) scale(${mix(0.3, 1, out.amount).toFixed(4)})`);
      node.style.opacity = (drawn * clamp(out.amount * 1.6, 0, 1)).toFixed(3);
    };
    run(out, { amount: 0 }, { amount: 1, duration: 1.1, ease: 'power3.out' }, at, paint);
    enter(tethers[index], { opacity: 0 }, { duration: 0.8 }, at + 0.3);
    if (labels[index]) enter(labels[index], { opacity: 0, y: 5 }, { duration: 0.5 }, at + 0.7);
    undo(() => {
      node.removeAttribute('transform');
      node.style.removeProperty('opacity');
    });
    return paint;
  });
  cue(beats, [1, 1.8, 2.6, 3.4, 5]);

  const HOLD = 0.66;
  const MOVE = 0.52;
  const count = CROWD_ROUND.length;
  let clock = 0;
  let shown = -1;
  const place = (dt) => {
    clock += dt;
    const hunt = state.hunt;
    const step = Math.floor(clock / (HOLD + MOVE));
    const local = clock - step * (HOLD + MOVE);
    const from = CROWD_ROUND[step % count];
    const to = CROWD_ROUND[(step + 1) % count];
    const travel = local < HOLD ? 0 : easeInOut((local - HOLD) / MOVE);
    // On each one the brackets close in, fail to hold, and open again.
    const grip = local < HOLD ? 1.08 - 0.18 * Math.sin((local / HOLD) * Math.PI) : 1.08;
    const x = mix(CROWD_CENTER.x, mix(from.x, to.x, travel), hunt);
    const y = mix(CROWD_CENTER.y, mix(from.y, to.y, travel), hunt);
    reticle.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
    reticleScale.setAttribute('transform', `scale(${mix(1.25, grip, hunt).toFixed(3)})`);
    const before = CROWD_ROUND[(step + count - 1) % count];
    trail.setAttribute('points', `${before.x},${before.y} ${from.x},${from.y} ${x.toFixed(1)},${y.toFixed(1)}`);
    if (hunt !== shown) {
      shown = hunt;
      reticle.style.opacity = hunt.toFixed(3);
      trail.style.opacity = (hunt * 0.5).toFixed(3);
    }
  };
  const paint = () => {
    blooms.forEach((bloom) => bloom());
    place(0);
  };
  paint();
  undo(() => {
    reticle.setAttribute('transform', `translate(${CROWD_REST.x} ${CROWD_REST.y})`);
    reticleScale.removeAttribute('transform');
    trail.setAttribute('points', CROWD_TRAIL.map((point) => `${point.x},${point.y}`).join(' '));
    reticle.style.removeProperty('opacity');
    trail.style.removeProperty('opacity');
  });
  return { paint, tick: (time, dt) => place(dt) };
}

// One lane carries everything; then the stream fans out across five.
function buildLanes({ q, beats, enter, cue }) {
  const lanes = q('.lanes-lane');
  const fills = q('.lanes-cell-fill');
  const followed = lanes.findIndex((lane) => lane.classList.contains('is-followed'));
  const within = (lane, selector) => [...lane.querySelectorAll(selector)];

  enter(q('.lanes-title'), { opacity: 0 }, { duration: 0.5 }, 1.8);
  enter(within(lanes[followed], '.lanes-decoy'), { opacity: 0 }, { duration: 0.4 }, 1.8);
  enter(q('.lanes-whole'), { opacity: 1 }, { duration: 2.4, ease: 'none' }, 1.7);
  enter(within(lanes[followed], '.lanes-share, .lanes-own'), { opacity: 0 }, { duration: 1.4 }, 2.6);
  // The moment the first lane opens, one lane no longer carries it all.
  enter(q('.lanes-sees-before'), { opacity: 1 }, { duration: 0.3 }, 2.2);
  enter(q('.lanes-sees-after'), { opacity: 0 }, { duration: 0.4 }, 2.4);

  // The other four open in turn, nearest first; each takes a share with it.
  [1, 3, 0, 4].forEach((laneIndex, order) => {
    const lane = lanes[laneIndex];
    const at = 1.7 + order * 0.65;
    enter(within(lane, '.lanes-base'), { drawSVG: '0%' }, { duration: 0.8, ease: 'power2.out' }, at);
    enter(within(lane, '.lanes-share, .lanes-own'), { opacity: 0 }, { duration: 0.5 }, at + 0.45);
    enter(within(lane, '.lanes-decoy'), { opacity: 0 }, { duration: 0.4 }, at + 0.6);
    enter(fills[laneIndex > followed ? laneIndex - 1 : laneIndex], { opacity: 1 }, { duration: 0.3 }, at + 0.6);
  });
  cue(beats, [0.4, 1.8, 4.7]);
  return {};
}

// The device crosses kinds of place; each decoy re-plans after, in its own time.
function buildKeep({ q, svg, beats, undo, run, cue }) {
  const state = { x: KEEP_START };
  const now = q('.keep-now')[0];
  const reveal = q('.keep-reveal')[0];
  const marks = [
    ...q('.keep-replan').map((element) => ({ element, x: Number(element.dataset.x), ahead: false })),
    ...q('.keep-guide').map((element, index) => ({ element, x: KEEP_STOPS[index], ahead: false })),
  ];
  const finalSegment = svg.dataset.seg;

  // Everything in this figure follows from one number: how far along it is.
  const paint = () => {
    const x = state.x;
    now.setAttribute('transform', `translate(${x.toFixed(2)} 0)`);
    reveal.setAttribute('width', (x >= KEEP_END - 0.5 ? 340 : Math.max(0, x - 30)).toFixed(2));
    const segment = String(keepSegmentAt(x));
    if (svg.dataset.seg !== segment) svg.dataset.seg = segment;
    for (const mark of marks) {
      const ahead = x < mark.x;
      if (ahead !== mark.ahead) {
        mark.ahead = ahead;
        mark.element.classList.toggle('is-ahead', ahead);
      }
    }
  };
  run(state, { x: KEEP_START }, { x: KEEP_END, duration: 8, ease: 'none' }, 0.4, paint);
  cue(beats, [0.5, 2.3, 3.5, 5]);

  paint();
  undo(() => {
    now.setAttribute('transform', `translate(${KEEP_END} 0)`);
    reveal.setAttribute('width', '340');
    svg.dataset.seg = finalSegment;
    marks.forEach((mark) => mark.element.classList.remove('is-ahead'));
  });
  return { paint };
}

// Plan at the dock, undock, 24 hours dark, dock again, read the report.
function buildDay({ gsap, timeline, q, svg, beats, undo, enter, resize, run, cue }) {
  const day = { turn: 0 };
  const hand = q('.day-hand')[0];
  const sweep = q('.day-sweep')[0];
  const progress = q('.day-progress')[0];
  const length = Number(sweep.dataset.length);
  const rim = Number(progress.dataset.length);
  const [cx, cy] = [sweep.getAttribute('cx'), sweep.getAttribute('cy')];
  const finalStep = svg.dataset.step;
  const step = (value, time) => timeline.set(svg, { attr: { 'data-step': value } }, time);
  const flow = (value, time) => timeline.set(svg, { attr: { 'data-flow': value } }, time);
  const paint = () => {
    hand.setAttribute('transform', `rotate(${(day.turn * 360).toFixed(2)} ${cx} ${cy})`);
    sweep.setAttribute('stroke-dashoffset', (length * (1 - day.turn)).toFixed(2));
    progress.setAttribute('stroke-dashoffset', (rim * (1 - day.turn)).toFixed(2));
  };

  gsap.set(svg, { attr: { 'data-step': 0, 'data-flow': 'none' } });
  // plan
  flow('plan', 0.4);
  resize(q('.day-plan-row'), () => ({ width: 0 }), { duration: 0.5, stagger: 0.16 }, 0.5);
  enter(q('.day-plan-arc'), { drawSVG: '0%' }, { duration: 0.5, stagger: 0.05, ease: 'power1.inOut' }, 1);
  step(1, 2.1);
  // undock
  flow('none', 2.7);
  step(2, 2.8);
  timeline
    .to(q('.day-link-upper'), { y: -5, duration: 0.45, ease: 'power2.inOut' }, 2.8)
    .to(q('.day-link-lower'), { y: 5, duration: 0.45, ease: 'power2.inOut' }, 2.8)
    .to(q('.day-console'), { opacity: 0.36, duration: 0.5 }, 2.9);
  // 24 hours dark
  step(3, 3.6);
  run(day, { turn: 0 }, { turn: 1, duration: 4.4, ease: 'none' }, 3.6, paint);
  // dock
  step(4, 8);
  timeline
    .to(q('.day-link-upper, .day-link-lower'), { y: 0, duration: 0.45, ease: 'power2.inOut' }, 8)
    .to(q('.day-console'), { opacity: 1, duration: 0.5 }, 8.1);
  // report
  step(5, 8.9);
  flow('report', 8.9);
  enter(q('.day-report-row'), { opacity: 0, x: -8 }, { duration: 0.4, stagger: 0.22 }, 9);
  flow('none', 10.3);
  cue(beats, [0.6, 2.8, 3.6, 8, 8.9]);

  paint();
  undo(() => {
    hand.setAttribute('transform', `rotate(0 ${cx} ${cy})`);
    sweep.setAttribute('stroke-dashoffset', '0');
    progress.setAttribute('stroke-dashoffset', '0');
    svg.dataset.step = finalStep;
    svg.dataset.flow = 'none';
  });
  return { paint };
}

const BUILDERS = { signal: buildSignal, crowd: buildCrowd, lanes: buildLanes, keep: buildKeep, day: buildDay };

/* ------------------------------------------------- always on, motion or not */

// Marks the current section in the rail. The rail only shows on wide screens.
function followChapters(root, cleanups) {
  const links = [...root.querySelectorAll('[data-eid-chapter]')];
  const sections = links.map((link) => document.getElementById(link.dataset.eidChapter));
  if (!links.length || sections.some((section) => !section)) return;
  let frame = 0;
  let current = -1;
  const update = () => {
    frame = 0;
    const line = window.innerHeight * 0.45;
    let index = 0;
    sections.forEach((section, at) => {
      if (section.getBoundingClientRect().top <= line) index = at;
    });
    if (index === current) return;
    current = index;
    links.forEach((link, at) => {
      if (at === index) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };
  const request = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  update();
  cleanups.push(() => {
    window.removeEventListener('scroll', request);
    window.removeEventListener('resize', request);
    if (frame) window.cancelAnimationFrame(frame);
    links.forEach((link) => link.removeAttribute('aria-current'));
  });
}

// The opening instrument turns in CSS; it stops when it leaves the screen.
function restHero(root, cleanups) {
  const hero = root.querySelector('.eid-hero');
  if (!hero || typeof IntersectionObserver !== 'function') return;
  const observer = new IntersectionObserver(([entry]) => {
    hero.dataset.live = String(entry.isIntersecting);
  });
  observer.observe(hero);
  cleanups.push(() => {
    observer.disconnect();
    hero.dataset.live = 'true';
  });
}

/* ------------------------------------------------------------------ setup */

export async function createEidolonMotion(root) {
  // Kept for the life of the page: the rail and the opening instrument.
  const always = [];
  // The scenes' motion, which can be put away on its own.
  const cleanups = [];
  const settle = () => cleanups.splice(0).reverse().forEach((cleanup) => cleanup());
  const dispose = () => {
    settle();
    always.splice(0).reverse().forEach((cleanup) => cleanup());
  };
  followChapters(root, always);
  restHero(root, always);
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (calm.matches) return { dispose };
  // Without a way to tell which scene is on screen, the page keeps its still
  // frames at normal height, as it does when this module cannot load.
  if (typeof IntersectionObserver !== 'function') {
    root.setAttribute('data-eid-static', '');
    always.push(() => root.removeAttribute('data-eid-static'));
    return { dispose };
  }
  // If the visitor turns motion off while the page is open, the scenes go
  // back to their finished frames (the stylesheet drops the tall layout).
  const onCalm = () => {
    if (calm.matches) settle();
  };
  calm.addEventListener('change', onCalm);
  always.push(() => calm.removeEventListener('change', onCalm));

  let gsap;
  let ScrollTrigger;
  try {
    const [core, trigger, draw] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('gsap/DrawSVGPlugin')]);
    ({ gsap } = core);
    ({ ScrollTrigger } = trigger);
    gsap.registerPlugin(ScrollTrigger, draw.DrawSVGPlugin);
  } catch (error) {
    dispose();
    throw error;
  }
  if (calm.matches) return { dispose };

  const pinned = window.matchMedia(PINNED);
  const held = () => pinned.matches && !root.hasAttribute('data-eid-static');
  const pageTop = (element) => element.getBoundingClientRect().top + window.scrollY;
  const scenes = [];

  const context = gsap.context(() => {
    root.querySelectorAll('[data-eid-scene]').forEach((section) => {
      const build = BUILDERS[section.dataset.eidScene];
      const figure = section.querySelector('.eid-figure');
      const svg = figure?.querySelector('svg');
      if (!build || !svg) return;
      const timeline = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });
      const undo = (cleanup) => cleanups.push(cleanup);
      const scene = build({
        gsap,
        timeline,
        svg,
        undo,
        beats: [...section.querySelectorAll('[data-beat]')],
        q: gsap.utils.selector(svg),
        ...tools(gsap, timeline, undo),
      });
      // A beat of stillness at the end, so the finished frame holds.
      timeline.to({}, { duration: 0.9 });

      // Held scenes play across the stretch they are held for; on small
      // screens a scene plays as its figure comes up to the middle.
      const start = () => Math.max(0, held() ? pageTop(section) - window.innerHeight * 0.45 : pageTop(figure) - window.innerHeight * 0.86);
      const end = () => Math.max(
        start() + 240,
        held() ? pageTop(section) + section.offsetHeight - window.innerHeight * 1.12 : pageTop(figure) + figure.offsetHeight * 0.5 - window.innerHeight * 0.5,
      );
      ScrollTrigger.create({
        trigger: section,
        start,
        end,
        scrub: 0.6,
        animation: timeline,
        invalidateOnRefresh: true,
        onUpdate: (self) => section.style.setProperty('--eid-progress', self.progress.toFixed(4)),
        onScrubComplete: () => scene.paint?.(),
        // The measured stretch, for the page's own checks and captures.
        onRefresh: (self) => {
          section.dataset.eidFrom = String(Math.round(self.start));
          section.dataset.eidTo = String(Math.round(self.end));
          section.style.setProperty('--eid-progress', self.progress.toFixed(4));
          scene.paint?.();
        },
      });
      undo(() => {
        delete section.dataset.eidFrom;
        delete section.dataset.eidTo;
        section.style.removeProperty('--eid-progress');
      });
      scenes.push({ figure, tick: scene.tick, live: false });
    });
  }, root);
  cleanups.push(() => context.revert());

  // Loops run only for scenes on screen, and never in a hidden tab.
  let last = 0;
  const frame = (time) => {
    const dt = last ? clamp(time - last, 0, 0.1) : 0;
    last = time;
    if (document.hidden) return;
    for (const scene of scenes) if (scene.live && scene.tick) scene.tick(time, dt);
  };
  let running = false;
  const sync = () => {
    const wanted = scenes.some((scene) => scene.live && scene.tick);
    if (wanted === running) return;
    running = wanted;
    last = 0;
    if (wanted) gsap.ticker.add(frame);
    else gsap.ticker.remove(frame);
  };
  const watcher = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const scene = scenes.find((item) => item.figure === entry.target);
      if (!scene) return;
      scene.live = entry.isIntersecting;
      scene.figure.dataset.live = String(entry.isIntersecting);
    });
    sync();
  });
  scenes.forEach((scene) => watcher.observe(scene.figure));
  cleanups.push(() => {
    watcher.disconnect();
    gsap.ticker.remove(frame);
    scenes.forEach((scene) => { scene.figure.dataset.live = 'false'; });
  });

  // The held layout and the stacked one measure differently.
  const remeasure = () => ScrollTrigger.refresh();
  pinned.addEventListener('change', remeasure);
  cleanups.push(() => pinned.removeEventListener('change', remeasure));

  return { dispose };
}
