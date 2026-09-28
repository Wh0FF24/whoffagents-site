// Scroll choreography for the supporting pages (GSAP + ScrollTrigger, the
// same libraries as the homepage). Everything starts visible in the HTML; only
// elements still below the fold when this runs are set back and revealed as
// they arrive, so nothing already on screen flickers. Reduced motion skips it.
export async function createEngMotion(root) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return { dispose() {} };
  const [{ gsap }, { ScrollTrigger }, { DrawSVGPlugin }, { SplitText }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('gsap/DrawSVGPlugin'),
    import('gsap/SplitText'),
  ]);
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, SplitText);
  // Only elements wholly below the screen are set back: anything already
  // peeking in at the bottom edge stays as it is.
  const below = (element) => element.getBoundingClientRect().top >= window.innerHeight;
  const labelled = [];

  const context = gsap.context(() => {
    root.querySelectorAll('[data-split]').forEach((heading) => {
      if (!below(heading)) return;
      // Name the heading from its visible text (line breaks become spaces), so
      // splitting it into lines cannot run its words together for screen readers.
      if (!heading.hasAttribute('aria-label')) {
        heading.setAttribute('aria-label', heading.innerText.replace(/\s+/g, ' ').trim());
        labelled.push(heading);
      }
      const split = SplitText.create(heading, { type: 'lines', mask: 'lines', linesClass: 'eng-split-line', aria: 'none' });
      gsap.from(split.lines, {
        yPercent: 105,
        duration: 1.05,
        stagger: 0.09,
        ease: 'power4.out',
        scrollTrigger: { trigger: heading, start: 'top 88%', once: true },
      });
    });

    root.querySelectorAll('[data-reveal]').forEach((element) => {
      if (!below(element)) return;
      gsap.from(element, {
        autoAlpha: 0,
        y: 30,
        duration: 0.95,
        ease: 'power3.out',
        scrollTrigger: { trigger: element, start: 'top 90%', once: true },
      });
    });

    root.querySelectorAll('[data-reveal-group]').forEach((group) => {
      const items = [...group.children].filter(below);
      if (!items.length) return;
      gsap.from(items, {
        autoAlpha: 0,
        y: 36,
        duration: 0.9,
        stagger: 0.11,
        ease: 'power3.out',
        scrollTrigger: { trigger: group, start: 'top 85%', once: true },
      });
    });

    root.querySelectorAll('[data-draw]').forEach((figure) => {
      if (!below(figure)) return;
      const strokes = figure.querySelectorAll('[data-stroke]');
      if (!strokes.length) return;
      gsap.from(strokes, {
        drawSVG: 0,
        duration: 1.5,
        stagger: 0.07,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: figure, start: 'top 85%', once: true },
      });
    });

    // Figures that run through their steps once as they arrive, then stay
    // complete: a CSS variable (--progress, 0..1) and the reached step
    // (data-step; the first is reached at the start). One already on screen
    // is left complete, as the HTML has it.
    root.querySelectorAll('[data-run]').forEach((figure) => {
      if (!below(figure)) return;
      const steps = Number(figure.dataset.run) || 1;
      const state = { progress: 0 };
      const apply = () => {
        figure.style.setProperty('--progress', state.progress.toFixed(3));
        figure.dataset.step = String(Math.min(steps, Math.floor(state.progress * steps + 0.001) + 1));
      };
      apply();
      gsap.to(state, {
        progress: 1,
        duration: 0.45 * steps + 0.7,
        ease: 'power1.inOut',
        onUpdate: apply,
        scrollTrigger: { trigger: figure, start: 'top 72%', once: true },
      });
    });
  }, root);

  // Reveals can change layout; let the triggers re-measure once fonts settle.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());

  return {
    dispose() {
      context.revert();
      labelled.forEach((heading) => heading.removeAttribute('aria-label'));
    },
  };
}
