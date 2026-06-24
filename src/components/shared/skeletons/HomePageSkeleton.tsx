import { Skeleton } from "@/components/ui/skeleton";
import HeroSectionSkeleton from "./HeroSectionSkeleton";
import CultureSectionSkeleton from "./CultureSectionSkeleton";
import UMKMSectionSkeleton from "./UMKMSectionSkeleton";

export default function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-stone-50">
      <HeroSectionSkeleton />

      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-3 mb-10">
            <Skeleton className="h-4 w-36 mx-auto" />
            <Skeleton className="h-9 w-72 max-w-full mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </section>

      <CultureSectionSkeleton />
      <UMKMSectionSkeleton />
    </div>
  );
}
