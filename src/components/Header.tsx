'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { ShoppingBag, Search, User as UserIcon, LogOut, Sparkles, Truck, Globe, Heart, X, ArrowRight, Star, ChevronDown } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    products,
    user,
    setUser,
    setIsCartOpen,
    setIsAuthModalOpen,
    searchQuery,
    setSearchQuery,
    getCartItemsCount,
    wishlist,
    selectedCategory,
    setSelectedCategory,
  } = useStore();

  const router = useRouter();
  const pathname = usePathname();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const cartCount = getCartItemsCount();
  const wishlistCount = wishlist.length;

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  // Search suggestions: top 4 matching products
  const suggestions = searchQuery.trim()
    ? products
        .filter(p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 4)
    : [];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-xl">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-xs py-1.5 px-4 text-center font-medium tracking-wide flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-600" />
          <span>FAST DELIVERIES ACROSS PAKISTAN • USE CODE <strong className="bg-emerald-700 px-1.5 py-0.5 rounded text-amber-700">WELCOME10</strong> FOR 10% OFF</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-emerald-100">
          <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Nationwide Shipping (TCS, Leopards, Trax)</span>
          <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> PKR (₨) Currency</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24 gap-4">
          {/* Logo — wide format with neon cyber glow + Urdu Tagline */}
          <Link href="/" className="shrink-0 group flex flex-col items-center sm:flex-row sm:items-center" title="sastamaal.net - Home">
            <img
              src="/brand/sastamaal-logo.png"
              alt="sastamaal.net"
              className="h-14 sm:h-18 w-auto max-w-[240px] sm:max-w-[320px] object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_12px_rgba(16,185,129,0.35)]"
            />
            <div className="pt-1 sm:pl-4 sm:pt-0 text-center sm:text-left">
              <p className="text-sm sm:text-base font-bold text-emerald-600 tracking-wide" dir="rtl">
                اب خریدا ہوا سامان واپس بھی ہوگا، تبدیل بھی۔
              </p>
            </div>
          </Link>

          {/* Live Search with Dropdown Suggestions */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <div className="relative w-full flex items-center rounded-full bg-slate-100/90 border border-slate-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition overflow-hidden">
              {/* Category filter button inside search bar */}
              <div ref={dropdownRef} className="relative shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCategoryDropdownOpen(prev => !prev);
                    setIsSearchFocused(false);
                  }}
                  className="flex items-center gap-1 pl-3 pr-2.5 text-[11px] font-bold whitespace-nowrap text-emerald-600 hover:text-emerald-700 transition border-r border-slate-300 h-9"
                  aria-label="Select category"
                >
                  <span className="max-w-[70px] truncate">{selectedCategory === 'All' ? 'All' : selectedCategory}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {/* Category dropdown */}
                {isCategoryDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in-0 duration-200 py-1.5">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsCategoryDropdownOpen(false);
                          if (pathname !== '/') router.push('/#products');
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-medium transition flex items-center justify-between ${
                          selectedCategory === cat
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <input
                type="text"
                placeholder="Search chargers, earbuds, power banks..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-xs py-2.5 pr-8 pl-3 focus:outline-none transition"
              />
              <Search className="w-4 h-4 text-slate-600 absolute right-3 top-3 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-8 top-3 text-slate-600 hover:text-slate-900"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown Suggestions */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in-0 duration-200">
                <div className="p-2 space-y-1">
                  {suggestions.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-600">
                      No gadgets found matching &quot;{searchQuery}&quot;
                    </div>
                  ) : (
                    <>
                      <div className="px-3 py-1 text-[10px] font-bold uppercase text-slate-600 tracking-wider">
                        Products ({suggestions.length})
                      </div>
                      {suggestions.map(item => (
                        <Link
                          key={item.id}
                          href={`/products/${item.slug || item.id}`}
                          onClick={() => setIsSearchFocused(false)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100/80 transition group"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-50 shrink-0 relative">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-slate-900 truncate group-hover:text-emerald-600 transition-colors">
                              {item.name}
                            </div>
                            <div className="flex items-center gap-2 text-[11px]">
                              <span className="text-emerald-600 font-bold">₨ {item.price.toLocaleString()}</span>
                              <span className="text-slate-500">•</span>
                              <span className="text-slate-600">{item.category}</span>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-600 transition shrink-0" />
                        </Link>
                      ))}
                      <div className="pt-1 border-t border-slate-200">
                        <Link
                          href="/products"
                          onClick={() => setIsSearchFocused(false)}
                          className="block text-center py-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition"
                        >
                          View all catalog results →
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Categories Filter Bar — desktop only, upper right */}
          <div className="hidden lg:flex items-center gap-1.5 shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  if (pathname !== '/') router.push('/#products');
                }}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-50 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-100 text-slate-700 border border-slate-300 hover:border-emerald-600/50 hover:text-emerald-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative p-2.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 border border-slate-300 text-slate-700 hover:text-rose-600 transition flex items-center justify-center min-w-[38px] min-h-[38px]"
              title="My Wishlist"
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-600' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-slate-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center gap-2 bg-slate-100/80 border border-slate-300 rounded-full py-1.5 px-3">
                {user.avatar ? (
                  <Image src={user.avatar} alt={user.name} width={28} height={28} className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <UserIcon className="w-4 h-4 text-emerald-600" />
                )}
                <span className="text-xs font-medium max-w-[100px] truncate text-slate-800 hidden sm:inline">
                  {user.name.split(' ')[0]}
                </span>
                <button
                  onClick={() => setUser(null)}
                  className="p-0.5 text-slate-600 hover:text-rose-600 transition"
                  title="Logout"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 transition text-xs font-medium"
                title="Sign In / Guest"
              >
                Sign In
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-50 hover:from-emerald-400 hover:to-teal-400 font-bold transition shadow-lg shadow-emerald-500/20 py-2.5 px-3 flex items-center justify-center min-w-[38px] min-h-[38px]"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-slate-50 text-emerald-600 text-[11px] font-extrabold w-4.5 h-4.5 rounded-full border-2 border-emerald-400 flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile-only search bar */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-slate-900 placeholder-slate-400 text-xs rounded-lg py-2 pl-8 pr-3 border border-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
            <Search className="w-3.5 h-3.5 text-slate-600 absolute left-2.5 top-2.5" />
          </div>
        </div>
      </div>
    </header>
  );
};
