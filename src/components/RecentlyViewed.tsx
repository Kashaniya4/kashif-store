'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { Clock, ArrowRight, Star } from 'lucide-react';

export const RecentlyViewed: React.FC = () => {
  const { recentlyViewed } = useStore();

  if (recentlyViewed.length === 0) return null;

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Recently Viewed</h3>
            <p className="text-xs text-slate-400">Items you checked out recently</p>
          </div>
        </div>
        <Link
          href="/products"
          className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {recentlyViewed.slice(0, 6).map(product => (
          <Link
            key={product.id}
            href={`/products/${product.slug || product.id}`}
            className="group bg-slate-900/90 border border-slate-800 rounded-xl p-3 hover:border-emerald-500/40 transition flex flex-col justify-between"
          >
            <div className="aspect-square relative rounded-lg overflow-hidden bg-slate-950 mb-2">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                {product.name}
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs font-bold text-emerald-400">
                  ₨ {product.price.toLocaleString()}
                </span>
                <div className="flex items-center gap-0.5 text-[10px] text-amber-400">
                  <Star className="w-2.5 h-2.5 fill-amber-400" />
                  <span>{product.rating}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
