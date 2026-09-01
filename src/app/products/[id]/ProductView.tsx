'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/store';
import { useStore } from '@/context/StoreContext';
import { categorySlug } from '@/lib/seo';
import {
  Star,
  ShoppingCart,
  ArrowLeft,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Tag,
  MessageCircle,
  BadgeCheck,
  Package,
  Sparkles,
  Heart,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { RecentlyViewed } from '@/components/RecentlyViewed';

export default function ProductView({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart, cart, getStock, toggleWishlist, isInWishlist, trackRecentlyViewed } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.image);
  const touchStartX = React.useRef(0);
  const isWishlisted = isInWishlist(product.id);

  const liveStock = getStock(product.id);
  const isInCart = cart.some(item => item.product.id === product.id);
  const inCartQty = cart.find(item => item.product.id === product.id)?.quantity ?? 0;

  // Track recently viewed on mount
  useEffect(() => {
    trackRecentlyViewed(product);
  }, [product, trackRecentlyViewed]);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuantity = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= liveStock) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    const added = addToCart(product, quantity);
    if (added) {
      setQuantity(1);
    }
  };

  const handleBuyNow = () => {
    const added = addToCart(product, quantity);
    if (added) {
      router.push('/checkout');
    }
  };

  const isSoldOut = liveStock <= 0;
  const canAddMore = inCartQty + quantity <= liveStock;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

      {/* Breadcrumb / Back button */}
      <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-600" aria-label="Breadcrumb">
        <Link href="/" className="inline-flex items-center gap-1 hover:text-emerald-600 transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Store Catalog</span>
        </Link>
        <span>/</span>
        <Link href={`/category/${categorySlug(product.category)}`} className="hover:text-emerald-600 transition">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* Product Image Showcase */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden relative">
          {/* Main Image with Swipe */}
          <div
            className="aspect-square relative overflow-hidden select-none touch-pan-y"
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              const dx = e.changedTouches[0].clientX - touchStartX.current;
              if (Math.abs(dx) > 50 && product.images && product.images.length > 1) {
                const cur = product.images.indexOf(selectedImage);
                if (dx < 0) {
                  // swipe left -> next
                  setSelectedImage(product.images[(cur + 1) % product.images.length]);
                } else {
                  // swipe right -> prev
                  setSelectedImage(product.images[(cur - 1 + product.images.length) % product.images.length]);
                }
              }
            }}
          >
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-contain transition-opacity duration-300"
            />
            {discountPercent > 0 && (
              <div className="absolute top-4 left-4 bg-orange-500 text-white font-extrabold text-xs px-3 py-1 rounded-lg shadow-lg flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                <span>SAVE {discountPercent}%</span>
              </div>
            )}
            {/* Swipe arrows */}
            {product.images && product.images.length > 1 && (
              <>
                <button
                  onClick={() => {
                    const cur = product.images!.indexOf(selectedImage);
                    setSelectedImage(product.images![(cur - 1 + product.images!.length) % product.images!.length]);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/40 hover:bg-white/50 text-slate-900 transition"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => {
                    const cur = product.images!.indexOf(selectedImage);
                    setSelectedImage(product.images![(cur + 1) % product.images!.length]);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/40 hover:bg-white/50 text-slate-900 transition"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                {/* counter */}
                <div className="absolute bottom-3 right-3 text-xs font-bold text-slate-900 bg-white/40 px-2 py-1 rounded-lg">
                  {product.images.indexOf(selectedImage) + 1} / {product.images.length}
                </div>
              </>
            )}
          </div>
          {/* Thumbnail Gallery */}
          {(product.images && product.images.length > 1) && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2 px-2" aria-label="Product images">
              {product.images.map((img, idx) => (
                <div key={img} role="listitem" className="shrink-0">
                  <button
                    onClick={() => setSelectedImage(img)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === img
                        ? 'border-emerald-600 shadow-lg shadow-emerald-500/20'
                        : 'border-slate-300 hover:border-slate-500'
                    }`}
                    aria-label={`View image ${idx + 1} of ${product.images?.length ?? product.images!.length}`}
                    aria-current={selectedImage === img ? 'true' : 'false'}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} - view ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Specs & Purchase Column */}
        <div className="space-y-6">

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              {product.category}
            </span>
            <h1 className="text-3xl font-black text-slate-900 mt-1 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-600">
              <div className="flex items-center gap-1 text-amber-600 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{product.rating}</span>
              </div>
              <span>•</span>
              <span>{product.reviewsCount} Customer Reviews</span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold">Verified Stock ({liveStock} units available)</span>
            </div>
          </div>

          {/* Pricing in PKR */}
          <div className="p-4 rounded-2xl bg-white/80 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-600">Price in Pakistan (PKR)</div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-900">
                  ₨ {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-500 line-through">
                    ₨ {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right text-xs text-emerald-600 font-semibold">
              <div>Inclusive of all taxes</div>
              <div>Free Delivery Over ₨ 15,000</div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              {product.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {product.tags.slice(0, 3).map((tag) => (
                <div key={tag} className="rounded-xl border border-slate-200 bg-white/60 p-3 text-slate-700 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{tag}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity Selector & Add to Cart & Wishlist */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
            <div className="flex items-center bg-white border border-slate-300 rounded-xl p-1">
              <button
                onClick={() => handleQuantity(-1)}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-extrabold text-sm text-slate-900" aria-live="polite">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantity(+1)}
                disabled={quantity >= liveStock}
                aria-label="Increase quantity"
                className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isSoldOut}
              className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add {quantity} to Cart</span>
              {isInCart && <Check className="w-4 h-4 text-emerald-700" />}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-4 rounded-2xl border transition flex items-center justify-center ${
                isWishlisted
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-600'
                  : 'bg-white border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-600'
              }`}
              title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-600' : ''}`} />
            </button>
          </div>

          {/* Buy Now — direct to checkout */}
          <button
            onClick={handleBuyNow}
            disabled={isSoldOut}
            className="w-full py-3 px-5 rounded-xl border border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap className="w-4 h-4" />
            <span>Buy Now</span>
          </button>

          {!canAddMore && !isSoldOut && (
            <p className="text-xs text-amber-600 font-semibold">
              Note: You already have {inCartQty} in your cart (max {liveStock} available).
            </p>
          )}

          {/* Technical Specifications Table */}
          <div className="pt-6 border-t border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Technical Specifications</h3>
            <div className="bg-white/60 rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-200 text-xs">
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between p-3">
                  <span className="text-slate-600 font-medium">{key}</span>
                  <span className="text-slate-900 font-semibold">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Trust Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 text-center text-xs">
            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <Truck className="w-4 h-4 text-emerald-600 mx-auto" />
              <div className="font-bold text-slate-800">Express Delivery</div>
              <div className="text-[10px] text-slate-600">TCS / Leopards</div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto" />
              <div className="font-bold text-slate-800">Official Warranty</div>
              <div className="text-[10px] text-slate-600">100% Genuine</div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <RotateCcw className="w-4 h-4 text-emerald-600 mx-auto" />
              <div className="font-bold text-slate-800">7 Days Return</div>
              <div className="text-[10px] text-slate-600">Hassle-Free</div>
            </div>
          </div>

        </div>

      </div>

      {/* Product confidence sections */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 space-y-3">
          <BadgeCheck className="w-6 h-6 text-emerald-600" />
          <h2 className="text-slate-900 font-bold">Why this product stands out</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {product.name} is selected for customers who want reliable quality, clear pricing in PKR, and a smooth Pakistani checkout experience.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 space-y-3">
          <Package className="w-6 h-6 text-emerald-600" />
          <h2 className="text-slate-900 font-bold">Packed for safe delivery</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            We prepare every order carefully and ship via trusted courier partners including TCS, Leopards, and Trax.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 space-y-3">
          <MessageCircle className="w-6 h-6 text-emerald-600" />
          <h2 className="text-slate-900 font-bold">Support before and after purchase</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Have questions about size, specs, payment, or delivery? Our local support team can help before checkout.
          </p>
        </div>
      </section>

      {/* Recently Viewed */}
      <RecentlyViewed />

      {/* Related discovery */}
      <section className="rounded-3xl border border-slate-200 bg-white/60 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Explore more</span>
          <h2 className="text-xl font-black text-slate-900 mt-1">More {product.category} products in Pakistan</h2>
          <p className="text-sm text-slate-600 mt-1">Compare similar products with local payments, PKR pricing, and nationwide delivery.</p>
        </div>
        <Link href={`/category/${categorySlug(product.category)}`} className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-black text-xs uppercase tracking-wider text-center">
          View Category
        </Link>
      </section>
    </div>
  );
}
