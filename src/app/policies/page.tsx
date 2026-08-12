import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Policies',
  description: 'Browse sastamaal.net policy pages for privacy, shipping, returns, and terms.',
  alternates: { canonical: `${SITE_CONFIG.url}/policies` },
};

export default function PoliciesPage() {
  const links = [
    ['About Us', '/about'],
    ['Contact', '/contact'],
    ['Shipping Policy', '/shipping-policy'],
    ['Return Policy', '/return-policy'],
    ['Privacy Policy', '/privacy-policy'],
    ['Terms of Service', '/terms-of-service'],
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Policies</span>
        <h1 className="text-3xl font-black text-white">Policies & Information</h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Find all support and policy pages for sastamaal.net in one place.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-white hover:border-emerald-500 transition">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
