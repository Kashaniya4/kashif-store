'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MessageCircle,
  ShieldCheck,
  Truck,
  RefreshCw,
  PhoneCall,
  Mail,
  MapPin
} from 'lucide-react';

const POLICY_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Shipping Policy', href: '/shipping-policy' },
  { label: 'Return Policy', href: '/return-policy' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms-of-service' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Pakistani Value Propositions Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">Fast Express Shipping</h4>
              <p className="text-xs text-slate-400">TCS, Leopards & Trax 24-48h Delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">100% Genuine Products</h4>
              <p className="text-xs text-slate-400">Verified Quality & Warranty</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">Pakistani Local Support</h4>
              <p className="text-xs text-slate-400">JazzCash, EasyPaisa & COD Accepted</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">Easy 7-Day Returns</h4>
              <p className="text-xs text-slate-400">Hassle-Free Replacement Policy</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 py-12 border-b border-slate-800">

          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/brand/bazaar-icon.svg"
                alt="sastamaal.net"
                width={160}
                height={160}
                className="h-12 w-12 object-contain"
              />
              <span className="text-2xl font-extrabold text-white tracking-tight">
                sastamaal<span className="text-emerald-400">.net</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 pr-4">
              Pakistan&apos;s next-generation e-commerce destination with seamless local mobile wallet checkout (JazzCash, EasyPaisa, SadaPay, COD) and nationwide courier delivery.
            </p>

            {/* Social Links */}
            <div className="pt-2">
              <h5 className="text-xs font-semibold uppercase text-slate-200 tracking-wider mb-3">Connect With Us</h5>
              <div className="flex flex-wrap items-center gap-2">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center justify-center rounded-lg bg-slate-900 hover:bg-pink-600/20 hover:text-pink-400 border border-slate-800 hover:border-pink-500/50 px-3 py-1.5 text-sm transition-colors" title="Instagram">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="https://wa.me/923397100515" target="_blank" rel="noreferrer" className="flex items-center justify-center rounded-lg bg-slate-900 hover:bg-emerald-600/20 hover:text-emerald-400 border border-slate-800 hover:border-emerald-500/50 px-3 py-1.5 text-sm transition-colors" title="WhatsApp Business"><MessageCircle className="w-4 h-4" /></a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="flex items-center justify-center rounded-lg bg-slate-900 hover:bg-blue-600/20 hover:text-blue-400 border border-slate-800 hover:border-blue-500/50 px-3 py-1.5 text-sm transition-colors" title="Facebook"><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
                <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="flex items-center justify-center rounded-lg bg-slate-900 hover:bg-cyan-600/20 hover:text-cyan-400 border border-slate-800 hover:border-cyan-500/50 px-3 py-1.5 text-sm transition-colors" title="TikTok"><span className="font-bold text-xs">TT</span></a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center justify-center rounded-lg bg-slate-900 hover:bg-sky-600/20 hover:text-sky-400 border border-slate-800 hover:border-sky-500/50 px-3 py-1.5 text-sm transition-colors" title="LinkedIn"><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="flex items-center justify-center rounded-lg bg-slate-900 hover:bg-rose-600/20 hover:text-rose-400 border border-slate-800 hover:border-rose-500/50 px-3 py-1.5 text-sm transition-colors" title="YouTube"><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Quick Links</h5>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/" className="hover:text-emerald-400 transition">Store Catalog</Link></li>
              <li><Link href="/products" className="hover:text-emerald-400 transition">All Products</Link></li>
              <li><Link href="/checkout" className="hover:text-emerald-400 transition">Checkout Page</Link></li>
              <li><Link href="/policies" className="hover:text-emerald-400 transition">Policies</Link></li>
            </ul>
          </div>

          {/* Payment Gateways Info */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Supported Payments</h5>
            <div className="space-y-2 text-xs">
              <div className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-slate-300"><span className="font-semibold text-rose-400">JazzCash</span><span className="text-[10px] text-slate-500">Mobile Wallet</span></div>
              <div className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-slate-300"><span className="font-semibold text-emerald-400">EasyPaisa</span><span className="text-[10px] text-slate-500">Mobile Wallet</span></div>
              <div className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-slate-300"><span className="font-semibold text-teal-300">SadaPay / NayaPay</span><span className="text-[10px] text-slate-500">Virtual Debit</span></div>
              <div className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-slate-300"><span className="font-semibold text-amber-300">Cash on Delivery</span><span className="text-[10px] text-slate-500">Nationwide</span></div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Help & Support</h5>
            <ul className="space-y-3 text-xs">
              <li>
                <a
                  href="https://maps.app.goo.gl/BhU2TupDpo9d5qLN7?g_st=awb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 hover:text-emerald-400 transition-colors group"
                >
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="underline decoration-dotted underline-offset-2 decoration-slate-600 group-hover:decoration-emerald-400">
                    Al-Hamd telecom, Main Sir Sayyad Road, Block 8, Khanewal
                  </span>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <PhoneCall className="w-5 h-5 text-emerald-400 shrink-0" />
                <a href="tel:+923397100515" className="text-emerald-400 hover:text-pink-400 transition-colors text-sm font-medium" title="Call support">
                  0339-7100515
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
                <a href="mailto:blasterbeaty@gmail.com" className="text-emerald-400 hover:text-pink-400 transition-colors text-sm font-medium" title="Email support">
                  blasterbeaty@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <a href="https://wa.me/923397100515" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-pink-400 transition-colors text-sm font-medium" title="WhatsApp support">
                  WhatsApp: 0339-7100515
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 text-center">
          <p className="text-xs text-slate-400 mb-2">© {new Date().getFullYear()} sastamaal.net. All rights reserved. Built for Pakistan E-Commerce.</p>
          <div className="flex flex-wrap justify-center gap-2 text-slate-400">
            {POLICY_LINKS.map((link, i) => (
              <React.Fragment key={link.href}>
                {i > 0 && <span>•</span>}
                <Link href={link.href} className="hover:text-emerald-400 transition text-xs">{link.label}</Link>
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};
