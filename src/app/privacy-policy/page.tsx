import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'sastamaal.net privacy policy describing how we handle customer information.',
  alternates: { canonical: `${SITE_CONFIG.url}/privacy-policy` },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Privacy Policy</span>
        <h1 className="text-3xl font-black text-slate-900">Privacy Policy</h1>
        <p className="text-sm text-slate-700 leading-relaxed">
          sastamaal.net respects your privacy. We only collect the information needed to process orders, improve the store, and provide customer support.
        </p>
      </div>

      <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
        <p>We may use your name, phone number, email, and address to fulfill orders and communicate about delivery.</p>
        <p>We do not sell your personal data. Payment details are handled through the selected payment method or gateway flow.</p>
        <p>We may store cart or order preferences locally in your browser to improve the shopping experience.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/60 p-6 space-y-3">
        <h2 className="text-xl font-bold text-slate-900">Questions about privacy?</h2>
        <p className="text-sm text-slate-700">Reach out to our support team anytime.</p>
        <Link href="/contact" className="inline-flex px-4 py-2 rounded-xl bg-emerald-500 text-slate-50 font-bold text-xs">Contact Support</Link>
      </div>
    </div>
  );
}
