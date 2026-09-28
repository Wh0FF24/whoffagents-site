import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';

// The Whoff core: a holographic sphere of crimson data fragments around a
// white-hot nucleus, royal-blue filaments reaching to the edges of the screen.
// Everything is procedural; the page (coreDirector) supplies framing and
// chapter state every frame and this module only draws.

const TAU = Math.PI * 2;

function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(random) {
  return Math.sqrt(-2 * Math.log(Math.max(random(), 1e-6))) * Math.cos(TAU * random());
}

// Brand colors become linear working colors through ColorManagement.
const COLOR = {
  crimson: new THREE.Color('#970921'),
  crimsonHot: new THREE.Color(0.95, 0.055, 0.12),
  white: new THREE.Color(1.0, 0.82, 0.86),
  royal: new THREE.Color('#0442AE'),
  royalHot: new THREE.Color(0.36, 0.58, 1.0),
  silver: new THREE.Color('#A9ADB3'),
};

/* ------------------------------------------------------------------ shell */

const shellVertex = /* glsl */ `
  attribute vec3 aDir;
  attribute vec3 aTan;
  attribute vec3 aSize;   // length, width, radius
  attribute vec4 aSeed;   // phase, rate, heat, assemble delay
  attribute float aKind;  // 0 crimson, 1 royal
  uniform float uTime;
  uniform float uAssemble;
  uniform float uScanY;
  varying vec2 vUv;
  varying float vLight;
  varying float vHeat;
  varying float vKind;
  varying float vFacing;
  void main() {
    float a = clamp((uAssemble - aSeed.w * 0.62) / 0.38, 0.0, 1.0);
    a = 1.0 - pow(1.0 - a, 3.0);
    float swirl = (1.0 - a) * (1.4 + aSeed.y * 1.6);
    float cs = cos(swirl);
    float sn = sin(swirl);
    vec3 n = normalize(vec3(aDir.x * cs - aDir.z * sn, aDir.y, aDir.x * sn + aDir.z * cs));
    vec3 t = normalize(vec3(aTan.x * cs - aTan.z * sn, aTan.y, aTan.x * sn + aTan.z * cs));
    vec3 b = normalize(cross(n, t));
    float radius = aSize.z * (1.0 + (1.0 - a) * (0.8 + aSeed.x * 2.2));
    vec3 pos = n * radius + t * (position.x * aSize.x) + b * (position.y * aSize.y);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vec3 nView = normalize(mat3(modelViewMatrix) * n);
    vFacing = 0.16 + 0.84 * smoothstep(-0.6, 0.9, nView.z);
    float flick = 0.62 + 0.38 * sin(uTime * (0.7 + aSeed.y * 4.6) + aSeed.x * 61.0);
    float drop = step(0.1, fract(aSeed.x * 7.31 + uTime * (0.025 + aSeed.y * 0.08)));
    float band = exp(-pow((n.y - uScanY) * 4.2, 2.0));
    vLight = (0.3 + 0.7 * flick * drop) * (0.78 + 0.95 * band) * a;
    vHeat = aSeed.z;
    vKind = aKind;
    vUv = position.xy + 0.5;
    gl_Position = projectionMatrix * mv;
  }
`;

const shellFragment = /* glsl */ `
  uniform vec3 uCrimson;
  uniform vec3 uCrimsonHot;
  uniform vec3 uRoyal;
  uniform vec3 uRoyalHot;
  uniform vec3 uWhite;
  uniform float uGain;
  varying vec2 vUv;
  varying float vLight;
  varying float vHeat;
  varying float vKind;
  varying float vFacing;
  void main() {
    float across = 1.0 - abs(vUv.y - 0.5) * 2.0;
    float along = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x);
    float mask = smoothstep(0.0, 0.5, across) * along;
    float heat = clamp(vHeat * (0.55 + 0.45 * vLight), 0.0, 1.0);
    vec3 base = mix(uCrimson, uRoyal, vKind);
    vec3 hot = mix(uCrimsonHot, uRoyalHot, vKind);
    vec3 color = mix(base, hot, smoothstep(0.3, 0.85, heat));
    color = mix(color, uWhite, smoothstep(0.9, 1.0, heat) * 0.6);
    float intensity = vLight * vFacing * uGain * (0.7 + heat * 1.2);
    gl_FragColor = vec4(color * intensity, mask);
  }
`;

function sphericalDirection(lat, lon, out) {
  const c = Math.cos(lat);
  return out.set(c * Math.cos(lon), Math.sin(lat), c * Math.sin(lon));
}

function buildShell({ count, seed, radius, spread = 0.02, blueShare = 0.06, clusters = 11, dash = 1 }) {
  const random = seeded(seed);
  const dir = new Float32Array(count * 3);
  const tan = new Float32Array(count * 3);
  const size = new Float32Array(count * 3);
  const seeds = new Float32Array(count * 4);
  const kind = new Float32Array(count);
  const centers = Array.from({ length: clusters }, () => ({
    lat: Math.asin(random() * 2 - 1) * 0.92,
    lon: random() * TAU,
    spread: 0.14 + random() * 0.34,
  }));
  const d = new THREE.Vector3();
  const t = new THREE.Vector3();
  let index = 0;

  const heat = () => {
    const h = random();
    if (h > 0.972) return 0.96 + random() * 0.04;
    if (h > 0.82) return 0.55 + random() * 0.35;
    return random() * 0.42;
  };
  const push = (lat, lon, alongLatitude, length, width) => {
    if (index >= count) return false;
    sphericalDirection(lat, lon, d);
    if (alongLatitude) t.set(-Math.sin(lon), 0, Math.cos(lon));
    else t.set(-Math.sin(lat) * Math.cos(lon), Math.cos(lat), -Math.sin(lat) * Math.sin(lon));
    dir.set([d.x, d.y, d.z], index * 3);
    tan.set([t.x, t.y, t.z], index * 3);
    size.set([length, width, radius + (random() - 0.5) * spread], index * 3);
    seeds.set([random(), random(), heat(), (lat / Math.PI + 0.5) * 0.55 + random() * 0.45], index * 4);
    kind[index] = random() < blueShare ? 1 : 0;
    index += 1;
    return true;
  };

  while (index < count) {
    let lat;
    let lon;
    if (random() < 0.64) {
      const center = centers[Math.floor(random() * clusters)];
      lat = THREE.MathUtils.clamp(center.lat + gauss(random) * center.spread, -1.48, 1.48);
      lon = center.lon + gauss(random) * center.spread * 1.7;
    } else {
      lat = Math.asin(random() * 2 - 1);
      lon = random() * TAU;
    }
    const mode = random();
    const cosLat = Math.max(Math.cos(lat), 0.2);
    if (mode < 0.5) {
      // A run of dashes along a latitude track: the circuitry of the shell.
      let run = 2 + Math.floor(random() * 10);
      let at = lon;
      while (run > 0) {
        run -= 1;
        const length = (0.012 + random() * 0.075) * dash;
        const gap = 0.004 + random() * 0.024;
        if (!push(lat, at + length / cosLat / 2, true, length, 0.0042 + random() * 0.0046)) break;
        at += (length + gap) / cosLat;
      }
    } else if (mode < 0.7) {
      const run = 1 + Math.floor(random() * 4);
      for (let k = 0; k < run; k += 1) push(lat + k * 0.02, lon, false, (0.01 + random() * 0.036) * dash, 0.0038 + random() * 0.003);
    } else if (mode < 0.9) {
      const bars = 2 + Math.floor(random() * 4);
      const length = (0.018 + random() * 0.05) * dash;
      for (let k = 0; k < bars; k += 1) push(lat + k * 0.012, lon, true, length * (0.55 + random() * 0.55), 0.0044);
    } else {
      const side = 0.006 + random() * 0.013;
      push(lat, lon, random() < 0.5, side, side * 0.8);
    }
  }

  const quad = new THREE.PlaneGeometry(1, 1);
  const geometry = new THREE.InstancedBufferGeometry();
  geometry.index = quad.index;
  geometry.setAttribute('position', quad.getAttribute('position'));
  geometry.setAttribute('aDir', new THREE.InstancedBufferAttribute(dir, 3));
  geometry.setAttribute('aTan', new THREE.InstancedBufferAttribute(tan, 3));
  geometry.setAttribute('aSize', new THREE.InstancedBufferAttribute(size, 3));
  geometry.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 4));
  geometry.setAttribute('aKind', new THREE.InstancedBufferAttribute(kind, 1));
  geometry.instanceCount = count;
  return geometry;
}

function shellMaterial(gain) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uAssemble: { value: 1 },
      uScanY: { value: 0 },
      uGain: { value: gain },
      uCrimson: { value: COLOR.crimson },
      uCrimsonHot: { value: COLOR.crimsonHot },
      uRoyal: { value: COLOR.royal },
      uRoyalHot: { value: COLOR.royalHot },
      uWhite: { value: COLOR.white },
    },
    vertexShader: shellVertex,
    fragmentShader: shellFragment,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
}

/* ------------------------------------------------------------------ rings */

const ringVertex = /* glsl */ `
  varying vec2 vPos;
  varying float vFacing;
  void main() {
    vPos = position.xy;
    vec3 normalView = normalize(normalMatrix * vec3(0.0, 0.0, 1.0));
    vFacing = 0.4 + 0.6 * abs(normalView.z);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ringFragment = /* glsl */ `
  uniform float uTime;
  uniform float uInner;
  uniform float uOuter;
  uniform float uCells;
  uniform float uFlow;
  uniform float uPattern;
  uniform float uGain;
  uniform float uReveal;
  uniform float uSeed;
  uniform vec3 uColor;
  uniform vec3 uHot;
  varying vec2 vPos;
  varying float vFacing;
  float hash(float n) { return fract(sin(n * 12.9898 + uSeed) * 43758.5453); }
  void main() {
    float u = atan(vPos.y, vPos.x) / 6.28318530718 + 0.5;
    float w = (length(vPos) - uInner) / (uOuter - uInner);
    float intensity = 0.0;
    float heat = 0.0;
    if (uPattern < 0.5) {
      float x = u * uCells + uTime * uFlow;
      float cell = floor(x);
      float f = fract(x);
      float on = step(0.28, hash(cell));
      float dash = smoothstep(0.0, 0.04, f) * (1.0 - smoothstep(0.82, 0.9, f));
      float lanes = smoothstep(0.02, 0.12, w) * (1.0 - smoothstep(0.88, 0.98, w));
      float stripe = 0.55 + 0.45 * step(0.45, fract(w * 3.0 + hash(cell + 4.1) * 0.6));
      intensity = on * dash * lanes * stripe;
      heat = step(0.84, hash(cell + 9.7));
    } else if (uPattern < 1.5) {
      float x = u * uCells;
      float f = fract(x);
      float tick = 1.0 - smoothstep(0.08, 0.2, f);
      float major = 1.0 - step(0.5, mod(floor(x), 8.0));
      float reach = step(1.0 - mix(0.42, 1.0, major), w);
      float spine = 1.0 - smoothstep(0.06, 0.16, w);
      intensity = max(tick * reach, spine * 0.7);
      heat = major * 0.5;
    } else {
      float x = u * uCells + uTime * uFlow;
      float f = fract(x) - 0.5;
      float arc = 6.28318 * (uInner + uOuter) * 0.5 / uCells;
      vec2 local = vec2(f * arc, (w - 0.5) * (uOuter - uInner));
      intensity = 1.0 - smoothstep(0.28, 0.5, length(local) / (uOuter - uInner));
      heat = step(0.9, hash(floor(x)));
    }
    float reveal = 1.0 - step(uReveal, u);
    vec3 color = mix(uColor, uHot, heat);
    gl_FragColor = vec4(color * intensity * uGain * vFacing * reveal, intensity);
  }
`;

function makeRing({ inner, outer, cells, flow = 0, pattern = 0, color, hot, gain, seed = 1 }) {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uInner: { value: inner },
      uOuter: { value: outer },
      uCells: { value: cells },
      uFlow: { value: flow },
      uPattern: { value: pattern },
      uGain: { value: gain },
      uReveal: { value: 1 },
      uSeed: { value: seed },
      uColor: { value: color },
      uHot: { value: hot },
    },
    vertexShader: ringVertex,
    fragmentShader: ringFragment,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  return new THREE.Mesh(new THREE.RingGeometry(inner, outer, 360, 1), material);
}

/* -------------------------------------------------------------- textures */

function glowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.14, 'rgba(255,255,255,.6)');
  gradient.addColorStop(0.38, 'rgba(255,255,255,.15)');
  gradient.addColorStop(0.7, 'rgba(255,255,255,.03)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function irisTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  const c = size / 2;
  context.strokeStyle = 'rgba(255,255,255,0.95)';
  context.lineWidth = 3;
  context.beginPath();
  context.arc(c, c, 86, 0, TAU);
  context.stroke();
  context.lineWidth = 1.5;
  context.setLineDash([10, 7]);
  context.beginPath();
  context.arc(c, c, 62, 0, TAU);
  context.stroke();
  context.setLineDash([]);
  context.lineWidth = 2;
  for (let tick = 0; tick < 12; tick += 1) {
    const angle = (tick / 12) * TAU;
    const long = tick % 3 === 0;
    context.beginPath();
    context.moveTo(c + Math.cos(angle) * 96, c + Math.sin(angle) * 96);
    context.lineTo(c + Math.cos(angle) * (long ? 118 : 106), c + Math.sin(angle) * (long ? 118 : 106));
    context.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/* ---------------------------------------------------------------- points */

const pointVertex = /* glsl */ `
  attribute vec3 aDir;
  attribute vec4 aData;   // speed, phase, life, size
  attribute float aKind;
  uniform float uTime;
  uniform float uDpr;
  uniform float uAmount;
  uniform float uMode;    // 0 sparks, 1 motes
  varying float vAlpha;
  varying float vKind;
  void main() {
    vec3 p;
    float alpha;
    if (uMode < 0.5) {
      float t = mod(uTime + aData.y * aData.z, aData.z);
      float k = t / aData.z;
      p = aDir * (0.97 + k * aData.x);
      alpha = (1.0 - k) * (1.0 - k) * smoothstep(0.0, 0.08, k);
    } else {
      float angle = uTime * aData.x + aData.y * 6.2831;
      float c = cos(angle);
      float s = sin(angle);
      p = vec3(aDir.x * c - aDir.z * s, aDir.y + sin(uTime * 0.3 + aData.y * 9.0) * 0.02, aDir.x * s + aDir.z * c);
      alpha = 0.35 + 0.65 * pow(0.5 + 0.5 * sin(uTime * 1.3 + aData.y * 40.0), 3.0);
    }
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aData.w * uDpr * (6.0 / -mv.z);
    vAlpha = alpha * uAmount;
    vKind = aKind;
    gl_Position = projectionMatrix * mv;
  }
`;

const pointFragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uGain;
  varying float vAlpha;
  varying float vKind;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    if (r > 1.0) discard;
    float core = pow(1.0 - r, 2.2);
    gl_FragColor = vec4(mix(uColorA, uColorB, vKind) * core * uGain * vAlpha, core);
  }
`;

function makePoints({ count, seed, mode, colorA, colorB, gain, blueShare }) {
  const random = seeded(seed);
  const dir = new Float32Array(count * 3);
  const data = new Float32Array(count * 4);
  const kind = new Float32Array(count);
  const v = new THREE.Vector3();
  for (let index = 0; index < count; index += 1) {
    v.set(gauss(random), gauss(random), gauss(random)).normalize();
    if (mode === 1) v.multiplyScalar(0.12 + Math.cbrt(random()) * 0.78);
    dir.set([v.x, v.y, v.z], index * 3);
    data.set(mode === 0
      ? [0.35 + random() * 1.4, random(), 1.2 + random() * 2.4, 1.2 + random() * 2.4]
      : [(random() - 0.5) * 0.25, random(), 1, 0.8 + random() * 1.6], index * 4);
    kind[index] = random() < blueShare ? 1 : 0;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  geometry.setAttribute('aDir', new THREE.BufferAttribute(dir, 3));
  geometry.setAttribute('aData', new THREE.BufferAttribute(data, 4));
  geometry.setAttribute('aKind', new THREE.BufferAttribute(kind, 1));
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uDpr: { value: 1 },
      uAmount: { value: 1 },
      uMode: { value: mode },
      uColorA: { value: colorA },
      uColorB: { value: colorB },
      uGain: { value: gain },
    },
    vertexShader: pointVertex,
    fragmentShader: pointFragment,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  return points;
}

/* ------------------------------------------------------------- filaments */

// Tendril angles (screen space, 0 = right, clockwise positive) biased to the
// horizontal, like the reference frame: most energy leaves left and right.
const TENDRIL_ANGLES = [-10, 14, 169, 194, -36, 33, 147, 219, 64, 118, 244, 297, -58, 236];
const TENDRIL_POINTS = 64;
const STRIKE_POINTS = 44;
const BRANCH_POINTS = 16;

function makeLines(maxSegments, width) {
  const geometry = new LineSegmentsGeometry();
  geometry.setPositions(new Float32Array(maxSegments * 6));
  geometry.setColors(new Float32Array(maxSegments * 6));
  geometry.instanceCount = 0;
  const material = new LineMaterial({
    color: 0xffffff,
    linewidth: width,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    worldUnits: false,
  });
  material.blending = THREE.AdditiveBlending;
  const lines = new LineSegments2(geometry, material);
  lines.frustumCulled = false;
  return {
    lines,
    geometry,
    material,
    positions: geometry.attributes.instanceStart.data,
    colors: geometry.attributes.instanceColorStart.data,
    max: maxSegments,
  };
}

// Liang-Barsky: does the segment (x0,y0)-(x1,y1) cross the rectangle?
function segmentCrosses(x0, y0, x1, y1, box) {
  let t0 = 0;
  let t1 = 1;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const p = [-dx, dx, -dy, dy];
  const q = [x0 - box.left, box.right - x0, y0 - box.top, box.bottom - y0];
  for (let i = 0; i < 4; i += 1) {
    if (p[i] === 0) {
      if (q[i] < 0) return false;
    } else {
      const t = q[i] / p[i];
      if (p[i] < 0) {
        if (t > t1) return false;
        if (t > t0) t0 = t;
      } else {
        if (t < t0) return false;
        if (t < t1) t1 = t;
      }
    }
  }
  return true;
}

function cubic(p0, p1, p2, p3, t, out) {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return out.set(
    p0.x * a + p1.x * b + p2.x * c + p3.x * d,
    p0.y * a + p1.y * b + p2.y * c + p3.y * d,
    p0.z * a + p1.z * b + p2.z * c + p3.z * d,
  );
}

/* ----------------------------------------------------------------- scene */

export function createCoreScene(host, options = {}) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, stencil: false, powerPreference: 'high-performance' });
  } catch {
    return null;
  }
  if (!renderer.getContext()) return null;
  renderer.setClearColor(0x000000, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.setAttribute('tabindex', '-1');
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);
  camera.position.set(0, 0, 8);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), 0.78, 0.42, 0.16);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const rig = new THREE.Group();
  const core = new THREE.Group();
  const shells = new THREE.Group();
  const armillary = new THREE.Group();
  rig.add(core);
  core.add(shells, armillary);
  scene.add(rig);

  /* shell layers */
  const shellMat = shellMaterial(1.1);
  const echoMat = shellMaterial(0.85);
  const outerGeometry = buildShell({ count: 5600, seed: 11, radius: 1.0, spread: 0.035 });
  const midGeometry = buildShell({ count: 3200, seed: 23, radius: 0.88, spread: 0.03, clusters: 8, blueShare: 0.1 });
  const innerGeometry = buildShell({ count: 1700, seed: 37, radius: 0.74, spread: 0.02, clusters: 6, dash: 0.8 });
  const outer = new THREE.Mesh(outerGeometry, shellMat);
  const mid = new THREE.Mesh(midGeometry, shellMat);
  const inner = new THREE.Mesh(innerGeometry, shellMat);
  [outer, mid, inner].forEach((mesh) => { mesh.frustumCulled = false; shells.add(mesh); });
  mid.rotation.set(0.5, 0.2, 0.35);
  inner.rotation.set(-0.6, 0.9, 0.1);

  /* armillary rings */
  const rings = [
    makeRing({ inner: 0.56, outer: 0.64, cells: 46, flow: 0.9, pattern: 0, color: COLOR.crimson, hot: COLOR.crimsonHot, gain: 2.6, seed: 3 }),
    makeRing({ inner: 0.69, outer: 0.72, cells: 144, pattern: 1, color: COLOR.silver, hot: COLOR.white, gain: 0.5, seed: 5 }),
    makeRing({ inner: 0.43, outer: 0.47, cells: 60, flow: -1.4, pattern: 2, color: COLOR.royal, hot: COLOR.royalHot, gain: 3.2, seed: 7 }),
    makeRing({ inner: 0.8, outer: 0.83, cells: 70, flow: 0.35, pattern: 0, color: COLOR.royal, hot: COLOR.royalHot, gain: 2.2, seed: 9 }),
  ];
  const ringTilts = [[1.18, 0.28, 0], [-0.52, 0.82, 0.1], [0.32, -1.1, 0.4], [1.57, 0.06, 0]];
  const ringSpins = [0.22, -0.1, 0.34, 0.05];
  rings.forEach((ring, index) => {
    const holder = new THREE.Group();
    holder.rotation.set(...ringTilts[index]);
    holder.add(ring);
    armillary.add(holder);
  });

  /* nucleus */
  const glowMap = glowTexture();
  const irisMap = irisTexture();
  const sprite = (map, color, size, opacity) => {
    const material = new THREE.SpriteMaterial({ map, color, opacity, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending });
    const item = new THREE.Sprite(material);
    item.scale.set(size, size, 1);
    core.add(item);
    return item;
  };
  const haze = sprite(glowMap, new THREE.Color(0.004, 0.03, 0.2), 3.6, 0.05);
  const halo = sprite(glowMap, new THREE.Color(0.4, 0.004, 0.02), 2.3, 0.2);
  const aura = sprite(glowMap, new THREE.Color(0.95, 0.08, 0.14), 0.95, 0.42);
  const nucleus = sprite(glowMap, new THREE.Color(1.5, 1.4, 1.5), 0.36, 1);
  const iris = sprite(irisMap, new THREE.Color(1.25, 1.2, 1.4), 0.26, 0.9);

  /* particles */
  const sparks = makePoints({ count: 640, seed: 51, mode: 0, colorA: COLOR.crimsonHot, colorB: COLOR.royalHot, gain: 2.2, blueShare: 0.22 });
  const motes = makePoints({ count: 420, seed: 67, mode: 1, colorA: COLOR.crimsonHot, colorB: COLOR.white, gain: 1.4, blueShare: 0.15 });
  core.add(sparks, motes);

  /* decoy echoes: the same signature, repeated */
  const echoRoot = new THREE.Group();
  scene.add(echoRoot);
  const ECHOES = [
    { x: -1.75, y: 1.2, z: -0.3, s: 0.62, spin: 0.9 },
    { x: 1.95, y: 0.95, z: -0.5, s: 0.56, spin: -0.7 },
    { x: 0.55, y: -1.95, z: -0.2, s: 0.6, spin: 0.6 },
  ];
  const echoes = ECHOES.map((config) => {
    const group = new THREE.Group();
    const a = new THREE.Mesh(outerGeometry, echoMat);
    const b = new THREE.Mesh(midGeometry, echoMat);
    a.frustumCulled = false;
    b.frustumCulled = false;
    b.rotation.set(0.5, 0.2, 0.35);
    group.add(a, b);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowMap, color: new THREE.Color(0.8, 0.08, 0.16), opacity: 0.35, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending }));
    glow.scale.set(1.6, 1.6, 1);
    group.add(glow);
    group.visible = false;
    echoRoot.add(group);
    return { group, glow, ...config };
  });

  /* network web behind the core */
  const webRandom = seeded(97);
  const webNodes = [];
  for (let index = 0; index < 150; index += 1) {
    const angle = webRandom() * TAU;
    const radius = 1.3 + Math.pow(webRandom(), 1.25) * 2.9;
    webNodes.push({
      base: new THREE.Vector3(Math.cos(angle) * radius * 1.3, Math.sin(angle) * radius * 0.9, -0.5 - webRandom() * 1.8),
      phase: webRandom() * TAU,
      bright: webRandom(),
    });
  }
  const webEdges = [];
  const seen = new Set();
  webNodes.forEach((node, index) => {
    const nearest = webNodes
      .map((other, j) => ({ j, d: other.base.distanceToSquared(node.base) }))
      .filter((item) => item.j !== index)
      .sort((a, b) => a.d - b.d)
      .slice(0, 3);
    nearest.forEach(({ j, d }) => {
      const key = index < j ? `${index}-${j}` : `${j}-${index}`;
      if (d < 1.1 && !seen.has(key)) {
        seen.add(key);
        webEdges.push([index, j, webRandom()]);
      }
    });
  });
  const webPositions = new Float32Array(webEdges.length * 6);
  const webColors = new Float32Array(webEdges.length * 6);
  const webGeometry = new THREE.BufferGeometry();
  webGeometry.setAttribute('position', new THREE.BufferAttribute(webPositions, 3).setUsage(THREE.DynamicDrawUsage));
  webGeometry.setAttribute('color', new THREE.BufferAttribute(webColors, 3));
  const webMaterial = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.5, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending });
  const web = new THREE.LineSegments(webGeometry, webMaterial);
  web.frustumCulled = false;
  webEdges.forEach(([a, , bright], index) => {
    const reach = webNodes[a].base.length();
    const level = (bright > 0.92 ? 1.3 : 0.2 + bright * 0.35) * Math.max(0.15, 1 - (reach - 1.3) / 3.4);
    const color = [COLOR.royal.r * level * 2.4 + 0.004, COLOR.royal.g * level * 2.4 + 0.012, COLOR.royal.b * level * 2.4];
    webColors.set([...color, ...color], index * 6);
  });
  scene.add(web);

  /* tendrils and lightning */
  const tendrilLines = makeLines(TENDRIL_ANGLES.length * (TENDRIL_POINTS - 1), 1.05);
  const strikeLines = makeLines(TENDRIL_ANGLES.length * (STRIKE_POINTS + BRANCH_POINTS * 2), 1.25);
  scene.add(tendrilLines.lines, strikeLines.lines);
  const tendrilRandom = seeded(131);
  const tendrils = TENDRIL_ANGLES.map((degrees, index) => ({
    angle: THREE.MathUtils.degToRad(degrees),
    crimson: index === 4 || index === 9,
    phase: tendrilRandom() * TAU,
    amp: 0.035 + tendrilRandom() * 0.1,
    lift: (tendrilRandom() - 0.5) * 0.9,
    depth: -0.4 - tendrilRandom() * 1.4,
    speed: 0.14 + tendrilRandom() * 0.18,
    bend: (tendrilRandom() - 0.5) * 0.5,
    start: new THREE.Vector3(),
    end: new THREE.Vector3(),
    anchorEnd: new THREE.Vector3(),
    anchorWeight: 0,
    anchor: -1,
    clear: 1,
    grow: 1,
    points: Array.from({ length: TENDRIL_POINTS }, () => new THREE.Vector3()),
    strike: { life: 0, age: 0, jitter: 0, level: 0, span: 1, crimson: true, points: [], branches: [] },
  }));
  // Lightning is scheduled for the whole core, not per filament: one strike
  // at a time, every few seconds, mostly in the brand crimson.
  const lightning = { next: 1.6, sinceBlue: 1 };

  /* state */
  const size = { width: 1, height: 1, dpr: 1 };
  let dead = false;
  let lost = false;
  const tmpA = new THREE.Vector3();
  const tmpB = new THREE.Vector3();
  const tmpC = new THREE.Vector3();
  const tmpD = new THREE.Vector3();
  const ndc = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const zAxis = new THREE.Vector3(0, 0, 1);
  const random = seeded(733);

  function frame(f) {
    const { width, height } = size;
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
    const diameter = Math.max(40, f.d);
    const distance = Math.sqrt(1 + (height / (diameter * Math.tan(halfFov))) ** 2);
    camera.position.set(0, 0, distance);
    camera.lookAt(0, 0, 0);
    camera.setViewOffset(width, height, -(f.x - width / 2), -(f.y - height / 2), width, height);
    camera.updateMatrixWorld();
  }

  function screenToWorld(x, y, z, out) {
    ndc.set((x / size.width) * 2 - 1, -(y / size.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    plane.constant = -z;
    return raycaster.ray.intersectPlane(plane, out) || out.set(0, 0, z);
  }

  function edgePoint(f, angle, margin, out) {
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    const left = -margin;
    const right = size.width + margin;
    const top = -margin;
    const bottom = size.height + margin;
    const tx = dx > 0 ? (right - f.x) / dx : dx < 0 ? (left - f.x) / dx : Infinity;
    const ty = dy > 0 ? (bottom - f.y) / dy : dy < 0 ? (top - f.y) / dy : Infinity;
    const t = Math.min(tx, ty);
    return out.set(f.x + dx * t, f.y + dy * t, 0);
  }

  function writeSegment(buffer, index, a, b) {
    buffer.array.set([a.x, a.y, a.z, b.x, b.y, b.z], index * 6);
  }

  function writeColor(buffer, index, r, g, b, r2, g2, b2) {
    buffer.array.set([r, g, b, r2, g2, b2], index * 6);
  }

  function jaggedPath(source, count, reach, amplitude, out) {
    out.length = 0;
    const last = Math.max(1, Math.floor((source.length - 1) * reach));
    for (let index = 0; index < count; index += 1) {
      const s = index / (count - 1);
      const position = s * last;
      const lower = Math.floor(position);
      const upper = Math.min(lower + 1, source.length - 1);
      const point = new THREE.Vector3().lerpVectors(source[lower], source[upper], position - lower);
      out.push(point);
    }
    // Midpoint-style jitter: large wander plus fine crackle, pinned at the root.
    for (let index = 1; index < out.length; index += 1) {
      const s = index / (out.length - 1);
      const envelope = Math.sin(Math.min(1, s * 1.15) * Math.PI * 0.5);
      out[index].x += (random() - 0.5) * amplitude * envelope;
      out[index].y += (random() - 0.5) * amplitude * envelope;
      out[index].z += (random() - 0.5) * amplitude * 0.6 * envelope;
    }
    return out;
  }

  function strikeTendril(tendril, reach) {
    const strike = tendril.strike;
    // A strike runs out from the core along part of the filament (its span),
    // not all the way to the screen edge; the crackle is sized to that part.
    const length = tendril.start.distanceTo(tendril.end) * Math.min(1, reach) * strike.span;
    const amplitude = 0.04 + length * 0.022;
    // tendril.points already hold only the drawn part of the filament.
    jaggedPath(tendril.points, STRIKE_POINTS, strike.span, amplitude, strike.points);
    strike.branches.length = 0;
    const branchCount = random() < 0.5 ? 1 : 0;
    for (let branch = 0; branch < branchCount; branch += 1) {
      const at = Math.floor(STRIKE_POINTS * (0.18 + random() * 0.5));
      const origin = strike.points[Math.min(at, strike.points.length - 1)];
      const next = strike.points[Math.min(at + 2, strike.points.length - 1)];
      const direction = tmpA.subVectors(next, origin).normalize();
      direction.applyAxisAngle(zAxis, (random() < 0.5 ? -1 : 1) * (0.3 + random() * 0.4));
      const branchLength = length * (0.08 + random() * 0.12);
      const points = [];
      for (let index = 0; index < BRANCH_POINTS; index += 1) {
        const s = index / (BRANCH_POINTS - 1);
        const point = origin.clone().addScaledVector(direction, branchLength * s);
        if (index > 0) {
          point.x += (random() - 0.5) * amplitude * 0.8 * s;
          point.y += (random() - 0.5) * amplitude * 0.8 * s;
        }
        points.push(point);
      }
      strike.branches.push(points);
    }
  }

  function updateFilaments(state, f, dt) {
    const { time } = state;
    const reachAll = THREE.MathUtils.clamp(state.grow ?? 1, 0, 1);
    const tendrilAmount = state.tendril;
    const retract = THREE.MathUtils.lerp(0.18, 1, tendrilAmount);
    const anchors = state.targets || [];
    let segment = 0;
    let strikeSegment = 0;

    // Each content anchor claims the free tendril already pointing closest to it.
    tendrils.forEach((tendril) => { tendril.anchor = -1; });
    anchors.forEach((anchor, anchorIndex) => {
      const wanted = Math.atan2(anchor.y - f.y, anchor.x - f.x);
      let best = null;
      let bestGap = Infinity;
      tendrils.forEach((tendril) => {
        if (tendril.anchor !== -1) return;
        const gap = Math.abs(Math.atan2(Math.sin(tendril.angle - wanted), Math.cos(tendril.angle - wanted)));
        if (gap < bestGap) {
          bestGap = gap;
          best = tendril;
        }
      });
      if (best) best.anchor = anchorIndex;
    });

    tendrils.forEach((tendril, index) => {
      // Screen-space target: an edge of the viewport, or a content anchor.
      const angle = tendril.angle + Math.sin(time * 0.05 + tendril.phase) * 0.07;
      edgePoint(f, angle, 60, tmpA);
      const tipX = tmpA.x;
      const tipY = tmpA.y;
      // A filament whose path from the core to the screen edge crosses copy on
      // screen carries neither lightning nor a bright pulse.
      const overCopy = (state.copyKeepOut || []).some((zone) => segmentCrosses(f.x, f.y, tipX, tipY, zone));
      screenToWorld(tmpA.x, tmpA.y, tendril.depth, tendril.end);
      const anchor = tendril.anchor >= 0 ? anchors[tendril.anchor] : null;
      const blend = dt > 0 ? Math.min(1, dt * 4.5) : 1;
      const targetWeight = anchor ? THREE.MathUtils.clamp(state.anchorWeight ?? 1, 0, 1) : 0;
      tendril.anchorWeight += (targetWeight - tendril.anchorWeight) * blend;
      if (anchor) screenToWorld(anchor.x, anchor.y, 0, tendril.anchorEnd);
      // A tethered filament grows from the core straight to its copy and
      // retracts the same way; it never sweeps in from the screen edge.
      const tethered = tendril.anchorWeight > 0.02;
      if (tethered) tendril.end.copy(tendril.anchorEnd);

      // Keep free filaments out of the part of the screen that carries copy.
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);
      const side = state.side;
      // Judged by direction even while tethered, so a released tether is
      // already pulled back and cannot re-extend toward the copy.
      const controlHit = (state.keepOut || []).some((zone) => segmentCrosses(f.x, f.y, tmpA.x, tmpA.y, zone));
      const facesCopy = controlHit || (side === 'left' && dx < -0.2) || (side === 'right' && dx > 0.2)
        || (side === 'bottom' && dy > 0.12) || (side === 'band' && (Math.abs(dy) < 0.42 || dy > 0.45))
        || (side === 'level' && Math.abs(dy) > 0.45);
      tendril.clear += ((facesCopy ? 0.16 : 1) - tendril.clear) * (dt > 0 ? Math.min(1, dt * 6) : 1);

      const worldAngle = tethered ? Math.atan2(tendril.anchorEnd.y, tendril.anchorEnd.x) : -angle;
      const lift = tethered ? 0 : tendril.lift;
      tendril.start.set(Math.cos(worldAngle) * 0.28, Math.sin(worldAngle) * 0.28 + lift * 0.2, 0.12);
      const length = tendril.start.distanceTo(tendril.end);
      tmpB.set(Math.cos(worldAngle), Math.sin(worldAngle), 0).multiplyScalar(length * 0.34).add(tendril.start);
      tmpB.y += lift * 0.6;
      tmpC.subVectors(tendril.start, tendril.end).normalize().multiplyScalar(length * 0.3).add(tendril.end);
      tmpD.subVectors(tendril.end, tendril.start).cross(zAxis).normalize();
      tmpC.addScaledVector(tmpD, tendril.bend * (1 - tendril.anchorWeight * 0.8));

      const freeTarget = retract * tendril.clear;
      if (tethered) tendril.grow = tendril.anchorWeight;
      else tendril.grow += (freeTarget - tendril.grow) * (dt > 0 ? Math.min(1, dt * (freeTarget < tendril.grow ? 8 : 2.4)) : 1);
      const reach = reachAll * tendril.grow;
      const perpendicular = tmpD;
      for (let point = 0; point < TENDRIL_POINTS; point += 1) {
        const s = (point / (TENDRIL_POINTS - 1)) * reach;
        cubic(tendril.start, tmpB, tmpC, tendril.end, s, tendril.points[point]);
        const envelope = Math.sin(Math.PI * Math.min(1, s)) * (1 - tendril.anchorWeight * 0.7);
        const wave = Math.sin(time * (0.55 + tendril.speed) + s * 7.5 + tendril.phase) * 0.62
          + Math.sin(time * (1.1 + tendril.speed) - s * 13 + tendril.phase * 2.1) * 0.38;
        tendril.points[point].addScaledVector(perpendicular, wave * tendril.amp * envelope);
        tendril.points[point].z += Math.cos(time * 0.4 + s * 5 + tendril.phase) * tendril.amp * 0.6 * envelope;
      }

      const base = tendril.crimson ? COLOR.crimson : COLOR.royal;
      const hot = tendril.crimson ? COLOR.crimsonHot : COLOR.royalHot;
      const pulseAt = (time * (0.18 + tendril.speed * 0.9) + tendril.phase / TAU) % 1;
      // Bright pulses belong to a settled chapter; they fade while scrolling.
      const settled = THREE.MathUtils.clamp(state.anchorWeight ?? 1, 0, 1);
      // No pulses where a chapter pulls its filaments in (keyed to the
      // chapter's own value so they stop the moment it is entered).
      const reachOut = THREE.MathUtils.smoothstep(Math.min(tendrilAmount, state.tendrilGoal ?? tendrilAmount), 0.15, 0.5);
      // ...and only on a filament that is itself at rest: fully tethered, or
      // free, unblocked and fully drawn. Retracting filaments carry no pulse.
      const own = tethered
        ? THREE.MathUtils.smoothstep(tendril.anchorWeight, 0.8, 1)
        : THREE.MathUtils.smoothstep(tendril.clear, 0.7, 0.95) * (1 - THREE.MathUtils.smoothstep(Math.abs(tendril.grow - freeTarget), 0.02, 0.1));
      const pulseGain = overCopy ? 0 : (0.12 + 0.88 * settled * settled) * reachOut * (state.calm ?? 1) * own;
      tendril.pulseGain = pulseGain;
      const level = (tendril.anchorWeight > 0.5 ? 0.95 : 0.3 + tendrilAmount * 0.45) * (state.heat ?? 1) * (index % 3 === 0 ? 1.35 : 0.8);
      for (let point = 0; point < TENDRIL_POINTS - 1 && segment < tendrilLines.max; point += 1) {
        const s0 = point / (TENDRIL_POINTS - 1);
        const s1 = (point + 1) / (TENDRIL_POINTS - 1);
        const fade = (s) => Math.pow(1 - s, 0.55) * (0.35 + 0.65 * Math.min(1, s * 6));
        const pulse = (s) => Math.exp(-(((s - pulseAt) * 11) ** 2));
        const c0 = level * fade(s0) * 1.35;
        const c1 = level * fade(s1) * 1.35;
        const p0 = pulse(s0) * 1.9 * pulseGain;
        const p1 = pulse(s1) * 1.9 * pulseGain;
        writeSegment(tendrilLines.positions, segment, tendril.points[point], tendril.points[point + 1]);
        writeColor(
          tendrilLines.colors,
          segment,
          base.r * c0 + hot.r * p0 * level, base.g * c0 + hot.g * p0 * level, base.b * c0 + hot.b * p0 * level,
          base.r * c1 + hot.r * p1 * level, base.g * c1 + hot.g * p1 * level, base.b * c1 + hot.b * p1 * level,
        );
        segment += 1;
      }

      // Lightning: a short-lived jagged strike that rides a free, fully drawn
      // filament pointing away from copy. Anything else cuts it at once.
      const strike = tendril.strike;
      tendril.reach = reach;
      // ...and whose path from the core to the screen edge crosses no copy on screen.
      tendril.strikeable = !tethered && tendril.clear > 0.7 && Math.abs(tendril.grow - freeTarget) < 0.04 && !overCopy;
      if (!(state.strike > 0.01) || !tendril.strikeable || state.still) strike.life = 0;
      if (strike.life > 0) {
        strike.age += dt;
        strike.jitter -= dt;
        if (strike.jitter <= 0) {
          strike.jitter = 0.05 + random() * 0.04;
          strikeTendril(tendril, reach);
        }
        const envelope = Math.max(0, 1 - strike.age / Math.max(strike.life, 0.001)) * strike.level * (0.6 + random() * 0.4);
        if (strike.age >= strike.life) strike.life = 0;
        const paths = [strike.points, ...strike.branches];
        paths.forEach((path, pathIndex) => {
          const branchScale = pathIndex === 0 ? 1 : 0.5;
          for (let point = 0; point < path.length - 1 && strikeSegment < strikeLines.max; point += 1) {
            const s = point / (path.length - 1);
            const k = envelope * branchScale * (1 - s * 0.55) * 2.3;
            writeSegment(strikeLines.positions, strikeSegment, path[point], path[point + 1]);
            const color = strike.crimson ? COLOR.crimsonHot : COLOR.royalHot;
            // A touch of white gives the strike its heat; less on crimson,
            // which would otherwise read as pink.
            const white = strike.crimson ? 0.06 : 0.15;
            const [r, g, b] = [color.r, color.g, color.b].map((channel) => (channel * (1 - white) + white) * k);
            writeColor(strikeLines.colors, strikeSegment, r, g, b, r, g, b);
            strikeSegment += 1;
          }
        });
      }
    });

    // One strike at a time for the whole core: every three to four seconds
    // where a chapter asks for full lightning, less often where it asks for less.
    if (state.strike > 0.01 && reachAll > 0.95 && !state.still) {
      lightning.next -= dt * (0.3 + state.strike * 0.7);
      if (lightning.next <= 0 && !tendrils.some((tendril) => tendril.strike.life > 0)) {
        const ready = tendrils.filter((tendril) => tendril.strikeable);
        if (ready.length) {
          const tendril = ready[Math.floor(random() * ready.length)];
          const strike = tendril.strike;
          strike.life = 0.12 + random() * 0.16;
          strike.age = 0;
          strike.jitter = 0;
          strike.level = 0.5 + random() * 0.3;
          strike.span = 0.55 + random() * 0.3;
          // Mostly crimson, whatever the filament's own colour: a royal-blue
          // strike comes after two or three crimson ones, never two in a row.
          strike.crimson = lightning.sinceBlue < 2 || (lightning.sinceBlue === 2 && random() < 0.4);
          lightning.sinceBlue = strike.crimson ? lightning.sinceBlue + 1 : 0;
          strikeTendril(tendril, tendril.reach);
          lightning.next = 2.2 + random() * 3;
        } else {
          lightning.next = 0.25;
        }
      }
    }

    tendrilLines.geometry.instanceCount = segment;
    tendrilLines.positions.needsUpdate = true;
    tendrilLines.colors.needsUpdate = true;
    strikeLines.geometry.instanceCount = strikeSegment;
    strikeLines.positions.needsUpdate = true;
    strikeLines.colors.needsUpdate = true;
  }

  function updateWeb(state) {
    const t = state.time;
    webEdges.forEach(([a, b], index) => {
      const na = webNodes[a];
      const nb = webNodes[b];
      tmpA.copy(na.base);
      tmpA.x += Math.sin(t * 0.21 + na.phase) * 0.08;
      tmpA.y += Math.cos(t * 0.17 + na.phase) * 0.08;
      tmpB.copy(nb.base);
      tmpB.x += Math.sin(t * 0.21 + nb.phase) * 0.08;
      tmpB.y += Math.cos(t * 0.17 + nb.phase) * 0.08;
      webPositions.set([tmpA.x, tmpA.y, tmpA.z, tmpB.x, tmpB.y, tmpB.z], index * 6);
    });
    webGeometry.attributes.position.needsUpdate = true;
    webMaterial.opacity = THREE.MathUtils.clamp(state.web, 0, 1) * 0.34 * (state.heat ?? 1);
    web.rotation.z = Math.sin(t * 0.02) * 0.05;
  }

  function render(state) {
    if (dead || lost) return false;
    const f = state.frame;
    const t = state.time;
    const dt = Math.min(state.dt || 0, 0.1);
    frame(f);

    const heat = state.heat ?? 1;
    const assemble = state.assemble ?? 1;
    const echo = state.echo ?? 0;
    const pointer = state.pointer || { x: 0, y: 0 };
    rig.rotation.set(
      (state.pose?.pitch ?? 0) + pointer.y * 0.12,
      (state.pose?.yaw ?? 0) + pointer.x * 0.18,
      state.pose?.roll ?? 0,
    );
    const coreScale = 1 - echo * 0.34;
    core.scale.setScalar(coreScale * (0.96 + 0.04 * Math.sin(t * 0.8)));

    const spin = state.spin ?? 1;
    shells.rotation.y = t * 0.06 * spin;
    outer.rotation.x = Math.sin(t * 0.05) * 0.12;
    mid.rotation.y = 0.2 - t * 0.085 * spin;
    inner.rotation.z = 0.1 + t * 0.11 * spin;
    rings.forEach((ring, index) => {
      ring.rotation.z = t * ringSpins[index] * spin;
      ring.material.uniforms.uTime.value = t;
      ring.material.uniforms.uReveal.value = THREE.MathUtils.clamp(assemble * 1.4 - index * 0.12, 0, 1);
      ring.material.uniforms.uGain.value = [2.6, 0.5, 3.2, 2.2][index] * heat;
    });
    armillary.rotation.y = t * 0.03 * spin;

    const scanY = Math.sin(t * 0.33) * 0.95;
    [shellMat, echoMat].forEach((material) => {
      material.uniforms.uTime.value = t;
      material.uniforms.uAssemble.value = assemble;
      material.uniforms.uScanY.value = scanY;
    });
    shellMat.uniforms.uGain.value = 1.1 * heat;
    echoMat.uniforms.uGain.value = 0.85 * heat * Math.min(1, echo * 1.4);

    const breathe = 1 + Math.sin(t * 1.7) * 0.05 + Math.sin(t * 5.3) * 0.015;
    nucleus.scale.setScalar(0.36 * breathe * (0.35 + 0.65 * heat));
    nucleus.material.opacity = Math.min(1, heat * 1.1);
    aura.material.opacity = 0.42 * heat;
    halo.material.opacity = 0.2 * heat;
    haze.material.opacity = 0.05 * heat * (1 - echo * 0.5);
    iris.material.rotation = -t * 0.4;
    iris.material.opacity = 0.9 * heat;

    sparks.material.uniforms.uTime.value = t;
    sparks.material.uniforms.uAmount.value = (state.sparks ?? 1) * heat * assemble;
    motes.material.uniforms.uTime.value = t;
    motes.material.uniforms.uAmount.value = heat;
    sparks.material.uniforms.uDpr.value = size.dpr;
    motes.material.uniforms.uDpr.value = size.dpr;

    // Decoys emerge from the core and settle around it.
    echoes.forEach((item, index) => {
      const k = THREE.MathUtils.clamp(echo * 1.25 - index * 0.12, 0, 1);
      const eased = 1 - Math.pow(1 - k, 3);
      item.group.visible = eased > 0.002;
      item.group.position.set(item.x * eased * coreScale, item.y * eased * coreScale, item.z * eased);
      item.group.scale.setScalar(item.s * eased);
      item.group.rotation.set(rig.rotation.x, t * 0.06 * item.spin + index, 0.2 * index);
      item.glow.material.opacity = 0.32 * eased * heat;
    });

    updateWeb(state);
    updateFilaments(state, f, dt);
    composer.render();
    if (import.meta.env.DEV && window.__coreDebugOn) exposeGeometry(state);
    return true;
  }

  // Dev-only: publish where lightning and bright filament pulses are on screen,
  // so audits can test them against the copy exactly (see scripts/audit-lightning.mjs).
  let debugFrame = 0;
  function exposeGeometry(state) {
    // Screen coordinates, wherever the stage sits on the page.
    const origin = canvas.getBoundingClientRect();
    const project = (point) => {
      tmpA.copy(point).project(camera);
      return [origin.left + (tmpA.x + 1) / 2 * size.width, origin.top + (1 - tmpA.y) / 2 * size.height];
    };
    const strikes = [];
    tendrils.forEach((tendril) => {
      if (tendril.strike.life <= 0) return;
      [tendril.strike.points, ...tendril.strike.branches].forEach((path) => {
        for (let index = 0; index < path.length - 1; index += 1) strikes.push([...project(path[index]), ...project(path[index + 1])]);
      });
    });
    const pulses = [];
    tendrils.forEach((tendril, index) => {
      const at = (state.time * (0.18 + tendril.speed * 0.9) + tendril.phase / TAU) % 1;
      const point = tendril.points[Math.round(at * (TENDRIL_POINTS - 1))];
      // [x, y, filament, tethered, clear, grow, gain] for diagnosis.
      if (point && (tendril.pulseGain ?? 0) > 0.5) pulses.push([...project(point), index, tendril.anchorWeight > 0.02 ? 1 : 0, tendril.clear, tendril.grow, tendril.pulseGain]);
    });
    const colors = tendrils.filter((tendril) => tendril.strike.life > 0).map((tendril) => (tendril.strike.crimson ? 'crimson' : 'royal'));
    debugFrame += 1;
    window.__coreDebug = { frame: debugFrame, strikes, pulses, colors };
  }

  function resize(width, height, dpr) {
    if (dead) return;
    size.width = Math.max(1, width);
    size.height = Math.max(1, height);
    size.dpr = dpr;
    renderer.setPixelRatio(dpr);
    renderer.setSize(size.width, size.height, false);
    composer.setPixelRatio(dpr);
    composer.setSize(size.width, size.height);
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    tendrilLines.material.resolution.set(size.width, size.height);
    strikeLines.material.resolution.set(size.width, size.height);
  }

  const contextLost = (event) => {
    event.preventDefault();
    lost = true;
    options.onLost?.();
  };
  canvas.addEventListener('webglcontextlost', contextLost);

  return {
    canvas,
    resize,
    render,
    get lost() {
      return lost;
    },
    dispose() {
      if (dead) return;
      dead = true;
      canvas.removeEventListener('webglcontextlost', contextLost);
      const geometries = new Set();
      const materials = new Set();
      scene.traverse((item) => {
        if (item.geometry) geometries.add(item.geometry);
        if (item.material) materials.add(item.material);
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      glowMap.dispose();
      irisMap.dispose();
      composer.passes.forEach((pass) => pass.dispose?.());
      composer.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
