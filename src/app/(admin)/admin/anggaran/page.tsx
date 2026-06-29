import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Edit, Plus, FileText, TrendingUp, TrendingDown } from "lucide-react";
import DeleteBudgetForm from "./DeleteBudgetForm";
import { formatRupiah } from "@/lib/format-rupiah";

export const revalidate = 0; // Dynamic rendering

export default async function AdminAnggaranPage() {
  const budgets = await prisma.villageBudget.findMany({
    orderBy: { year: "desc" },
  });

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-navy tracking-tight uppercase">
            Kelola Anggaran Desa
          </h1>
          <p className="text-sm text-navy/60 font-medium mt-1">
            Manajemen pertanggungjawaban penggunaan anggaran (APBDes) tahunan.
          </p>
        </div>
        <Link
          href="/admin/anggaran/tambah"
          className="inline-flex items-center justify-center bg-turquoise hover:bg-turquoise/90 text-black px-6 py-3 rounded-full font-bold text-xs tracking-widest uppercase transition-all shadow-md shadow-turquoise/10 cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2 stroke-[3]" />
          Tambah Tahun Anggaran
        </Link>
      </div>

      {budgets.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center text-navy/40 font-semibold shadow-sm">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          Belum ada data anggaran tahunan yang direkam.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {budgets.map((budget) => {
            const revenueRealizationPct = budget.totalRevenueBudget > 0
              ? (budget.totalRevenueRealization / budget.totalRevenueBudget) * 100
              : 0;

            const expenditureRealizationPct = budget.totalExpenditureBudget > 0
              ? (budget.totalExpenditureRealization / budget.totalExpenditureBudget) * 100
              : 0;

            const surplusDeficit = budget.totalRevenueRealization - budget.totalExpenditureRealization;
            const isSurplus = surplusDeficit >= 0;

            return (
              <div
                key={budget.id}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden group"
              >
                {/* Year Label background decoration */}
                <div className="absolute right-0 top-0 text-slate-100 font-black text-9xl -mr-6 -mt-10 select-none pointer-events-none z-0 group-hover:text-slate-200/60 transition-colors">
                  {budget.year}
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <span className="bg-navy text-black text-xs font-black px-4 py-1.5 rounded-full tracking-widest uppercase shadow-sm">
                      TAHUN {budget.year}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/admin/anggaran/${budget.id}`}
                        className="p-2 text-navy/40 hover:text-navy hover:bg-navy/5 rounded-xl transition-all"
                        title="Ubah & Kelola Detail"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <DeleteBudgetForm id={budget.id} year={budget.year} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Revenue Card Summary */}
                    <div className="bg-teal-50/30 border border-teal-100/50 rounded-2xl p-4">
                      <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
                        <TrendingUp size={16} /> Pendapatan
                      </div>
                      <div className="text-xs text-slate-500 font-semibold mb-1">
                        Pagu: <span className="text-slate-700 font-bold">{formatRupiah(budget.totalRevenueBudget)}</span>
                      </div>
                      <div className="text-xs text-slate-500 font-semibold">
                        Realisasi: <span className="text-teal-700 font-bold">{formatRupiah(budget.totalRevenueRealization)}</span>
                      </div>
                      <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-teal-500 h-full rounded-full"
                          style={{ width: `${Math.min(revenueRealizationPct, 100)}%` }}
                        />
                      </div>
                      <div className="text-right text-[10px] font-bold text-teal-600 mt-1">
                        {revenueRealizationPct.toFixed(1)}% Realisasi
                      </div>
                    </div>

                    {/* Expenditure Card Summary */}
                    <div className="bg-indigo-50/30 border border-indigo-100/50 rounded-2xl p-4">
                      <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
                        <TrendingDown size={16} /> Belanja
                      </div>
                      <div className="text-xs text-slate-500 font-semibold mb-1">
                        Pagu: <span className="text-slate-700 font-bold">{formatRupiah(budget.totalExpenditureBudget)}</span>
                      </div>
                      <div className="text-xs text-slate-500 font-semibold">
                        Realisasi: <span className="text-indigo-700 font-bold">{formatRupiah(budget.totalExpenditureRealization)}</span>
                      </div>
                      <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full"
                          style={{ width: `${Math.min(expenditureRealizationPct, 100)}%` }}
                        />
                      </div>
                      <div className="text-right text-[10px] font-bold text-indigo-600 mt-1">
                        {expenditureRealizationPct.toFixed(1)}% Realisasi
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer showing surplus / deficit status */}
                <div className="relative z-10 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold">Status Realisasi APBDes:</span>
                  <span className={`text-xs font-black tracking-wider uppercase px-3 py-1 rounded-full ${isSurplus ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
                    }`}>
                    {isSurplus ? "Surplus" : "Defisit"}: {formatRupiah(Math.abs(surplusDeficit))}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
