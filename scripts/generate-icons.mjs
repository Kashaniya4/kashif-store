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

// Shopping-bag mark in [0,1] coordinates
function inBagMark(x, y) {
  // main bag body (rounded bottom)
  const inBody =
    x >= 0.36 && x <= 0.64 &&
    inRoundedRect(x, y, 0.36, 0.36, 0.64, 0.74, 0.035);
  if (inBody) {
    // cut out the handle hole (rounded top of body)
    if (x >= 0.475 && x <= 0.525 && y >= 0.30 && y <= 0.42) return false;
    return true;
  }
  // handle arc (two side posts + top bar) drawn as a thick ring segment
  const hx = (x - 0.5) * 4;         // center x around 0.5
  const hy = (y - 0.34) * 4;        // center y of handle top
  const dist = Math.hypot(hx, hy);
  const inHandleRing = dist >= 0.72 && dist <= 0.86 && y <= 0.34 + 0.08;
  if (inHandleRing && !inBody) return true;
  return false;
}

function render(size, maskable) {
  const pad = maskable ? 0.18 : 0.0; // maskable safe zone ~40% inset
  const x0 = pad;
  const x1 = 1 - pad;
  const y0 = pad;
  const y1 = 1 - pad;
  const radius = maskable ? 0.5 : 0.22;
  const top = hexToRgb('#10b981');
  const bot = hexToRgb('#14b8a6');
  const dark = hexToRgb('#022c22');
  const white = hexToRgb('#f8fafc');

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
      } else if (inBagMark(u, v)) {
        // subtle dark shadow behind mark
        if (inBagMark(u - 0.008, v - 0.006)) {
          r = white[0]; g = white[1]; b = white[2];
        } else {
          r = dark[0]; g = dark[1]; b = dark[2];
        }
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
