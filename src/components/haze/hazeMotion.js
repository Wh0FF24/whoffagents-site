// Motion for the /haze page (GSAP and ScrollTrigger, which the rest of the
// site already uses). The page is complete without this module: every figure
// is drawn finished in the HTML. Here each scene gets a timeline that starts
// from its opening state and runs to that finished frame.
//
//  - On a wide, tall screen a scene is held in place and the scroll plays it.
//  - On a small screen a scene plays once, as its figure comes into view.
//  - Nothing runs for a scene that is off screen.
//  - Reduced motion skips all of it and keeps the finished frames.
//
// Two rules keep a scene exact wherever the scroll stops:
//  - A part's opening state is set outright when the scene is built, never
//    left to a tween's first render.
//  - Anything that moves along a path, turns or changes size follows one
//    plain number, and is written out here from that number.
//
// The figures' geometry (hazeData.js) is handed in by the page, which
// already holds it, so this module asks for no file that other pages load.

const HELD = '(min-width: 900px) and (min-height: 600px)';
const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
const mix = (from, to, amount) => from + (to - from) * amount;
const easeOut = (t) => 1 - (1 - t) ** 3;
const easeIn = (t) => t * t;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

function tools(gsap, timeline, undo) {
  // Remember what an element holds before a scene writes to it, and put it
  // back when the scene is put away.
  const keep = (element, attributes = [], styles = []) => {
    const was = attributes.map((name) => element.getAttribute(name));
    undo(() => {
      attributes.forEach((name, index) => {
        if (was[index] === null) element.removeAttribute(name);
        else element.setAttribute(name, was[index]);
      });
      styles.forEach((name) => element.style.removeProperty(name));
    });
  };
  // Put parts in their opening state now, then play them to how the page
  // draws them: opacity back to what the stylesheet gives, offsets to none,
  // a line to its full length.
  const enter = (targets, from, to, position) => {
    const list = gsap.utils.toArray(targets);
    if (!list.length) return;
    const drawn = 'opacity' in from ? list.map((element) => Number(window.getComputedStyle(element).opacity)) : null;
    gsap.set(list, from);
    const end = { ...to };
    if (drawn) end.opacity = (index) => drawn[index];
    if ('x' in from) end.x = 0;
    if ('y' in from) end.y = 0;
    if ('drawSVG' in from) end.drawSVG = true;
    timeline.to(list, end, position);
  };
  // Play a plain number between two values and repaint as it moves.
  const run = (state, from, to, position, paint) => {
    timeline.fromTo(state, from, { ...to, immediateRender: false, onUpdate: paint }, position);
  };
  return { keep, enter, run };
}

/* ---------------------------------------------------------------- scenes */

// Scattered, soft points find their places in the day. Then the profile that
// can be read off them comes into focus, a line at a time.
function buildPattern({ q, keep, enter, run }) {
  const state = { gather: 0 };
  const dots = q('.hz-dot').map((element) => ({
    element,
    x: Number(element.getAttribute('cx')),
    y: Number(element.getAttribute('cy')),
    r: Number(element.getAttribute('r')),
    fromX: Number(element.dataset.fx),
    fromY: Number(element.dataset.fy),
    order: Number(element.dataset.order),
  }));
  dots.forEach((dot) => keep(dot.element, ['cx', 'cy', 'r'], ['opacity']));
  // In two moves, as the copy has it. First each point finds when it
  // happened: its place along the day. Then what it was about: it drops into
  // its row and comes into focus. Each point sets off a little after the one
  // before, and all have arrived when the number reaches its end.
  const SPREAD = 0.5;
  const paint = () => {
    const gather = state.gather;
    for (const dot of dots) {
      const when = easeInOut(clamp((gather / 0.52) * (1 + SPREAD) - dot.order * SPREAD, 0, 1));
      const what = easeInOut(clamp(((gather - 0.44) / 0.56) * (1 + SPREAD) - dot.order * SPREAD, 0, 1));
      dot.element.setAttribute('cx', mix(dot.fromX, dot.x, when).toFixed(2));
      dot.element.setAttribute('cy', mix(dot.fromY, dot.y, what).toFixed(2));
      dot.element.setAttribute('r', (dot.r * mix(2.4, 1, what)).toFixed(2));
      dot.element.style.opacity = mix(0.2, 1, Math.max(when * 0.4, what)).toFixed(3);
    }
  };

  run(state, { gather: 0 }, { gather: 1, duration: 3.9, ease: 'none' }, 0.2, paint);
  enter(q('.hz-legend'), { opacity: 0 }, { duration: 0.5 }, 0.5);
  enter(q('.hz-day-part'), { opacity: 0 }, { duration: 0.5, stagger: 0.12 }, 0.9);
  enter(q('.hz-row-line'), { drawSVG: 0 }, { duration: 0.9, stagger: 0.18, ease: 'power1.inOut' }, 2.2);
  enter(q('.hz-row-label'), { opacity: 0, x: -6 }, { duration: 0.5, stagger: 0.18 }, 2.4);
  // The profile: its edge, its line of daily rhythm, then the words.
  enter(q('.hz-card-edge'), { opacity: 0.1 }, { duration: 0.8 }, 4);
  enter(q('.hz-card-title'), { opacity: 0 }, { duration: 0.5 }, 4.1);
  enter(q('.hz-rhythm--real'), { drawSVG: 0 }, { duration: 1.2, ease: 'power1.inOut' }, 4.4);
  enter(q('.hz-card-name--routine'), { opacity: 0 }, { duration: 0.4 }, 5.5);
  enter(q('.hz-card-routine'), { opacity: 0, x: -6 }, { duration: 0.5 }, 5.6);
  enter(q('.hz-card-name--interests'), { opacity: 0 }, { duration: 0.4 }, 6.2);
  enter(q('.hz-chip'), { opacity: 0, y: 4 }, { duration: 0.4, stagger: 0.16 }, 6.3);
  enter(q('.hz-card-state--sharp'), { opacity: 0, x: 6 }, { duration: 0.45 }, 7.1);

  paint();
  return { paint };
}

// Decoys come in beside the real activity, each in its own time. Every one
// adds its own rhythm to the profile, until no single rhythm stands out.
function buildCrowd({ q, enter }) {
  const within = (root, selector) => [...root.querySelectorAll(selector)];
  const rhythms = q('.hz-rhythm--decoy');

  enter(q('.hz-legend-item--decoys'), { opacity: 0, x: -6 }, { duration: 0.5 }, 0.2);
  q('.hz-row--decoy').forEach((row, index) => {
    const at = 0.7 + index * 1.05;
    enter(within(row, '.hz-row-label'), { opacity: 0, x: -6 }, { duration: 0.45 }, at);
    enter(within(row, '.hz-row-line'), { drawSVG: 0 }, { duration: 0.7, ease: 'power1.inOut' }, at);
    enter(within(row, '.hz-dot'), { opacity: 0 }, { duration: 0.35, stagger: Number(row.dataset.each) }, at + 0.15);
    if (rhythms[index]) enter(rhythms[index], { drawSVG: 0 }, { duration: 0.9, ease: 'power1.inOut' }, at + 0.3);
  });
  enter(q('.hz-dot--mixed'), { opacity: 0 }, { duration: 0.35, stagger: 0.075 }, 4.4);

  // The profile goes soft.
  enter(q('.hz-rhythm-band'), { opacity: 0 }, { duration: 1.1 }, 5.3);
  enter(q('.hz-rhythm--real'), { opacity: 1 }, { duration: 0.9 }, 5.5);
  enter(q('.hz-rhythm--faded'), { opacity: 0 }, { duration: 0.9 }, 5.5);
  enter(q('.hz-card-routine'), { opacity: 1 }, { duration: 0.6 }, 5.9);
  enter(q('.hz-card-routine-soft'), { opacity: 0 }, { duration: 0.7 }, 6.05);
  enter(q('.hz-chip'), { opacity: 1 }, { duration: 0.5, stagger: 0.09 }, 6.3);
  enter(q('.hz-soft-chip'), { opacity: 0 }, { duration: 0.5, stagger: 0.07 }, 6.5);
  enter(q('.hz-card-edge'), { opacity: 0.92 }, { duration: 0.9 }, 6.6);
  enter(q('.hz-card-feather'), { opacity: 0 }, { duration: 0.9 }, 6.6);
  enter(q('.hz-card-state--sharp'), { opacity: 1 }, { duration: 0.35 }, 7.1);
  enter(q('.hz-card-state--blurry'), { opacity: 0, x: 6 }, { duration: 0.45 }, 7.3);
  return {};
}

// Two rows of decoys reach the detector. Everything here follows the clock:
// where each mark is, whether it has been stopped, how far it has dropped.
function buildTested({ q, keep, enter, run, data }) {
  const { GATE, TEST_LENGTH, TEST_MARKS, TEST_PACE, TEST_ROWS } = data;
  const state = { time: 0 };
  const pair = (selector, list) => q(selector).map((element, index) => ({ element, ...list[index] }));
  const caught = pair('.hz-mark--caught', TEST_MARKS.caught);
  const waiting = pair('.hz-mark--waiting', TEST_MARKS.waiting);
  const tested = pair('.hz-mark--tested', TEST_MARKS.tested);
  const stop = q('.hz-gate-stop')[0];
  const through = q('.hz-gate-through')[0];
  [...caught, ...waiting, ...tested].forEach((mark) => keep(mark.element, ['transform'], ['opacity']));
  keep(stop, [], ['opacity']);
  keep(through, [], ['opacity']);
  const rested = Number(window.getComputedStyle(caught[0].element).opacity);
  const DROP = 1;
  // A mark fades in as it comes on from the left edge.
  const arriving = (x) => clamp((x - 12) / 24, 0, 1);
  const put = (mark, x, y, turn, opacity) => {
    mark.element.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})${turn ? ` rotate(${turn.toFixed(1)})` : ''}`);
    mark.element.style.opacity = opacity.toFixed(3);
  };

  const paint = () => {
    const time = state.time;
    let stopped = 0;
    let passing = 0;
    for (const mark of caught) {
      if (time <= mark.at) {
        const x = mark.startX + TEST_PACE * time;
        put(mark, x, TEST_ROWS.random, mark.turn, arriving(x));
      } else {
        const fall = clamp((time - mark.at) / DROP, 0, 1);
        put(mark, mix(GATE.stop, mark.x, easeOut(fall)), mix(TEST_ROWS.random, mark.y, easeIn(fall)), mix(mark.turn, mark.restTurn, easeOut(fall)), mix(1, rested, fall));
        stopped = Math.max(stopped, 1 - clamp((time - mark.at) / 0.7, 0, 1));
      }
    }
    for (const mark of waiting) {
      const x = mark.startX + TEST_PACE * time;
      put(mark, x, mark.y, mark.turn, arriving(x));
    }
    for (const mark of tested) {
      const x = mark.startX + TEST_PACE * time;
      put(mark, x, mark.y, 0, arriving(x));
      passing = Math.max(passing, 1 - clamp(Math.abs(x - GATE.x) / 20, 0, 1));
    }
    stop.style.opacity = stopped.toFixed(3);
    through.style.opacity = (passing * 0.9).toFixed(3);
  };

  run(state, { time: 0 }, { time: TEST_LENGTH, duration: TEST_LENGTH, ease: 'none' }, 0, paint);
  const firstPass = Math.min(...TEST_MARKS.tested.map((mark) => mark.at));
  enter(q('.hz-test-out--caught'), { opacity: 0, x: 6 }, { duration: 0.45 }, TEST_MARKS.caught[0].at + 0.25);
  enter(q('.hz-test-out--passes'), { opacity: 0, x: 6 }, { duration: 0.45 }, firstPass + 0.25);

  paint();
  return { paint };
}

// The gauge on the sample screen moves from one worded end toward the other,
// and the window above it fills with decoys as it goes.
function buildScore({ q, keep, run, data }) {
  const { GAUGE, scoreAt } = data;
  const state = { level: 0.03 };
  const mark = q('.hz-gauge-mark')[0];
  const you = q('.hz-lens-you')[0];
  const glow = q('.hz-lens-glow')[0];
  const notice = q('.hz-notice')[0];
  const dots = q('.hz-lens-dot').map((element) => ({ element, order: Number(element.dataset.order) }));
  keep(mark, ['transform']);
  keep(you, ['r', 'fill']);
  keep(glow, ['opacity']);
  keep(notice, ['opacity']);
  dots.forEach((dot) => keep(dot.element, ['opacity']));

  const paint = () => {
    const now = scoreAt(state.level);
    mark.setAttribute('transform', `translate(${now.markX} ${GAUGE.y})`);
    you.setAttribute('r', now.youR);
    you.setAttribute('fill', now.youFill);
    glow.setAttribute('opacity', now.youGlow);
    notice.setAttribute('opacity', now.notice);
    for (const dot of dots) dot.element.setAttribute('opacity', now.decoy(dot.order));
  };

  run(state, { level: 0.03 }, { level: 0.36, duration: 1.9, ease: 'power2.inOut' }, 0.7, paint);
  run(state, { level: 0.36 }, { level: 0.62, duration: 1.6, ease: 'power2.inOut' }, 3, paint);
  run(state, { level: 0.62 }, { level: 0.88, duration: 1.5, ease: 'power2.inOut' }, 4.9, paint);
  run(state, { level: 0.88 }, { level: GAUGE.rest, duration: 1, ease: 'power1.inOut' }, 6.5, paint);

  paint();
  return { paint };
}

const BUILDERS = { pattern: buildPattern, crowd: buildCrowd, tested: buildTested, score: buildScore };

/* ------------------------------------------------------------------ setup */

export async function createHazeMotion(root, data) {
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Kept until the page is left.
  const always = [];
  // The motion itself, which can be put away on its own.
  const cleanups = [];
  const settle = () => cleanups.splice(0).reverse().forEach((cleanup) => cleanup());
  const dispose = () => {
    settle();
    always.splice(0).reverse().forEach((cleanup) => cleanup());
  };
  if (calm.matches) return { dispose };
  // Without a way to tell which scene is on screen the page keeps its still
  // frames at normal height, as it does when this module cannot load.
  if (typeof IntersectionObserver !== 'function') {
    root.setAttribute('data-hz-static', '');
    always.push(() => root.removeAttribute('data-hz-static'));
    return { dispose };
  }

  let gsap;
  let ScrollTrigger;
  const [core, trigger, draw] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('gsap/DrawSVGPlugin')]);
  ({ gsap } = core);
  ({ ScrollTrigger } = trigger);
  gsap.registerPlugin(ScrollTrigger, draw.DrawSVGPlugin);
  if (calm.matches) return { dispose };

  const held = window.matchMedia(HELD);
  const pageTop = (element) => element.getBoundingClientRect().top + window.scrollY;
  const barHeight = () => root.querySelector('.hz-bar')?.offsetHeight ?? 0;

  function start() {
    const undo = (cleanup) => cleanups.push(cleanup);
    const holding = held.matches;
    const scenes = [];

    // The opening loop and each scene's own small loops are in the
    // stylesheet. They run only once this is set, and only for a figure that
    // is on screen (data-live below).
    root.setAttribute('data-hz-on', '');
    undo(() => root.removeAttribute('data-hz-on'));

    const context = gsap.context(() => {
      root.querySelectorAll('[data-hz-scene]').forEach((section) => {
        const build = BUILDERS[section.dataset.hzScene];
        const figure = section.querySelector('.hz-figure');
        const svg = figure?.querySelector('svg');
        if (!build || !svg) return;
        // A scene already on screen when a small-screen page starts is left
        // as it is: finished.
        if (!holding && figure.getBoundingClientRect().top < window.innerHeight) return;

        const timeline = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });
        const scene = build({ q: gsap.utils.selector(svg), data, ...tools(gsap, timeline, undo) });
        // A beat of stillness at the end, so the finished frame holds.
        timeline.to({}, { duration: 0.8 });
        const item = { section, figure, timeline, paint: scene.paint, done: false };
        scenes.push(item);

        if (holding) {
          // Played by the scroll, across the stretch the scene is held for.
          const from = () => Math.max(0, pageTop(section) - barHeight());
          const to = () => Math.max(from() + 240, pageTop(section) + section.offsetHeight - window.innerHeight * 1.16);
          ScrollTrigger.create({
            trigger: section,
            start: from,
            end: to,
            scrub: 0.5,
            animation: timeline,
            invalidateOnRefresh: true,
            onScrubComplete: () => scene.paint?.(),
            // The measured stretch, for the page's own checks and captures.
            onRefresh: (self) => {
              section.dataset.hzFrom = String(Math.round(self.start));
              section.dataset.hzTo = String(Math.round(self.end));
              scene.paint?.();
            },
          });
        } else {
          // Played once, by the clock, when the figure has come into view.
          section.dataset.hzPlay = 'waiting';
          timeline.timeScale(1.5);
          timeline.eventCallback('onComplete', () => {
            item.done = true;
            section.dataset.hzPlay = 'done';
          });
        }
        undo(() => {
          delete section.dataset.hzFrom;
          delete section.dataset.hzTo;
          delete section.dataset.hzPlay;
        });
      });

      // The sections of plain text arrive with a short rise. They are only
      // faded, never hidden, so the form in the last one can always be
      // reached with the keyboard.
      const risers = [...root.querySelectorAll('[data-hz-rise]')].filter((element) => element.getBoundingClientRect().top >= window.innerHeight);
      if (risers.length) {
        gsap.set(risers, { opacity: 0, y: 22 });
        const riser = new IntersectionObserver(
          (entries) => {
            const arrived = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target);
            if (!arrived.length) return;
            arrived.forEach((element) => riser.unobserve(element));
            gsap.to(arrived, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, overwrite: true });
          },
          { rootMargin: '0px 0px -8% 0px' },
        );
        risers.forEach((element) => riser.observe(element));
        undo(() => riser.disconnect());
      }
    }, root);
    undo(() => context.revert());

    // Which figures are on screen. A figure's loops run only while it is,
    // and a small-screen scene plays once most of its figure can be seen.
    const figures = [...root.querySelectorAll('.hz-figure')];
    const watcher = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.dataset.live = String(entry.isIntersecting);
          const item = scenes.find((scene) => scene.figure === entry.target);
          if (!item || holding || item.done) continue;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            item.section.dataset.hzPlay = 'playing';
            item.timeline.play();
          } else if (!entry.isIntersecting) {
            item.timeline.pause();
          }
        }
      },
      { threshold: [0, 0.5] },
    );
    figures.forEach((figure) => watcher.observe(figure));
    undo(() => {
      watcher.disconnect();
      figures.forEach((figure) => {
        figure.dataset.live = 'false';
      });
    });

    // Fonts can change where a scene starts and ends.
    document.fonts?.ready.then(() => {
      if (cleanups.length) ScrollTrigger.refresh();
    });
  }

  start();

  // If the visitor turns motion off while the page is open, every scene goes
  // back to its finished frame (the stylesheet drops the tall layout).
  const onCalm = () => {
    settle();
    if (!calm.matches) start();
  };
  calm.addEventListener('change', onCalm);
  always.push(() => calm.removeEventListener('change', onCalm));

  // A held scene and a played one are driven differently, so a change of
  // screen shape starts the scenes again.
  const onShape = () => {
    if (calm.matches) return;
    settle();
    start();
  };
  held.addEventListener('change', onShape);
  always.push(() => held.removeEventListener('change', onShape));

  return { dispose };
}
