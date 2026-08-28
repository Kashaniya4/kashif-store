'use client';

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';

/**
 * Full-width horizontal auto-scrolling customer reviews strip.
 * Shows review cards with profile avatars, ratings, and review text.
 * Pauses on hover, resumes on leave.
 */

interface MarqueeReview {
  id: number;
  name: string;
  city: string;
  avatar: string;
  rating: number;
  text: string;
  product: string;
  verified: boolean;
}

const INITIAL_REVIEWS: MarqueeReview[] = [
  {
    id: 1,
    name: 'Ahmed Raza',
    city: 'Lahore',
    avatar: 'AR',
    rating: 5,
    text: 'Ordered my charger and it arrived within 18 hours via TCS! Genuine product, packaging was perfect.',
    product: '45W PD Adapter',
    verified: true,
  },
  {
    id: 2,
    name: 'Fatima Khan',
    city: 'Karachi',
    avatar: 'FK',
    rating: 5,
    text: 'AirPods sound amazing, noise cancellation works great. Best price I found online.',
    product: 'Apple AirPods 3',
    verified: true,
  },
  {
    id: 3,
    name: 'Muhammad Ali',
    city: 'Islamabad',
    avatar: 'MA',
    rating: 5,
    text: 'The soundbar hits way above its price. Bass is punchy and setup took 2 minutes.',
    product: 'Ronin R-3010 Soundbar',
    verified: true,
  },
  {
    id: 4,
    name: 'Sara Ahmed',
    city: 'Faisalabad',
    avatar: 'SA',
    rating: 4,
    text: 'Power bank is a beast, charged my phone 5 times on one charge. Delivery was quick.',
    product: 'Octo 50000mAh Power Bank',
    verified: true,
  },
  {
    id: 5,
    name: 'Bilal Hassan',
    city: 'Rawalpindi',
    avatar: 'BH',
    rating: 5,
    text: 'Great quality smartwatch, bracelet looks premium and battery lasts a full week.',
    product: 'Smart Watch 8 Classic',
    verified: true,
  },
  {
    id: 6,
    name: 'Ayesha Malik',
    city: 'Multan',
    avatar: 'AM',
    rating: 5,
    text: 'Super fast shipping and the phone cooler works like magic during gaming sessions.',
    product: 'Magnetic Cooling Fan 15W',
    verified: true,
  },
  {
    id: 7,
    name: 'Usman Farooq',
    city: 'Peshawar',
    avatar: 'UF',
    rating: 5,
    text: 'Cable is durable and charges at full speed. Support answered on WhatsApp instantly.',
    product: '60W Fast Charge Cable',
    verified: true,
  },
  {
    id: 8,
    name: 'Hina Yousaf',
    city: 'Sialkot',
    avatar: 'HY',
    rating: 4,
    text: 'Earbuds have excellent battery life and the case is pocket friendly. Very happy!',
    product: 'Buds 3 Pro ANC',
    verified: true,
  },
];

export const ProductMarquee: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const posRef = useRef(0);
  const speed = 1;

  // Memoize duplicated reviews — no re-render allocation
  const items = useMemo(() => [...INITIAL_REVIEWS, ...INITIAL_REVIEWS], []);

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
    <section className="relative overflow-hidden border-y border-slate-800 bg-slate-950/80 backdrop-blur-sm py-4">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

      <div
        ref={scrollRef}
        className="flex gap-4 py-2 px-4 overflow-x-auto scrollbar-none"
        onMouseEnter={() => { isPausedRef.current = true; }}
        onMouseLeave={() => { isPausedRef.current = false; }}
        style={{ scrollBehavior: 'auto' }}
      >
        {items.map((review, i) => (
          <div
            key={`${review.id}-${i}`}
            className="group shrink-0 w-72 sm:w-80 rounded-xl border border-slate-800 bg-slate-900/70 p-4 backdrop-blur-sm transition-all hover:border-emerald-500/50"
          >
            {/* Header: avatar + name + verified */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold text-xs shrink-0 shadow-lg shadow-emerald-500/20">
                {review.avatar}
              </div>
              <div className="min-w-0">
                <div className="text-white font-semibold text-sm truncate">{review.name}</div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <span>{review.city}</span>
                  {review.verified && (
                    <>
                      <span>•</span>
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Verified</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Rating stars */}
            <div className="flex items-center gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3.5 h-3.5 ${
                    star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                  }`}
                />
              ))}
            </div>

            {/* Review text */}
            <p className="relative text-slate-200 text-xs leading-relaxed line-clamp-3">
              <Quote className="w-3 h-3 text-emerald-500/50 absolute -left-0.5 -top-0.5" />
              <span className="pl-3">{review.text}</span>
            </p>

            {/* Product */}
            <div className="mt-2 text-emerald-400 text-[10px] font-medium">{review.product}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
