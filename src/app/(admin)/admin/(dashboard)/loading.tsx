import { Loader2 } from "lucide-react";

export default function AdminDashboardLoading() {
  return (
    <div className="w-full pb-10 animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="h-10 md:h-12 w-64 bg-slate-200 rounded-lg mb-4"></div>
          <div className="h-4 w-96 max-w-full bg-slate-200 rounded-md"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-28 bg-slate-200 rounded-xl"></div>
          <div className="h-10 w-36 bg-slate-200 rounded-xl"></div>
        </div>
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-200 mb-5"></div>
            <div className="h-8 w-16 bg-slate-200 rounded-lg mb-2"></div>
            <div className="h-3 w-24 bg-slate-200 rounded-md"></div>
          </div>
        ))}
      </div>

      {/* Bottom Grid Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Financial Skeleton */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-slate-200"></div>
            <div>
              <div className="h-6 w-48 bg-slate-200 rounded-lg mb-2"></div>
              <div className="h-4 w-32 bg-slate-200 rounded-md"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-32 bg-slate-50 rounded-2xl border border-slate-100"></div>
            <div className="h-32 bg-slate-50 rounded-2xl border border-slate-100"></div>
          </div>
        </div>

        {/* Activity Skeleton */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-200"></div>
            <div>
              <div className="h-6 w-32 bg-slate-200 rounded-lg mb-2"></div>
              <div className="h-4 w-24 bg-slate-200 rounded-md"></div>
            </div>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4 p-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0"></div>
                <div className="flex-1">
                  <div className="h-4 w-full bg-slate-200 rounded-md mb-2"></div>
                  <div className="h-3 w-2/3 bg-slate-200 rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
