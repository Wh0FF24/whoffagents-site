import { LOOP_STAGES } from './coreChapters';

// Choreography for the core homepage. GSAP runs the boot sequence, text and
// scroll reveals; anime.js runs the instruments (stepped tick ring, staggered
// dot pulses). Everything is optional: without this module the page is still
// complete and readable.
let lenisUsers = 0;

export async function createCoreMotion({ root, layer, hud, dotsCanvas, director, reduced }) {
  const [
    { gsap },
    { ScrollTrigger },
    { SplitText },
    { ScrambleTextPlugin },
    { DrawSVGPlugin },
    anime,
    { createDotField },
    lenisModule,
  ] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('gsap/SplitText'),
    import('gsap/ScrambleTextPlugin'),
    import('gsap/DrawSVGPlugin'),
    import('animejs'),
    import('./dotField'),
    reduced ? Promise.resolve(null) : import('lenis'),
  ]);
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin);
  if (import.meta.env.DEV) window.__core = { gsap, ScrollTrigger };

  const cleanups = [];
  const field = createDotField(dotsCanvas);
  cleanups.push(() => field.dispose());
  const sections = [...root.querySelectorAll('[data-chapter-section]')];
  const context = gsap.context(() => {}, root);
  const html = document.documentElement;

  /* smooth scrolling for wheel and trackpad users */
  let lenis = null;
  if (lenisModule && window.matchMedia('(pointer: fine)').matches) {
    const Lenis = lenisModule.default;
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95, anchors: { offset: 0 } });
    const raf = (seconds) => lenis.raf(seconds * 1000);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    // Counted: a newer instance may already be live when an older one is
    // disposed (React StrictMode mounts twice in development).
    lenisUsers += 1;
    html.classList.add('lenis');
    // The core is placed after Lenis moves the page in each frame, so a fast
    // scroll can never draw it against a stale copy position.
    cleanups.push(director.drive(gsap.ticker));
    cleanups.push(() => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisUsers -= 1;
      if (!lenisUsers) {
        gsap.ticker.lagSmoothing(500, 33);
        html.classList.remove('lenis');
      } else {
        // Lenis' own destroy() strips its classes; a newer instance still needs
        // the persistent one (it manages its transient scrolling classes itself).
        html.classList.add('lenis');
      }
    });
  }

  /* instrument motion (anime.js) */
  const ticks = hud.querySelector('.hud-ticks');
  let tickAngle = 0;
  let tickTimer = null;
  const stepTicks = (amount, bounce = 0.55, duration = 700) => {
    tickAngle += amount;
    anime.animate(ticks, { rotate: tickAngle, ease: anime.spring({ bounce, duration }) });
  };
  if (!reduced) {
    tickTimer = anime.createTimer({ duration: 2100, loop: true, onLoop: () => stepTicks(5) });
    cleanups.push(() => tickTimer.pause());
  }
  const pulseDots = () => {
    anime.animate(hud.querySelectorAll('.hud-dot'), {
      opacity: [{ to: 1, duration: 180 }, { to: 0.35, duration: 700 }],
      scale: [{ to: 2.2, duration: 180 }, { to: 1, duration: 700 }],
      delay: anime.stagger(9, { from: 'center' }),
      ease: 'outQuad',
    });
  };

  /* boot sequence */
  const intro = root.querySelector('.ch-intro');
  const title = intro.querySelector('.ch-title');
  const kicker = intro.querySelector('.ch-kicker-text');
  const kickerText = kicker.textContent;
  let bootTimeline = null;

  if (!reduced) {
    const firstVisit = (() => {
      try {
        const seen = sessionStorage.getItem('whoff-core-boot');
        sessionStorage.setItem('whoff-core-boot', '1');
        return !seen;
      } catch {
        return true;
      }
    })();
    // Split the heading itself so its accessible name stays on the h1.
    const titleSplit = SplitText.create(title, { type: 'words,chars', wordsClass: 'ch-word', charsClass: 'ch-char' });
    cleanups.push(() => titleSplit.revert());
    director.boot.heat = 0;
    director.boot.assemble = 0;
    director.boot.grow = 0;
    director.wake();
    context.add(() => {
      bootTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      bootTimeline
        .to(director.boot, { heat: 1, duration: 1.1, ease: 'power2.inOut', onUpdate: director.wake }, 0.05)
        .to(director.boot, { assemble: 1, duration: 1.9, ease: 'power3.inOut' }, 0.1)
        .from('.hud-arc, .hud-outline', { drawSVG: '50% 50%', duration: 1.2, stagger: 0.07, ease: 'power2.inOut' }, 0.3)
        .from('.hud-tick', { opacity: 0, duration: 0.01, stagger: { each: 0.0045, from: 'start' } }, 0.3)
        .from('.hud-degrees text', { opacity: 0, duration: 0.4, stagger: 0.08 }, 0.9)
        .from('.hud-bracket', { scale: 1.35, opacity: 0, transformOrigin: '50% 50%', duration: 0.9, ease: 'expo.out' }, 1.25)
        .from('.hud-cross', { opacity: 0, duration: 0.5 }, 1.3)
        .to(director.boot, { grow: 1, duration: 1.3, ease: 'expo.out' }, 1.35)
        .add(() => { field.pulse(); pulseDots(); stepTicks(30, 0.6, 1100); }, 1.4)
        .fromTo(kicker, { opacity: 0 }, { opacity: 1, duration: 1.1, scrambleText: { text: kickerText, chars: '01/<>#+', revealDelay: 0.25, speed: 0.55 } }, 0.55)
        .from(titleSplit.chars, { opacity: 0, yPercent: 60, filter: 'blur(8px)', duration: 0.9, stagger: { each: 0.028, from: 'start' }, ease: 'expo.out' }, 1.05)
        .from('.ch-intro .ch-reveal', { opacity: 0, y: 18, duration: 0.9, stagger: 0.1, ease: 'expo.out' }, 1.65)
        .from(document.querySelector('.wf-header') || [], { opacity: 0, y: -12, duration: 0.8, ease: 'power2.out' }, 1.6)
        .from('.ch-rail, .ch-motion', { opacity: 0, x: 12, duration: 0.8, stagger: 0.1, ease: 'power2.out' }, 1.8);
      if (!firstVisit) bootTimeline.timeScale(2.2);
    });
    html.classList.remove('core-boot');
    const hurry = () => bootTimeline?.isActive() && bootTimeline.timeScale(5);
    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((type) => window.addEventListener(type, hurry, { passive: true, once: true }));
    cleanups.push(() => ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((type) => window.removeEventListener(type, hurry)));
  } else {
    html.classList.remove('core-boot');
  }

  /* the intro recedes as the page moves on */
  if (!reduced) {
    context.add(() => {
      gsap.fromTo(intro, { opacity: 1, y: 0 }, {
        opacity: 0,
        y: -70,
        ease: 'none',
        immediateRender: false,
        scrollTrigger: { trigger: intro, start: 'top top', end: 'bottom 64%', scrub: 0.3 },
      });
    });
  }

  /* chapter reveals */
  const splits = [];
  sections.slice(1).forEach((section) => {
    if (reduced) return;
    const heading = section.querySelector('.ch-heading');
    const label = section.querySelector('.ch-kicker-text');
    const labelText = label?.textContent || '';
    const split = SplitText.create(heading, { type: 'lines', mask: 'lines', linesClass: 'ch-line' });
    splits.push(split);
    context.add(() => {
      const reveal = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
        .from(split.lines, { yPercent: 110, duration: 1.1, stagger: 0.09 }, 0)
        .fromTo(label, { opacity: 0 }, { opacity: 1, duration: 0.9, scrambleText: { text: labelText, chars: '01/<>#+', speed: 0.6 } }, 0)
        .from(section.querySelectorAll('.ch-reveal'), { opacity: 0, y: 26, duration: 1, stagger: 0.075 }, 0.18);
      ScrollTrigger.create({
        trigger: section,
        start: 'top 64%',
        end: 'bottom 30%',
        onEnter: () => reveal.play(),
        onEnterBack: () => reveal.play(),
        onLeaveBack: () => reveal.reverse(),
      });
    });
  });
  cleanups.push(() => splits.forEach((split) => split.revert()));

  /* per-frame hooks from the director */
  const loopProgress = hud.querySelector('.hud-loop-progress');
  const loopRunner = hud.querySelector('.hud-loop-runner');
  const loopLength = loopProgress ? Number(loopProgress.getAttribute('stroke-dasharray')) : 0;
  let loopStage = -1;
  function frame({ current, radius, index, local, float }) {
    field.setCore(current.x, current.y, radius);
    const loop = index === 2 ? local : float > 2 ? 1 : 0;
    if (loopProgress) loopProgress.style.strokeDashoffset = String(loopLength * (1 - loop));
    if (loopRunner) loopRunner.setAttribute('transform', `rotate(${(loop * 360).toFixed(2)})`);
    const stage = Math.min(LOOP_STAGES.length - 1, Math.floor(loop * LOOP_STAGES.length * 0.999));
    if (stage !== loopStage) {
      loopStage = stage;
      layer.dataset.stage = String(stage + 1);
    }
  }

  function chapter() {
    if (reduced || bootTimeline?.isActive()) return;
    field.pulse();
    pulseDots();
    stepTicks(45, 0.5, 1200);
    gsap.fromTo(hud.querySelectorAll('.hud-bracket'), { scale: 1.22, opacity: 0 }, { scale: 1, opacity: 1, transformOrigin: '50% 50%', duration: 0.9, ease: 'expo.out', overwrite: true });
  }

  let disposed = false;
  document.fonts?.ready.then(() => {
    if (disposed) return;
    ScrollTrigger.refresh();
    director.refresh();
  });

  return {
    frame,
    chapter,
    scrollTo(target) {
      if (lenis) lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
      else document.querySelector(target)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    },
    setPaused(paused) {
      // Only the continuous instruments stop; reveals still finish so no
      // content is left hidden.
      if (paused) {
        bootTimeline?.progress(1);
        tickTimer?.pause();
        layer.classList.add('is-paused');
      } else {
        tickTimer?.play();
        layer.classList.remove('is-paused');
      }
    },
    dispose() {
      // The context owns this instance's tweens and ScrollTriggers; never
      // touch global ScrollTrigger state (a newer instance may be live).
      disposed = true;
      bootTimeline?.kill();
      context.revert();
      cleanups.reverse().forEach((cleanup) => cleanup());
      html.classList.remove('core-boot');
    },
  };
}
