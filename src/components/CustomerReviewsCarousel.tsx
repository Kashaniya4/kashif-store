'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Star, MessageCircle, ChevronLeft, ChevronRight, ShieldCheck, Plus, X, Check } from 'lucide-react';

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

const INITIAL_REVIEWS: Review[] = [
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
  const [reviewsList, setReviewsList] = useState<Review[]>(INITIAL_REVIEWS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const animatingRef = useRef(false);
  const [reviewsPerView, setReviewsPerView] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCity, setFormCity] = useState('Lahore');
  const [formProduct, setFormProduct] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formText, setFormText] = useState('');

  // Load custom reviews from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pk_store_reviews');
      if (saved) {
        setReviewsList([...JSON.parse(saved), ...INITIAL_REVIEWS]);
      }
    } catch (e) { /* ignore */ }
  }, []);

  // Responsive reviews per view
  useEffect(() => {
    const updatePerView = () => {
      setReviewsPerView(window.innerWidth >= 768 ? 2 : 1);
    };
    updatePerView();
    window.addEventListener('resize', updatePerView, { passive: true });
    return () => window.removeEventListener('resize', updatePerView);
  }, []);

  const maxIndex = Math.max(0, reviewsList.length - reviewsPerView);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!animatingRef.current && maxIndex > 0 && !isModalOpen) {
        animatingRef.current = true;
        setCurrentIndex(prev => (prev + 1 > maxIndex ? 0 : prev + 1));
        setTimeout(() => { animatingRef.current = false; }, 500);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [maxIndex, isModalOpen]);

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

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formText.trim()) return;

    const initials = formName.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const newReview: Review = {
      id: Date.now(),
      name: formName.trim(),
      city: formCity,
      avatar: initials || 'PK',
      rating: formRating,
      text: formText.trim(),
      product: formProduct.trim() || 'Verified Purchase',
      date: 'Just now',
      verified: true,
    };

    const updated = [newReview, ...reviewsList];
    setReviewsList(updated);

    try {
      const existing = JSON.parse(localStorage.getItem('pk_store_reviews') || '[]');
      localStorage.setItem('pk_store_reviews', JSON.stringify([newReview, ...existing]));
    } catch (err) { /* ignore */ }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsModalOpen(false);
      setFormName('');
      setFormText('');
      setFormProduct('');
      setCurrentIndex(0);
    }, 1200);
  };

  const slideWidthPercent = 100 / reviewsPerView;

  return (
    <div className="relative w-full bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-5 lg:p-7 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-emerald-600" />
          <h3 className="text-slate-900 font-bold text-lg">Customer Reviews</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-600" />
            <span className="text-xs text-amber-600 font-bold">4.9/5</span>
            <span className="text-[10px] text-slate-500">({reviewsList.length}+ reviews)</span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 border border-emerald-600/40 text-xs font-semibold transition"
          >
            <Plus className="w-3.5 h-3.5" /> Write a Review
          </button>
        </div>
      </div>

      {/* Reviews Carousel */}
      <div className="relative h-[200px] sm:h-[240px]">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * slideWidthPercent}%)` }}
        >
          {reviewsList.map((review, index) => {
            const isVisible = index >= currentIndex && index < currentIndex + reviewsPerView;
            return (
              <div
                key={review.id}
                style={{ width: `${slideWidthPercent}%` }}
                className={`shrink-0 px-2 transition-opacity duration-300 ${
                  isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <div className="h-full bg-white/80 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 font-bold text-xs shrink-0">
                        {review.avatar}
                      </div>
                      <div>
                        <div className="text-slate-900 font-semibold text-sm">{review.name}</div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-600">
                          <span>{review.city}</span>
                          <span>•</span>
                          <span>{review.date}</span>
                          {review.verified && (
                            <>
                              <span>•</span>
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600">Verified</span>
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
                            i < review.rating ? 'fill-amber-400 text-amber-600' : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Product */}
                  <div className="text-emerald-600 text-xs font-medium mb-2">{review.product}</div>

                  {/* Review Text */}
                  <p className="text-slate-800 text-sm leading-relaxed flex-1 line-clamp-3">
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
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 border border-slate-300 text-slate-900 hover:bg-slate-100 hover:border-emerald-600/50 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed z-10"
          aria-label="Previous review"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={goToNext}
          disabled={maxIndex === 0}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 border border-slate-300 text-slate-900 hover:bg-slate-100 hover:border-emerald-600/50 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed z-10"
          aria-label="Next review"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots Indicator */}
        {maxIndex > 0 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
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
                className={`h-6 px-1 flex items-center justify-center rounded-full transition-all ${
                  i === currentIndex
                    ? 'w-6'
                    : 'w-4 hover:bg-slate-200'
                }`}
                aria-label={`Go to review set ${i + 1}`}
              >
                <span
                  className={`block rounded-full transition-all ${
                    i === currentIndex
                      ? 'w-4 h-2 bg-emerald-500'
                      : 'w-2 h-2 bg-slate-600'
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Write a Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md p-4 animate-in fade-in-0 duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-600 hover:text-slate-900 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">Review Submitted!</h4>
                <p className="text-xs text-slate-600">Thank you for sharing your feedback with the community.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <h4 className="text-xl font-black text-slate-900">Write a Customer Review</h4>
                  <p className="text-xs text-slate-600 mt-1">Share your experience with fellow shoppers across Pakistan.</p>
                </div>

                {/* Star Rating */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Rating</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormRating(star)}
                        className="p-1 hover:scale-110 transition"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= formRating
                              ? 'fill-amber-400 text-amber-600'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & City */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Usman Ali"
                      value={formName}
                      onChange={e => setFormName(e.target.value)}
                      className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Lahore, Karachi"
                      value={formCity}
                      onChange={e => setFormCity(e.target.value)}
                      className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Product Purchased (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. VoltX Max 65W GaN Fast Charger"
                    value={formProduct}
                    onChange={e => setFormProduct(e.target.value)}
                    className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Review</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tell us about the delivery, build quality, and performance..."
                    value={formText}
                    onChange={e => setFormText(e.target.value)}
                    className="w-full bg-slate-100 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-50 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
