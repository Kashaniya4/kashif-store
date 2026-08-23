'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { ShoppingCart, Heart, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
      {toasts.map(toast => {
        const isCart = toast.type === 'cart';
        const isWishlist = toast.type === 'wishlist';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/95 border border-slate-700 text-white shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isCart
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : isWishlist
                    ? 'bg-rose-500/20 text-rose-400'
                    : 'bg-cyan-500/20 text-cyan-400'
                }`}
              >
                {isCart && <ShoppingCart className="w-4 h-4" />}
                {isWishlist && <Heart className="w-4 h-4 fill-rose-500" />}
                {!isCart && !isWishlist && <Info className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white">{toast.message}</div>
                {toast.productName && (
                  <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                    {toast.productName}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 text-slate-500 hover:text-slate-300 transition"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
