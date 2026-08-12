import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Contact sastamaal.net',
  description: 'Contact sastamaal.net support for orders, shipping questions, and product help in Pakistan.',
  alternates: { canonical: `${SITE_CONFIG.url}/contact` },
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Contact</span>
        <h1 className="text-3xl font-black text-white">Contact sastamaal.net</h1>
        <p className="text-slate-300 text-sm leading-relaxed">
          Need help with an order, delivery, or a product question? Our Pakistani support team is here to help.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-white font-bold mb-2">Email</h2>
          <p className="text-sm text-slate-400">blasterbeaty@gmail.com</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-white font-bold mb-2">Phone / WhatsApp</h2>
          <p className="text-sm text-slate-400">0339-7100515</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
        <h2 className="text-xl font-bold text-white">How we help</h2>
        <ul className="list-disc pl-5 text-sm text-slate-300 space-y-2">
          <li>Order status and delivery tracking</li>
          <li>Payment support for JazzCash, EasyPaisa, and COD</li>
          <li>Product questions, warranty, and returns</li>
        </ul>
        <div className="flex flex-wrap gap-3 text-xs pt-2">
          <Link href="/products" className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold">Browse Products</Link>
          <Link href="/shipping-policy" className="px-4 py-2 rounded-xl border border-slate-700 text-white">Shipping Policy</Link>
        </div>
      </div>
    </div>
  );
}
