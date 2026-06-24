import { Skeleton } from "@/components/ui/skeleton";

export default function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <Skeleton className="w-full h-[50vh] md:h-[65vh] rounded-none" />
      <div className="container mx-auto px-6 -mt-20 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-5xl mx-auto flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-2/3 space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="w-full lg:w-1/3 space-y-6">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
