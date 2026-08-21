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
} from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'newest', label: 'Newest' },
  { value: 'discount', label: 'Biggest Discount' },
];

const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under ₨1,000', min: 0, max: 1000 },
  { label: '₨1,000 - ₨5,000', min: 1000, max: 5000 },
  { label: '₨5,000 - ₨10,000', min: 5000, max: 10000 },
  { label: '₨10,000 - ₨20,000', min: 10000, max: 20000 },
  { label: 'Over ₨20,000', min: 20000, max: Infinity },
];

export default function AllProductsPage() {
  const { products } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filtered = useMemo(() => {
    let result = [...products];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Category
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Price
    if (priceRange > 0) {
      const range = PRICE_RANGES[priceRange];
      result = result.filter(p => p.price >= range.min && p.price < range.max);
    }

    // Rating
    if (minRating > 0) {
      result = result.filter(p => p.rating >= minRating);
    }

    // In stock
    if (inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'discount':
        result.sort((a, b) => {
          const dA = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) * 100 : 0;
          const dB = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) * 100 : 0;
          return dB - dA;
        });
        break;
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [products, search, selectedCategory, sortBy, priceRange, minRating, inStockOnly]);

  const activeFilters = [
    selectedCategory !== 'All' && { label: selectedCategory, clear: () => setSelectedCategory('All') },
    priceRange > 0 && { label: PRICE_RANGES[priceRange].label, clear: () => setPriceRange(0) },
    minRating > 0 && { label: `${minRating}+ Stars`, clear: () => setMinRating(0) },
    inStockOnly && { label: 'In Stock', clear: () => setInStockOnly(false) },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  return (
    <div className="pb-20">
      <StructuredData data={productListStructuredData(products)} />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4">
            <Link href="/" className="hover:text-emerald-400 transition">Home</Link>
            <span>/</span>
            <span className="text-slate-300">All Products</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-black text-white">All Products</h1>
          <p className="text-sm text-slate-400 mt-2">
            {filtered.length} of {products.length} products — nationwide delivery, local payments
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Search + Sort + Filter Toggle */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search products, categories, tags..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-900 text-white placeholder-slate-400 text-sm rounded-xl py-2.5 pl-10 pr-10 border border-slate-700 focus:outline-none focus:border-emerald-500 transition"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-3 text-slate-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-slate-900 text-white text-sm rounded-xl py-2.5 pl-10 pr-10 border border-slate-700 focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition ${
              showFilters
                ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-emerald-500/50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Active Filter Pills */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeFilters.map((f, i) => (
              <button
                key={i}
                onClick={f.clear}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition"
              >
                {f.label}
                <X className="w-3 h-3" />
              </button>
            ))}
            <button
              onClick={() => { setSelectedCategory('All'); setPriceRange(0); setMinRating(0); setInStockOnly(false); setSearch(''); }}
              className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-semibold hover:bg-slate-700 transition"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Expanded Filters */}
        {showFilters && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="text-xs font-bold text-slate-300 mb-2 block">Category</label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition ${
                      selectedCategory === cat
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-emerald-500/30'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <label className="text-xs font-bold text-slate-300 mb-2 block">Price Range</label>
              <div className="flex flex-wrap gap-1.5">
                {PRICE_RANGES.map((range, i) => (
                  <button
                    key={i}
                    onClick={() => setPriceRange(i)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition ${
                      priceRange === i
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-emerald-500/30'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="text-xs font-bold text-slate-300 mb-2 block">Minimum Rating</label>
              <div className="flex gap-1.5">
                {[0, 3, 4, 4.5].map(r => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition ${
                      minRating === r
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-amber-500/30'
                    }`}
                  >
                    {r === 0 ? 'All' : `${r}+ ★`}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Filter */}
            <div>
              <label className="text-xs font-bold text-slate-300 mb-2 block">Availability</label>
              <button
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`px-4 py-1.5 rounded-lg text-[11px] font-semibold transition ${
                  inStockOnly
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-emerald-500/30'
                }`}
              >
                {inStockOnly ? '✓ In Stock Only' : 'Show All'}
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <PackageCheck className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No products found</h3>
            <p className="text-sm text-slate-400">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
