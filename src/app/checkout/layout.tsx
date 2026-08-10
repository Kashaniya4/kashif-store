import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/seo';

// Transactional page — keep out of search indexes.
export const metadata: Metadata = {
  title: 'Secure Checkout & Shipping',
  description: 'Complete your secure Bazaar.pk order with JazzCash, EasyPaisa, SadaPay, bank transfer or Cash on Delivery. Nationwide 24-48hr delivery.',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
  alternates: {
    canonical: `${SITE_CONFIG.url}/checkout`,
  },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
