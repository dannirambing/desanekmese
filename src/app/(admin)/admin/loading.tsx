export default function AdminGenericLoading() {
  return (
    <div className="w-full space-y-6 animate-pulse pb-10">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          {/* Page Title */}
          <div className="h-9 w-60 bg-slate-200 rounded-lg mb-2"></div>
          {/* Subtitle */}
          <div className="h-4 w-96 max-w-full bg-slate-200 rounded-md"></div>
        </div>
        {/* Action Button */}
        <div className="h-10 w-40 bg-slate-200 rounded-full shrink-0"></div>
      </div>

      {/* Filters Skeleton */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
        {/* Search Input */}
        <div className="w-full md:flex-1 h-10 bg-slate-100 rounded-xl"></div>
        {/* Dropdowns */}
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <div className="w-full md:w-36 h-10 bg-slate-100 rounded-xl"></div>
          <div className="w-full md:w-36 h-10 bg-slate-100 rounded-xl"></div>
        </div>
      </div>

      {/* Table/Card Grid Skeleton */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4 w-3/5">Data & Detail</th>
                <th className="px-6 py-4 w-1/5">Status</th>
                <th className="px-6 py-4 w-1/5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...Array(5)].map((_, idx) => (
                <tr key={idx} className="transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      {/* Image / Thumbnail placeholder */}
                      <div className="w-12 h-12 rounded-lg bg-slate-200 shrink-0"></div>
                      <div className="space-y-2 flex-1 min-w-0">
                        {/* Title text */}
                        <div className="h-4.5 bg-slate-200 rounded-md w-3/4"></div>
                        {/* Secondary text */}
                        <div className="h-3 bg-slate-100 rounded-md w-1/2"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {/* Status Pill Badge */}
                    <div className="h-6 w-20 bg-slate-200 rounded-md"></div>
                  </td>
                  <td className="px-6 py-5">
                    {/* Action buttons on the right */}
                    <div className="flex justify-end gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-100"></div>
                      <div className="w-8 h-8 rounded-lg bg-slate-100"></div>
                      <div className="w-8 h-8 rounded-lg bg-slate-100"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
        {/* Pagination text info */}
        <div className="h-4 w-48 bg-slate-200 rounded-md"></div>
        {/* Pagination buttons */}
        <div className="flex gap-2">
          <div className="h-9 w-20 bg-slate-200 rounded-xl"></div>
          <div className="h-9 w-9 bg-slate-200 rounded-xl"></div>
          <div className="h-9 w-9 bg-slate-200 rounded-xl"></div>
          <div className="h-9 w-20 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
