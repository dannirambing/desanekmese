import { requireAdminSession } from "@/lib/auth-session";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { notFound } from "next/navigation";
import { formatRupiah } from "@/lib/format-rupiah";
import { addBudgetDetail, updateBudgetYear } from "../actions";
import BudgetDetailRow from "./BudgetDetailRow";
import AuditTrailInfo from "@/components/admin/AuditTrailInfo";

export const revalidate = 0; // Dynamic rendering

export default async function DetailAnggaranPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession(["MANAGE_BUDGET"]);

  const { id } = await params;
  const budget = await prisma.villageBudget.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: { createdAt: "asc" },
      },
      createdBy: { select: { name: true } },
      updatedBy: { select: { name: true } },
    },
  });

  if (!budget) notFound();

  const revenues = budget.items.filter((item) => item.type === "REVENUE");
  const expenditures = budget.items.filter((item) => item.type === "EXPENDITURE");

  // Sum calculations
  const totalRevBudget = budget.totalRevenueBudget;
  const totalRevReal = budget.totalRevenueRealization;
  const totalExpBudget = budget.totalExpenditureBudget;
  const totalExpReal = budget.totalExpenditureRealization;

  const revPct = totalRevBudget > 0 ? (totalRevReal / totalRevBudget) * 100 : 0;
  const expPct = totalExpBudget > 0 ? (totalExpReal / totalExpBudget) * 100 : 0;

  const updateYearWithId = updateBudgetYear.bind(null, budget.id);
  const addDetailWithId = addBudgetDetail.bind(null, budget.id);

  return (
    <div className="w-full">
      <Link
        href="/admin/anggaran"
        className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-[#0f172a]/40 hover:text-[#0f172a] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-navy tracking-tight uppercase">
            Detail Anggaran {budget.year}
          </h1>
          <p className="text-sm text-navy/60 font-medium mt-1">
            Kelola detail pendapatan dan belanja anggaran pendapatan dan belanja desa (APBDes).
          </p>
        </div>
      </div>

      {/* Grid Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-teal-700 tracking-wider uppercase flex items-center gap-2">
              <TrendingUp size={18} /> Total Pendapatan
            </h2>
            <span className="text-xs font-black bg-teal-50 text-teal-700 px-3 py-1 rounded-full border border-teal-100">
              {revPct.toFixed(1)}% Realisasi
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-semibold">Anggaran:</span>
              <span className="font-extrabold text-navy">{formatRupiah(totalRevBudget)}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-slate-100 pt-2">
              <span className="text-slate-500 font-semibold">Realisasi:</span>
              <span className="font-extrabold text-teal-600">{formatRupiah(totalRevReal)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-indigo-700 tracking-wider uppercase flex items-center gap-2">
              <TrendingDown size={18} /> Total Belanja
            </h2>
            <span className="text-xs font-black bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">
              {expPct.toFixed(1)}% Realisasi
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-semibold">Anggaran:</span>
              <span className="font-extrabold text-navy">{formatRupiah(totalExpBudget)}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-slate-100 pt-2">
              <span className="text-slate-500 font-semibold">Realisasi:</span>
              <span className="font-extrabold text-indigo-600">{formatRupiah(totalExpReal)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Settings */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-navy uppercase mb-4 tracking-wider">
              Ubah Tahun Anggaran
            </h3>
            <form action={updateYearWithId} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-navy/60 mb-2">
                  Tahun Anggaran
                </label>
                <input
                  type="number"
                  name="year"
                  required
                  defaultValue={budget.year}
                  className="w-full p-3 border border-slate-200 rounded-xl font-bold text-navy focus:ring-2 focus:ring-turquoise outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-navy text-white py-3 rounded-xl font-black uppercase tracking-widest hover:bg-turquoise hover:text-black transition-all cursor-pointer text-xs"
              >
                Simpan Tahun
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Details Lists */}
        <div className="xl:col-span-2 space-y-8">
          {/* Pendapatan Section */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-black text-teal-700 uppercase mb-6 tracking-wide border-b border-slate-100 pb-3 flex items-center gap-2">
              <TrendingUp size={20} /> Pos Pendapatan (Revenues)
            </h3>

            {/* List Revenues */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-navy font-bold uppercase border-b border-slate-100">
                    <th className="px-4 py-3 rounded-l-xl">Kategori/Pos Pendapatan</th>
                    <th className="px-4 py-3">Anggaran (Pagu)</th>
                    <th className="px-4 py-3">Realisasi</th>
                    <th className="px-4 py-3 text-right rounded-r-xl">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                  {revenues.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-slate-400 font-medium">
                        Belum ada pos pendapatan ditambahkan.
                      </td>
                    </tr>
                  ) : (
                    revenues.map((item) => {
                      return (
                        <BudgetDetailRow
                          key={item.id}
                          item={item}
                          budgetId={budget.id}
                          type="REVENUE"
                        />
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Add Revenue Form */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <h4 className="text-xs font-black text-navy uppercase mb-3">Tambah Pos Pendapatan</h4>
              <form action={addDetailWithId} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input type="hidden" name="type" value="REVENUE" />
                <div className="md:col-span-1">
                  <input
                    type="text"
                    name="category"
                    placeholder="Nama Kategori (misal: Dana Desa)"
                    required
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-navy focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    name="amountBudget"
                    placeholder="Anggaran (Pagu)"
                    required
                    min={0}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-navy focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="amountRealization"
                    placeholder="Realisasi"
                    required
                    min={0}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-navy focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Plus size={16} className="stroke-[3]" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Belanja Section */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-black text-indigo-700 uppercase mb-6 tracking-wide border-b border-slate-100 pb-3 flex items-center gap-2">
              <TrendingDown size={20} /> Pos Belanja (Expenditures)
            </h3>

            {/* List Expenditures */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-navy font-bold uppercase border-b border-slate-100">
                    <th className="px-4 py-3 rounded-l-xl">Kategori/Pos Belanja</th>
                    <th className="px-4 py-3">Anggaran (Pagu)</th>
                    <th className="px-4 py-3">Realisasi</th>
                    <th className="px-4 py-3 text-right rounded-r-xl">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                  {expenditures.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-slate-400 font-medium">
                        Belum ada pos belanja ditambahkan.
                      </td>
                    </tr>
                  ) : (
                    expenditures.map((item) => {
                      return (
                        <BudgetDetailRow
                          key={item.id}
                          item={item}
                          budgetId={budget.id}
                          type="EXPENDITURE"
                        />
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Add Expenditure Form */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <h4 className="text-xs font-black text-navy uppercase mb-3">Tambah Pos Belanja</h4>
              <form action={addDetailWithId} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input type="hidden" name="type" value="EXPENDITURE" />
                <div className="md:col-span-1">
                  <input
                    type="text"
                    name="category"
                    placeholder="Nama Kategori (misal: Pembangunan Jalan)"
                    required
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-navy focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    name="amountBudget"
                    placeholder="Anggaran (Pagu)"
                    required
                    min={0}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-navy focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="amountRealization"
                    placeholder="Realisasi"
                    required
                    min={0}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-navy focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Plus size={16} className="stroke-[3]" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <AuditTrailInfo
          createdBy={budget.createdBy}
          updatedBy={budget.updatedBy}
          createdAt={budget.createdAt}
          updatedAt={budget.updatedAt}
        />
      </div>
    </div>
  );
}
