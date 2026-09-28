import { CHAPTER_IDS, STATE_KEYS, layoutFor, smooth, stateFor } from './coreChapters';

// One clock for the whole homepage. Scroll position becomes a continuous
// chapter value; the core glides between chapter poses; filaments aim at the
// content that is on screen. Runs outside React so scrolling never re-renders.
export function createCoreDirector({ layer, stage, hud, poster, sections, reduced = false, onChapter, onStatus, onFrame }) {
  const view = { width: 1, height: 1, layoutWidth: 1, layoutHeight: 1 };
  const bounds = [];
  let finalPose = null;
  const current = { x: 0, y: 0, d: 0 };
  STATE_KEYS.forEach((key) => { current[key] = 0; });
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const boot = { assemble: 1, heat: 1, grow: 1 };
  const targets = [];
  const frameTimes = [];
  let scene = null;
  let dead = false;
  let paused = false;
  let still = reduced;
  let rafId = 0;
  let externalClock = false;
  let wanted = false;
  let lastStamp = 0;
  let time = 7.5;
  let chapterIndex = -1;
  let initialized = false;
  let lastScroll = 0;
  let controlLift = 0;
  let exitOpacity = 1;
  let exitMode = null;
  const NO_ZONES = [];
  // Whether a fixed control is showing. Element.checkVisibility arrived in
  // Safari 17.4; older browsers read the control's own computed style.
  const showing = (element) => {
    if (element.checkVisibility) return element.checkVisibility({ opacityProperty: true, visibilityProperty: true });
    const style = getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0;
  };
  // The phone ending (whole above the footer, or gone at the page end), held
  // through small height changes such as a browser toolbar sliding.
  let phoneEnding = null;
  // How far the core dims once it has sunk behind the copy (phones).
  const SUNK = 0.74;
  let stillFor = 0;
  let keyPaging = 0;
  let dpr = 1;
  let dprCap = 1.5;
  let idleId;
  let loadTimer;

  // The HUD and poster keep the exact boxes first paint gave them
  // (core-home.css) and are placed by transform alone. Moving them into
  // other boxes would count as a layout shift even where nothing visibly
  // moves. unit is the core diameter each box was drawn for. The boxes are
  // redrawn when the intro core grows by more than a tenth or shrinks by more
  // than a third (a rotation, a much larger window), so they are never
  // scaled far from the size they were drawn at; a phone's toolbar sliding
  // in and out does not redraw them. A redraw re-places them at once, so no
  // frame shows a new box with the old transform.
  const frames = new Map();
  let frozenAt = 0;
  let drawn = null;
  function freeze(introD) {
    const size0 = Math.max(1, introD);
    if (frozenAt && size0 / frozenAt <= 1.1 && size0 / frozenAt >= 0.65) return;
    frozenAt = size0;
    [[hud, 2], [poster, 2.5]].forEach(([element, span]) => {
      if (!element) return;
      ['left', 'top', 'width', 'height'].forEach((key) => element.style.removeProperty(key));
      const style = getComputedStyle(element);
      const size = parseFloat(style.width) || 1000;
      const left = parseFloat(style.left) || 0;
      const top = parseFloat(style.top) || 0;
      Object.assign(element.style, { left: `${left}px`, top: `${top}px`, width: `${size}px`, height: `${size}px` });
      frames.set(element, { x: left + size / 2, y: top + size / 2, unit: size / span });
    });
    if (drawn) {
      place(hud, drawn.x, drawn.y, drawn.d);
      place(poster, drawn.x, drawn.y, drawn.d);
    }
  }
  function place(element, x, y, d) {
    const frame = frames.get(element);
    if (!frame) return;
    element.style.transform = `translate3d(${(x - frame.x).toFixed(1)}px, ${(y - frame.y).toFixed(1)}px, 0) scale(${(d / frame.unit).toFixed(4)})`;
  }

  function measure() {
    view.layoutWidth = window.innerWidth || stage.clientWidth || 1;
    view.layoutHeight = window.innerHeight || stage.clientHeight || 1;
    const before = `${view.width}x${view.height}`;
    view.width = Math.max(1, stage.clientWidth || window.innerWidth);
    view.height = Math.max(1, stage.clientHeight || window.innerHeight);
    if (`${view.width}x${view.height}` !== before) exitMode = null;
    finalPose = stateFor(CHAPTER_IDS[CHAPTER_IDS.length - 1], view.width, view.height, view.layoutWidth, view.layoutHeight);
    freeze(stateFor(CHAPTER_IDS[0], view.width, view.height, view.layoutWidth, view.layoutHeight).d);
    bounds.length = 0;
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      bounds.push({ top: rect.top + window.scrollY, height: rect.height });
    });
    measureLabels();
  }

  // The working-loop labels ring the core in "How we work". Where that ring
  // would reach the chapter's copy (narrow desktops, small landscape
  // tablets) they are left out; the loop itself still shows on the core.
  // Ring sizes mirror core-home.css (1.68 r + 44px, or + 36px below 1100px).
  function measureLabels() {
    const items = [...layer.querySelectorAll('.ch-loop-labels li')];
    const sticky = sections[CHAPTER_IDS.indexOf('method')]?.querySelector('.ch-method-sticky');
    if (!items.length || !sticky || !items[0].offsetWidth) {
      layer.dataset.labels = 'on';
      return;
    }
    const pose = stateFor('method', view.width, view.height, view.layoutWidth, view.layoutHeight);
    const ring = (pose.d / 2) * 1.68 + (layoutFor(view.layoutWidth, view.layoutHeight) === 'desktop' ? 44 : 36);
    // The copy is pinned at the top of the screen while the chapter plays,
    // but the labels stay up (hold above .6) for about .16 of a screen of
    // scrolling on either side, while the copy slides by that much; and they
    // show while the core is within a tenth of a diameter of its pose.
    const origin = sticky.getBoundingClientRect().top;
    const slide = view.height * 0.16 + 14;
    const drift = pose.d * 0.1 + 14;
    const copy = [...sticky.querySelectorAll('.ch-method-lead, .ch-method-principle')].map((element) => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left - drift, right: rect.right + drift, top: rect.top - origin - slide, bottom: rect.bottom - origin + slide };
    });
    const hit = items.some((item, index) => {
      const angle = ((index / items.length) * 360 - 90) * (Math.PI / 180);
      const x = pose.x + Math.cos(angle) * ring;
      const y = pose.y + Math.sin(angle) * ring;
      // The text itself, not the label's minimum box.
      const w = Math.max(...[...item.children].map((child) => child.offsetWidth)) / 2;
      const h = item.offsetHeight / 2;
      return copy.some((box) => x - w < box.right && x + w > box.left && y - h < box.bottom && y + h > box.top);
    });
    layer.dataset.labels = hit ? 'off' : 'on';
  }

  // Copy on screen that a strike or a bright pulse must not cross: the text
  // blocks of every chapter in view, padded for the filament's curve.
  const COPY = '.ch-panel, .ch-title-line, .ch-intro .ch-kicker, .ch-intro-foot, .ch-intro-readout, .ch-figure-note';
  function copyZones() {
    const zones = [];
    sections.forEach((section) => {
      const box = section.getBoundingClientRect();
      if (box.bottom < 0 || box.top > view.height) return;
      section.querySelectorAll(COPY).forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (!rect.width || rect.bottom < 0 || rect.top > view.height) return;
        zones.push({ left: rect.left - 36, top: rect.top - 36, right: rect.right + 36, bottom: rect.bottom + 36 });
      });
    });
    // The fixed controls too, padded more: a filament's curve can pass close
    // to them even where its straight path does not.
    controls?.querySelectorAll('.ch-rail, .ch-motion').forEach((element) => {
      if (!showing(element)) return;
      const rect = element.getBoundingClientRect();
      if (rect.width) zones.push({ left: rect.left - 64, top: rect.top - 64, right: rect.right + 64, bottom: rect.bottom + 64 });
    });
    return zones;
  }

  function progress() {
    const y = window.scrollY;
    const h = view.height;
    for (let index = 0; index < bounds.length; index += 1) {
      const start = bounds[index].top;
      const end = start + Math.max(0, bounds[index].height - h);
      if (y < start) {
        if (index === 0) return { float: 0, local: 0 };
        const previous = bounds[index - 1];
        const previousEnd = previous.top + Math.max(0, previous.height - h);
        const t = (y - previousEnd) / Math.max(1, start - previousEnd);
        return { float: index - 1 + t, local: 1 };
      }
      if (y <= end) {
        const tail = index === bounds.length - 1 ? y - start : 0;
        return { float: index, local: end > start ? (y - start) / (end - start) : 0.5, tail };
      }
    }
    // Inside and past the last chapter: report how far, so the core scrolls
    // with it instead of letting its copy pass underneath.
    const last = bounds[bounds.length - 1];
    const tail = last ? Math.max(0, y - last.top) : 0;
    return { float: Math.max(0, bounds.length - 1), local: 1, tail };
  }

  function target(float) {
    const last = CHAPTER_IDS.length - 1;
    const lower = Math.min(last, Math.max(0, Math.floor(float)));
    const upper = Math.min(last, lower + 1);
    const a = stateFor(CHAPTER_IDS[lower], view.width, view.height, view.layoutWidth, view.layoutHeight);
    const b = stateFor(CHAPTER_IDS[upper], view.width, view.height, view.layoutWidth, view.layoutHeight);
    const t = smooth(0.08, 0.92, float - lower);
    const out = {};
    ['x', 'y', 'd', ...STATE_KEYS].forEach((key) => { out[key] = a[key] + (b[key] - a[key]) * t; });
    return out;
  }

  function collectAnchors(index, hold) {
    targets.length = 0;
    if (hold < 0.02 || layoutFor(view.layoutWidth, view.layoutHeight) === 'phone') return;
    const section = sections[index];
    if (!section) return;
    section.querySelectorAll('[data-core-anchor]').forEach((node) => {
      const rect = node.getBoundingClientRect();
      if (rect.bottom < 40 || rect.top > view.height - 40 || !rect.width) return;
      const side = node.dataset.coreAnchor;
      if (side === 'top') targets.push({ x: rect.left + rect.width / 2, y: rect.top - 10 });
      else if (side === 'bottom') targets.push({ x: rect.left + rect.width / 2, y: rect.bottom + 10 });
      else if (rect.left + rect.width / 2 < current.x) targets.push({ x: rect.right + 18, y: rect.top + rect.height / 2 });
      else targets.push({ x: rect.left - 18, y: rect.top + rect.height / 2 });
    });
  }

  function update(dt, animate) {
    const { float, local, tail = 0 } = progress();
    const layout = layoutFor(view.layoutWidth, view.layoutHeight);
    // Phones: past the intro the core sinks into the background, dimmed,
    // and the copy scrolls over it.
    const sink = layout === 'phone' ? smooth(0.1, 0.6, float) : 0;
    const goal = target(float);
    // Lightning needs the page to be genuinely still, not merely inside a chapter.
    const scrollDelta = window.scrollY - lastScroll;
    const scrolled = Math.abs(scrollDelta) > 0.5;
    lastScroll = window.scrollY;
    stillFor = scrolled ? 0 : stillFor + dt;
    keyPaging = Math.max(0, keyPaging - dt);
    // A jump (more than 40% of a screen in one frame) lands the core in place
    // instead of gliding it across the copy in between.
    const jumped = Math.abs(scrollDelta) > view.height * 0.4;
    if (jumped) initialized = false;
    // Dev-only framing override, used to render the static poster.
    if (import.meta.env.DEV && window.__coreFrame) Object.assign(goal, window.__coreFrame(view));
    if (!initialized || !animate) {
      Object.assign(current, goal);
      pointer.x = pointer.tx;
      pointer.y = pointer.ty;
      initialized = true;
    } else {
      // Keyboard paging moves the page in quick fixed steps: the core moves
      // with it instead of gliding in across the new heading afterwards.
      const place = 1 - Math.exp(-dt * (keyPaging > 0 ? 26 : 5.2));
      const mood = 1 - Math.exp(-dt * 3);
      current.x += (goal.x - current.x) * place;
      current.y += (goal.y - current.y) * place;
      current.d += (goal.d - current.d) * place;
      STATE_KEYS.forEach((key) => { current[key] += (goal[key] - current[key]) * mood; });
      pointer.x += (pointer.tx - pointer.x) * (1 - Math.exp(-dt * 2.4));
      pointer.y += (pointer.ty - pointer.y) * (1 - Math.exp(-dt * 2.4));
    }

    const index = Math.min(CHAPTER_IDS.length - 1, Math.max(0, Math.round(float)));
    if (index !== chapterIndex) {
      chapterIndex = index;
      layer.dataset.chapter = CHAPTER_IDS[index];
      onChapter?.(index);
    }
    const hold = 1 - Math.min(1, Math.abs(float - index) * 2.6);
    collectAnchors(index, hold);
    // How far the core still has to travel to its pose, in diameters: the
    // working-loop labels wait until it has arrived.
    const away = (Math.hypot(goal.x - current.x, goal.y - current.y) + Math.abs(goal.d - current.d)) / Math.max(1, goal.d);

    // The final chapter carries the core up and off the top edge instead of
    // leaving it behind the copy while the footer arrives. When the page ends
    // too soon after the chapter's resting place for a full exit (a short final
    // chapter on a tall screen), the core rises faster than the page (at most
    // about three times as fast) so it is gone exactly at the page end. If the
    // page ends before its body would even reach the top edge, it rises with
    // the page and stays whole on screen.
    const lastBound = bounds[bounds.length - 1];
    let riseRate = 1;
    if (tail && lastBound && finalPose) {
      const exitRoom = document.documentElement.scrollHeight - view.height - lastBound.top;
      // A few pixels past the fade's end, so the page end is fully clear.
      const fullExit = finalPose.y + finalPose.d * 0.575 + 12;
      // Which ending (rise out, or stay whole) is decided once per screen
      // size, so a late reflow that moves the page end by a few pixels (fonts,
      // split headings) cannot flip it while someone is reading.
      if (!exitMode || Math.abs(exitRoom - exitMode.room) > 48) exitMode = { room: exitRoom, lift: exitRoom > finalPose.y - finalPose.d / 2 };
      if (exitMode.lift && exitRoom < fullExit) riseRate = fullExit / Math.max(1, exitRoom);
    }
    // (Phones leave with the footer instead; see below.)
    const rise = layout === 'phone' ? 0 : tail * riseRate;
    let shown = rise ? { ...current, y: current.y - rise } : current;
    const radius = current.d / 2;
    // However fast the arrival, the core's instruments stay above the final
    // chapter's first line (smoothing would otherwise let them trail into it).
    const lastIndex = CHAPTER_IDS.length - 1;
    if (index === lastIndex && layout !== 'phone') {
      const guard = sections[lastIndex]?.querySelector('.ch-kicker');
      if (guard) {
        const limit = guard.getBoundingClientRect().top - 14 - radius * 1.6;
        if (shown.y > limit) shown = { ...shown, y: limit };
      }
    }
    // Phones: the footer carries the sunk core up ahead of it, its sphere
    // (0.575 d below the centre) kept clear, instead of rising through it.
    // If the core still fits whole above the footer where the page ends, it
    // ends there; otherwise it rises just fast enough to have left over the
    // top edge exactly at the page end, never stopping half cut off.
    const footerTop = lastBound ? lastBound.top + lastBound.height - window.scrollY : Infinity;
    if (layout === 'phone') {
      const clearance = current.d * 0.62;
      const start = shown.y + clearance;
      if (footerTop < start) {
        const room = Math.max(0, document.documentElement.scrollHeight - window.innerHeight - window.scrollY);
        const footerEnd = footerTop - room;
        // Spare room for a whole ending; the choice holds unless it moves by
        // more than a toolbar (80px), so the core cannot flip between whole
        // and gone as a browser's toolbar slides at the page end.
        const spare = footerEnd - clearance - radius;
        if (!phoneEnding || Math.abs(spare - phoneEnding.spare) > 80) phoneEnding = { whole: spare >= 0, spare };
        const end = phoneEnding.whole ? footerEnd - clearance : -radius * 1.2;
        const rate = start > footerEnd ? Math.max(1, (shown.y - end) / (start - footerEnd)) : 1;
        shown = { ...shown, y: shown.y - (start - footerTop) * rate };
      }
    }
    layer.style.setProperty('--cx', `${shown.x.toFixed(1)}px`);
    layer.style.setProperty('--cy', `${shown.y.toFixed(1)}px`);
    layer.style.setProperty('--cr', `${radius.toFixed(1)}px`);
    layer.style.setProperty('--hold', hold.toFixed(3));
    layer.style.setProperty('--local', local.toFixed(3));
    layer.style.setProperty('--settled', (1 - smooth(0.03, 0.1, away)).toFixed(3));
    drawn = { x: shown.x, y: shown.y, d: current.d };
    place(hud, drawn.x, drawn.y, drawn.d);
    place(poster, drawn.x, drawn.y, drawn.d);

    // It fades only as it crosses the top edge (judged by where it naturally
    // sits, not the momentary clamp above), so it never dims while fully on
    // screen, and drawing stops once it is gone. (On phones, where the
    // footer carries it, judged by where it is carried to.)
    const exit = smooth(-radius * 1.15, radius * 0.5, layout === 'phone' ? shown.y : current.y - rise);
    const shade = exit * (1 - SUNK * sink);
    if (Math.abs(shade - exitOpacity) > 0.004 || (shade === 0) !== (exitOpacity === 0) || (shade >= 0.999) !== (exitOpacity >= 0.999)) {
      exitOpacity = shade;
      layer.style.opacity = shade >= 0.999 ? '' : shade.toFixed(3);
    }
    const offstage = exit < 0.01 || (lastBound && window.scrollY > lastBound.top + lastBound.height);
    layer.dataset.offstage = offstage ? 'true' : 'false';
    // The footer scrolls in over the fixed controls: the rail steps aside and
    // the motion control rides above the footer so it is never covered.
    layer.dataset.footer = footerTop < view.height / 2 + 140 ? 'near' : 'far';
    const motionControl = controls?.querySelector('.ch-motion');
    if (motionControl) {
      // The translate property composes with the boot tween's transform instead of fighting it.
      const lift = Math.round(Math.max(0, motionControl.offsetTop + motionControl.offsetHeight + 12 - footerTop));
      if (lift !== controlLift) {
        controlLift = lift;
        motionControl.style.translate = lift ? `0 ${-lift}px` : '';
      }
    }
    // Lightning waits for the page to be still with the core settled in a
    // chapter that allows it (the chapter's own value, not the eased one).
    // Phones, and screens too short for copy and core side by side (a phone
    // on its side), get neither lightning nor bright filament pulses.
    const cramped = view.layoutHeight < 520;
    const striking = animate && layout !== 'phone' && !cramped && stillFor > 0.45 && hold > 0.5 && away < 0.08 && goal.strike > 0.01;
    // Copy on screen that lightning and bright pulses must not cross, measured
    // once the page has settled enough for either to show (and for the still
    // frame of reduced motion).
    const copyKeepOut = !cramped && (!animate || stillFor > 0.2) ? copyZones() : NO_ZONES;
    if (scene && !offstage) {
      scene.render({
        time,
        dt: animate ? dt : 0,
        frame: shown,
        pose: current,
        pointer,
        heat: boot.heat,
        assemble: boot.assemble,
        grow: boot.grow,
        tendril: current.tendril,
        tendrilGoal: goal.tendril,
        // Filament pulses also wait for the page to settle, and stay dark
        // once the core has sunk behind the copy.
        calm: cramped || sink > 0.5 ? 0 : animate ? smooth(0.2, 0.7, stillFor) : 1,
        strike: striking ? goal.strike : 0,
        copyKeepOut,
        echo: current.echo,
        web: current.web,
        sparks: current.sparks,
        spin: current.spin,
        targets,
        anchorWeight: hold,
        // Phones: keep filaments level, around the intro's copy and behind
        // the chapters' copy alike.
        side: layout === 'phone' ? 'level' : stateFor(CHAPTER_IDS[index], view.width, view.height, view.layoutWidth, view.layoutHeight).side,
        keepOut: fixedControls(),
        still: !animate,
      });
    }
    onFrame?.({ current: shown, float, local, hold, index, time, animate, radius, view });
  }

  // Fixed controls (chapter rail, motion toggle) that filaments must not cross.
  const controls = layer.parentElement;
  function fixedControls() {
    const zones = [];
    controls?.querySelectorAll('.ch-rail, .ch-motion').forEach((element) => {
      if (!showing(element)) return;
      const rect = element.getBoundingClientRect();
      if (rect.width) zones.push({ left: rect.left - 28, top: rect.top - 20, right: rect.right + 28, bottom: rect.bottom + 20 });
    });
    return zones;
  }

  function adaptQuality(dt) {
    if (!scene || dt <= 0) return;
    frameTimes.push(dt);
    if (frameTimes.length < 90) return;
    const average = frameTimes.reduce((sum, value) => sum + value, 0) / frameTimes.length;
    frameTimes.length = 0;
    if (average > 0.026 && dprCap > 0.8) {
      dprCap = Math.max(0.8, dprCap - 0.2);
      resize();
    }
  }

  function tick(stamp) {
    rafId = 0;
    if (dead) return;
    const dt = lastStamp ? Math.min((stamp - lastStamp) / 1000, 0.1) : 1 / 60;
    lastStamp = stamp;
    const animate = !paused && !still;
    if (animate) {
      time += dt;
      adaptQuality(dt);
    }
    update(dt, animate);
    if (animate && !document.hidden && layer.dataset.offstage !== 'true') schedule();
    else lastStamp = 0;
  }

  function schedule() {
    if (dead) return;
    if (externalClock) wanted = true;
    else if (!rafId) rafId = window.requestAnimationFrame(tick);
  }

  function resize() {
    measure();
    if (scene) {
      const pixels = view.width * view.height;
      const device = window.devicePixelRatio || 1;
      dpr = Math.min(device, dprCap, Math.sqrt(3200000 / pixels));
      scene.resize(view.width, view.height, Math.max(0.6, dpr));
    }
    initialized = false;
    schedule();
  }

  let resizeFrame = 0;
  const resizeObserver = new ResizeObserver(() => {
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => { resizeFrame = 0; resize(); });
  });
  resizeObserver.observe(stage);
  sections.forEach((section) => resizeObserver.observe(section));

  const onScroll = () => { stillFor = 0; schedule(); };
  // Any intent to move cuts lightning before the page starts moving.
  const pagingKeys = new Set(['PageDown', 'PageUp', ' ', 'ArrowDown', 'ArrowUp', 'Home', 'End']);
  const onIntent = (event) => {
    stillFor = 0;
    keyPaging = event.type === 'keydown' && pagingKeys.has(event.key) ? 1.2 : 0;
  };
  const intents = ['wheel', 'keydown', 'pointerdown', 'touchstart'];
  const onPointer = (event) => {
    if (event.pointerType === 'touch') return;
    pointer.tx = (event.clientX / view.width) * 2 - 1;
    pointer.ty = (event.clientY / view.height) * 2 - 1;
    if (!paused && !still) schedule();
  };
  const onVisibility = () => { if (!document.hidden) { lastStamp = 0; schedule(); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  intents.forEach((type) => window.addEventListener(type, onIntent, { passive: true, capture: true }));
  window.addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);

  async function loadScene() {
    try {
      const { createCoreScene } = await import('./coreScene');
      if (dead) return;
      scene = createCoreScene(stage, {
        onLost: () => {
          scene?.dispose();
          scene = null;
          layer.dataset.scene = 'fallback';
          onStatus?.('fallback');
        },
      });
      if (!scene) {
        layer.dataset.scene = 'fallback';
        onStatus?.('fallback');
        return;
      }
      resize();
      layer.dataset.scene = 'ready';
      onStatus?.('ready');
    } catch {
      if (dead) return;
      layer.dataset.scene = 'fallback';
      onStatus?.('fallback');
    }
  }

  measure();
  update(0, false);
  layer.classList.add('is-directed');
  if ('requestIdleCallback' in window) idleId = window.requestIdleCallback(loadScene, { timeout: 700 });
  else loadTimer = window.setTimeout(loadScene, 60);

  return {
    boot,
    get scene() { return scene; },
    get state() { return current; },
    get chapter() { return chapterIndex; },
    refresh() { resize(); },
    wake() { schedule(); },
    // Run from another frame clock (the smooth-scroll ticker), after it has
    // moved the page, so the core and the copy are placed from the same scroll
    // position in every frame. Returns a function that hands the loop back.
    drive(ticker) {
      externalClock = true;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
        wanted = true;
      }
      const pump = () => {
        if (dead || !(wanted || window.scrollY !== lastScroll)) return;
        wanted = false;
        tick(performance.now());
      };
      ticker.add(pump);
      return () => {
        ticker.remove(pump);
        externalClock = false;
        if (wanted) {
          wanted = false;
          schedule();
        }
      };
    },
    setPaused(value) {
      paused = value;
      layer.dataset.paused = value ? 'true' : 'false';
      lastStamp = 0;
      schedule();
    },
    setStill(value) {
      still = value;
      lastStamp = 0;
      schedule();
    },
    dispose() {
      dead = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId);
      if (loadTimer !== undefined) window.clearTimeout(loadTimer);
      resizeObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      intents.forEach((type) => window.removeEventListener(type, onIntent, { capture: true }));
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      scene?.dispose();
      scene = null;
      layer.classList.remove('is-directed');
      frames.forEach((frame, element) => ['left', 'top', 'width', 'height', 'transform'].forEach((key) => element.style.removeProperty(key)));
      frozenAt = 0;
      drawn = null;
    },
  };
}
