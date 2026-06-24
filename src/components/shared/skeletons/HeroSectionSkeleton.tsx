import { Skeleton } from "@/components/ui/skeleton";

export default function HeroSectionSkeleton() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-stone-900">
      <div className="absolute inset-0 bg-gradient-to-t from-amber-950/40 via-stone-900/60 to-stone-800/80" />

      <div className="container relative z-10 mx-auto px-6 text-center mt-16">
        <div className="flex flex-col items-center">
          <Skeleton className="h-9 w-56 rounded-full bg-white/15 mb-6" />

          <Skeleton className="h-16 md:h-24 w-full max-w-2xl bg-white/15 mb-3" />
          <Skeleton className="h-10 md:h-14 w-full max-w-xl bg-white/10 mb-3" />
          <Skeleton className="h-5 w-72 max-w-full bg-white/10 mb-10" />

          <div className="w-full max-w-xl space-y-2 mb-12">
            <Skeleton className="h-4 w-full bg-white/10" />
            <Skeleton className="h-4 w-5/6 mx-auto bg-white/10" />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Skeleton className="h-14 w-48 rounded-full bg-white/20" />
            <Skeleton className="h-14 w-52 rounded-full bg-white/10" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <Skeleton className="h-3 w-10 bg-white/10" />
        <Skeleton className="h-7 w-7 rounded-full bg-white/10" />
      </div>
    </section>
  );
}
