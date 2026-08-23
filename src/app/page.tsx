'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/ProductCard';
import { PromoBanner } from '@/components/PromoBanner';
import { StructuredData } from '@/components/StructuredData';
import {
  Truck,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
  Tag,
  RefreshCw,
  Star,
  PackageCheck,
  Zap,
  Headphones,
} from 'lucide-react';
import {
  SITE_CONFIG,
  organizationStructuredData,
  webSiteStructuredData,
  localBusinessStructuredData,
  productListStructuredData,
  faqStructuredData,
} from '@/lib/seo';
import { CustomerReviewsCarousel } from '@/components/CustomerReviewsCarousel';
import { ProductMarquee } from '@/components/ProductMarquee';
import { RecentlyViewed } from '@/components/RecentlyViewed';

const FAQS = [
  {
    question: 'How do I pay on sastamaal.net?',
    answer:
      'You can pay securely via JazzCash, EasyPaisa, SadaPay, NayaPay, Visa/Mastercard, direct bank transfer (IBAN), or Cash on Delivery (COD) — all in Pakistani Rupees (PKR).',
  },
  {
    question: 'How long does delivery take in Pakistan?',
    answer:
      'We deliver nationwide within 24-48 hours via TCS, Leopards and Trax couriers. Major cities like Karachi, Lahore, Islamabad, Faisalabad and Rawalpindi get priority express service.',
  },
  {
    question: 'Is Cash on Delivery (COD) available?',
    answer:
      'Yes! COD is available nationwide. You pay cash to the rider upon delivery at your doorstep. Free shipping applies on orders over Rs. 15,000.',
  },
  {
    question: 'Can I return or exchange a product?',
    answer:
      'Yes, we offer an easy 7-day return and replacement policy on all genuine products. Contact our Pakistani support team within 7 days of delivery and we will arrange a hassle-free replacement.',
  },
  {
    question: 'Are sastamaal.net products authentic and under warranty?',
    answer:
      '100%. Every product on sastamaal.net is verified genuine and covered by an official manufacturer warranty. We also provide a dedicated Pakistani after-sales support line.',
  },
];

const toCategorySlug = (category: string) =>
  category
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export default function HomePage() {
  const {
    products,
    searchQuery,
    selectedCategory,
    setSelectedCategory,
  } = useStore();

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pb-20">
      {/* SEO structured data: Organization, WebSite, LocalBusiness, Product list, FAQ */}
      <StructuredData
        data={[
          organizationStructuredData(),
          webSiteStructuredData(),
          localBusinessStructuredData(),
          productListStructuredData(products),
          faqStructuredData(FAQS),
        ]}
      />

      {/* Hero Banner — Dark Sci-Fi Theme with Laser Effects */}
      <section className="relative overflow-hidden rounded-2xl lg:rounded-3xl">
        <div className="relative w-full min-h-[400px] sm:min-h-[480px] lg:min-h-[520px] rounded-2xl lg:rounded-3xl overflow-hidden">
          {/* Sci-fi animated background */}
          <div className="absolute inset-0 scifi-hero-bg" />
          <div className="absolute inset-0 scifi-grid" />

          {/* Animated laser beams */}
          <div className="laser-beam" style={{ left: '10%', animationDelay: '0s' }} />
          <div className="laser-beam cyan" style={{ left: '35%', animationDelay: '2s' }} />
          <div className="laser-beam violet" style={{ left: '65%', animationDelay: '4.5s' }} />
          <div className="laser-beam" style={{ left: '85%', animationDelay: '1s' }} />

          {/* Firework bursts */}
          <div className="firework" style={{ top: '15%', right: '18%' }} />
          <div className="firework rose" style={{ bottom: '20%', right: '30%', animationDelay: '1.2s' }} />
          <div className="firework violet" style={{ top: '60%', right: '8%', animationDelay: '2.8s' }} />

          {/* Floating particles */}
          <div className="particle" style={{ top: '8%', left: '20%', animationDelay: '0s', '--drift': '18px' } as React.CSSProperties} />
          <div className="particle cyan" style={{ top: '50%', left: '45%', animationDelay: '1.5s', '--drift': '-12px' } as React.CSSProperties} />
          <div className="particle amber" style={{ bottom: '20%', left: '60%', animationDelay: '3s', '--drift': '20px' } as React.CSSProperties} />
          <div className="particle" style={{ top: '30%', right: '15%', animationDelay: '2s', '--drift': '-15px' } as React.CSSProperties} />
          <div className="particle cyan" style={{ bottom: '10%', right: '40%', animationDelay: '4s', '--drift': '10px' } as React.CSSProperties} />

          {/* Image underlay */}
          <Image
            src="/brand/hero-banner-1200x400.png"
            alt="sastamaal.net — Mobile Accessories & Gadgets"
            width={1200}
            height={400}
            priority
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-transparent" />

          {/* Content overlay */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                {/* Left: Text content */}
                <div className="max-w-2xl text-white flex-1 min-w-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] sm:text-xs font-semibold shadow-sm backdrop-blur-sm">
                    <Tag className="w-3.5 h-3.5 shrink-0" />
                    <span>Pakistan&apos;s Trusted Mobile Accessories &amp; Gadgets Store</span>
                  </div>

                  <h1 className="mt-4 sm:mt-5 text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-tight sm:leading-[1.1] drop-shadow-2xl">
                    Genuine gadgets at the{' '}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-200">
                      best prices
                    </span>{' '}
                    in Pakistan
                  </h1>

                  <p className="mt-3 sm:mt-4 text-slate-200 text-xs sm:text-base leading-relaxed max-w-lg drop-shadow">
                    Chargers, cables, covers, screen glass, power banks &amp; audio — with lightning-fast delivery and trusted payments: JazzCash, EasyPaisa &amp; COD.
                  </p>

                  <div className="mt-6 sm:mt-7 flex flex-wrap items-center gap-3">
                    <a
                      href="#products"
                      className="px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider transition shadow-lg shadow-emerald-500/25 inline-flex items-center gap-2 active:scale-95"
                    >
                      Shop All Deals
                      <ArrowRight className="w-4 h-4" />
                    </a>
                    <Link
                      href="/shipping-policy"
                      className="px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl border border-white/10 bg-white/5 text-white font-semibold text-xs sm:text-sm hover:border-emerald-500/60 hover:bg-white/10 transition backdrop-blur-sm"
                    >
                      Delivery Times
                    </Link>
                  </div>

                  {/* Categories — inline in hero, link to category pages */}
                  <div className="mt-6 sm:mt-8 flex flex-wrap gap-2">
                    {categories.filter(c => c !== 'All').map((cat) => (
                      <Link
                        key={cat}
                        href={`/category/${toCategorySlug(cat)}`}
                        className="px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap transition backdrop-blur-sm bg-white/5 text-slate-300 border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-400"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Right: Featured product showcase — hidden on mobile */}
                <div className="hidden lg:flex flex-col gap-2 shrink-0">
                  {products.filter(p => p.isFeatured).slice(0, 5).map((product, idx) => {
                    const discount = product.originalPrice
                      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                      : 0;
                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug || product.id}`}
                        className="group flex items-center gap-2.5 bg-slate-900/80 backdrop-blur-md border border-emerald-500/20 rounded-xl p-2 hover:bg-slate-900 hover:border-emerald-500/50 transition-all duration-300 w-60 shadow-lg shadow-black/40"
                        style={{ animationDelay: `${idx * 0.15}s` }}
                      >
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                          {discount > 0 && (
                            <span className="absolute top-0 left-0 bg-rose-500 text-white text-[7px] font-bold px-0.5 rounded-sm">
                              -{discount}%
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-[11px] font-semibold truncate drop-shadow">{product.name}</p>
                          <span className="text-emerald-400 text-xs font-extrabold">₨{product.price.toLocaleString()}</span>
                        </div>
                        <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Strip Banner — E-commerce standard */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PromoBanner
            href="/products"
            title="Flash Sale — Up to 40% OFF"
            subtitle="Limited-time deals on chargers, cables, earbuds &amp; power banks."
            cta="Shop Deals Now"
            icon={Zap}
            variant="emerald"
            accentText="Hot Deals"
            images={[
              'ronin-axis-bar-rgb-soundbar-speaker',
              'romoss-pct10-10000mah-fast-charge-power-bank',
              'octo-oc502-50000mah-22-5w-mega-power-bank',
              'google-pixel-30w-usb-c-charging-cable',
            ].map(slug => {
              const p = products.find(x => x.slug === slug);
              return p ? { src: p.image, alt: p.name, href: `/products/${p.slug}` } : null;
            }).filter(Boolean) as { src: string; alt: string; href: string }[]}
          />
          <PromoBanner
            href="/category/electronics-and-audio"
            title="Audio &amp; Accessories"
            subtitle="Premium Bluetooth speakers, earbuds, TWS &amp; gaming audio accessories."
            cta="Browse Audio"
            icon={Headphones}
            variant="violet"
            accentText="Trending"
            images={[
              'buds3-pro-anc-wireless-earbuds',
              'apple-airpods-pro-wireless-earbuds-premium',
              'lunar-ultrapods-pro-tws-transparent-earbuds',
              'octo-music-bar-m750-rgb-bluetooth-speaker',
            ].map(slug => {
              const p = products.find(x => x.slug === slug);
              return p ? { src: p.image, alt: p.name, href: `/products/${p.slug}` } : null;
            }).filter(Boolean) as { src: string; alt: string; href: string }[]}
          />
        </div>
      </section>

      {/* Featured products — clean standard grid */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Featured products</h2>
            <p className="text-sm text-slate-400 mt-1">Hand-picked gadgets at the best prices in Pakistan.</p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-emerald-500/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <PackageCheck className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No products found</h3>
            <p className="text-xs text-slate-400">
              No items matched &quot;{searchQuery}&quot; or category &quot;{selectedCategory}&quot;.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" suppressHydrationWarning>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Auto-scrolling product image strip — below products */}
      <section>
        <ProductMarquee />
      </section>

      {/* Recently Viewed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <RecentlyViewed />
      </section>

      {/* Trust Badges — Delivery, Genuine, Returns, Support */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-800">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-white">Why shop with us</h2>
            <p className="text-sm text-slate-400 mt-1">Trusted by thousands of Pakistani customers.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-4 hover:border-emerald-500/50 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-white font-semibold text-sm block">24-48h Delivery</span>
              <span className="text-slate-400 text-xs">TCS, Leopards & Trax</span>
            </div>
          </div>

          <div className="group flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-4 hover:border-emerald-500/50 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-white font-semibold text-sm block">100% Genuine</span>
              <span className="text-slate-400 text-xs">Verified products &amp; warranty</span>
            </div>
          </div>

          <div className="group flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-4 hover:border-emerald-500/50 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <span className="text-white font-semibold text-sm block">7-day returns</span>
              <span className="text-slate-400 text-xs">Hassle-free replacement</span>
            </div>
          </div>

          <div className="group flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-4 hover:border-emerald-500/50 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-white font-semibold text-sm block">Local support</span>
              <span className="text-slate-400 text-xs">WhatsApp &amp; email help</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — light */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-black text-white">Common questions</h2>
          <p className="text-sm text-slate-400 mt-1">Everything you need to know before ordering.</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq) => (
            <article key={faq.question} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
              <h3 className="text-white font-semibold flex items-start gap-2">
                <Star className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                {faq.question}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mt-2">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Customer Reviews Carousel */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CustomerReviewsCarousel />
      </section>

      {/* SEO-friendly copy block */}
      <section className="sr-only" aria-hidden="true">
        <h2>Online Shopping in Pakistan — Electronics, Fashion &amp; Wearables</h2>
        <p>{SITE_CONFIG.descriptionLong}</p>
        <p>Payments accepted: JazzCash, EasyPaisa, SadaPay, NayaPay, Visa, Mastercard, Bank Transfer and Cash on Delivery.</p>
      </section>
    </div>
  );
}
