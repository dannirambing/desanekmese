import { Skeleton } from "@/components/ui/skeleton";

export default function CultureSectionSkeleton() {
  return (
    <section className="py-24 bg-stone-50">
      <div className="container mx-auto px-6">
        <div className="space-y-3 mb-16">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-8 w-72" />
        </div>
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="w-full lg:w-1/2 relative h-[500px]">
            <Skeleton className="absolute top-0 left-0 w-3/4 h-4/5 rounded-2xl" />
            <Skeleton className="absolute bottom-0 right-0 w-3/5 h-2/3 rounded-2xl" />
          </div>
          <div className="w-full lg:w-1/2 space-y-4">
            <Skeleton className="h-10 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-12 w-48 rounded-full mt-6" />
          </div>
        </div>
      </div>
    </section>
  );
}
