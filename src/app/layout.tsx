import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { SocialAuthModal } from '@/components/SocialAuthModal';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { SITE_CONFIG } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  // Title template: each page can set its own title via generateMetadata
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.shortName} | ${SITE_CONFIG.name} — Pakistan's Premier E-Commerce Store`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  applicationName: SITE_CONFIG.name,
  keywords: [...SITE_CONFIG.keywords],
  authors: [{ name: 'sastamaal.net Team', url: SITE_CONFIG.url }],
  creator: 'sastamaal.net',
  publisher: 'sastamaal.net',
  category: 'E-Commerce',
  icons: {
    icon: [
      { url: '/brand/sastamaal-logo.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/brand/sastamaal-logo.svg',
    apple: [{ url: '/brand/bazaar-icon-192.png', sizes: '192x192', type: 'image/png' }],
    other: [
      { rel: 'mask-icon', url: '/brand/sastamaal-logo.svg', color: '#10b981' },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: SITE_CONFIG.name,
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.locale,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.shortName} | ${SITE_CONFIG.name} — Pakistan's Premier E-Commerce Store`,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    images: [
      {
        url: '/brand/sastamaal-logo.svg',
        width: 800,
        height: 400,
        alt: SITE_CONFIG.shortName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.shortName} | ${SITE_CONFIG.name} — Pakistan's Premier E-Commerce Store`,
    description: SITE_CONFIG.description,
    images: ['/brand/sastamaal-logo.png'],
    creator: '@sastamaalnet',
    site: '@sastamaalnet',
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
  verification: {
    // Populate after registering with each platform:
    // google: 'GOOGLE_SITE_VERIFICATION',
    // bing: 'BING_SITE_VERIFICATION',
    // yandex: 'YANDEX_VERIFICATION',
    // facebookDomainVerification: 'FB_DOMAIN_VERIFICATION',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
    { media: '(prefers-color-scheme: light)', color: '#020617' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-PK" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased min-h-screen flex flex-col`}>
        <StoreProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <SocialAuthModal />
          <FloatingWhatsApp />
        </StoreProvider>
      </body>
    </html>
  );
}
