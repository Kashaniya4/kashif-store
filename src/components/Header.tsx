'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { ShoppingBag, Search, User as UserIcon, LogOut, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    cart,
    user,
    setUser,
    setIsCartOpen,
    setIsAuthModalOpen,
    searchQuery,
    setSearchQuery,
    getCartItemsCount
  } = useStore();

  const cartCount = getCartItemsCount();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-xs py-1.5 px-4 text-center font-medium tracking-wide flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
          <span>🚀 FAST DELIVERIES ACROSS PAKISTAN • USE CODE <strong className="bg-emerald-800 px-1.5 py-0.5 rounded text-amber-200">WELCOME10</strong> FOR 10% OFF</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-emerald-100">
          <span>📍 Nationwide Shipping (TCS, Leopards, Trax)</span>
          <span>🇵🇰 PKR (₨) Currency</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/brand/sastamaal-logo-transparent.png"
              alt="sastamaal.net"
              width={512}
              height={280}
              priority
              className="h-10 w-auto object-contain group-hover:opacity-90 transition-opacity"
            />
          </Link>

          {/* Live Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <input
              type="text"
              placeholder="Search items by name, category, or tag..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/80 text-white placeholder-slate-400 text-sm rounded-full py-2.5 pl-10 pr-4 border border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          {/* Right Navigation */}
          <div className="flex items-center gap-3">
            {/* Auth Button */}
            {user ? (
              <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-full py-1.5 px-3">
                {user.avatar ? (
                  <Image src={user.avatar} alt={user.name} width={24} height={24} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <UserIcon className="w-4 h-4 text-emerald-400" />
                )}
                <span className="text-xs font-medium max-w-[90px] truncate text-slate-200">
                  {user.name.split(' ')[0]}
                </span>
                <button
                  onClick={() => setUser(null)}
                  className="text-slate-400 hover:text-rose-400 p-0.5 ml-1 transition"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition"
              >
                Sign In / Guest
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 font-bold transition shadow-lg shadow-emerald-500/20 flex items-center justify-center"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-slate-950 text-emerald-400 text-[11px] font-extrabold w-5 h-5 rounded-full border-2 border-emerald-400 flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 text-white placeholder-slate-400 text-xs rounded-lg py-2 pl-9 pr-3 border border-slate-700 focus:outline-none focus:border-emerald-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>
    </header>
  );
};
