"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { Search, X, Loader2 } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface AdminTableFiltersProps {
  placeholder?: string;
  showStatusFilter?: boolean;
  statusOptions?: FilterOption[];
  categories?: FilterOption[];
  categoryLabel?: string;
}

export default function AdminTableFilters({
  placeholder = "Cari data...",
  showStatusFilter = true,
  statusOptions = [
    { label: "Semua Status", value: "" },
    { label: "Published", value: "PUBLISHED" },
    { label: "Draft", value: "DRAFT" },
  ],
  categories,
  categoryLabel = "Kategori",
}: AdminTableFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state for search input
  const [searchVal, setSearchVal] = useState(searchParams.get("search") ?? "");

  // Sync searchVal if the URL changes (e.g. user hits back/forward or resets)
  useEffect(() => {
    setSearchVal(searchParams.get("search") ?? "");
  }, [searchParams]);

  // Helper to construct new search query string
  const updateQuery = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Always reset page to 1 when filters change
    params.set("page", "1");

    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === "") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery({ search: searchVal });
  };

  const handleClearSearch = () => {
    setSearchVal("");
    updateQuery({ search: null });
  };

  const handleResetAll = () => {
    setSearchVal("");
    startTransition(() => {
      router.push(pathname);
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6">
      <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-turquoise/40 focus:border-turquoise text-sm font-medium transition-all"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          {searchVal && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="bg-navy hover:bg-navy/90 text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors shrink-0 flex items-center justify-center gap-1.5"
        >
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            "Cari"
          )}
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
        {/* Status Filter */}
        {showStatusFilter && (
          <select
            value={searchParams.get("status") ?? ""}
            onChange={(e) => updateQuery({ status: e.target.value })}
            disabled={isPending}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-turquoise/40 text-sm font-semibold text-slate-700 transition-all cursor-pointer"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {/* Category Filter (Optional) */}
        {categories && categories.length > 0 && (
          <select
            value={searchParams.get("category") ?? ""}
            onChange={(e) => updateQuery({ category: e.target.value })}
            disabled={isPending}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-turquoise/40 text-sm font-semibold text-slate-700 transition-all cursor-pointer"
          >
            <option value="">Semua {categoryLabel}</option>
            {categories.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {/* Reset Filter Button */}
        {(searchParams.get("search") || searchParams.get("status") || searchParams.get("category")) && (
          <button
            type="button"
            onClick={handleResetAll}
            disabled={isPending}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors shrink-0"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
