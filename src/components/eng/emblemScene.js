// Drives one copy of the homepage core at a fixed pose inside a box, for the
// supporting pages' heroes. It draws only while the box is on screen and the
// tab is visible, eases toward the pointer, and hands back to the poster if
// WebGL is unavailable or lost.
const POSES = {
  capabilities: { yaw: 0.55, pitch: 0.12, roll: -0.08, spin: 1.2, tendril: 0.9, strike: 0.3, echo: 0, web: 0.6, sparks: 0.9 },
  research: { yaw: -0.45, pitch: -0.08, roll: 0.1, spin: 0.8, tendril: 0.55, strike: 0.2, echo: 1, web: 0.7, sparks: 0.6 },
  company: { yaw: 0.95, pitch: 0.05, roll: -0.04, spin: 0.7, tendril: 0.75, strike: 0.25, echo: 0, web: 0.5, sparks: 0.8 },
};

// Diameter of the core as a share of the box: matches the poster framing
// (the poster image is 2.5 core diameters wide).
export const EMBLEM_CORE_SHARE = 0.4;

export function createCoreEmblem(stage, host, { variant = 'company', onStatus } = {}) {
  const pose = POSES[variant] || POSES.company;
  const size = { width: 1, height: 1 };
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let scene = null;
  let dead = false;
  let visible = false;
  let rafId = 0;
  let lastStamp = 0;
  let time = 6 + Math.random() * 30;

  function resize() {
    const rect = stage.getBoundingClientRect();
    size.width = Math.max(1, rect.width);
    size.height = Math.max(1, rect.height);
    scene?.resize(size.width, size.height, Math.min(window.devicePixelRatio || 1, 1.75));
    schedule();
  }

  function tick(stamp) {
    rafId = 0;
    if (dead || !scene) return;
    const dt = lastStamp ? Math.min((stamp - lastStamp) / 1000, 0.1) : 1 / 60;
    lastStamp = stamp;
    time += dt;
    const ease = 1 - Math.exp(-dt * 2.4);
    pointer.x += (pointer.tx - pointer.x) * ease;
    pointer.y += (pointer.ty - pointer.y) * ease;
    const d = Math.min(size.width, size.height) * EMBLEM_CORE_SHARE;
    const frame = { x: size.width / 2, y: size.height / 2, d };
    scene.render({
      time,
      dt,
      frame,
      pose: { ...frame, ...pose },
      pointer,
      heat: 1,
      assemble: 1,
      grow: 1,
      tendril: pose.tendril,
      tendrilGoal: pose.tendril,
      calm: 1,
      strike: pose.strike,
      echo: pose.echo,
      web: pose.web,
      sparks: pose.sparks,
      spin: pose.spin,
      targets: [],
      anchorWeight: 1,
      side: 'none',
      keepOut: [],
      still: false,
    });
    if (visible && !document.hidden) schedule();
    else lastStamp = 0;
  }

  function schedule() {
    if (!rafId && !dead && scene && visible && !document.hidden) rafId = window.requestAnimationFrame(tick);
  }

  const onPointer = (event) => {
    if (event.pointerType === 'touch') return;
    const rect = host.getBoundingClientRect();
    pointer.tx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
    pointer.ty = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
  };
  const onVisibility = () => { lastStamp = 0; schedule(); };
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    lastStamp = 0;
    schedule();
  }, { rootMargin: '80px' });
  const resizeObserver = new ResizeObserver(resize);
  intersection.observe(host);
  resizeObserver.observe(stage);
  window.addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);

  import('../core/coreScene')
    .then(({ createCoreScene }) => {
      if (dead) return;
      scene = createCoreScene(stage, {
        onLost: () => {
          scene?.dispose();
          scene = null;
          onStatus?.('fallback');
        },
      });
      if (!scene) {
        onStatus?.('fallback');
        return;
      }
      resize();
      onStatus?.('ready');
    })
    .catch(() => { if (!dead) onStatus?.('fallback'); });

  return {
    dispose() {
      dead = true;
      if (rafId) cancelAnimationFrame(rafId);
      intersection.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      scene?.dispose();
      scene = null;
    },
  };
}
