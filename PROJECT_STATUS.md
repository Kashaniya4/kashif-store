# PROJECT STATUS — sastamaal.net / kashif-store

> **Note for AI assistants (Claude Code etc.):** Read this file FIRST when starting work in a fresh clone. It contains full project context, conventions, and user preferences. Working directory should be `store/` (repo root).

## What this is
Next.js 16 e-commerce store for Pakistani mobile accessories. **sastamaal.net** branding. Live at **https://kashif-store.vercel.app** (auto-deploys from GitHub `main`).

## CRITICAL: This is NOT the Next.js you know
This Next.js 16 version has breaking changes vs training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing code. Heed deprecation notices. (See AGENTS.md — `next dev` re-adds that block.)

## Deployment & sync (user's standing rule)
- **Every change must end with: build → commit → push to `main`** (Vercel auto-deploys).
- Repo: `https://github.com/Kashaniya4/kashif-store.git`
- User runs `git push` — sometimes needs rebase if diverged; resolve conflicts keeping the LIGHT-theme version.
- Product images: compress before committing (see image rules below). Raw photos live outside git.

## User preferences (from memory + session)
- **Roman Urdu / English mix** for communication.
- **MINIMALISTIC design** — clean, no clutter, no over-decoration. Recent example: Buy Now button was made small emerald-outline (secondary to Add to Cart solid green).
- **Light theme** site-wide (converted from dark). Classes: `bg-white`/`bg-slate-50`/`text-slate-900`/`border-slate-200`/emerald accents.
- **% OFF badges are orange** (`bg-orange-500 text-white`). Wishlist/error stay rose. Featured badge emerald-600.
- Urdu tagline in Header (below logo, right side, 14-16px): «اب خریدا ہوا سامان واپس بھی ہوگا، تبدیل بھی۔» Also on warranty-claim page under H1.
- Site must stay **fully responsive**, especially mobile.

## Real business data
- Address: Al-Hamd telecom, Main Sir Sayyad Road, Block 8, Khanewal (Google Maps link in footer)
- Phone/WhatsApp: **0339-7100515** (`+923397100515`, `wa.me/923397100515` with prefilled text)
- Email: **blasterbeaty@gmail.com**
- Hours: Mon–Sat 10 AM – 7 PM PKT
- Free delivery over ₨15,000; flat ₨250 otherwise. Couriers: TCS, Leopards, Trax, PostEx, CallCourier.

## Products data model
- Source of truth: `src/data/products.json` (40 products).
- Images: `public/products/Download/Quick Share/listed products/<folder>/<image>`
- Folder name ↔ product mapping is EXACT (folder names have typos like "rumoss", "magnatic", "chaging" — those are the real folder names, don't rename).
- Slug convention: lowercase, `&`→`and`, `+`→`plus`, spaces→dashes (e.g. `extreme-rock-715-ancplusenc-earbuds`).
- Featured image = same-name-as-folder file inside its folder. `images[]` = all files in folder (space-encoded URLs via `quote(safe="/()+=&,.~-_")`).
- Each product page has: swipe gallery (touch + prev/next + counter), thumbnails, quantity, Add to Cart (solid emerald), Buy Now (outline emerald → /checkout), wishlist.

## Image rules (IMPORTANT — Vercel size limits)
- `.gitignore` blocks raw Quick Share images EXCEPT `listed products/**` subfolder.
- Before committing new product photos: resize to max 1200px long edge, JPEG q80 (~85% smaller). A 193-image set went 354MB → 22.6MB.
- Never commit the raw full-size phone photos.

## Key routes
- `/` home (hero + products + promos + marquee + FAQ + trust badges)
- `/products` grid + sidebar filters; `/products/[slug]` detail
- `/category/[slug]`, `/checkout`, `/wishlist`, `/admin` (password `admin123` via NEXT_PUBLIC_ADMIN_PASSWORD; tabs: Overview/Orders/Products/Analytics)
- Policies: `/warranty-claim`, `/return-policy`, `/shipping-policy`, `/privacy-policy`, `/terms-of-service`, `/policies`, `/about`, `/contact`, `/json-importer`
- `/admin` = order logistics + product CRUD (add/edit/delete/stock±) — data lives in localStorage per browser.

## Lighthouse status (last audit: 2026-09)
Homepage P84/A93/SEO100, Product page P95/A90/SEO100, Best-practices 100 all pages.
Fixes done: aria-labels, role=listitem gallery, contrast (WELCOME10 chip amber-300 on slate-900), 24px carousel dots, logo width/height, priority-load first 4 cards.

## Conventions
- Client components fetch products via `useStore()` (StoreContext) — localStorage-backed, seeded from products.json.
- Server components (SEO landing) use `ServerProductCard` reading products.json directly.
- PWA: manifest.json + icons in /public/brand.
- Commit style: conventional commits (`feat:`, `fix:`, `style:`, `chore:`), end with `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`.
- No test suite; `npm run build` is the verification gate. ESLint must be 0 errors (warnings OK; set-state-in-effect & immutability rules disabled in eslint.config.mjs — intentional SSR/rAF patterns).

## Environment
- Windows 11, git bash. Dev server `npm run dev -- --port 3000` (check `netstat -ano | findstr :3000` for port conflicts; kill stale via `cmd //c "taskkill /PID <pid> /F"`).
- Python available for batch scripts (PIL installed) — temp scripts must be deleted before commit.
