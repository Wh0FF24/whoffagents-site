import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import officialMark from "../../public/brand/whoff-mark.svg?raw";

// Three related objects, constructed here for the studio. No remote models or textures.
export function createIdentityScene(host, kind, initialReduced, onLost) {
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
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
  camera.position.set(0, 0, 10.5);
  const room = new RoomEnvironment(),
    pmrem = new THREE.PMREMGenerator(renderer),
    environment = pmrem.fromScene(room, 0.04);
  scene.environment = environment.texture;
  room.dispose();
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xcbdcff, 0x15101a, 1.2));
  const key = new THREE.DirectionalLight(0xffffff, 2);
  key.position.set(-3, 5, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(
    kind === "tools" ? 0xffcd95 : 0x669fff,
    2,
  );
  rim.position.set(4, 1, -3);
  scene.add(rim);
  const silver = new THREE.MeshPhysicalMaterial({
    color: 0xc0c0c0,
    metalness: 1,
    roughness: 0.26,
    clearcoat: 0.4,
  });
  const blue = new THREE.MeshPhysicalMaterial({
    color: 0x003da5,
    metalness: 0.45,
    roughness: 0.3,
    clearcoat: 0.6,
  });
  const red = new THREE.MeshPhysicalMaterial({
    color: 0xc8102e,
    metalness: 0.35,
    roughness: 0.3,
    clearcoat: 0.6,
  });
  const gold = new THREE.MeshStandardMaterial({
    color: 0xe1bd70,
    metalness: 0.8,
    roughness: 0.28,
  });
  const dark = new THREE.MeshStandardMaterial({
    color: 0x09162e,
    metalness: 0.5,
    roughness: 0.45,
  });
  const root = new THREE.Group();
  scene.add(root);
  const textures = [];
  const pieces = [];
  const bars = [];
  let modes = [];
  function mesh(geometry, material, parent = root) {
    const m = new THREE.Mesh(geometry, material);
    parent.add(m);
    return m;
  }
  function box(w, h, d, material, parent = root, radius = 0.06) {
    return mesh(new RoundedBoxGeometry(w, h, d, 3, radius), material, parent);
  }
  function tube(points, radius, material, parent = root) {
    return mesh(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))),
        60,
        radius,
        24,
        false,
      ),
      material,
      parent,
    );
  }
  if (kind === "agents") {
    root.rotation.set(0.12, -0.35, -0.09);
    mesh(new THREE.TorusGeometry(2.02, 0.095, 16, 120), silver);
    mesh(new THREE.TorusGeometry(1.79, 0.17, 18, 120), blue);
    const backing = mesh(
      new THREE.CylinderGeometry(1.64, 1.64, 0.22, 90),
      dark,
    );
    backing.rotation.x = Math.PI / 2;
    backing.position.z = -0.13;
    const seam = mesh(
      new THREE.TorusGeometry(1.6, 0.017, 8, 110),
      new THREE.MeshBasicMaterial({ color: 0x88baff }),
    );
    seam.position.z = 0.03;
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * Math.PI * 2;
      const tick = box(i % 5 === 0 ? 0.12 : 0.05, 0.014, 0.014, silver);
      tick.position.set(Math.cos(a) * 2.2, Math.sin(a) * 2.2, 0);
      tick.rotation.z = a;
    }
    modes = [new THREE.Group(), new THREE.Group(), new THREE.Group()];
    modes.forEach((g) => {
      g.position.z = 0.2;
      root.add(g);
    });
    for (let i = 0; i < 13; i++) {
      const bar = box(0.105, 1, 0.105, silver, modes[0], 0.04);
      bar.position.x = (i - 6) * 0.17;
      bars.push(bar);
    }
    for (let i = 0; i < 3; i++) {
      const plate = box(1.85, 0.55, 0.1, i === 0 ? blue : dark, modes[1]);
      plate.position.set((i - 1) * 0.1, 0.7 - i * 0.66, i * 0.05);
      for (let j = 0; j < 2; j++) {
        const line = box(j ? 0.72 : 1.22, 0.026, 0.025, silver, plate, 0.01);
        line.position.set(j ? -0.23 : 0, 0.1 - j * 0.18, 0.061);
      }
    }
    for (let i = 0; i < 3; i++) {
      const x = (i - 1) * 0.98;
      const node = box(0.63, 0.63, 0.18, blue, modes[2], 0.16);
      node.position.set(x, 0, 0);
      const dot = mesh(new THREE.SphereGeometry(0.08, 16, 12), silver, node);
      dot.position.z = 0.15;
      if (i < 2)
        tube(
          [
            [x + 0.31, 0, 0],
            [x + 0.48, 0.16, 0],
            [x + 0.67, 0, 0],
          ],
          0.025,
          silver,
          modes[2],
        );
    }
    const marker = mesh(new THREE.TorusGeometry(2.02, 0.1, 12, 24, 0.26), red);
    marker.rotation.z = 0.58;
    const inset = mesh(new THREE.TorusGeometry(2.02, 0.027, 8, 24, 0.2), gold);
    inset.rotation.z = 0.61;
    inset.position.z = 0.092;
  } else if (kind === "tools") {
    root.rotation.set(0.28, -0.52, -0.1);
    ["SKILLS", "MCP", "STARTER KITS"].forEach((label, i) => {
      const piece = new THREE.Group();
      root.add(piece);
      piece.position.y = 1.18 - i * 1.18;
      pieces.push(piece);
      box(3.9, 0.43, 2.35, red, piece, 0.14);
      const bottom = box(3.6, 0.07, 2.08, gold, piece, 0.035);
      bottom.position.y = -0.24;
      const face = box(
        3.45,
        0.27,
        0.027,
        new THREE.MeshBasicMaterial({ color: 0x651022 }),
        piece,
        0.03,
      );
      face.position.z = 1.174;
      for (let j = 0; j < 9; j++) {
        const pin = box(0.08, 0.06, 0.055, gold, piece, 0.012);
        pin.position.set(0.78 + j * 0.1, -0.01, 1.21);
      }
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 512;
      const c = canvas.getContext("2d");
      c.fillStyle = "#9c122c";
      c.fillRect(0, 0, 1024, 512);
      c.fillStyle = "#e1bd70";
      c.font = "24px monospace";
      c.fillText(`WHOFF / MODULE 0${i + 1}`, 52, 65);
      c.font = "68px Arial";
      c.fillText(label, 52, 271);
      c.font = "22px monospace";
      c.fillText(
        ["REUSABLE KNOW-HOW", "USEFUL CONNECTIONS", "A HEAD START"][i],
        52,
        432,
      );
      c.strokeStyle = "#e1bd70";
      c.lineWidth = 2;
      c.strokeRect(26, 24, 972, 464);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(
        8,
        renderer.capabilities.getMaxAnisotropy(),
      );
      textures.push(texture);
      const plate = mesh(
        new THREE.PlaneGeometry(3.55, 1.93),
        new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }),
        piece,
      );
      plate.rotation.x = -Math.PI / 2;
      plate.position.y = 0.225;
      const numeral = box(0.13, 0.11, 0.035, gold, piece, 0.01);
      numeral.position.set(-1.54, 0, 1.21);
    });
  } else {
    root.rotation.set(0.1, -0.25, -0.025);
    // Extrude the supplied logo paths, preserving the actual interlocking W/A.
    const parsed = new SVGLoader().parse(officialMark);
    for (let i = 0; i < 2; i++) {
      const part = new THREE.Group();
      root.add(part);
      pieces.push(part);
    }
    parsed.paths.forEach((path) => {
      const fill = path.userData.style.fill;
      const warm = fill === "rgb(151,9,33)" || fill === "rgb(183,138,79)";
      const surface = new THREE.Group();
      surface.scale.set(0.009, -0.009, 0.009);
      surface.position.set(-376 * 0.009, 412 * 0.009, -0.15);
      pieces[warm ? 0 : 1].add(surface);
      const material = new THREE.MeshStandardMaterial({
        color: path.color,
        metalness: 0.5,
        roughness: 0.32,
      });
      SVGLoader.createShapes(path).forEach((shape) => {
        mesh(
          new THREE.ExtrudeGeometry(shape, {
            depth: 25,
            bevelEnabled: true,
            bevelThickness: 1.2,
            bevelSize: 0.6,
            bevelSegments: 2,
            steps: 1,
            curveSegments: 6,
          }),
          material,
          surface,
        );
      });
    });
  }
  let dead = false,
    lost = false,
    visible = true,
    reduced = initialReduced,
    paused = false,
    frame = 0,
    last = 0,
    time = 0,
    selected = 0,
    current = 0;
  const pointer = { x: 0, y: 0 };
  function render(now) {
    frame = 0;
    if (dead || lost || !visible || document.hidden) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!reduced && !paused) time += dt;
    current = reduced
      ? selected
      : current + (selected - current) * (1 - Math.exp(-dt * 8));
    if (Math.abs(selected - current) < 0.002) current = selected;
    root.position.y = !reduced && !paused ? Math.sin(time * 0.65) * 0.045 : 0;
    root.rotation.y =
      (kind === "agents" ? -0.35 : kind === "tools" ? -0.52 : -0.25) +
      (!reduced && !paused ? pointer.x * 0.07 : 0);
    if (kind === "agents") {
      modes.forEach((g, i) => {
        g.visible = i === selected;
      });
      bars.forEach((bar, i) => {
        bar.scale.y =
          0.18 +
          Math.pow(
            Math.sin(i * 0.65 + (!reduced && !paused ? time * 1.45 : 0)),
            2,
          ) *
            1.05;
      });
    } else if (kind === "tools") {
      pieces.forEach((piece, i) => {
        const focus = selected === i + 1 ? 1 : 0;
        const toX = focus ? 0.38 : 0,
          toZ = focus ? 0.8 : 0;
        piece.position.x = reduced
          ? toX
          : THREE.MathUtils.lerp(piece.position.x, toX, 0.16);
        piece.position.z = reduced
          ? toZ
          : THREE.MathUtils.lerp(piece.position.z, toZ, 0.16);
      });
    } else {
      pieces.forEach((part, i) => {
        const focus = selected === i + 1;
        const x = selected === 0 ? 0 : (i ? 1 : -1) * 0.12;
        const z = focus ? 0.32 : 0;
        part.position.x = reduced
          ? x
          : THREE.MathUtils.lerp(part.position.x, x, 0.16);
        part.position.z = reduced
          ? z
          : THREE.MathUtils.lerp(part.position.z, z, 0.16);
      });
    }
    renderer.render(scene, camera);
    host.dataset.selection = String(selected);
    host.dataset.motion = reduced ? "reduced" : paused ? "paused" : "running";
    host.dataset.drawCalls = String(renderer.info.render.calls);
    if ((!reduced && !paused) || current !== selected) schedule();
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
    camera.position.z = w / h < 1 ? 12.4 : 10.5;
    camera.updateProjectionMatrix();
    schedule();
  }
  const observer = new IntersectionObserver(
    ([e]) => {
      visible = e.isIntersecting;
      if (visible) {
        last = performance.now();
        schedule();
      } else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    },
    { threshold: 0.01 },
  );
  observer.observe(host);
  const sizeObserver = new ResizeObserver(resize);
  sizeObserver.observe(host);
  const move = (e) => {
    if (reduced || paused) return;
    const r = host.getBoundingClientRect();
    pointer.x = THREE.MathUtils.clamp(
      (e.clientX - r.left) / r.width - 0.5,
      -0.5,
      0.5,
    );
    pointer.y = THREE.MathUtils.clamp(
      (e.clientY - r.top) / r.height - 0.5,
      -0.5,
      0.5,
    );
  };
  const visibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else {
      last = performance.now();
      schedule();
    }
  };
  const contextLost = (e) => {
    e.preventDefault();
    lost = true;
    cancelAnimationFrame(frame);
    frame = 0;
    onLost();
  };
  window.addEventListener("pointermove", move, { passive: true });
  document.addEventListener("visibilitychange", visibility);
  renderer.domElement.addEventListener("webglcontextlost", contextLost);
  resize();
  return {
    select(index) {
      selected = index;
      schedule();
    },
    setReduced(value) {
      reduced = value;
      schedule();
    },
    setPaused(value) {
      paused = value;
      schedule();
    },
    dispose() {
      dead = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      sizeObserver.disconnect();
      window.removeEventListener("pointermove", move);
      document.removeEventListener("visibilitychange", visibility);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
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
