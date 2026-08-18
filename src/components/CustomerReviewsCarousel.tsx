'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Star, MessageCircle, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  city: string;
  avatar: string;
  rating: number;
  text: string;
  product: string;
  date: string;
  verified: boolean;
}

const reviews: Review[] = [
  {
    id: 1,
    name: 'Ahmed Raza',
    city: 'Lahore',
    avatar: 'AR',
    rating: 5,
    text: 'Ordered VoltX 65W charger — delivered in 18 hours via TCS! Genuine product, packaging was perfect.',
    product: 'VoltX Max 65W GaN Fast Charger',
    date: '2 days ago',
    verified: true,
  },
  {
    id: 2,
    name: 'Fatima Khan',
    city: 'Karachi',
    avatar: 'FK',
    rating: 5,
    text: 'ShieldView screen protector fits my iPhone 15 Pro Max perfectly. No bubbles, crystal clear.',
    product: 'ShieldView Ultra Clear Screen Protector',
    date: '5 days ago',
    verified: true,
  },
  {
    id: 3,
    name: 'Muhammad Ali',
    city: 'Islamabad',
    avatar: 'MA',
    rating: 5,
    text: 'BassBoom X speaker sounds amazing for the price. Battery lasts 12+ hours.',
    product: 'BassBoom X Wireless Bluetooth Speaker',
    date: '1 week ago',
    verified: true,
  },
  {
    id: 4,
    name: 'Sara Ahmed',
    city: 'Faisalabad',
    avatar: 'SA',
    rating: 4,
    text: 'SwiftLink cable is durable and charges fast. Customer support replied on WhatsApp within minutes.',
    product: 'SwiftLink 5A Braided USB-C Cable',
    date: '3 days ago',
    verified: true,
  },
  {
    id: 5,
    name: 'Bilal Hassan',
    city: 'Rawalpindi',
    avatar: 'BH',
    rating: 5,
    text: 'PowerCore 30000mAh power bank is a beast! Charged my phone 6 times on one charge.',
    product: 'PowerCore 30000mAh Power Bank',
    date: '4 days ago',
    verified: true,
  },
  {
    id: 6,
    name: 'Ayesha Malik',
    city: 'Multan',
    avatar: 'AM',
    rating: 5,
    text: 'AeroCool phone cooler works like magic during PUBG sessions. Phone stays cool even after 2 hours.',
    product: 'AeroCool Pro Magnetic Phone Cooler',
    date: '6 days ago',
    verified: true,
  },
];

export const CustomerReviewsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const animatingRef = useRef(false);
  const [reviewsPerView, setReviewsPerView] = useState(1);

  // Responsive reviews per view
  useEffect(() => {
    const updatePerView = () => {
      setReviewsPerView(window.innerWidth >= 768 ? 2 : 1);
    };
    updatePerView();
    window.addEventListener('resize', updatePerView, { passive: true });
    return () => window.removeEventListener('resize', updatePerView);
  }, []);

  const maxIndex = Math.max(0, reviews.length - reviewsPerView);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!animatingRef.current && maxIndex > 0) {
        animatingRef.current = true;
        setCurrentIndex(prev => (prev + 1 > maxIndex ? 0 : prev + 1));
        setTimeout(() => { animatingRef.current = false; }, 500);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [maxIndex]);

  const goToPrev = useCallback(() => {
    if (!animatingRef.current) {
      animatingRef.current = true;
      setCurrentIndex(prev => (prev - 1 < 0 ? maxIndex : prev - 1));
      setTimeout(() => { animatingRef.current = false; }, 500);
    }
  }, [maxIndex]);

  const goToNext = useCallback(() => {
    if (!animatingRef.current) {
      animatingRef.current = true;
      setCurrentIndex(prev => (prev + 1 > maxIndex ? 0 : prev + 1));
      setTimeout(() => { animatingRef.current = false; }, 500);
    }
  }, [maxIndex]);

  const slideWidthPercent = 100 / reviewsPerView;

  return (
    <div className="relative w-full bg-slate-950/60 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-5 lg:p-7 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-emerald-400" />
          <h3 className="text-white font-bold text-lg">Customer Reviews</h3>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="text-xs text-amber-300 font-bold">4.9/5</span>
          <span className="text-[10px] text-slate-500">({reviews.length}+ reviews)</span>
        </div>
      </div>

      {/* Reviews Carousel */}
      <div className="relative h-[200px] sm:h-[240px]">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * slideWidthPercent}%)` }}
        >
          {reviews.map((review, index) => {
            const isVisible = index >= currentIndex && index < currentIndex + reviewsPerView;
            return (
              <div
                key={review.id}
                style={{ width: `${slideWidthPercent}%` }}
                className={`shrink-0 px-2 transition-opacity duration-300 ${
                  isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <div className="h-full bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0">
                        {review.avatar}
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm">{review.name}</div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <span>{review.city}</span>
                          <span>•</span>
                          <span>{review.date}</span>
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
                    <div className="flex items-center gap-0.5 shrink-0">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Product */}
                  <div className="text-emerald-400 text-xs font-medium mb-2">{review.product}</div>

                  {/* Review Text */}
                  <p className="text-slate-200 text-sm leading-relaxed flex-1">
                    {review.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrev}
          disabled={maxIndex === 0}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-slate-800 hover:border-emerald-500/50 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous review"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={goToNext}
          disabled={maxIndex === 0}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-slate-800 hover:border-emerald-500/50 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next review"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots Indicator */}
        {maxIndex > 0 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {Array.from({ length: maxIndex + 1 }, (_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!animatingRef.current) {
                    animatingRef.current = true;
                    setCurrentIndex(i);
                    setTimeout(() => { animatingRef.current = false; }, 500);
                  }
                }}
                className={`h-2 rounded-full transition-all ${
                  i === currentIndex
                    ? 'bg-emerald-400 w-5'
                    : 'w-2 bg-slate-600 hover:bg-slate-500'
                }`}
                aria-label={`Go to review set ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
