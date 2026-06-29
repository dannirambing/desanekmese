"use client";

import { useState } from "react";
import { Newspaper, Landmark } from "lucide-react";
import NewsListWithFilter from "./NewsListWithFilter";
import BudgetDashboard from "./BudgetDashboard";

interface MediaFile {
  url: string;
}

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  status: string;
  publishedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  media: MediaFile[];
}

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

export default function NewsAndBudgetTabs({
  articles,
  budgets,
}: {
  articles: NewsArticle[];
  budgets: VillageBudget[];
}) {
  const [activeTab, setActiveTab] = useState<"news" | "budget">("news");

  return (
    <div className="space-y-12">
      {/* Tab Selector Buttons */}
      <div className="flex justify-center">
        <div className="inline-flex bg-blue-950/5 p-1.5 rounded-2xl border border-blue-950/10">
          <button
            type="button"
            onClick={() => setActiveTab("news")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-extrabold tracking-wide uppercase cursor-pointer transition-all ${
              activeTab === "news"
                ? "bg-white text-navy shadow-md shadow-navy/5"
                : "text-slate-500 hover:text-navy"
            }`}
          >
            <Newspaper size={18} />
            Berita & Kegiatan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("budget")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-extrabold tracking-wide uppercase cursor-pointer transition-all ${
              activeTab === "budget"
                ? "bg-white text-navy shadow-md shadow-navy/5"
                : "text-slate-500 hover:text-navy"
            }`}
          >
            <Landmark size={18} />
            Transparansi Anggaran
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="transition-all duration-300">
        {activeTab === "news" ? (
          <NewsListWithFilter articles={articles} />
        ) : (
          <BudgetDashboard budgets={budgets} />
        )}
      </div>
    </div>
  );
}
