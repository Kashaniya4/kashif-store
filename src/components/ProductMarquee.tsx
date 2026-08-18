'use client';

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';

/**
 * Full-width horizontal auto-scrolling product image strip.
 * Clickable thumbnails that scroll left-to-right continuously.
 * Pauses on hover, resumes on leave.
 */
export const ProductMarquee: React.FC = () => {
  const { products } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const posRef = useRef(0);
  const speed = 1.5;

  // Memoize duplicated items — no re-render allocation
  const items = useMemo(() => [...products, ...products], [products]);

  const animate = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (!isPausedRef.current) {
      posRef.current += speed;
      if (posRef.current >= el.scrollWidth / 2) {
        posRef.current = 0;
      }
      el.scrollLeft = posRef.current;
    }
    requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [animate]);

  return (
    <section className="relative overflow-hidden border-y border-slate-800 bg-slate-950/80 backdrop-blur-sm">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

      <div
        ref={scrollRef}
        className="flex gap-4 py-3 px-4 overflow-x-auto scrollbar-none"
        onMouseEnter={() => { isPausedRef.current = true; }}
        onMouseLeave={() => { isPausedRef.current = false; }}
        style={{ scrollBehavior: 'auto' }}
      >
        {items.map((product, i) => (
          <Link
            key={`${product.id}-${i}`}
            href={`/products/${product.slug || product.id}`}
            className="group shrink-0 flex flex-col items-center gap-1.5 w-20 transition-all hover:scale-110"
          >
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-slate-800 group-hover:border-emerald-500/60 transition-all shadow-md group-hover:shadow-lg group-hover:shadow-emerald-500/20">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <span className="text-[10px] text-slate-500 group-hover:text-emerald-400 transition-colors text-center leading-tight w-full truncate">
              {product.name.split(' ').slice(0, 2).join(' ')}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};
