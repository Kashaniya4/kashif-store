import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/seo';
import { ShieldCheck, MessageCircle, ArrowLeft, RefreshCw, Clock, FileText, CheckCircle2, XCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Warranty Claim — sastamaal.net',
  description: 'File a warranty claim for products purchased from sastamaal.net. Fast processing, Pakistan-wide support.',
  alternates: { canonical: `${SITE_CONFIG.url}/warranty-claim` },
};

export default function WarrantyClaimPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Warranty</span>
        <h1 className="text-3xl font-black text-white">Warranty Claim</h1>
        <p className="text-xl font-bold text-emerald-400 mt-2 tracking-wide" dir="rtl">اب خریدا ہوا سامان واپس بھی ہوگا، تبدیل بھی۔</p>
        <p className="text-sm text-slate-300 leading-relaxed">
          All products on sastamaal.net come with official manufacturer warranty. File a claim below — our team processes claims within 24–48 hours.
        </p>
      </div>

      {/* Quick Steps */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-emerald-400" /></div>
          <h3 className="text-white font-bold">1. Gather Info</h3>
          <p className="text-sm text-slate-400">Order number, product name, issue description, and photos of the defect.</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><MessageCircle className="w-5 h-5 text-emerald-400" /></div>
          <h3 className="text-white font-bold">2. Contact Us</h3>
          <p className="text-sm text-slate-400">WhatsApp or email our warranty team with the details. We reply within 4 hours.</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><RefreshCw className="w-5 h-5 text-emerald-400" /></div>
          <h3 className="text-white font-bold">3. Resolution</h3>
          <p className="text-sm text-slate-400">Replacement, repair, or refund — whichever is fastest for you.</p>
        </div>
      </div>

      {/* What's Covered */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">What's Covered</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Manufacturing defects</p>
              <p className="text-xs text-slate-400">Faulty components, dead pixels, charging issues, audio problems</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Premature failure</p>
              <p className="text-xs text-slate-400">Products failing under normal use within warranty period</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Missing accessories</p>
              <p className="text-xs text-slate-400">Cables, adapters, ear tips listed in box contents</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Software/firmware bugs</p>
              <p className="text-xs text-slate-400">Official firmware issues affecting core functionality</p>
            </div>
          </div>
        </div>
      </div>

      {/* What's NOT Covered */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Not Covered</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Physical damage</p>
              <p className="text-xs text-slate-400">Cracks, dents, water damage, crushed cables</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Unauthorized repair</p>
              <p className="text-xs text-slate-400">Opened/modified by non-authorized technicians</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Wear & tear</p>
              <p className="text-xs text-slate-400">Cable fraying, battery degradation, cosmetic scratches</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Wrong charger/voltage</p>
              <p className="text-xs text-slate-400">Damage from incompatible power adapters</p>
            </div>
          </div>
        </div>
      </div>

      {/* File Claim */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <h2 className="text-xl font-bold text-white">File Your Claim</h2>
        <div className="space-y-3 text-sm text-slate-300">
          <p><strong>WhatsApp (Fastest):</strong> +92 3XX XXXXXXX — Send order #, photos, issue description</p>
          <p><strong>Email:</strong> warranty@sastamaal.net — Subject: "Warranty Claim — [Order #]"</p>
          <p><strong>Hours:</strong> Mon–Sat 10 AM – 7 PM PKT | Response within 4 hours</p>
        </div>
        <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm">
          <MessageCircle className="w-4 h-4" />
          Contact Warranty Team
        </Link>
      </div>

      {/* Related Policies */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-2">
        <h3 className="text-sm font-bold text-white flex items-center gap-2"><FileText className="w-4 h-4 text-emerald-400" /> Related Policies</h3>
        <div className="flex flex-wrap gap-2">
          <Link href="/return-policy" className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 text-xs transition">Return & Replacement</Link>
          <Link href="/shipping-policy" className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 text-xs transition">Shipping Policy</Link>
          <Link href="/terms-of-service" className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 text-xs transition">Terms of Service</Link>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition">
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Link>
      </div>
    </div>
  );
}