import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'sastamaal.net shipping policy for nationwide courier delivery, dispatch timing, and delivery expectations in Pakistan.',
  alternates: { canonical: `${SITE_CONFIG.url}/shipping-policy` },
};

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Shipping Policy</span>
        <h1 className="text-3xl font-black text-white">Shipping Policy</h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          sastamaal.net ships across Pakistan using trusted courier partners. We aim to dispatch orders quickly and keep shipping transparent.
        </p>
      </div>

      <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
        <p>Orders are typically dispatched within 24 hours when inventory is available.</p>
        <p>Delivery usually takes 24-48 hours in major cities and may take slightly longer for remote areas.</p>
        <p>We use TCS, Leopards, Trax, and similar carriers depending on destination and service coverage.</p>
        <p>Free shipping is available on orders above Rs. 15,000 unless a campaign states otherwise.</p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
        <h2 className="text-xl font-bold text-white">Need help?</h2>
        <p className="text-sm text-slate-300">Contact support if your shipment is delayed or you want a tracking update.</p>
        <div className="flex flex-wrap gap-3 text-xs">
          <Link href="/contact" className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold">Contact Support</Link>
          <Link href="/return-policy" className="px-4 py-2 rounded-xl border border-slate-700 text-white">Return Policy</Link>
        </div>
      </div>
    </div>
  );
}
