/**
 * Generates Bazaar.pk PNG icons (192, 512, maskable) for the PWA manifest.
 * Pure Node — no dependencies. Draws a rounded-square emerald gradient
 * with a white shopping-bag mark, pixel by pixel.
 */
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// ---- minimal PNG encoder ----
function crc32(buf) {
  let c;
  const table = crc32.table || (crc32.table = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })());
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function encodePng(width, height, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 6;   // color type RGBA
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // filter: none
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---- drawing helpers (all in [0,1] coordinates) ----
const lerp = (a, b, t) => a + (b - a) * t;

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function inRoundedRect(x, y, x0, y0, x1, y1, r) {
  const cx = Math.max(x0 + r, Math.min(x, x1 - r));
  const cy = Math.max(y0 + r, Math.min(y, y1 - r));
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= r * r;
}

function inCircle(x, y, cx, cy, r) {
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= r * r;
}

function inPoly(x, y, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// ---- pure-symbol mark: price-tag outline + gold charging bolt ----
// Tag ring: pill/rounded-circle with a horizontal pin notch on the left.
function inTagRing(x, y) {
  const cx = 0.5, cy = 0.52, R = 0.33;
  const dist = Math.hypot(x - cx, y - cy);
  const onRing = Math.abs(dist - R) < 0.042;
  const inRingBounds = dist >= R - 0.05 && dist <= R + 0.05;
  if (!onRing || !inRingBounds) return false;
  // keep the ring a clean circle (already handled by radius check)
  return true;
}
// Left pin notch: a horizontal tab sticking out at the tag's left edge.
function inTagPin(x, y) {
  const cy = 0.52;
  return x >= 0.045 && x <= 0.19 && Math.abs(y - cy) < 0.042;
}
// Gold lightning bolt inside the tag.
function inBolt(x, y) {
  const u = (x - 0.5) * 2.1;
  const v = (y - 0.52) * 2.1;
  return inPoly(u, v, [
    [-0.32, -0.44], [0.14, 0.05], [-0.08, 0.05], [0.32, 0.44], [-0.14, -0.05], [0.08, -0.05],
  ]);
}

function render(size, maskable) {
  const pad = maskable ? 0.18 : 0.0; // maskable safe zone ~40% inset
  const x0 = pad;
  const x1 = 1 - pad;
  const y0 = pad;
  const y1 = 1 - pad;
  const radius = maskable ? 0.5 : 0.22;
  const top = hexToRgb('#10b981');
  const bot = hexToRgb('#0d9488');
  const dark = hexToRgb('#022c22');
  const white = hexToRgb('#f8fafc');
  const goldA = hexToRgb('#fbbf24');
  const goldB = hexToRgb('#f59e0b');

  const rgba = Buffer.alloc(size * size * 4);
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const u = px / (size - 1);
      const v = py / (size - 1);
      const i = (py * size + px) * 4;

      // background gradient (rounded rect)
      let r = lerp(top[0], bot[0], (u + v) / 2);
      let g = lerp(top[1], bot[1], (u + v) / 2);
      let b = lerp(top[2], bot[2], (u + v) / 2);
      let a = 255;

      if (!inRoundedRect(u, v, x0, y0, x1, y1, radius)) {
        // transparent outside rounded rect (non-maskable)
        if (!maskable) {
          a = 0; r = 0; g = 0; b = 0;
        } else {
          // maskable: fill to edge with gradient
          r = lerp(top[0], bot[0], (u + v) / 2);
          g = lerp(top[1], bot[1], (u + v) / 2);
          b = lerp(top[2], bot[2], (u + v) / 2);
        }
      } else if (inBolt(u, v)) {
        // gold charging bolt
        const t = (u + v) / 2;
        r = lerp(goldA[0], goldB[0], t);
        g = lerp(goldA[1], goldB[1], t);
        b = lerp(goldA[2], goldB[2], t);
      } else if (inTagRing(u, v) || inTagPin(u, v)) {
        // white price-tag outline
        r = white[0]; g = white[1]; b = white[2];
      }

      rgba[i] = r;
      rgba[i + 1] = g;
      rgba[i + 2] = b;
      rgba[i + 3] = a;
    }
  }
  return rgba;
}

const outDir = path.join(root, 'public', 'brand');
mkdirSync(outDir, { recursive: true });

const targets = [
  ['bazaar-icon-192.png', 192, false],
  ['bazaar-icon-512.png', 512, false],
  ['bazaar-icon-maskable.png', 512, true],
];

for (const [name, size, maskable] of targets) {
  const rgba = render(size, maskable);
  const png = encodePng(size, size, rgba);
  writeFileSync(path.join(outDir, name), png);
  console.log(`✓ ${name} (${size}x${size}, ${(png.length / 1024).toFixed(1)} KB)`);
}
