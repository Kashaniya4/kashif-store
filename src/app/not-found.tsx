import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-6 bg-white/60 border border-slate-200 p-8 sm:p-10 rounded-3xl backdrop-blur-md shadow-2xl">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-600/40 text-emerald-600 text-3xl font-black shadow-inner">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Page Not Found</h1>
          <p className="text-sm text-slate-600 max-w-sm mx-auto">
            The gadget or page you are looking for has been moved or doesn&apos;t exist.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-50 font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/products"
            className="px-6 py-3 rounded-xl border border-slate-300 hover:border-slate-600 bg-slate-100/80 text-slate-900 font-semibold text-sm transition flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            Browse Catalog
          </Link>
        </div>

        {/* Quick Links */}
        <div className="pt-6 border-t border-slate-200">
          <div className="text-xs text-slate-500 mb-3 font-medium">Popular Categories</div>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: 'Electronics & Audio', href: '/category/electronics-and-audio' },
              { label: 'Mobile Accessories', href: '/category/mobile-accessories' },
              { label: 'Wearables', href: '/category/wearables' },
              { label: 'Fashion', href: '/category/fashion-and-accessories' },
            ].map(cat => (
              <Link
                key={cat.href}
                href={cat.href}
                className="text-[11px] px-3 py-1.5 rounded-lg bg-slate-100/60 border border-slate-300/60 text-slate-700 hover:text-emerald-600 hover:border-emerald-500/40 transition"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
