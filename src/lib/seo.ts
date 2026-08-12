/**
 * Centralized SEO configuration for sastamaal.net
 * All site-wide constants, metadata generators, and structured data helpers.
 */
import { Product } from '@/types/store';
import productsData from '@/data/products.json';

// ---------------------------------------------------------------------------
// 1. Site Identity
// ---------------------------------------------------------------------------
export const SITE_CONFIG = {
  name: 'sastamaal.net',
  shortName: 'SASTAMAAL',
  description:
    "sastamaal.net is Pakistan's next-generation e-commerce destination with seamless local mobile wallet checkout (JazzCash, EasyPaisa, SadaPay, COD) and nationwide courier delivery across Karachi, Lahore, Islamabad, Faisalabad and more.",
  descriptionLong:
    "sastamaal.net is Pakistan's premier online store delivering premium electronics, fashion & accessories with JazzCash, EasyPaisa, SadaPay & cash-on-delivery payment options. Fast 24-48hr express shipping via TCS, Leopards & Trax to all major Pakistani cities.",
  url: 'https://sastamaal.net',
  domain: 'sastamaal.net',
  logo: 'https://sastamaal.net/brand/sastamaal-logo.png',
  logoTextOnly: 'https://sastamaal.net/brand/sastamaal-logo-transparent.png',
  locale: 'en-PK',
  currency: 'PKR',
  phone: '+923397100515',
  phoneDisplay: '0339-7100515',
  email: 'blasterbeaty@gmail.com',
  address: {
    street: 'Al-Hamd telecom, Main Sir Sayyad Road, Block 8',
    city: 'Khanewal',
    region: 'Punjab',
    postalCode: '',
    country: 'PK',
  },
  social: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    tiktok: 'https://tiktok.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
    whatsapp: 'https://wa.me/923397100515',
  },
  keywords: [
    'pakistan ecommerce',
    'online shopping pakistan',
    'jazzcash',
    'easypaisa',
    'sadapay',
    'cod cash on delivery',
    'tcs delivery',
    'leopards courier',
    'trax logistics',
    'electronics karachi',
    'fashion lahore',
    'smartphone islamabad',
    'earbuds pakistan',
    'smartwatch',
    'leather bag',
    'wearables',
    'audio',
    'sastamaal',
    'khanewal ecommerce',
  ],
} as const;

// ---------------------------------------------------------------------------
// 2. Default metadata factory (used by layout.tsx and any page fallback)
// ---------------------------------------------------------------------------
export const DEFAULT_OG_IMAGE = '/api/og'; // fallback — replace with static if desired

export function buildMetadata(overrides: {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  openGraph?: Record<string, unknown>;
}) {
  const title = overrides.title
    ? `${overrides.title} | ${SITE_CONFIG.name}`
    : `${SITE_CONFIG.shortName} | ${SITE_CONFIG.name}`;
  const description = overrides.description ?? SITE_CONFIG.description;

  const metadata: Record<string, unknown> = {
    title,
    description,
    keywords: overrides.openGraph?.keywords ?? [...SITE_CONFIG.keywords].join(', '),
    authors: [{ name: 'sastamaal.net Team', url: SITE_CONFIG.url }],
    creator: 'sastamaal.net Team',
    publisher: 'sastamaal.net',
    formatDetection: {
      email: false,
      address: false,
      telephone: SITE_CONFIG.phoneDisplay,
    },
    alternates: {
      canonical: overrides.canonical ?? SITE_CONFIG.url,
      languages: { 'en-PK': '/en-PK/', 'ur-PK': '/ur-PK/' }, // ur-PK stub (not yet localized)
    },
    openGraph: {
      type: 'website',
      locale: SITE_CONFIG.locale,
      siteName: SITE_CONFIG.name,
      title,
      description,
      url: overrides.canonical ?? SITE_CONFIG.url,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: SITE_CONFIG.shortName,
        },
      ],
      ...overrides.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
      creator: '@sastamaalnet',
      site: '@sastamaalnet',
    },
    robots: {
      index: overrides.noindex ? false : true,
      follow: overrides.noindex ? false : true,
      ...(overrides.noindex
        ? { noarchive: true, nosnippet: true }
        : {
            googleBot: {
              index: true,
              follow: true,
              'max-image-preview': 'large',
              'max-snippet': -1,
              'max-video-preview': -1,
            },
          }),
    },
  };

  return metadata;
}

// ---------------------------------------------------------------------------
// 4. Category slug helpers — used by sitemap, category pages, product listing
// ---------------------------------------------------------------------------
/** "Fashion & Accessories" → "fashion-accessories" (strip non-alphanumeric) */
export function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** "fashion-and-accessories" → "Fashion & Accessories" (match products) */
export function categoryFromSlug(slug: string): string | null {
  const normalized = slug.toLowerCase().replace(/-/g, ' ');
  const direct = productsData.find(
    p => p.category.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, ' ') === normalized.replace(/[^a-z0-9]+/g, ' ')
  );
  if (direct) return direct.category;

  // fuzzy fallback: "fashion-accessories" → category starting with "fashion"
  const firstWord = slug.split('-')[0];
  const fuzzy = productsData.find(p =>
    p.category.toLowerCase().startsWith(firstWord)
  );
  return fuzzy ? fuzzy.category : null;
}

// ---------------------------------------------------------------------------
// 5. Structured-data helpers
// ---------------------------------------------------------------------------
export function productStructuredData(product: Product) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: [product.image],
    description: product.description,
    sku: product.id,
    mpn: product.id.replace('prod-', 'SASTAMAAL-NET-'),
    gtin: `000000${Math.abs(product.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0))}`,
    brand: { '@type': 'Brand', name: 'sastamaal.net' },
    category: product.category,
    keywords: product.tags.join(', '),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      bestRating: 5,
      reviewCount: product.reviewsCount,
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_CONFIG.url}/products/${product.slug}`,
      priceCurrency: SITE_CONFIG.currency,
      price: product.price,
      priceValidUntil: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
      ...(product.originalPrice
        ? {
            totalPrice: product.price,
            priceCurrency: SITE_CONFIG.currency,
            itemCondition: 'https://schema.org/NewCondition',
          }
        : {}),
      seller: { '@type': 'Organization', name: 'sastamaal.net', url: SITE_CONFIG.url },
      ...(discount > 0
        ? {
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: product.price,
              priceCurrency: SITE_CONFIG.currency,
              valueAddedTaxIncluded: true,
              eligibleQuantity: { '@type': 'QuantitativeValue', value: 1 },
            },
          }
        : {}),
    },
    ...(discount > 0
      ? {
          isAccessoryOrSparePart: false,
        }
      : {}),
  };
}

export function productListStructuredData(products: Product[]) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'ItemList',
    name: `${SITE_CONFIG.shortName} Product Catalog`,
    url: SITE_CONFIG.url,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 25).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_CONFIG.url}/products/${p.slug}`,
      name: p.name,
    })),
  };
}

export function breadcrumbStructuredData(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqStructuredData(
  pairs: { question: string; answer: string }[]
) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'FAQPage',
    mainEntity: pairs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
}

export function organizationStructuredData() {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Organization',
    '@id': `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: SITE_CONFIG.logo,
    logoTextOnly: SITE_CONFIG.logoTextOnly,
    foundingDate: '2026-08-11',
    currency: SITE_CONFIG.currency,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.address.street,
      addressLocality: SITE_CONFIG.address.city,
      addressRegion: SITE_CONFIG.address.region,
      postalCode: SITE_CONFIG.address.postalCode,
      addressCountry: SITE_CONFIG.address.country,
    },
    contactPoints: [
      {
        '@type': 'ContactPoint',
        telephone: SITE_CONFIG.phone,
        contactType: 'customer service',
        areaServed: 'PK',
        availableLanguage: ['English', 'Urdu'],
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: '09:00',
          closes: '21:00',
        },
      },
      {
        '@type': 'ContactPoint',
        telephone: SITE_CONFIG.phone,
        contactType: 'whatsapp',
        areaServed: 'PK',
        availableLanguage: ['English', 'Urdu'],
      },
    ],
    sameAs: [
      SITE_CONFIG.social.instagram,
      SITE_CONFIG.social.facebook,
      SITE_CONFIG.social.tiktok,
      SITE_CONFIG.social.linkedin,
      SITE_CONFIG.social.youtube,
    ],
    department: [
      { '@type': 'LocalBusiness', name: 'sastamaal.net Head Office', address: SITE_CONFIG.address },
    ],
  };
}

export function webSiteStructuredData() {
  return {
    '@context': 'https://schema.org/',
    '@type': 'WebSite',
    '@id': `${SITE_CONFIG.url}/#website`,
    url: SITE_CONFIG.url,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'PropertyValueSpecification',
        propertyID: 'q',
        valueRequired: true,
        singleValue: `${SITE_CONFIG.url}/?s={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: SITE_CONFIG.locale,
  };
}

export function localBusinessStructuredData() {
  return {
    '@context': 'https://schema.org/',
    '@type': 'LocalBusiness',
    '@id': `${SITE_CONFIG.url}/#localbusiness`,
    name: 'sastamaal.net Official Store',
    image: SITE_CONFIG.logo,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.address.street,
      addressLocality: SITE_CONFIG.address.city,
      addressRegion: SITE_CONFIG.address.region,
      postalCode: SITE_CONFIG.address.postalCode,
      addressCountry: SITE_CONFIG.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 31.582045,
      longitude: 74.329797,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      opens: '09:00',
      closes: '21:00',
    },
    priceRange: '₨',
    currenciesAccepted: SITE_CONFIG.currency,
    paymentAccepted: ['JazzCash', 'EasyPaisa', 'SadaPay', 'Cash', 'Visa', 'Mastercard'],
    url: SITE_CONFIG.url,
  };
}
