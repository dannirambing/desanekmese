import { Skeleton } from "@/components/ui/skeleton";
import HeroSectionSkeleton from "./HeroSectionSkeleton";
import CultureSectionSkeleton from "./CultureSectionSkeleton";
import UMKMSectionSkeleton from "./UMKMSectionSkeleton";

export default function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-stone-50">
      <HeroSectionSkeleton />

      {/* Skeleton untuk Sub-Navbar Horizontal (Floating Bottom Dock) */}
      <div className="fixed bottom-6 left-0 right-0 w-full z-30 flex justify-center">
        <div className="container mx-auto px-6">
          <div className="bg-white/90 border border-slate-100/80 shadow-sm rounded-2xl lg:rounded-3xl p-2.5">
            <div className="flex flex-row items-center justify-start lg:justify-center overflow-x-auto gap-1.5 scrollbar-none">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-32 rounded-xl lg:rounded-2xl shrink-0" />
              ))}
            </div>
          </div>
        </div>
      </div>

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
