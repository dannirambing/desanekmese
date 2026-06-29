"use client";

import { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, Calendar, Receipt, Landmark } from "lucide-react";
import { formatRupiah } from "@/lib/format-rupiah";

interface BudgetDetail {
  id: string;
  type: "REVENUE" | "EXPENDITURE";
  category: string;
  amountBudget: number;
  amountRealization: number;
}

interface VillageBudget {
  id: string;
  year: number;
  totalRevenueBudget: number;
  totalRevenueRealization: number;
  totalExpenditureBudget: number;
  totalExpenditureRealization: number;
  items: BudgetDetail[];
}

export default function BudgetDashboard({
  budgets,
}: {
  budgets: VillageBudget[];
}) {
  const [selectedYear, setSelectedYear] = useState<number>(
    budgets.length > 0 ? budgets[0].year : new Date().getFullYear()
  );

  const activeBudget = useMemo(() => {
    return budgets.find((b) => b.year === selectedYear) || budgets[0];
  }, [budgets, selectedYear]);

  if (!activeBudget) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-blue-50 shadow-sm max-w-2xl mx-auto">
        <Landmark className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 font-semibold">Tidak ada data transparansi anggaran tersedia.</p>
      </div>
    );
  }

  const revenues = activeBudget.items.filter((i) => i.type === "REVENUE");
  const expenditures = activeBudget.items.filter((i) => i.type === "EXPENDITURE");

  // Summary Metrics
  const revPct = activeBudget.totalRevenueBudget > 0
    ? (activeBudget.totalRevenueRealization / activeBudget.totalRevenueBudget) * 100
    : 0;

  const expPct = activeBudget.totalExpenditureBudget > 0
    ? (activeBudget.totalExpenditureRealization / activeBudget.totalExpenditureBudget) * 100
    : 0;

  const surplusDeficit = activeBudget.totalRevenueRealization - activeBudget.totalExpenditureRealization;
  const isSurplus = surplusDeficit >= 0;

  // Chart configuration
  const chartHeight = 250;
  const chartWidth = 500;
  const paddingLeft = 80;
  const paddingTop = 20;
  const paddingBottom = 40;
  const paddingRight = 20;

  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;

  const maxVal = Math.max(
    activeBudget.totalRevenueBudget,
    activeBudget.totalRevenueRealization,
    activeBudget.totalExpenditureBudget,
    activeBudget.totalExpenditureRealization,
    1_000_000 // avoid 0 division
  ) * 1.15; // 15% padding top

  // helper to format brief numbers (e.g. 1.5 M, 500 Jt)
  const formatBrief = (val: number) => {
    if (val >= 1_000_000_000) {
      return `${(val / 1_000_000_000).toFixed(1).replace(".", ",")} M`;
    }
    if (val >= 1_000_000) {
      return `${(val / 1_000_000).toFixed(0)} Jt`;
    }
    return val.toString();
  };

  // Y-axis grid ticks (4 ticks)
  const ticks = [0, maxVal * 0.25, maxVal * 0.5, maxVal * 0.75, maxVal];

  // Bars positions
  // We have 2 main categories: Pendapatan (Index 0), Belanja (Index 1)
  const groupWidth = plotWidth / 2;

  const getBars = (index: number, budgetVal: number, realizationVal: number) => {
    const groupCenter = paddingLeft + index * groupWidth + groupWidth / 2;
    const barWidth = 40;
    const gap = 8;

    const xBudget = groupCenter - barWidth - gap / 2;
    const xReal = groupCenter + gap / 2;

    const yBudget = paddingTop + plotHeight - (budgetVal / maxVal) * plotHeight;
    const hBudget = (budgetVal / maxVal) * plotHeight;

    const yReal = paddingTop + plotHeight - (realizationVal / maxVal) * plotHeight;
    const hReal = (realizationVal / maxVal) * plotHeight;

    return {
      budget: { x: xBudget, y: yBudget, w: barWidth, h: Math.max(hBudget, 2) },
      realization: { x: xReal, y: yReal, w: barWidth, h: Math.max(hReal, 2) }
    };
  };

  const revenueBars = getBars(0, activeBudget.totalRevenueBudget, activeBudget.totalRevenueRealization);
  const expenditureBars = getBars(1, activeBudget.totalExpenditureBudget, activeBudget.totalExpenditureRealization);

  return (
    <div className="space-y-12">
      {/* Year Selector & Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-5xl mx-auto">
        <div>
          <h3 className="text-2xl md:text-3xl font-black text-navy uppercase tracking-tight">
            Transparansi Anggaran Desa Nekmese
          </h3>
          <p className="text-sm text-slate-500 font-semibold mt-1">
            Realisasi Anggaran Pendapatan dan Belanja Desa (APBDes)
          </p>
        </div>

        {/* Dropdown Selector */}
        <div className="flex items-center gap-3">
          <Calendar className="text-slate-400 shrink-0" size={20} />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tahun Anggaran:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            className="h-10 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-navy focus:ring-2 focus:ring-turquoise focus:border-turquoise outline-none cursor-pointer"
          >
            {budgets.map((b) => (
              <option key={b.id} value={b.year}>
                Tahun {b.year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Card 1: Revenue */}
        <div className="bg-gradient-to-br from-white to-teal-50/20 border border-teal-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute right-4 top-4 text-teal-100 group-hover:text-teal-200 transition-colors">
            <Landmark size={32} />
          </div>
          <span className="text-[10px] font-black tracking-widest text-teal-600 uppercase">
            Total Pendapatan
          </span>
          <h4 className="text-2xl md:text-3xl font-black text-navy mt-2 tracking-tight">
            {formatRupiah(activeBudget.totalRevenueRealization)}
          </h4>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Dari target {formatRupiah(activeBudget.totalRevenueBudget)}
          </p>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="font-extrabold text-teal-600">Persentase Realisasi:</span>
            <span className="font-black bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">
              {revPct.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Card 2: Expenditure */}
        <div className="bg-gradient-to-br from-white to-indigo-50/20 border border-indigo-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute right-4 top-4 text-indigo-100 group-hover:text-indigo-200 transition-colors">
            <Receipt size={32} />
          </div>
          <span className="text-[10px] font-black tracking-widest text-indigo-600 uppercase">
            Total Belanja
          </span>
          <h4 className="text-2xl md:text-3xl font-black text-navy mt-2 tracking-tight">
            {formatRupiah(activeBudget.totalExpenditureRealization)}
          </h4>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Dari pagu {formatRupiah(activeBudget.totalExpenditureBudget)}
          </p>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="font-extrabold text-indigo-600">Daya Serap Belanja:</span>
            <span className="font-black bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
              {expPct.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Card 3: Surplus / Deficit */}
        <div className="bg-gradient-to-br from-white to-amber-50/20 border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute right-4 top-4 text-slate-200 group-hover:text-slate-300 transition-colors">
            {isSurplus ? <TrendingUp size={32} /> : <TrendingDown size={32} />}
          </div>
          <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
            Sisa Lebih/Status Anggaran
          </span>
          <h4 className={`text-2xl md:text-3xl font-black mt-2 tracking-tight ${isSurplus ? "text-green-600" : "text-red-600"
            }`}>
            {formatRupiah(Math.abs(surplusDeficit))}
          </h4>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            {isSurplus ? "Surplus Keuangan Desa" : "Defisit Keuangan Desa"}
          </p>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-500">Status Buku:</span>
            <span className={`font-black px-3 py-0.5 rounded-full uppercase tracking-wider ${isSurplus ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}>
              {isSurplus ? "Surplus" : "Defisit"}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: SVG Chart & Detail breakdown tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
        {/* SVG Chart Panel */}
        <div className="lg:col-span-5 bg-white border border-blue-50 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-base font-black text-navy uppercase mb-1">
              Grafik Realisasi APBDes
            </h4>
            <p className="text-xs text-slate-400 font-semibold mb-6">
              Perbandingan Target (Pagu) vs Realisasi
            </p>
          </div>

          {/* SVG Container */}
          <div className="w-full flex justify-center py-4 select-none">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-auto max-w-[450px]"
            >
              {/* Ticks Gridlines and Labels */}
              {ticks.map((t, i) => {
                const y = paddingTop + plotHeight - (t / maxVal) * plotHeight;
                return (
                  <g key={i}>
                    {/* Gridline */}
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={chartWidth - paddingRight}
                      y2={y}
                      stroke="#e2e8f0"
                      strokeWidth={1}
                      strokeDasharray={i === 0 ? "0" : "4 4"}
                    />
                    {/* Y Label */}
                    <text
                      x={paddingLeft - 10}
                      y={y + 4}
                      fill="#64748b"
                      fontSize={11}
                      fontWeight="bold"
                      textAnchor="end"
                    >
                      {formatBrief(t)}
                    </text>
                  </g>
                );
              })}

              {/* X Axis base line */}
              <line
                x1={paddingLeft}
                y1={paddingTop + plotHeight}
                x2={chartWidth - paddingRight}
                y2={paddingTop + plotHeight}
                stroke="#94a3b8"
                strokeWidth={1.5}
              />

              {/* Revenue Bars Group */}
              {/* Budget Bar */}
              <rect
                x={revenueBars.budget.x}
                y={revenueBars.budget.y}
                width={revenueBars.budget.w}
                height={revenueBars.budget.h}
                fill="#cbd5e1"
                rx={4}
                className="transition-all duration-500 hover:fill-slate-400"
              />
              {/* Realization Bar */}
              <rect
                x={revenueBars.realization.x}
                y={revenueBars.realization.y}
                width={revenueBars.realization.w}
                height={revenueBars.realization.h}
                fill="#14b8a6"
                rx={4}
                className="transition-all duration-500 hover:fill-teal-600"
              />

              {/* Expenditure Bars Group */}
              {/* Budget Bar */}
              <rect
                x={expenditureBars.budget.x}
                y={expenditureBars.budget.y}
                width={expenditureBars.budget.w}
                height={expenditureBars.budget.h}
                fill="#cbd5e1"
                rx={4}
                className="transition-all duration-500 hover:fill-slate-400"
              />
              {/* Realization Bar */}
              <rect
                x={expenditureBars.realization.x}
                y={expenditureBars.realization.y}
                width={expenditureBars.realization.w}
                height={expenditureBars.realization.h}
                fill="#6366f1"
                rx={4}
                className="transition-all duration-500 hover:fill-indigo-600"
              />

              {/* X Axis Labels */}
              <text
                x={paddingLeft + groupWidth / 2}
                y={paddingTop + plotHeight + 22}
                fill="#0f172a"
                fontSize={12}
                fontWeight="extrabold"
                textAnchor="middle"
              >
                Pendapatan
              </text>
              <text
                x={paddingLeft + groupWidth + groupWidth / 2}
                y={paddingTop + plotHeight + 22}
                fill="#0f172a"
                fontSize={12}
                fontWeight="extrabold"
                textAnchor="middle"
              >
                Belanja
              </text>
            </svg>
          </div>

          {/* Chart Legends */}
          <div className="flex justify-center items-center gap-6 pt-4 border-t border-slate-100 text-xs font-bold">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-slate-300 rounded" />
              <span className="text-slate-500">Pagu/Target</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-teal-500 rounded" />
              <span className="text-slate-700">Realisasi Pendapatan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-indigo-500 rounded" />
              <span className="text-slate-700">Realisasi Belanja</span>
            </div>
          </div>
        </div>

        {/* Details Breakdown Tables */}
        <div className="lg:col-span-7 bg-white border border-blue-50 rounded-3xl p-6 shadow-sm space-y-8">
          {/* Revenue Breakdown */}
          <div>
            <h4 className="text-base font-black text-teal-700 uppercase mb-4 tracking-wide flex items-center gap-2">
              <TrendingUp size={18} /> Rincian Pendapatan
            </h4>
            <div className="space-y-4">
              {revenues.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Belum ada rincian data pendapatan.</p>
              ) : (
                revenues.map((item) => {
                  const pct = item.amountBudget > 0 ? (item.amountRealization / item.amountBudget) * 100 : 0;
                  return (
                    <div key={item.id} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold text-navy">
                        <span className="line-clamp-1">{item.category}</span>
                        <div className="text-right">
                          <span className="text-teal-600">{formatRupiah(item.amountRealization)}</span>
                          <span className="text-slate-400 font-semibold"> / {formatRupiah(item.amountBudget)}</span>
                        </div>
                      </div>
                      {/* Bar indicator */}
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                        <div
                          className="bg-teal-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <div className="text-right text-[10px] font-black text-teal-600">
                        Realisasi: {pct.toFixed(1)}%
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Expenditure Breakdown */}
          <div className="border-t border-slate-100 pt-6">
            <h4 className="text-base font-black text-indigo-700 uppercase mb-4 tracking-wide flex items-center gap-2">
              <TrendingDown size={18} /> Rincian Belanja (Berdasarkan Bidang)
            </h4>
            <div className="space-y-4">
              {expenditures.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Belum ada rincian data belanja.</p>
              ) : (
                expenditures.map((item) => {
                  const pct = item.amountBudget > 0 ? (item.amountRealization / item.amountBudget) * 100 : 0;
                  return (
                    <div key={item.id} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold text-navy">
                        <span className="line-clamp-1">{item.category}</span>
                        <div className="text-right">
                          <span className="text-indigo-600">{formatRupiah(item.amountRealization)}</span>
                          <span className="text-slate-400 font-semibold"> / {formatRupiah(item.amountBudget)}</span>
                        </div>
                      </div>
                      {/* Bar indicator */}
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                        <div
                          className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <div className="text-right text-[10px] font-black text-indigo-600">
                        Daya Serap: {pct.toFixed(1)}%
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
