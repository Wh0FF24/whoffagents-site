import { animate, stagger } from 'animejs';

// A measurement grid around the core. anime.js staggers a pulse across the
// grid from the core's position whenever the core changes chapters.
const smooth = (edge0, edge1, value) => {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

export function createDotField(canvas, { spacing = 26 } = {}) {
  const context = canvas.getContext('2d');
  let dots = [];
  let cols = 0;
  let rows = 0;
  let originX = 0;
  let originY = 0;
  let ratio = 1;
  let frame = 0;
  let pulseAnimation;
  let pulseFrozen = false;
  const core = { x: -9999, y: -9999, r: 200 };
  const pointer = { x: -9999, y: -9999 };

  function build() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    cols = Math.ceil(width / spacing) + 1;
    rows = Math.ceil(height / spacing) + 1;
    originX = (width - (cols - 1) * spacing) / 2;
    originY = (height - (rows - 1) * spacing) / 2;
    dots = [];
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) dots.push({ x: originX + col * spacing, y: originY + row * spacing, v: 0 });
    }
    request();
  }

  function draw() {
    frame = 0;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    const radius = Math.max(40, core.r);
    for (let index = 0; index < dots.length; index += 1) {
      const dot = dots[index];
      const dx = dot.x - core.x;
      const dy = dot.y - core.y;
      const distance = Math.sqrt(dx * dx + dy * dy) / radius;
      let alpha = 0.035 + 0.13 * smooth(1.06, 1.45, distance) * (1 - smooth(1.9, 3.8, distance));
      if (distance < 1.06) alpha *= 0.1;
      const px = dot.x - pointer.x;
      const py = dot.y - pointer.y;
      const near = Math.max(0, 1 - Math.sqrt(px * px + py * py) / 140);
      alpha += near * near * 0.34 + dot.v * 0.62;
      if (alpha < 0.03) continue;
      const size = 1.1 + dot.v * 1.9 + near * 0.7;
      context.globalAlpha = Math.min(1, alpha);
      context.fillStyle = dot.v > 0.18 ? '#6f97ff' : '#a9adb3';
      context.fillRect(dot.x - size / 2, dot.y - size / 2, size, size);
    }
    context.globalAlpha = 1;
  }

  function request() {
    if (!frame) frame = window.requestAnimationFrame(draw);
  }

  function pulse() {
    if (!dots.length) return;
    const col = Math.min(cols - 1, Math.max(0, Math.round((core.x - originX) / spacing)));
    const row = Math.min(rows - 1, Math.max(0, Math.round((core.y - originY) / spacing)));
    pulseAnimation?.revert?.();
    dots.forEach((dot) => { dot.v = 0; });
    pulseAnimation = animate(dots, {
      v: [{ to: 1, duration: 240, ease: 'outQuad' }, { to: 0, duration: 820, ease: 'inOutSine' }],
      delay: stagger(11, { grid: [cols, rows], from: row * cols + col }),
      onRender: request,
      onComplete: request,
    });
  }

  function setCore(x, y, r) {
    if (Math.abs(core.x - x) < 0.4 && Math.abs(core.y - y) < 0.4 && Math.abs(core.r - r) < 0.4) return;
    core.x = x;
    core.y = y;
    core.r = r;
    request();
  }

  const onPointer = (event) => {
    if (event.pointerType === 'touch') return;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    request();
  };
  const onLeave = () => {
    pointer.x = -9999;
    pointer.y = -9999;
    request();
  };
  const observer = new ResizeObserver(build);
  observer.observe(canvas);
  window.addEventListener('pointermove', onPointer, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);
  build();

  return {
    setCore,
    pulse,
    // Pausing freezes a pulse in flight where it is; resuming carries it on.
    setPaused(value) {
      if (value) {
        if (pulseFrozen || !pulseAnimation || pulseAnimation.paused || pulseAnimation.completed) return;
        pulseFrozen = true;
        pulseAnimation.pause();
      } else if (pulseFrozen) {
        pulseFrozen = false;
        pulseAnimation.resume();
      }
    },
    dispose() {
      observer.disconnect();
      window.removeEventListener('pointermove', onPointer);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      pulseAnimation?.pause?.();
      if (frame) window.cancelAnimationFrame(frame);
    },
  };
}
