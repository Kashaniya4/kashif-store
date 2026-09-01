import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import productsData from '@/data/products.json';
import { Product } from '@/types/store';
import { ServerProductCard } from '@/components/ServerProductCard';
import { StructuredData } from '@/components/StructuredData';
import {
  SITE_CONFIG,
  categorySlug,
  categoryFromSlug,
  productListStructuredData,
  breadcrumbStructuredData,
  faqStructuredData,
} from '@/lib/seo';

const products = productsData as unknown as Product[];

// Friendly category descriptors used in metadata + FAQ copy
const CATEGORY_DESCRIPTORS: Record<string, { title: string; description: string; keywords: string[] }> = {
  'fashion-and-accessories': {
    title: 'Fashion & Accessories',
    description: 'Premium leather bags, accessories and fashion items in Pakistan.',
    keywords: ['leather bags Pakistan', 'fashion accessories', 'premium bags', 'travel duffel'],
  },
  'electronics-and-audio': {
    title: 'Electronics & Audio',
    description: 'Wireless earbuds, audio gear and electronics in Pakistan.',
    keywords: ['earbuds Pakistan', 'wireless earbuds', 'ANC headphones', 'audio gear'],
  },
  wearables: {
    title: 'Wearables',
    description: 'Smart watches and wearable tech in Pakistan.',
    keywords: ['smartwatch Pakistan', 'smart watch', 'fitness tracker', 'wearables'],
  },
};

export function generateStaticParams() {
  const categories = Array.from(new Set(products.map(p => p.category)));
  return categories.map(cat => ({ slug: categorySlug(cat) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryFromSlug(slug);
  const descriptor = CATEGORY_DESCRIPTORS[slug];

  const title = descriptor
    ? `${descriptor.title} in Pakistan — Buy Online`
    : category
    ? `${category} in Pakistan — Buy Online`
    : 'Category Not Found';
  const description = descriptor
    ? descriptor.description
    : category
    ? `Shop ${category} online in Pakistan at sastamaal.net. Fast nationwide delivery, JazzCash/EasyPaisa/COD payment.`
    : 'Browse products in this category at sastamaal.net.';

  const canonical = `${SITE_CONFIG.url}/category/${slug}`;

  return {
    title,
    description,
    keywords: descriptor ? descriptor.keywords.join(', ') : undefined,
    alternates: { canonical },
    openGraph: {
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      url: canonical,
      type: 'website',
    },
    robots: {
      index: !!category,
      follow: true,
      googleBot: { index: !!category, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categoryFromSlug(slug);
  const descriptor = CATEGORY_DESCRIPTORS[slug];

  const categoryProducts = category
    ? products.filter(p => p.category === category)
    : [];

  if (!category || categoryProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Category Not Found</h1>
        <p className="text-sm text-slate-600">This category does not exist or has no products yet.</p>
        <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-slate-50 font-bold text-xs">
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Products</span>
        </Link>
      </div>
    );
  }

  const schemas = [
    productListStructuredData(categoryProducts),
    breadcrumbStructuredData([
      { name: SITE_CONFIG.shortName, url: SITE_CONFIG.url },
      { name: 'All Products', url: `${SITE_CONFIG.url}/products` },
      { name: category, url: `${SITE_CONFIG.url}/category/${slug}` },
    ]),
    faqStructuredData([
      {
        question: `Where can I buy ${category} online in Pakistan?`,
        answer: `You can buy ${category} online at sastamaal.net. We deliver nationwide in 24-48 hours via TCS, Leopards and Trax, with free shipping on orders over Rs. 15,000.`,
      },
      {
        question: `What payment methods does sastamaal.net accept for ${category.toLowerCase()}?`,
        answer: `sastamaal.net accepts JazzCash, EasyPaisa, SadaPay, NayaPay, Visa/Mastercard, bank transfer and Cash on Delivery (COD) for all ${category.toLowerCase()} orders.`,
      },
    ]),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <StructuredData data={schemas} />

      {/* Breadcrumb nav */}
      <nav className="flex items-center gap-2 text-xs text-slate-600" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-emerald-600 transition">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-emerald-600 transition">All Products</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">{category}</span>
      </nav>

      {/* Page header */}
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Category</span>
        <h1 className="text-3xl font-black text-slate-900 mt-1">
          {descriptor?.title ?? category} in Pakistan
        </h1>
        <p className="text-xs text-slate-600 mt-2 max-w-2xl">
          {descriptor?.description ?? `Shop ${category} online in Pakistan`} — {categoryProducts.length} products available with nationwide delivery and local payment options.
        </p>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categoryProducts.map(product => (
          <ServerProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
