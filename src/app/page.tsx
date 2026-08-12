'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/ProductCard';
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

      {/* Hero — clean, one message */}
      <section className="relative overflow-hidden pt-20 pb-24 border-b border-slate-800">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Tag className="w-3.5 h-3.5" />
            Affordable prices · Nationwide delivery
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Genuine gadgets at the{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
              best prices
            </span>{' '}
            in Pakistan
          </h1>

          <p className="mt-5 text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Phones, audio, chargers, cases and more — with fast delivery and payments you already trust: JazzCash, EasyPaisa and Cash on Delivery.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#products"
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-500/20 inline-flex items-center gap-2"
            >
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/shipping-policy"
              className="px-7 py-3.5 rounded-xl border border-slate-700 text-white font-semibold text-sm hover:border-emerald-500 transition"
            >
              See Delivery Times
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-slate-400">
            <span className="flex items-center gap-2"><Truck className="w-4 h-4 text-emerald-400" /> 24-48h delivery</span>
            <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Genuine & warranty</span>
            <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 text-emerald-400" /> 7-day returns</span>
            <span className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-emerald-400" /> Local support</span>
          </div>
        </div>
      </section>

      {/* Featured products — the main content */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Categories — simple */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-800">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-white">Shop by category</h2>
            <p className="text-sm text-slate-400 mt-1">Find exactly what you need, faster.</p>
          </div>
          <Link href="/products" className="hidden sm:inline-flex text-xs font-semibold text-emerald-400 hover:text-emerald-300 items-center gap-1">
            All products <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from(new Set(products.map(p => p.category))).map((category) => (
            <Link
              key={category}
              href={`/category/${toCategorySlug(category)}`}
              className="group flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-4 hover:border-emerald-500/50 transition"
            >
              <span className="text-white font-semibold">{category}</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition" />
            </Link>
          ))}
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

      {/* SEO-friendly copy block */}
      <section className="sr-only" aria-hidden="true">
        <h2>Online Shopping in Pakistan — Electronics, Fashion &amp; Wearables</h2>
        <p>{SITE_CONFIG.descriptionLong}</p>
        <p>Payments accepted: JazzCash, EasyPaisa, SadaPay, NayaPay, Visa, Mastercard, Bank Transfer and Cash on Delivery.</p>
      </section>
    </div>
  );
}
