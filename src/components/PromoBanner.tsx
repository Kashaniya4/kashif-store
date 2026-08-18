'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface PromoBannerImage {
  src: string;
  alt: string;
  href: string;
}

interface PromoBannerProps {
  href: string;
  title: string;
  subtitle: string;
  cta?: string;
  icon: LucideIcon;
  accentText?: string;
  variant?: 'emerald' | 'violet';
  images?: PromoBannerImage[];
}

/**
 * Dark sci-fi themed promo banner tile with animated laser beams,
 * firework bursts, floating particles, and cyberpunk grid.
 */
export const PromoBanner: React.FC<PromoBannerProps> = ({
  href,
  title,
  subtitle,
  cta = 'Explore',
  icon: Icon,
  accentText,
  variant = 'emerald',
  images = [],
}) => {
  const isViolet = variant === 'violet';

  return (
    <Link
      href={href}
      className={`group relative rounded-xl overflow-hidden p-2.5 flex flex-col justify-between hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-lg shadow-black/30 border border-white/5 ${isViolet ? 'scifi-tile violet' : 'scifi-tile'}`}
    >
      {/* Cyberpunk grid background */}
      <div className="absolute inset-0 scifi-grid pointer-events-none" />

      {/* Animated laser beams — fewer, thinner */}
      <div className="laser-beam" style={{ left: '20%', animationDelay: '0s' }} />
      <div className="laser-beam cyan" style={{ left: '60%', animationDelay: '2.5s' }} />

      {/* Firework bursts — smaller */}
      <div className={`firework ${isViolet ? 'violet' : ''}`} style={{ top: '20%', right: '10%' }} />

      {/* Top glow accent */}
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl pointer-events-none"
        style={{ background: isViolet ? 'rgba(139, 92, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)' }} />

      {/* Compact row: icon + title + badge + arrow */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className={`p-1 rounded-lg backdrop-blur-sm border ${isViolet
          ? 'bg-violet-500/15 border-violet-500/30'
          : 'bg-emerald-500/15 border-emerald-500/30'
        }`}>
          <Icon className={`w-3.5 h-3.5 ${isViolet ? 'text-violet-400' : 'text-emerald-400'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white text-[11px] font-bold leading-tight truncate drop-shadow-lg">{title}</h3>
          <p className="text-slate-400 text-[9px] leading-tight truncate">{subtitle}</p>
        </div>
        {accentText && (
          <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wider backdrop-blur-sm border shrink-0 ${isViolet
            ? 'bg-violet-500/20 text-violet-300 border-violet-500/40'
            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          }`}>
            {accentText}
          </span>
        )}
        <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isViolet ? 'text-violet-400' : 'text-emerald-400'} group-hover:translate-x-0.5 transition-transform`} />
      </div>

      {/* Product thumbnail row — 4 small inline */}
      {images.length > 0 && (
        <div className="relative z-10 grid grid-cols-4 gap-1.5 pt-1.5">
          {images.slice(0, 4).map((img, i) => (
            <div
              key={i}
              className="h-10 rounded-md overflow-hidden border border-white/10 hover:border-white/25 transition-all bg-black/40"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </Link>
  );
};
