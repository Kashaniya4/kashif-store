import type { MetadataRoute } from 'next';
import { SITE_CONFIG, categorySlug } from '@/lib/seo';
import productsData from '@/data/products.json';
import { Product } from '@/types/store';

const products = productsData as unknown as Product[];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static core pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_CONFIG.url,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_CONFIG.url}/products`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Every product detail page (uses slug → canonical URL)
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_CONFIG.url}/products/${product.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // One canonical category URL per distinct category
  const categories = Array.from(new Set(products.map((p) => p.category)));
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_CONFIG.url}/category/${categorySlug(category)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...categoryPages];
}
