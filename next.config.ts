import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://images.unsplash.com https://unsplash.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://www.google-analytics.com",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "unsplash.com" },
    ],
    // Lazy-load + generate WebP/AVIF variants to cut page weight.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30-day cache for optimized images
  },

  // International targeting for Pakistan (geo-SEO) + security headers.
  // CSP is commented so it does not block Google fonts/analytics until verified.
  headers: async () => [
    {
      source: "/brand/:path*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    { source: "/manifest.json", headers: [{ key: "Cache-Control", value: "public, max-age=86400" }] },
    { source: "/robots.txt", headers: [{ key: "Cache-Control", value: "public, max-age=86400" }] },
    { source: "/sitemap.xml", headers: [{ key: "Cache-Control", value: "public, max-age=86400" }] },
    { source: "/favicon.ico", headers: [{ key: "Cache-Control", value: "public, max-age=86400" }] },
    ...securityHeaders.map((h) => ({
      source: "/(.*)",
      headers: [h],
    })),
  ],

  // Reduce bundle size and speed up client navigation.
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
