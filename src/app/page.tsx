'use client';

import React from 'react';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/ProductCard';
import { StructuredData } from '@/components/StructuredData';
import {
  Sparkles,
  Truck,
  Smartphone,
  ArrowRight,
  Filter,
  PackageCheck,
  ShieldCheck,
  Tag
} from 'lucide-react';
import {
  SITE_CONFIG,
  organizationStructuredData,
  webSiteStructuredData,
  localBusinessStructuredData,
  productListStructuredData,
  faqStructuredData,
} from '@/lib/seo';

const FAQS = [
  {
    question: 'How do I pay on Bazaar.pk?',
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
    question: 'Are Bazaar.pk products authentic and under warranty?',
    answer:
      '100%. Every product on Bazaar.pk is verified genuine and covered by an official manufacturer warranty. We also provide a dedicated Pakistani after-sales support line.',
  },
];

export default function HomePage() {
  const {
    products,
    searchQuery,
    selectedCategory,
    setSelectedCategory,
    getStock
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
    <div className="space-y-16 pb-20">
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

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800">

        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Copy */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                <span>Pakistan&apos;s Premier E-Commerce Store</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Discover Premium <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">Products</span> In Pakistan
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
                Experience seamless local e-commerce. Pay securely via JazzCash, EasyPaisa, SadaPay, or Cash on Delivery (COD) with fast express delivery across Pakistan.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#products"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-emerald-500/20 transition flex items-center gap-2 group"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Badges bar */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-md mx-auto lg:mx-0 text-xs">
                <div>
                  <div className="font-extrabold text-white text-base">₨ PKR</div>
                  <div className="text-slate-400">Local Currency</div>
                </div>
                <div>
                  <div className="font-extrabold text-emerald-400 text-base">4 Gateways</div>
                  <div className="text-slate-400">JazzCash / EasyPaisa</div>
                </div>
                <div>
                  <div className="font-extrabold text-teal-300 text-base">24-48h</div>
                  <div className="text-slate-400">TCS / Leopards</div>
                </div>
              </div>

            </div>

            {/* Right Card Feature Showcase */}
            <div className="relative">
              <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Live Catalog</span>
                  </div>
                  <span className="text-xs bg-emerald-950 text-emerald-300 font-mono px-2.5 py-1 rounded-md border border-emerald-800">
                    {products.length} Products Active
                  </span>
                </div>

                {/* Products preview thumbnail list */}
                <div className="space-y-3">
                  {products.slice(0, 3).map((prod) => (
                    <div key={prod.id} className="flex items-center gap-4 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition">
                      <Image src={prod.image} alt={prod.name} width={48} height={48} className="w-12 h-12 rounded-xl object-cover bg-slate-950" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{prod.name}</h4>
                        <p className="text-[11px] text-slate-400">₨ {prod.price.toLocaleString()} • In Stock ({getStock(prod.id)})</p>
                      </div>
                      <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                        {prod.category}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-200">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Verified Pakistani Warranty & Doorstep Returns</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Product Catalog */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Header & Category Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Catalog Selection</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Featured Products</h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-4">
            <PackageCheck className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No products found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No items matched &quot;{searchQuery}&quot; or category &quot;{selectedCategory}&quot;.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </section>

      {/* Pakistani Logistics & Payment Gateway Trust Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-10 space-y-8">

          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase text-emerald-400 tracking-wider">
              Built for Pakistan
            </span>
            <h3 className="text-2xl font-extrabold text-white">
              Local Mobile Wallets & Logistics Network
            </h3>
            <p className="text-xs text-slate-400">
              We support all popular Pakistani payment options and nationwide express courier fulfillment.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
              <Smartphone className="w-6 h-6 text-rose-400 mx-auto" />
              <div className="font-extrabold text-sm text-white">JazzCash</div>
              <div className="text-[11px] text-slate-400">USSD Prompt & Wallet</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
              <Smartphone className="w-6 h-6 text-emerald-400 mx-auto" />
              <div className="font-extrabold text-sm text-white">EasyPaisa</div>
              <div className="text-[11px] text-slate-400">Mobile Transfer & OTP</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
              <Smartphone className="w-6 h-6 text-teal-300 mx-auto" />
              <div className="font-extrabold text-sm text-white">SadaPay / Naya</div>
              <div className="text-[11px] text-slate-400">Virtual Debit Handle</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
              <Truck className="w-6 h-6 text-amber-400 mx-auto" />
              <div className="font-extrabold text-sm text-white">TCS / Leopards</div>
              <div className="text-[11px] text-slate-400">Trax & PostEx Delivery</div>
            </div>
          </div>

        </div>
      </section>

      {/* SEO-friendly copy block (hidden but indexable) */}
      <section className="sr-only" aria-hidden="true">
        <h2>Online Shopping in Pakistan — Electronics, Fashion &amp; Wearables</h2>
        <p>{SITE_CONFIG.descriptionLong}</p>
        <p>Payments accepted: JazzCash, EasyPaisa, SadaPay, NayaPay, Visa, Mastercard, Bank Transfer and Cash on Delivery.</p>
      </section>

    </div>
  );
}
