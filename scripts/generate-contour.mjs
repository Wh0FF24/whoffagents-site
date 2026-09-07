import { writeFileSync, mkdirSync } from "node:fs";

// A folded parametric surface, drawn locally for the studio's background field.
function point(u, v) {
  const x = 520 + u * 300 + v * 170;
  const y = 420 + v * 240 + Math.sin(u * 2.3 + v * 0.8) * 135;
  return `${x.toFixed(1)},${y.toFixed(1)}`;
}
const paths = [];
for (let i = 0; i <= 24; i++) {
  const v = -1 + i / 12;
  paths.push(
    `<polyline points="${Array.from({ length: 65 }, (_, j) => point(-1 + j / 32, v)).join(" ")}"/>`,
  );
}
for (let i = 0; i <= 16; i++) {
  const u = -1 + i / 8;
  paths.push(
    `<polyline points="${Array.from({ length: 49 }, (_, j) => point(u, -1 + j / 24)).join(" ")}"/>`,
  );
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 840"><defs><linearGradient id="fade" x1="0" x2="1"><stop stop-color="white" stop-opacity="0"/><stop offset=".36" stop-color="white" stop-opacity=".35"/><stop offset=".8" stop-color="white"/><stop offset="1" stop-color="white" stop-opacity=".2"/></linearGradient></defs><g fill="none" stroke="url(#fade)" stroke-width=".85">${paths.join("")}</g></svg>`;
mkdirSync("public/art", { recursive: true });
writeFileSync("public/art/contour-field.svg", svg);
