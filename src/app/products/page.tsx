'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/ProductCard';
import { StructuredData } from '@/components/StructuredData';
import { productListStructuredData } from '@/lib/seo';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  PackageCheck,
  X,
  ChevronDown,
  Filter,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low → High' },
  { value: 'price-high', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'Name A–Z' },
  { value: 'discount', label: 'Biggest Discount' },
];

const PRICE_RANGES = [
  { label: 'All', min: 0, max: Infinity },
  { label: 'Under ₨1K', min: 0, max: 1000 },
  { label: '₨1K – ₨5K', min: 1000, max: 5000 },
  { label: '₨5K – ₨10K', min: 5000, max: 10000 },
  { label: '₨10K – ₨20K', min: 10000, max: 20000 },
  { label: '₨20K+', min: 20000, max: Infinity },
];

const RATINGS = [0, 3, 4, 4.5];

export default function AllProductsPage() {
  const { products } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filtered = useMemo(() => {
    let result = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)));
    }
    if (selectedCategory !== 'All') result = result.filter(p => p.category === selectedCategory);
    if (priceRange > 0) { const r = PRICE_RANGES[priceRange]; result = result.filter(p => p.price >= r.min && p.price < r.max); }
    if (minRating > 0) result = result.filter(p => p.rating >= minRating);
    if (inStockOnly) result = result.filter(p => p.stock > 0);

    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'discount': result.sort((a, b) => { const dA = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) * 100 : 0; const dB = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) * 100 : 0; return dB - dA; }); break;
      default: result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
    return result;
  }, [products, search, selectedCategory, sortBy, priceRange, minRating, inStockOnly]);

  const resetFilters = () => { setSelectedCategory('All'); setPriceRange(0); setMinRating(0); setInStockOnly(false); setSearch(''); setSortBy('featured'); };

  return (
    <div className="pb-20">
      <StructuredData data={productListStructuredData(products)} />

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-xs mb-4">
            <Link href="/" className="hover:text-emerald-400 transition">Home</Link>
            <span>/</span>
            <span className="text-slate-300">All Products</span>
            <div className="ml-auto flex items-center gap-3">
              <Link href="/warranty-claim" className="hover:text-emerald-400 transition text-xs">Warranty Claim</Link>
              <Link href="/return-policy" className="hover:text-emerald-400 transition text-xs">Return Policy</Link>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">All Products</h1>
          <p className="text-sm text-slate-400 mt-2">{filtered.length} of {products.length} products — nationwide delivery, local payments</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Mobile: Search + Filter Toggle */}
        <div className="flex gap-3 mb-4 lg:hidden">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-slate-900 text-white placeholder-slate-400 text-sm rounded-xl py-2.5 pl-10 pr-4 border border-slate-700 focus:outline-none focus:border-emerald-500 transition" />
          </div>
          <button onClick={() => setShowMobileFilters(!showMobileFilters)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-slate-300 border border-slate-700 text-sm font-semibold">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        {/* Mobile Filters Panel */}
        {showMobileFilters && (
          <div className="lg:hidden bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-4 space-y-4">
            <SidebarFilters categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} priceRange={priceRange} setPriceRange={setPriceRange} minRating={minRating} setMinRating={setMinRating} inStockOnly={inStockOnly} setInStockOnly={setInStockOnly} sortBy={sortBy} setSortBy={setSortBy} resetFilters={resetFilters} />
          </div>
        )}

        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-emerald-400" /> Filters</h3>
                <button onClick={resetFilters} className="text-[11px] text-slate-500 hover:text-emerald-400 transition">Reset</button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-slate-800 text-white placeholder-slate-400 text-xs rounded-lg py-2 pl-8 pr-3 border border-slate-700 focus:outline-none focus:border-emerald-500 transition" />
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Categories</h4>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${selectedCategory === cat ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-emerald-500/30'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <SidebarFilters categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} priceRange={priceRange} setPriceRange={setPriceRange} minRating={minRating} setMinRating={setMinRating} inStockOnly={inStockOnly} setInStockOnly={setInStockOnly} sortBy={sortBy} setSortBy={setSortBy} resetFilters={resetFilters} />

              {/* Customer Care */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Customer Care</h4>
                <div className="space-y-1">
                  <Link href="/warranty-claim" className="flex items-center gap-2 text-xs text-slate-300 hover:text-emerald-400 py-1 transition">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Warranty Claim</span>
                  </Link>
                  <Link href="/return-policy" className="flex items-center gap-2 text-xs text-slate-300 hover:text-emerald-400 py-1 transition">
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Return Policy</span>
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-slate-500">{filtered.length} products</span>
              <div className="relative">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-slate-900 text-white text-xs rounded-lg py-2 pl-8 pr-8 border border-slate-700 focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer">
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <PackageCheck className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-lg font-bold text-white">No products found</h3>
                <p className="text-sm text-slate-400">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarFilters({ categories, selectedCategory, setSelectedCategory, priceRange, setPriceRange, minRating, setMinRating, inStockOnly, setInStockOnly, sortBy, setSortBy, resetFilters }: { categories: string[]; selectedCategory: string; setSelectedCategory: (v: string) => void; priceRange: number; setPriceRange: (v: number) => void; minRating: number; setMinRating: (v: number) => void; inStockOnly: boolean; setInStockOnly: (v: boolean) => void; sortBy: string; setSortBy: (v: string) => void; resetFilters: () => void }) {
  return (
    <div className="space-y-4">
      {/* Category */}
      <div>
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Category</label>
        <div className="flex flex-wrap gap-1.5">
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${selectedCategory === cat ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-emerald-500/30'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Price Range</label>
        <div className="flex flex-wrap gap-1.5">
          {PRICE_RANGES.map((r, i) => (
            <button key={i} onClick={() => setPriceRange(i)} className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${priceRange === i ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-emerald-500/30'}`}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Rating</label>
        <div className="flex gap-1.5">
          {RATINGS.map(r => (
            <button key={r} onClick={() => setMinRating(r)} className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${minRating === r ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-amber-500/30'}`}>
              {r === 0 ? 'All' : `${r}★+`}
            </button>
          ))}
        </div>
      </div>

      {/* Stock */}
      <div>
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Availability</label>
        <button onClick={() => setInStockOnly(!inStockOnly)} className={`w-full px-3 py-1.5 rounded-md text-[11px] font-semibold transition ${inStockOnly ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-emerald-500/30'}`}>
          {inStockOnly ? '✓ In Stock Only' : 'Show All'}
        </button>
      </div>
    </div>
  );
}
