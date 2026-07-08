import { Skeleton } from "@/components/ui/skeleton";

export default function DestinationSectionSkeleton() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1/3 h-full bg-stone-50 -skew-x-12 -translate-x-20 z-0 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6">
        {/* Header & Stats Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-16 pb-8 border-b border-slate-100">
          <div className="max-w-2xl w-full space-y-4">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-10 w-80 max-w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          {/* Statistik Cepat Skeleton */}
          <div className="flex items-center gap-6 px-6 py-4 bg-stone-50 border border-stone-200/50 rounded-2xl shadow-sm self-start lg:self-auto flex-shrink-0">
            <div>
              <Skeleton className="h-8 w-12 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="w-px h-10 bg-slate-200"></div>
            <div>
              <Skeleton className="h-8 w-12 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="w-px h-10 bg-slate-200"></div>
            <div>
              <Skeleton className="h-8 w-8 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>

        {/* Grid Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 p-6 flex flex-col justify-end"
            >
              <div className="space-y-3 z-10">
                <Skeleton className="h-3 w-20 bg-stone-200/60" />
                <Skeleton className="h-7 w-3/4 bg-stone-200/60" />
                <Skeleton className="h-4 w-1/2 bg-stone-200/60" />
                <Skeleton className="h-4 w-full bg-stone-200/60" />
                <div className="pt-3 border-t border-stone-200/20">
                  <Skeleton className="h-3 w-24 bg-stone-200/60" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Button Skeleton */}
        <div className="mt-16 flex justify-center">
          <Skeleton className="h-12 w-64 rounded-full" />
        </div>
      </div>
    </section>
  );
}
