import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import productsData from '@/data/products.json';
import { Product } from '@/types/store';
import ProductView from './ProductView';
import { StructuredData } from '@/components/StructuredData';
import {
  SITE_CONFIG,
  productStructuredData,
  breadcrumbStructuredData,
} from '@/lib/seo';

function findProduct(id: string): Product | undefined {
  return (productsData as unknown as Product[]).find(p => p.id === id || p.slug === id);
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = findProduct(id);

  if (!product) {
    return {
      title: 'Product Not Found — sastamaal.net',
      description: 'The product you are looking for does not exist or was removed.',
      robots: { index: false, follow: false },
    };
  }

  const priceDisplay = `₨ ${product.price.toLocaleString()}`;
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const description = `${product.name} — ${priceDisplay}${product.originalPrice ? ` (M.R.P. ₨ ${product.originalPrice.toLocaleString()})` : ''}${discount > 0 ? ` | ${discount}% OFF` : ''} | ${product.category} | Buy online at sastamaal.net with JazzCash, EasyPaisa, COD & nationwide delivery.`;
  const canonicalUrl = `${SITE_CONFIG.url}/products/${product.slug}`;

  return {
    title: `${product.name} — Buy Online in Pakistan`,
    description,
    keywords: [...product.tags, product.category, 'buy in Pakistan', 'online shopping Pakistan', 'JazzCash', 'COD'].join(', '),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      title: `${product.name} — Buy Online in Pakistan`,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      images: [
        {
          url: product.image,
          width: 1200,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} — Buy Online in Pakistan`,
      description,
      images: [product.image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = findProduct(id);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <h2 className="text-2xl font-bold text-white">Product Not Found</h2>
        <p className="text-sm text-slate-400">The product you are looking for does not exist or was removed.</p>
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  // Structured data: Product + BreadcrumbList (server-rendered for crawlers)
  const schema = [
    productStructuredData(product),
    breadcrumbStructuredData([
      { name: SITE_CONFIG.shortName, url: SITE_CONFIG.url },
      { name: product.category, url: `${SITE_CONFIG.url}/#products` },
      { name: product.name, url: `${SITE_CONFIG.url}/products/${product.slug}` },
    ]),
  ];

  return (
    <>
      <StructuredData data={schema} />
      <ProductView product={product} />
    </>
  );
}
