import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'sastamaal.net terms of service for store usage, orders, and support.',
  alternates: { canonical: `${SITE_CONFIG.url}/terms-of-service` },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Terms</span>
        <h1 className="text-3xl font-black text-slate-900">Terms of Service</h1>
        <p className="text-sm text-slate-700 leading-relaxed">
          By using sastamaal.net, you agree to browse responsibly, provide accurate order information, and follow our policies for shipping and returns.
        </p>
      </div>

      <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
        <p>Product details and prices may change without notice until an order is confirmed.</p>
        <p>We may cancel or delay an order if payment is not completed, stock runs out, or address details are incomplete.</p>
        <p>Use the site only for lawful shopping and content browsing purposes.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/60 p-6 space-y-3">
        <h2 className="text-xl font-bold text-slate-900">Need clarification?</h2>
        <p className="text-sm text-slate-700">Contact support if you need help with any order or policy question.</p>
        <Link href="/contact" className="inline-flex px-4 py-2 rounded-xl bg-emerald-500 text-slate-50 font-bold text-xs">Contact Support</Link>
      </div>
    </div>
  );
}
