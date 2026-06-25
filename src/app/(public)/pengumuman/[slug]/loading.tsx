import { Skeleton } from "@/components/ui/skeleton";

export default function PengumumanDetailLoading() {
  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header/Cover Skeleton */}
      <div className="relative w-full h-[45vh] md:h-[55vh] bg-stone-200 animate-pulse flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-stone-300/40" />
      </div>

      {/* Main Content Card Skeleton */}
      <div className="container mx-auto px-6 -mt-16 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto border border-stone-200/50 space-y-8">
          
          {/* Date Metadata Skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-36" />
          </div>

          {/* Title Skeletons */}
          <div className="space-y-3">
            <Skeleton className="h-10 w-3/4 md:w-2/3" />
            <Skeleton className="h-10 w-1/2 md:w-1/3" />
          </div>

          {/* Content Paragraph Skeletons */}
          <div className="space-y-4 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          {/* Return Button Skeleton */}
          <div className="pt-8 border-t border-stone-100">
            <Skeleton className="h-5 w-56" />
          </div>
        </div>
      </div>
    </div>
  );
}
