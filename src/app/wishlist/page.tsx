'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/ProductCard';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, products } = useStore();

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-emerald-400 transition">Home</Link>
        <span>/</span>
        <span className="text-slate-300">My Wishlist</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Heart className="w-6 h-6 fill-rose-500/20" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">My Wishlist</h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
        </div>

        <Link
          href="/products"
          className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
        </Link>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-24 space-y-4 bg-slate-900/30 border border-slate-800/60 rounded-3xl p-8 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Your wishlist is empty</h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Explore our gadget catalog and click the heart icon on any product to save it here for later.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20"
          >
            <ShoppingBag className="w-4 h-4" />
            Discover Gadgets
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
