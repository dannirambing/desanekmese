import { Skeleton } from "@/components/ui/skeleton";

export default function UMKMSectionSkeleton() {
  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10 space-y-3">
          <Skeleton className="h-4 w-40 mx-auto" />
          <Skeleton className="h-8 w-64 mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-2xl" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
