import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'About sastamaal.net',
  description: 'Learn about sastamaal.net — a Pakistan-focused ecommerce store for premium products, local payments, and nationwide delivery.',
  alternates: { canonical: `${SITE_CONFIG.url}/about` },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">About Us</span>
        <h1 className="text-3xl font-black text-white">About sastamaal.net</h1>
        <p className="text-slate-300 text-sm leading-relaxed">
          sastamaal.net is a Pakistan-focused ecommerce store built to make premium shopping simple, trustworthy, and fast. We help customers buy electronics, fashion accessories, and wearables with local payment methods and nationwide courier delivery.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        {[
          ['Pakistan-first checkout', 'JazzCash, EasyPaisa, SadaPay, bank transfer, and COD.'],
          ['Fast courier shipping', '24-48 hour dispatch with TCS, Leopards, and Trax.'],
          ['Verified product quality', 'Handpicked products with warranty and stock tracking.'],
          ['Helpful support', 'WhatsApp and email support for quick order help.'],
        ].map(([title, body]) => (
          <div key={title} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-white font-bold mb-2">{title}</h2>
            <p className="text-sm text-slate-400">{body}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
        <h2 className="text-xl font-bold text-white">Why customers use sastamaal.net</h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Our store is designed for easy browsing, clear product details, local currency pricing, and a smooth checkout experience for customers in Pakistan.
        </p>
        <div className="flex flex-wrap gap-3 text-xs">
          <Link href="/products" className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold">Browse Products</Link>
          <Link href="/contact" className="px-4 py-2 rounded-xl border border-slate-700 text-white">Contact Support</Link>
        </div>
      </section>
    </div>
  );
}
