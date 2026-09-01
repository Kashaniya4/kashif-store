import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Return Policy',
  description: 'sastamaal.net return and replacement policy for Pakistan customers.',
  alternates: { canonical: `${SITE_CONFIG.url}/return-policy` },
};

export default function ReturnPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Return Policy</span>
        <h1 className="text-3xl font-black text-slate-900">Return & Replacement Policy</h1>
        <p className="text-xl font-bold text-emerald-600 mt-2 tracking-wide" dir="rtl">اب خریدا ہوا سامان واپس بھی ہوگا، تبدیل بھی۔</p>
        <p className="text-sm text-slate-700 leading-relaxed">
          We want every sastamaal.net customer to be happy with their order. If something is wrong, we make returns and replacements simple.
        </p>
      </div>

      <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
        <p>Contact us within 7 days of receiving your order if the item is damaged, defective, or incorrect.</p>
        <p>Keep the original packaging and accessories so our team can process your return faster.</p>
        <p>Once we inspect the item, we will arrange a replacement, exchange, or refund based on the issue and stock availability.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/60 p-6 space-y-3">
        <h2 className="text-xl font-bold text-slate-900">Next step</h2>
        <p className="text-sm text-slate-700">If you need help with a return, message our team and include your order number.</p>
        <Link href="/contact" className="inline-flex px-4 py-2 rounded-xl bg-emerald-500 text-slate-50 font-bold text-xs">Contact Support</Link>
      </div>
    </div>
  );
}
