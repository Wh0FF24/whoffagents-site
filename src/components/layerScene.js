import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export function createLayerScene(host, projects, initialReduced, onLost) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
  const room = new RoomEnvironment(),
    pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(room, 0.04);
  room.dispose();
  pmrem.dispose();
  scene.environment = environment.texture;
  scene.add(new THREE.HemisphereLight(0xd3e4ff, 0x08101d, 2));
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(-4, 6, 6);
  scene.add(light);
  const silver = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0,
    metalness: 0.85,
    roughness: 0.28,
  });
  const blue = new THREE.MeshStandardMaterial({
    color: 0x003da5,
    metalness: 0.65,
    roughness: 0.3,
  });
  const red = new THREE.MeshStandardMaterial({
    color: 0xc8102e,
    metalness: 0.5,
    roughness: 0.3,
  });
  const gold = new THREE.MeshStandardMaterial({
    color: 0xe1bd70,
    metalness: 0.75,
    roughness: 0.3,
  });
  let dead = false,
    lost = false,
    visible = true,
    frame = 0,
    reduced = initialReduced,
    paused = false;
  let current = 0,
    target = 0,
    last = 0;
  const textures = [],
    images = [];
  const panels = projects.map((project, i) => {
    const group = new THREE.Group();
    scene.add(group);
    const body = new THREE.Mesh(
      new RoundedBoxGeometry(6.2, 4.12, 0.16, 3, 0.07),
      i === 3 ? red : blue,
    );
    group.add(body);
    const rim = new THREE.Mesh(
      new RoundedBoxGeometry(6.1, 4.02, 0.08, 3, 0.045),
      i === 3 ? gold : silver,
    );
    rim.position.z = 0.09;
    group.add(rim);
    const canvas = document.createElement("canvas");
    canvas.width = 1500;
    canvas.height = 980;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#101b2e";
    ctx.fillRect(0, 0, 1500, 980);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    textures.push(texture);
    const image = new Image();
    images.push(image);
    image.onload = () => {
      if (dead) return;
      ctx.fillStyle = "#101b2e";
      ctx.fillRect(0, 0, 1500, 980);
      // Fit the entire supplied screenshot; no square-face crop or distortion.
      const scale = Math.min(
        1500 / image.naturalWidth,
        930 / image.naturalHeight,
      );
      const w = image.naturalWidth * scale,
        h = image.naturalHeight * scale;
      ctx.drawImage(image, (1500 - w) / 2, 50 + (930 - h) / 2, w, h);
      ctx.fillStyle = "#b9c8de";
      ctx.font = "17px monospace";
      ctx.fillText(`WHOFF / ${project.name.toUpperCase()}`, 28, 31);
      ctx.fillStyle = i === 3 ? "#e1bd70" : "#95b8ef";
      for (let d = 0; d < 3; d++) {
        ctx.beginPath();
        ctx.arc(1430 + d * 18, 25, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      texture.needsUpdate = true;
      schedule();
    };
    image.onerror = () => {
      if (!dead) {
        lost = true;
        onLost();
      }
    };
    image.src = project.image;
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(5.98, 3.9),
      new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }),
    );
    screen.position.z = 0.14;
    group.add(screen);
    return group;
  });
  const smooth = (x) => THREE.MathUtils.smoothstep(x, 0, 1);
  function render(now) {
    frame = 0;
    if (dead || lost || !visible || document.hidden) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    current = reduced
      ? target
      : THREE.MathUtils.lerp(current, target, 1 - Math.exp(-dt * 8));
    if (Math.abs(current - target) < 0.001) current = target;
    const opening = smooth(current),
      travel = Math.max(0, current - 1);
    panels.forEach((panel, i) => {
      const d = i - travel;
      // Waiting panels fan behind the featured page; completed pages exit left.
      const x = d < 0 ? d * 7 : d * 1.2;
      const y = d < 0 ? d * 0.18 : d * 0.38;
      const z = d < 0 ? d * 1.9 : -d * 1.05;
      panel.position.set(
        THREE.MathUtils.lerp(2.55 - i * 0.18, x, opening),
        THREE.MathUtils.lerp(-i * 0.13, y, opening),
        THREE.MathUtils.lerp(-i * 0.35, z, opening),
      );
      panel.rotation.set(
        THREE.MathUtils.lerp(0.16, Math.abs(d) * 0.035, opening),
        THREE.MathUtils.lerp(
          -0.5,
          d < 0 ? -0.4 : -Math.min(d, 1) * 0.11,
          opening,
        ),
        THREE.MathUtils.lerp(-0.07, Math.min(d, 2) * 0.018, opening),
      );
      panel.scale.setScalar(THREE.MathUtils.lerp(0.7, 1.06, opening));
    });
    renderer.render(scene, camera);
    host.dataset.progress = current.toFixed(3);
    host.dataset.drawCalls = String(renderer.info.render.calls);
    if (current !== target) schedule();
  }
  function schedule() {
    if (!frame && !dead && !lost && visible && !document.hidden)
      frame = requestAnimationFrame(render);
  }
  function resize() {
    const w = host.clientWidth,
      h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.position.set(0, 0, camera.aspect < 1 ? 15.5 : 10.8);
    camera.updateProjectionMatrix();
    schedule();
  }
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) {
      last = performance.now();
      schedule();
    } else {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  });
  observer.observe(host);
  const size = new ResizeObserver(resize);
  size.observe(host);
  const visibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else schedule();
  };
  const contextLost = (e) => {
    e.preventDefault();
    lost = true;
    cancelAnimationFrame(frame);
    frame = 0;
    onLost();
  };
  document.addEventListener("visibilitychange", visibility);
  renderer.domElement.addEventListener("webglcontextlost", contextLost);
  resize();
  return {
    setProgress(value, direct = false) {
      if (!paused || direct) {
        target = value;
        schedule();
      }
    },
    setReduced(value) {
      reduced = value;
      schedule();
    },
    setPaused(value) {
      paused = value;
      if (paused) target = current;
      schedule();
    },
    dispose() {
      dead = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      size.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      images.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
      const geometries = new Set(),
        materials = new Set();
      scene.traverse((node) => {
        if (node.geometry) geometries.add(node.geometry);
        if (node.material) materials.add(node.material);
      });
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      environment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
