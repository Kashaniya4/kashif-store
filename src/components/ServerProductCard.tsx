import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/store';
import { Star, ArrowRight } from 'lucide-react';

/**
 * Server-rendered product card — used by SEO landing pages (/products,
 * /category/[slug]) so product names, prices, ratings and links appear in
 * the initial HTML that search engines crawl. No client store dependency.
 */
export const ServerProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <article className="group bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5">
      <Link href={`/products/${product.slug || product.id}`} className="block relative aspect-square overflow-hidden bg-slate-950">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 bg-rose-500 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-md shadow-md">
            {discountPercent}% OFF
          </span>
        )}
        <span className="absolute bottom-3 right-3 bg-slate-900/90 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
          In Stock ({product.stock})
        </span>
      </Link>

      <div className="p-5">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-medium text-emerald-400">{product.category}</span>
          <span className="flex items-center gap-1 text-amber-400 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            {product.rating}
            <span className="text-slate-500">({product.reviewsCount})</span>
          </span>
        </div>

        <h2 className="font-bold text-base text-white leading-snug group-hover:text-emerald-400 transition-colors">
          {product.name}
        </h2>

        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-lg font-extrabold text-white">₨ {product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-xs text-slate-500 line-through">₨ {product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        <Link href={`/products/${product.slug || product.id}`} className="mt-4 inline-block w-full text-center py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5">
          View Product
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </article>
  );
};
