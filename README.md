# 🛍️ Bazaar.pk — Pakistan's Premier E-Commerce Store

A production-ready Pakistani e-commerce storefront built with **Next.js 16** and **React 19**, featuring local payment gateways (JazzCash, EasyPaisa, SadaPay, COD), nationwide courier logistics (TCS, Leopards, Trax), and full technical SEO for global discoverability.

## ✨ Features

### 🛒 Storefront
- **Product catalog** with categories, search, and live stock tracking
- **Product detail pages** with specs, ratings, and discount badges
- **Shopping cart** drawer with quantity controls and stock validation
- **Promo codes** — percentage, fixed, and free-shipping types (WELCOME10 included)

### 💳 Pakistani Payments
- JazzCash, EasyPaisa, SadaPay / NayaPay, Visa / Mastercard, Bank IBAN transfer, Cash on Delivery
- PKR (₨) currency throughout, free delivery over ₨ 15,000
- Payment gateway simulation modal with confirmation + confetti

### 📦 Logistics Admin (`/admin`)
- Password-protected dashboard (default: `admin123`, override via `NEXT_PUBLIC_ADMIN_PASSWORD`)
- Revenue, orders, pending-dispatch, and shipped metrics
- Courier assignment (TCS / Leopards / Trax / PostEx / CallCourier) + auto tracking numbers
- Printable tax invoice, order search & status pipeline

### ⚡ JSON Product Importer (`/json-importer`)
- Paste or upload a JSON array of products — validated and merged into the live catalog instantly
- Persists to localStorage (survives reloads)

### 🔍 Technical SEO (added for global ranking)
- **Structured data (JSON-LD)**: `Product`, `Offer`, `AggregateRating`, `BreadcrumbList`, `FAQPage`, `Organization`, `WebSite` (+`SearchAction`), `LocalBusiness`, `ItemList`
- **Per-page metadata**: title templates, descriptions, Open Graph, Twitter cards, canonical URLs
- **`robots.txt`** with crawl rules (admin/checkout/importer blocked)
- **Dynamic `sitemap.xml`** — auto-generates from `products.json`
- **SEO landing pages**: `/products`, `/category/[slug]` (server-rendered for crawlers)
- **PWA**: `manifest.json`, brand icons (192/512/maskable), apple-touch-icon
- `noindex` on admin, checkout, and importer routes

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🏗️ Production

```bash
npm run build
npm run start
```

## 🌍 Deployment

Deploys as a standard Next.js app — works out of the box on **Vercel**, Netlify, or any Node server.

### After deploying, update these in `src/lib/seo.ts`:
1. `url` / `domain` → your live domain (e.g. `https://www.yourstore.com`)
2. `logo` URLs → your absolute asset paths

Then register in **Google Search Console**, submit `/sitemap.xml`, and verify.

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                # Home + structured data
│   ├── layout.tsx              # Global metadata, fonts, viewport
│   ├── robots.ts               # Crawl rules
│   ├── sitemap.ts              # Dynamic sitemap
│   ├── products/
│   │   ├── page.tsx            # All-products landing
│   │   └── [id]/page.tsx       # Product detail + Product schema
│   ├── category/[slug]/page.tsx# Category landing pages
│   ├── admin/                  # Logistics dashboard (noindex)
│   ├── checkout/               # Checkout (noindex)
│   └── json-importer/          # JSON import tool (noindex)
├── components/                 # UI components
├── context/StoreContext.tsx    # Global state (cart, orders, promos)
├── data/                       # products.json, promocodes.json
├── lib/seo.ts                  # SEO config + schema builders
└── types/                      # TypeScript interfaces
```

## 🔑 Adding Products

Edit `src/data/products.json` — sitemap, category pages, product metadata, and structured data all regenerate automatically.

## 🖼️ Brand Icons

Regenerate PWA icons after branding changes:

```bash
node scripts/generate-icons.mjs
```

## 📄 License

Private project. All rights reserved.
