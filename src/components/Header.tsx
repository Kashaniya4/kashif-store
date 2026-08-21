'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { ShoppingBag, Search, User as UserIcon, LogOut, Sparkles, Truck, Globe } from 'lucide-react';

export const Header: React.FC = () => {
  const {
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
          <span>FAST DELIVERIES ACROSS PAKISTAN • USE CODE <strong className="bg-emerald-800 px-1.5 py-0.5 rounded text-amber-200">WELCOME10</strong> FOR 10% OFF</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-emerald-100">
          <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Nationwide Shipping (TCS, Leopards, Trax)</span>
          <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> PKR (₨) Currency</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 gap-4">
          {/* Logo + brand name */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group" title="sastamaal.net - Home">
            <img
              src="/brand/sastamaal-logo.png"
              alt="sastamaal.net"
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight group-hover:text-emerald-400 transition-colors hidden sm:inline">
              sastamaal<span className="text-emerald-400">.net</span>
            </span>
          </Link>

          {/* Live Search */}
          <div className="hidden md:flex flex-1 max-w-xs mx-4 relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/80 text-white placeholder-slate-400 text-xs rounded-full py-2 pl-9 pr-3 border border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Right Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Auth Button */}
            {user ? (
              <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-full py-1.5 px-3">
                {user.avatar ? (
                  <Image src={user.avatar} alt={user.name} width={28} height={28} className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <UserIcon className="w-4 h-4 text-emerald-400" />
                )}
                <span className="text-xs font-medium max-w-[100px] truncate text-slate-200 hidden sm:inline">
                  {user.name.split(' ')[0]}
                </span>
                <button
                  onClick={() => setUser(null)}
                  className="p-0.5 text-slate-400 hover:text-rose-400 transition"
                  title="Logout"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition text-xs font-medium"
                title="Sign In / Guest"
              >
                Sign In
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 font-bold transition shadow-lg shadow-emerald-500/20 py-2.5 px-3 flex items-center justify-center min-w-[36px] min-h-[36px]"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-slate-950 text-emerald-400 text-[11px] font-extrabold w-4.5 h-4.5 rounded-full border-2 border-emerald-400 flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
