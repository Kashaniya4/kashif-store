import React from 'react';
import { ProductGridSkeleton } from '@/components/ProductCardSkeleton';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
      <div className="h-8 w-48 bg-slate-100 rounded-lg" />
      <div className="h-4 w-72 bg-slate-100/60 rounded" />
      <ProductGridSkeleton count={8} />
    </div>
  );
}
