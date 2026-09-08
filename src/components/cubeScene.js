import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

// A real-time object designed for this studio. No footage, model downloads, or external textures.
export function createCubeScene(host, projects, initialReduced, onLost) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.45;
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
  camera.position.set(0, 0.25, 10.8);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04);
  scene.environment = environment.texture;
  room.dispose();
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xc2d8ff, 0x000617, 2));
  const key = new THREE.DirectionalLight(0xffffff, 5);
  key.position.set(-4, 6, 5);
  scene.add(key);
  const blueLight = new THREE.PointLight(0x003da5, 65, 18);
  blueLight.position.set(3, -1, 3);
  scene.add(blueLight);
  const rim = new THREE.DirectionalLight(0x6e9fff, 3);
  rim.position.set(4, 2, -3);
  scene.add(rim);

  const silver = new THREE.MeshPhysicalMaterial({
    color: 0xc0c0c0,
    metalness: 1,
    roughness: 0.28,
    clearcoat: 0.5,
  });
  const blue = new THREE.MeshPhysicalMaterial({
    color: 0x003da5,
    metalness: 0.7,
    roughness: 0.22,
    clearcoat: 1,
  });
  const dark = new THREE.MeshStandardMaterial({
    color: 0x081328,
    metalness: 0.8,
    roughness: 0.3,
  });
  const lit = new THREE.MeshBasicMaterial({ color: 0x6e9fff });
  const red = new THREE.MeshPhysicalMaterial({
    color: 0xc8102e,
    metalness: 0.5,
    roughness: 0.26,
  });
  const gold = new THREE.MeshStandardMaterial({
    color: 0xe1bd70,
    metalness: 0.85,
    roughness: 0.23,
  });
  const object = new THREE.Group();
  scene.add(object);
  const cube = new THREE.Group();
  object.add(cube);
  const addBox = (parent, w, h, d, radius, material, x = 0, y = 0, z = 0) => {
    const mesh = new THREE.Mesh(
      new RoundedBoxGeometry(w, h, d, 3, radius),
      material,
    );
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  };
  addBox(cube, 3.05, 3.05, 3.05, 0.1, blue);
  // Eight separate silver corner blocks and twelve rails surround recessed display faces.
  for (const x of [-1, 1])
    for (const y of [-1, 1])
      for (const z of [-1, 1]) {
        addBox(
          cube,
          0.16,
          0.16,
          0.16,
          0.045,
          silver,
          x * 1.58,
          y * 1.58,
          z * 1.58,
        );
      }
  for (const a of [-1, 1])
    for (const b of [-1, 1]) {
      addBox(cube, 3.04, 0.045, 0.045, 0.02, silver, 0, a * 1.58, b * 1.58);
      addBox(cube, 0.045, 3.04, 0.045, 0.02, silver, a * 1.58, 0, b * 1.58);
      addBox(cube, 0.045, 0.045, 3.04, 0.02, silver, a * 1.58, b * 1.58, 0);
      addBox(cube, 2.64, 0.022, 0.022, 0.009, lit, 0, a * 1.54, b * 1.54);
      addBox(cube, 0.022, 2.64, 0.022, 0.009, lit, a * 1.54, 0, b * 1.54);
    }
  let dead = false;
  let contextLost = false;
  const textures = [];
  function screenTexture(project, index) {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    textures.push(texture);
    const draw = (img) => {
      ctx.fillStyle = index === 3 ? "#200c13" : "#0b1527";
      ctx.fillRect(0, 0, 1024, 1024);
      ctx.fillStyle = index === 3 ? "#e1bd70" : "#cdd9eb";
      ctx.font = "20px monospace";
      ctx.fillText(project.type, 48, 58);
      ctx.fillStyle = index === 3 ? "#c8102e" : "#003da5";
      ctx.fillRect(872, 36, 104, 26);
      if (img)
        ctx.drawImage(img, 0, 0, img.width, img.height, 32, 104, 960, 734);
      else {
        ctx.fillStyle = "#003da5";
        ctx.fillRect(32, 104, 960, 734);
      }
      ctx.fillStyle = index === 3 ? "#e1bd70" : "#edf1f7";
      ctx.font = "44px Arial";
      ctx.fillText(project.name, 48, 905);
      ctx.font = "17px monospace";
      ctx.fillText(project.status, 48, 958);
      texture.needsUpdate = true;
      schedule();
    };
    const img = new Image();
    img.onload = () => {
      if (!dead) draw(img);
    };
    img.onerror = () => {
      if (!dead) draw(null);
    };
    img.src = project.image;
    // The first render never waits for a network image.
    ctx.fillStyle = "#0b1527";
    ctx.fillRect(0, 0, 1024, 1024);
    return texture;
  }
  let frame = 0,
    visible = true,
    reduced = initialReduced,
    paused = false,
    target = 0,
    turn = 0,
    last = 0,
    elapsed = 0;
  const pointer = { x: 0, y: 0 };
  projects.forEach((project, index) => {
    const face = new THREE.Group();
    face.rotation.y = (index * Math.PI) / 2;
    cube.add(face);
    addBox(face, 2.94, 2.94, 0.1, 0.09, dark, 0, 0, 1.53);
    const material = new THREE.MeshBasicMaterial({
      map: screenTexture(project, index),
      toneMapped: false,
    });
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(2.71, 2.71), material);
    panel.position.z = 1.592;
    face.add(panel);
    for (const x of [-1, 1])
      for (const y of [-1, 1]) {
        const screw = new THREE.Mesh(
          new THREE.CylinderGeometry(0.028, 0.028, 0.015, 8),
          silver,
        );
        screw.rotation.x = Math.PI / 2;
        screw.position.set(x * 1.43, y * 1.43, 1.602);
        face.add(screw);
      }
  });
  // The lid carries a purpose-drawn silver W, inset in royal-blue metal.
  const lid = new THREE.Group();
  lid.rotation.x = -Math.PI / 2;
  cube.add(lid);
  addBox(lid, 2.92, 2.92, 0.09, 0.1, blue, 0, 0, 1.53);
  const logoCanvas = document.createElement("canvas");
  logoCanvas.width = 512;
  logoCanvas.height = 512;
  const c = logoCanvas.getContext("2d");
  c.fillStyle = "#003da5";
  c.fillRect(0, 0, 512, 512);
  c.strokeStyle = "#c0c0c0";
  c.lineWidth = 25;
  c.lineJoin = "round";
  c.beginPath();
  c.moveTo(112, 174);
  c.lineTo(175, 340);
  c.lineTo(256, 211);
  c.lineTo(337, 340);
  c.lineTo(400, 174);
  c.stroke();
  c.fillStyle = "#c0c0c0";
  c.font = "17px monospace";
  c.fillText("WHOFF / INDEPENDENT STUDIO", 105, 434);
  const logoTexture = new THREE.CanvasTexture(logoCanvas);
  logoTexture.colorSpace = THREE.SRGBColorSpace;
  textures.push(logoTexture);
  const logo = new THREE.Mesh(
    new THREE.PlaneGeometry(2.5, 2.5),
    new THREE.MeshBasicMaterial({
      map: logoTexture,
      toneMapped: false,
    }),
  );
  logo.position.z = 1.59;
  lid.add(logo);
  // One centered orbital plane. Every line, tick and accent shares its transform,
  // so the guides stay registered as the object moves or a face turns toward us.
  const orbit = new THREE.Group();
  orbit.rotation.set(0.32, -0.12, -0.18);
  object.add(orbit);
  const orbitRadius = 2.83;
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(orbitRadius, 0.008, 6, 180),
    new THREE.MeshBasicMaterial({
      color: 0x9daec7,
      transparent: true,
      opacity: 0.62,
      depthWrite: false,
    }),
  );
  orbit.add(ring);
  const sleeve = new THREE.Mesh(
    new THREE.TorusGeometry(orbitRadius, 0.026, 8, 32, 0.4),
    red,
  );
  sleeve.rotation.z = 0.7;
  orbit.add(sleeve);
  const inlay = new THREE.Mesh(
    new THREE.TorusGeometry(orbitRadius, 0.01, 8, 28, 0.32),
    gold,
  );
  inlay.rotation.z = 0.74;
  inlay.position.z = 0.027;
  orbit.add(inlay);
  const marker = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 8), silver);
  marker.position.set(orbitRadius, 0, 0);
  orbit.add(marker);
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2;
    const tick = new THREE.Mesh(
      new THREE.BoxGeometry(i % 6 === 0 ? 0.09 : 0.035, 0.008, 0.008),
      new THREE.MeshBasicMaterial({ color: i % 6 === 0 ? 0xc0c0c0 : 0x627590 }),
    );
    tick.position.set(Math.cos(a) * orbitRadius, Math.sin(a) * orbitRadius, 0);
    tick.rotation.z = a;
    orbit.add(tick);
  }
  function resize() {
    const w = host.clientWidth,
      h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.position.z = w / h < 0.85 ? 12.8 : 10.8;
    camera.updateProjectionMatrix();
    schedule();
  }
  function render(time) {
    frame = 0;
    if (dead || !visible || document.hidden) return;
    const dt = Math.min((time - last) / 1000, 0.05);
    last = time;
    if (!reduced && !paused) elapsed += dt;
    const difference = target - turn;
    turn =
      reduced || Math.abs(difference) < 0.002
        ? target
        : turn + difference * (1 - Math.exp(-dt * 7));
    const focus =
      Math.min(1, Math.abs(turn)) *
      (1 - Math.min(1, Math.abs(turn - Math.round(turn)) * 2));
    cube.rotation.set(
      0.28 - focus * 0.16 + (!reduced && !paused ? pointer.y * 0.035 : 0),
      -0.42 + focus * 0.3 - (turn * Math.PI) / 2,
      -0.1 + focus * 0.065,
    );
    cube.scale.setScalar(1.04 + focus * 0.04);
    object.position.y =
      !reduced && !paused ? Math.sin(elapsed * 0.65) * 0.055 : 0;
    object.rotation.y = !reduced && !paused ? pointer.x * 0.035 : 0;
    renderer.render(scene, camera);
    host.dataset.turn = turn.toFixed(3);
    host.dataset.drawCalls = String(renderer.info.render.calls);
    if ((!reduced && !paused) || Math.abs(target - turn) > 0.001) schedule();
  }
  function schedule() {
    if (!frame && !dead && !contextLost && visible && !document.hidden)
      frame = requestAnimationFrame(render);
  }
  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
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
  const move = (event) => {
    if (reduced || paused) return;
    const r = host.getBoundingClientRect();
    pointer.x = (event.clientX - r.left) / r.width - 0.5;
    pointer.y = (event.clientY - r.top) / r.height - 0.5;
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
  const lost = (event) => {
    event.preventDefault();
    contextLost = true;
    paused = true;
    cancelAnimationFrame(frame);
    frame = 0;
    onLost();
  };
  window.addEventListener("pointermove", move, { passive: true });
  document.addEventListener("visibilitychange", visibility);
  renderer.domElement.addEventListener("webglcontextlost", lost);
  resize();
  return {
    setTurn(value) {
      target = value;
      schedule();
    },
    setPaused(value) {
      paused = value;
      schedule();
    },
    setReduced(value) {
      reduced = value;
      schedule();
    },
    dispose() {
      dead = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      sizeObserver.disconnect();
      window.removeEventListener("pointermove", move);
      document.removeEventListener("visibilitychange", visibility);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
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
