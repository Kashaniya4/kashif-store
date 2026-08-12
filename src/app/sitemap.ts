import type { MetadataRoute } from 'next';
import { SITE_CONFIG, categorySlug } from '@/lib/seo';
import productsData from '@/data/products.json';
import { Product } from '@/types/store';

const products = productsData as unknown as Product[];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_CONFIG.url, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_CONFIG.url}/products`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${SITE_CONFIG.url}/policies`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_CONFIG.url}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_CONFIG.url}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_CONFIG.url}/shipping-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_CONFIG.url}/return-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_CONFIG.url}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_CONFIG.url}/terms-of-service`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_CONFIG.url}/products/${product.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const categories = Array.from(new Set(products.map((p) => p.category)));
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_CONFIG.url}/category/${categorySlug(category)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...categoryPages];
}
