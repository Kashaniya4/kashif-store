'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/store';
import { useStore } from '@/context/StoreContext';
import { Star, ShoppingCart, Check, Tag, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, cart, getStock, toggleWishlist, isInWishlist } = useStore();
  const isInCart = cart.some(item => item.product.id === product.id);
  const liveStock = getStock(product.id);
  const inCartQty = cart.find(item => item.product.id === product.id)?.quantity ?? 0;
  const isSoldOut = liveStock <= 0;
  const isMaxed = inCartQty >= liveStock;
  const isWishlisted = isInWishlist(product.id);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-white/80 border border-slate-200 rounded-2xl overflow-hidden hover:border-emerald-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 flex flex-col justify-between relative">

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md border transition-all duration-200 ${
          isWishlisted
            ? 'bg-rose-500/20 border-rose-500/50 text-rose-600'
            : 'bg-white/70 border-slate-300/60 text-slate-600 hover:text-slate-900 hover:scale-110'
        }`}
        title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        aria-label="Wishlist"
      >
        <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-600' : ''}`} />
      </button>

      {/* Product Image & Badges — clickable */}
      <Link href={`/products/${product.slug || product.id}`} className="relative block aspect-square overflow-hidden bg-slate-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isFeatured && (
            <span className="bg-emerald-500 text-slate-50 font-bold text-[10px] uppercase px-2.5 py-1 rounded-md shadow-md">
              Featured
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-orange-500 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-md shadow-md flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Stock Badge */}
        <div className="absolute bottom-3 right-3">
          {!isSoldOut ? (
            <span className="bg-emerald-950/95 text-emerald-700 border border-emerald-500/40 text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
              In Stock ({liveStock})
            </span>
          ) : (
            <span className="bg-rose-50/95 text-rose-300 border border-rose-500/40 text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
              Out of Stock
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
            <span className="font-medium text-emerald-600">{product.category}</span>
            <div className="flex items-center gap-1 text-amber-600 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-500">({product.reviewsCount})</span>
            </div>
          </div>

          <Link href={`/products/${product.slug || product.id}`}>
            <h3 className="font-bold text-base text-slate-900 line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Price in Pakistan</div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-slate-900">
                ₨ {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-500 line-through">
                  ₨ {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={isSoldOut || isMaxed}
            className={`p-3 rounded-xl font-bold transition-all flex items-center justify-center ${
              isInCart
                ? 'bg-emerald-950 border border-emerald-600 text-emerald-600'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-50 shadow-md shadow-emerald-500/20'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={
              isSoldOut
                ? 'Out of Stock'
                : isMaxed
                ? 'Max quantity in cart'
                : isInCart
                ? 'In Cart'
                : 'Add to Cart'
            }
          >
            {isInCart ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
          </button>
        </div>

      </div>
    </div>
  );
};
