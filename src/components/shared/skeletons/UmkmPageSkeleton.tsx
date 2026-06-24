import { Skeleton } from "@/components/ui/skeleton";

export default function UmkmPageSkeleton() {
  return (
    <>
      <section className="relative w-full pt-32 pb-20 md:pt-44 md:pb-28 bg-emerald-950">
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-8 w-44 mx-auto rounded-full bg-white/20" />
          <Skeleton className="h-12 w-80 max-w-full mx-auto bg-white/20" />
          <Skeleton className="h-6 w-96 max-w-full mx-auto bg-white/20" />
        </div>
      </section>

      <section className="py-16 md:py-24 bg-stone-50 min-h-screen">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14 space-y-3">
            <Skeleton className="h-4 w-36 mx-auto" />
            <Skeleton className="h-8 w-56 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-stone-100 overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
