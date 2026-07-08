import { Skeleton } from "@/components/ui/skeleton";

export default function NewsAndAnnouncementSectionSkeleton() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1/3 h-full bg-stone-50 -skew-x-12 -translate-x-20 z-0 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6">
        {/* Header & Stats Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-16 pb-8 border-b border-stone-200/60">
          <div className="max-w-2xl w-full space-y-4">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-10 w-80 max-w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          {/* Statistik Cepat Skeleton */}
          <div className="flex items-center gap-6 px-6 py-4 bg-stone-50 border border-stone-200/50 rounded-2xl shadow-sm self-start lg:self-auto flex-shrink-0">
            <div>
              <Skeleton className="h-8 w-10 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="w-px h-10 bg-slate-200"></div>
            <div>
              <Skeleton className="h-8 w-10 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>

        {/* Content Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mt-12">
          {/* Kolom Kiri: Berita (8 Kolom) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-6">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <Skeleton className="h-6 w-64" />
              </div>

              {/* News Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm p-4 space-y-4">
                    <Skeleton className="aspect-[16/10] w-full rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                    <Skeleton className="h-4 w-28 mt-2" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <Skeleton className="h-10 w-44 rounded-full" />
            </div>
          </div>

          {/* Kolom Kanan: Pengumuman (4 Kolom) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-6">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <Skeleton className="h-6 w-40" />
              </div>

              {/* Announcement List */}
              <div className="flex flex-col gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-3.5 w-full" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <Skeleton className="h-10 w-44 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
