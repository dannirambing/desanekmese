import { Skeleton } from "@/components/ui/skeleton";

export default function WisataPageSkeleton() {
  return (
    <>
      <section className="relative w-full pt-32 pb-20 md:pt-44 md:pb-28 bg-gray-900">
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-8 w-40 mx-auto rounded-full bg-white/20" />
          <Skeleton className="h-12 w-80 max-w-full mx-auto bg-white/20" />
          <Skeleton className="h-6 w-96 max-w-full mx-auto bg-white/20" />
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14 space-y-3">
            <Skeleton className="h-4 w-36 mx-auto" />
            <Skeleton className="h-8 w-56 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
