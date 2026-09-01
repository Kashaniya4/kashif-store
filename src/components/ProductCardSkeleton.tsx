import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white/60 border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square bg-slate-100/60 relative" />

      {/* Content Skeleton */}
      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 bg-slate-100 rounded" />
            <div className="h-3 w-12 bg-slate-100 rounded" />
          </div>
          <div className="h-4 w-3/4 bg-slate-100 rounded" />
          <div className="h-3 w-full bg-slate-100/50 rounded" />
        </div>

        {/* Price & Button */}
        <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-2.5 w-16 bg-slate-100/50 rounded" />
            <div className="h-5 w-24 bg-slate-100 rounded" />
          </div>
          <div className="w-10 h-10 bg-slate-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};
