# sastamaal.net — Technical Architecture Document

## Project Overview

**sastamaal.net** — Pakistani e-commerce store for mobile accessories. Next.js 16 (App Router), React 19, Tailwind CSS v4. Zero backend — all data in static JSON + client localStorage. Sci-fi dark theme with emerald accent.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.3.0 (App Router) |
| React | 19.2.8 |
| Styling | Tailwind CSS v4 (@tailwindcss/postcss) |
| Icons | lucide-react |
| Email | Resend SDK |
| Animations | canvas-confetti (checkout) + custom CSS keyframes |
| Font | Inter (next/font/google) |
| Language | TypeScript (strict) |
| Linting | ESLint 9 (flat config) |

---

## Directory Structure

```
store/
├── .claude/                    # Claude Code config (launch.json)
├── public/
│   ├── brand/                  # 7 brand assets (logo, hero banner, PWA icons)
│   ├── products/               # 18 local product images
│   └── [standard PWA/static assets]
├── scripts/
│   └── generate-icons.mjs      # Pure-Node PNG encoder for PWA icons
├── src/
│   ├── app/                    # App Router — 16 routes
│   │   ├── api/send-order-confirmation/
│   │   ├── admin/
│   │   ├── checkout/
│   │   ├── category/[slug]/
│   │   ├── contact/
│   │   ├── json-importer/
│   │   ├── policies/
│   │   ├── privacy-policy/
│   │   ├── products/
│   │   ├── products/[id]/
│   │   ├── return-policy/
│   │   ├── shipping-policy/
│   │   ├── terms-of-service/
│   │   ├── about/
│   │   ├── robots.ts
│   │   ├── sitemap.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/             # 12 React components
│   ├── context/
│   │   └── StoreContext.tsx    # Single global Context provider
│   ├── data/
│   │   ├── products.json       # 20 products, 4 categories
│   │   └── promocodes.json     # 4 promo codes
│   ├── lib/
│   │   └── seo.ts              # SEO config + JSON-LD helpers
│   └── types/
│       └── store.ts            # All TypeScript interfaces
├── package.json
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
└── .gitignore
```

---

## Configuration Files

### `next.config.ts`
- Security headers: X-Frame-Options DENY, CSP, Referrer-Policy, Permissions-Policy
- Image optimization: AVIF/WebP, 30-day cache, remote patterns for unsplash.com
- `optimizePackageImports`: lucide-react
- Cache headers for `/brand/*`, `/manifest.json`, `/robots.txt`, `/sitemap.xml`, `/favicon.ico`

### `tsconfig.json`
- Target: ES2017, strict mode
- Path alias: `@/*` → `./src/*`

### `postcss.config.mjs`
- Tailwind v4 only: `@tailwindcss/postcss` plugin
- No `tailwind.config.js`

### `eslint.config.mjs`
- Flat config extending `eslint-config-next/core-web-vitals` + `typescript`

### `.gitignore`
- Standard Next.js + `.env*` excluded

---

## Data Layer (No Database)

**All data is static JSON + client-side localStorage**

### `src/data/products.json` — 20 Products, 4 Categories
```
Fashion & Accessories      (5 products)
Electronics & Audio        (5 products)
Wearables                  (5 products)
Mobile Accessories         (5 products)
```
Each product: id, name, slug, price, originalPrice?, category, rating, reviewsCount, stock, isFeatured?, description, image (Unsplash URL), specs{}, tags[]

### `src/data/promocodes.json` — 4 Codes
- WELCOME10 (10% off)
- PAKISTAN500 (Rs 500 off min Rs 2000)
- FREESHIP (free shipping)
- VIP20 (20% off min Rs 5000)

### localStorage Keys
| Key | Purpose |
|-----|---------|
| `pk_store_cart` | Cart items |
| `pk_store_user` | Customer profile |
| `pk_store_orders` | Order history |
| `pk_store_stock` | Stock overrides (decremented on order) |

### Seed Data
2 initial orders injected on first load as `INITIAL_SAMPLE_ORDERS`

---

## Routes (App Router)

| Route | File | Rendering | Notes |
|-------|------|-----------|-------|
| `/` | `page.tsx` | Client | Homepage: hero, marquee, promos, featured grid, FAQ, reviews |
| `/about` | `about/page.tsx` | Server | Static |
| `/admin` | `admin/page.tsx` | Client | Password gate (sessionStorage), order management |
| `/category/[slug]` | `category/[slug]/page.tsx` | Server (SSG) | `generateStaticParams`, breadcrumb, FAQ schema |
| `/checkout` | `checkout/page.tsx` | Client | Form, promo, payment modal, success screen |
| `/contact` | `contact/page.tsx` | Server | Contact info |
| `/json-importer` | `json-importer/page.tsx` | Client | Internal tool: paste/upload JSON, validate, import |
| `/policies` | `policies/page.tsx` | Server | Policy index |
| `/privacy-policy` | `privacy-policy/page.tsx` | Server | |
| `/products` | `products/page.tsx` | Server | Full catalog, category links |
| `/products/[id]` | `products/[id]/page.tsx` | Server (SSG) | `generateStaticParams`, `generateMetadata`, delegates to `ProductView` |
| `/return-policy` | `return-policy/page.tsx` | Server | |
| `/shipping-policy` | `shipping-policy/page.tsx` | Server | |
| `/terms-of-service` | `terms-of-service/page.tsx` | Server | |
| `/robots.txt` | `robots.ts` | Server | Disallows admin, checkout, json-importer, api |
| `/sitemap.xml` | `sitemap.ts` | Server | Static + all products + all categories |

**No middleware, no error.tsx, no loading.tsx**

---

## Layouts

| File | Purpose |
|------|---------|
| `layout.tsx` | Root: StoreProvider, Header, Footer, CartDrawer, SocialAuthModal, FloatingWhatsApp, Inter font, dark theme, full SEO |
| `admin/layout.tsx` | noindex |
| `checkout/layout.tsx` | noindex |
| `json-importer/layout.tsx` | noindex |

---

## Components (12 files)

```
RootLayout
├── StoreProvider (context)
│   ├── Header              # Logo, search, auth, cart badge
│   ├── Footer              # Value props, social, policies, contact
│   ├── CartDrawer          # Slide-out: items, qty, promo, free-ship progress
│   ├── SocialAuthModal     # Mock Google/FB/Apple + guest signup
│   └── FloatingWhatsApp    # Fixed support button
│
├── HomePage
│   ├── StructuredData
│   ├── ProductMarquee      # Auto-scroll thumbnail strip
│   ├── PromoBanner (x2)    # Sci-fi promo tiles
│   ├── ProductCard (map)   # Client add-to-cart
│   └── CustomerReviewsCarousel
│
├── AllProductsPage
│   ├── StructuredData
│   └── ServerProductCard (map)  # SEO-friendly server card
│
├── CategoryPage
│   ├── StructuredData
│   └── ServerProductCard (map)
│
├── ProductDetailPage
│   ├── StructuredData
│   └── ProductView         # Images, qty, add-to-cart, specs, trust badges
│
├── CheckoutPage
│   └── PaymentModal
│
├── AdminPage
│   └── Invoice modal (inline)
│
└── JsonImporterPage
    └── Upload, textarea, preview grid (inline)
```

| Component | Directive | Key Features |
|-----------|-----------|--------------|
| `Header.tsx` | `'use client'` | Sticky, search, auth trigger, cart badge |
| `Footer.tsx` | `'use client'` | Social links, policies, clickable address |
| `CartDrawer.tsx` | `'use client'` | Qty controls, promo apply, free-ship progress bar |
| `SocialAuthModal.tsx` | `'use client'` | Mock social login + guest form |
| `FloatingWhatsApp.tsx` | `'use client'` | Fixed WhatsApp deep link |
| `PaymentModal.tsx` | `'use client'` | 6 methods, 2s timeout, confetti, email trigger |
| `ProductCard.tsx` | `'use client'` | Client add-to-cart, stock badges |
| `ServerProductCard.tsx` | Server | SEO product card |
| `ProductView.tsx` | `'use client'` | Full detail view |
| `ProductMarquee.tsx` | `'use client'` | Auto-scroll marquee |
| `PromoBanner.tsx` | `'use client'` | Native `<img>` (intentional, per commit) |
| `StructuredData.tsx` | `'use client'` | JSON-LD injection (Org, Product, FAQ, etc.) |
| `CustomerReviewsCarousel.tsx` | `'use client'` | 6 hardcoded reviews, auto-rotate |

---

## API Routes

### `POST /api/send-order-confirmation`
**File:** `src/app/api/send-order-confirmation/route.ts`

- Input: `{ order: Order }`
- Uses Resend SDK
- Skips gracefully if no email or no `RESEND_API_KEY`
- From: `ORDER_EMAIL_FROM` (default `orders@sastamaal.net`)
- HTML email: dark theme, order table, totals, delivery info
- Called fire-and-forget from `PaymentModal.tsx`

---

## Authentication

### Customer Auth — `SocialAuthModal.tsx` (Mock Only)
- Buttons: Google, Facebook, Apple → inject hardcoded mock users
- Guest checkout: name/phone/email form
- Persisted to `localStorage.pk_store_user`
- **No real OAuth, no sessions, no tokens**

### Admin Auth — `admin/page.tsx` (Client-Side Only)
- Password gate using `sessionStorage.pk_store_admin_auth`
- Check against `NEXT_PUBLIC_ADMIN_PASSWORD` (default `admin123`)
- **Not secure — purely UI gate**

---

## Payment Integration (Simulated)

**File:** `PaymentModal.tsx` — **No real gateway**

| Method | Flow | Status on Success |
|--------|------|-------------------|
| JazzCash | Mobile number prompt | `paid` |
| EasyPaisa | Mobile number prompt | `paid` |
| SadaPay/NayaPay | Username prompt | `paid` |
| COD | Confirm only | `unpaid` |
| Bank Transfer | Shows IBAN `PK82SASTA00019283746501` (Meezan) | `pending_verification` |
| Visa/Mastercard | Mock card form | `paid` |

- 2-second `setTimeout` simulates gateway
- On success: `canvas-confetti` + `placeOrder()` + email API fire

---

## State Management

**Single React Context:** `src/context/StoreContext.tsx`

### State
- `products` (from JSON + localStorage overrides)
- `cart` (CartItem[])
- `user` (User | null)
- `orders` (Order[])
- `activePromo` (PromoCode | null)
- `promoError` (string)
- `availablePromos` (PromoCode[])
- `isCartOpen`, `isAuthModalOpen`, `searchQuery`, `selectedCategory`

### Actions
- `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`
- `applyPromoCode`, `removePromoCode`
- `setUser` (mock auth)
- `placeOrder` (decrements stock, creates order, clears cart)
- `updateOrderStatus`, `deleteOrder` (restores stock)
- `getStock`, `importProducts` (json-importer tool)

### Computed
- `getCartSubtotal`, `getDiscountAmount`
- `getShippingFee` (free over Rs 15,000)
- `getCartTotal`, `getCartItemsCount`

### Persistence
- `localStorage`: cart, user, orders, stock
- `sessionStorage`: admin auth

---

## Image Handling

- `next/image` used in most components (AVIF/WebP, lazy, responsive `sizes`)
- Remote patterns: `images.unsplash.com`, `unsplash.com`
- Product images: Unsplash URLs in JSON + 18 local files in `public/products/`
- Brand assets: `public/brand/` (logo, hero banner, PWA icons)
- **Exception:** `PromoBanner.tsx` and hero featured cards use native `<img>` (not `next/image`) — intentional fix for fill issues (commit `ed50550`)
- Icon generation: `scripts/generate-icons.mjs` (pure Node PNG encoder)
- 30-day cache for optimized images

---

## Styling

**Tailwind CSS v4** via `@tailwindcss/postcss`

- `globals.css`: `@import "tailwindcss"` + `@layer base`
- Dark theme: `bg-slate-950`, `text-slate-100`, emerald `#10b981`
- Custom animations: `laser-sweep`, `firework-burst`, `laser-pulse`, `grid-drift`, `particle-float`, `ring-expand`
- Custom utilities: `.scrollbar-none`, `.scifi-grid`, `.scifi-hero-bg`, `.scifi-tile`
- `prefers-reduced-motion` disables animations
- Inter font via `next/font/google`
- **No CSS Modules anywhere**

---

## TypeScript Interfaces (`src/types/store.ts`)

```typescript
Product {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  category: string
  rating: number
  reviewsCount: number
  stock: number
  isFeatured?: boolean
  description: string
  image: string
  specs: Record<string, string>
  tags: string[]
}

CartItem { product: Product; quantity: number }

CustomerDetails {
  fullName: string
  email: string
  phone: string
  city: string
  address: string
  isGuest: boolean
}

Order {
  id: string
  orderNumber: string
  createdAt: string
  items: CartItem[]
  customer: CustomerDetails
  subtotal: number
  discount: number
  shippingFee: number
  total: number
  paymentMethod: PaymentMethod
  paymentStatus: 'paid' | 'unpaid' | 'pending_verification' | 'refunded' | 'failed'
  transactionId?: string
  status: OrderStatus
  courier?: CourierName
  trackingNumber?: string
  promoCodeApplied?: string
  notes?: string
}

User { id, name, email, phone?, avatar?, provider }

PromoCode { code, type: 'percentage'|'fixed'|'free_shipping', value, minSpend?, description }
```

Unions: `PaymentMethod` (7), `OrderStatus` (5), `CourierName` (5)

---

## Environment Variables

**No `.env` or `.env.example` committed** (`.gitignore` excludes `.env*`)

| Variable | Required | Default | Used In |
|----------|----------|---------|---------|
| `RESEND_API_KEY` | No | — | `api/send-order-confirmation/route.ts` |
| `ORDER_EMAIL_FROM` | No | `orders@sastamaal.net` | `api/send-order-confirmation/route.ts` |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | No | `admin123` | `admin/page.tsx` |

---

## PWA / Manifest

`public/manifest.json`:
- Name: "sastamaal.net"
- Display: standalone
- Theme color: `#10b981` (emerald)
- Icons: generated by `scripts/generate-icons.mjs`

---

## SEO / Structured Data

- `src/lib/seo.ts`: Centralized SEO config + JSON-LD builders
- `StructuredData.tsx` injects schemas per page:
  - Homepage: Organization, WebSite, FAQPage
  - Product: Product, Offer, AggregateRating, FAQ
  - Category: ItemList, BreadcrumbList, FAQPage
- `sitemap.ts` + `robots.ts` auto-generated

---

## Known Limitations / Technical Debt

1. **No database** — all data in JSON/localStorage, not production-ready
2. **No real auth** — mock social login, client-only admin gate
3. **No real payments** — simulated gateway, no webhook handling
4. **No middleware** — no auth protection, no i18n, no bot mitigation
5. **No error boundaries / loading states** — no `error.tsx`, `loading.tsx`
6. **Admin is client-side only** — password in `NEXT_PUBLIC_` env (exposed to browser)
7. **Stock management is client-side** — race conditions possible
8. **No tests** — zero test files
9. **Hardcoded reviews** — 6 static reviews in `CustomerReviewsCarousel.tsx`
10. **Email only fires on client** — no server-side order confirmation fallback
11. **Single global Context** — all state in one provider, re-renders entire tree
12. **No order ID generation strategy** — uses `Date.now()` + random

---

## Recent Git History (Last 20 Commits)

- Logo iterations across Header/Footer/layout (multiple commits)
- SSG via `generateStaticParams` for product/category pages
- Performance audit → sci-fi hero theme implementation
- Footer/branding polish, clickable address, transparent logo
- Trust badges and categories section reordering on homepage
- Product catalog expansions (AirPods, mobile accessories)

---

## Enhancement Opportunities (For Planning)

### Infrastructure
- Add database (PostgreSQL + Prisma/Drizzle)
- Real auth (NextAuth.js / Auth.js)
- Real payment gateway (JazzCash/EasyPaisa SDKs, Stripe)
- Middleware for auth protection, rate limiting
- Background jobs (order processing, email queue)

### Data
- Migrate products/promos to DB
- Admin CMS for product management
- Real inventory with reservations
- Order webhooks for payment confirmation

### UX
- Real user accounts with order history
- Wishlist, compare, recently viewed
- Product reviews (user-generated)
- Search with filters/facets
- Checkout progress indicator

### DevOps
- CI/CD pipeline
- Preview deployments
- Error tracking (Sentry)
- Analytics (GA4/Plausible)
- Load testing

### Code Quality
- Unit/integration tests (Vitest + React Testing Library)
- E2E tests (Playwright)
- Storybook for component docs
- Component-level code splitting
- Virtualized lists for large catalogs

---

## File Reference Index

| Category | Files |
|----------|-------|
| Entry | `src/app/layout.tsx`, `src/app/page.tsx` |
| Context | `src/context/StoreContext.tsx` |
| Types | `src/types/store.ts` |
| Data | `src/data/products.json`, `src/data/promocodes.json` |
| SEO | `src/lib/seo.ts`, `src/components/StructuredData.tsx` |
| API | `src/app/api/send-order-confirmation/route.ts` |
| Components | `src/components/*.tsx` (12 files) |
| Config | `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs` |
| Styling | `src/app/globals.css` |
| Scripts | `scripts/generate-icons.mjs` |
| Public | `public/brand/*`, `public/products/*`, `public/manifest.json` |