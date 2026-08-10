import type { Metadata } from 'next';
import Link from 'next/link';
import productsData from '@/data/products.json';
import { Product } from '@/types/store';
import { ServerProductCard } from '@/components/ServerProductCard';
import { StructuredData } from '@/components/StructuredData';
import { SITE_CONFIG, categorySlug, productListStructuredData } from '@/lib/seo';

const products = productsData as unknown as Product[];

export const metadata: Metadata = {
  title: 'All Products — Electronics, Fashion & Wearables in Pakistan',
  description: `Browse all ${products.length} products at Bazaar.pk — premium electronics, audio, fashion accessories and smart wearables in Pakistan. JazzCash, EasyPaisa, COD & nationwide delivery.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/products`,
  },
  openGraph: {
    title: `All Products — Electronics, Fashion & Wearables in Pakistan | ${SITE_CONFIG.name}`,
    description: `Browse all ${products.length} products at Bazaar.pk with nationwide delivery and local payment options.`,
    url: `${SITE_CONFIG.url}/products`,
    type: 'website',
    images: [{ url: '/brand/bazaar-logo.svg', width: 800, height: 400, alt: SITE_CONFIG.shortName }],
  },
};

export default function AllProductsPage() {
  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <StructuredData data={productListStructuredData(products)} />

      {/* Page header */}
      <div className="border-b border-slate-800 pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Full Catalog</span>
        <h1 className="text-3xl font-black text-white mt-1">All Products in Pakistan</h1>
        <p className="text-xs text-slate-400 mt-2 max-w-2xl">
          Shop the complete Bazaar.pk catalog — {products.length} products across {categories.length} categories, delivered nationwide via TCS, Leopards &amp; Trax with JazzCash, EasyPaisa and COD checkout.
        </p>
      </div>

      {/* Category quick links */}
      <nav className="flex flex-wrap gap-2" aria-label="Product categories">
        {categories.map(cat => (
          <Link
            key={cat}
            href={`/category/${categorySlug(cat)}`}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 border border-slate-800 transition"
          >
            {cat}
          </Link>
        ))}
      </nav>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(product => (
          <ServerProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
