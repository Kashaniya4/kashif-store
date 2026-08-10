import type { Metadata } from 'next';

// Admin portal — absolutely not for search engines.
export const metadata: Metadata = {
  title: 'Logistics Admin',
  description: 'Bazaar.pk order management and logistics dispatch portal (authorized staff only).',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
