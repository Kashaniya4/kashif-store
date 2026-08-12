import type { Metadata } from 'next';

// Internal tool — not for search engines.
export const metadata: Metadata = {
  title: 'JSON Product Importer',
  description: 'sastamaal.net internal tool to import product catalog JSON (authorized staff only).',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
  },
};

export default function JsonImporterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
