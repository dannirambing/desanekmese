"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useTransition } from "react";

interface AdminTablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage?: number;
}

export default function AdminTablePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 10,
}: AdminTablePaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      <div className="text-sm font-semibold text-slate-500">
        Menampilkan <span className="text-slate-800">{startItem}-{endItem}</span> dari{" "}
        <span className="text-slate-800">{totalItems}</span> data
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isPending}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer flex items-center justify-center"
        >
          <ChevronLeft className="w-4 h-4 text-slate-700" />
        </button>

        <span className="text-sm font-bold text-slate-700 px-3">
          Halaman {currentPage} dari {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isPending}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer flex items-center justify-center"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 text-slate-700 animate-spin" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-700" />
          )}
        </button>
      </div>
    </div>
  );
}
