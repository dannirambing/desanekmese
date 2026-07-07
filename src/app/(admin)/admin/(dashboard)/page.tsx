import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  Map,
  Sparkles,
  Store,
  Newspaper,
  Megaphone,
  Users,
  Bot,
  Wallet,
  Activity,
  ArrowRight,
  Plus,
  Clock,
} from "lucide-react";
import { formatIndonesianDate } from "@/lib/format-date";

const formatCompactRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    notation: "compact",
    compactDisplay: "short",
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  const userPerms = session?.user?.permissions || [];
  const canManageKonten = userPerms.includes("ALL_ACCESS") || userPerms.includes("MANAGE_BERITA");

  // Parallel data fetching for extremely fast load times
  const [
    wisata,
    budaya,
    umkm,
    berita,
    pengumuman,
    admins,
    chatbotQueries,
    recentBerita,
    recentPengumuman,
    latestBudget,
  ] = await Promise.all([
    prisma.tourismPlace.count(),
    prisma.cultureItem.count(),
    prisma.productUMKM.count(),
    prisma.newsArticle.count(),
    prisma.announcement.count(),
    prisma.admin.count(),
    prisma.chatCache.count(),
    prisma.newsArticle.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, createdAt: true, status: true, slug: true },
    }),
    prisma.announcement.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, createdAt: true, status: true, category: true },
    }),
    prisma.villageBudget.findFirst({ orderBy: { year: "desc" } }),
  ]);

  const metricsData = [
    {
      title: "Destinasi Wisata",
      count: wisata,
      href: "/admin/wisata",
      icon: Map,
      color: "from-blue-500 to-blue-400",
      bgLight: "bg-blue-50",
      textLight: "text-blue-600",
      perms: ["MANAGE_WISATA", "ALL_ACCESS"],
    },
    {
      title: "Konten Budaya",
      count: budaya,
      href: "/admin/budaya",
      icon: Sparkles,
      color: "from-amber-500 to-amber-400",
      bgLight: "bg-amber-50",
      textLight: "text-amber-600",
      perms: ["MANAGE_BUDAYA", "ALL_ACCESS"],
    },
    {
      title: "Produk UMKM",
      count: umkm,
      href: "/admin/umkm",
      icon: Store,
      color: "from-emerald-500 to-emerald-400",
      bgLight: "bg-emerald-50",
      textLight: "text-emerald-600",
      perms: ["MANAGE_UMKM", "ALL_ACCESS"],
    },
    {
      title: "Berita Desa",
      count: berita,
      href: "/admin/berita",
      icon: Newspaper,
      color: "from-indigo-500 to-indigo-400",
      bgLight: "bg-indigo-50",
      textLight: "text-indigo-600",
      perms: ["MANAGE_BERITA", "ALL_ACCESS"],
    },
    {
      title: "Pengumuman",
      count: pengumuman,
      href: "/admin/pengumuman",
      icon: Megaphone,
      color: "from-rose-500 to-rose-400",
      bgLight: "bg-rose-50",
      textLight: "text-rose-600",
      perms: ["MANAGE_PENGUMUMAN", "ALL_ACCESS"],
    },
    {
      title: "Admin Aktif",
      count: admins,
      href: "/admin/pengguna",
      icon: Users,
      color: "from-slate-700 to-slate-600",
      bgLight: "bg-slate-100",
      textLight: "text-slate-700",
      perms: ["ALL_ACCESS"],
    },
    {
      title: "Log Chatbot AI",
      count: chatbotQueries,
      href: "/admin/chatbot-log",
      icon: Bot,
      color: "from-turquoise to-teal-400",
      bgLight: "bg-teal-50",
      textLight: "text-teal-700",
      perms: ["ALL_ACCESS"],
    },
  ];

  const metrics = metricsData.filter(m => m.perms.some(p => userPerms.includes(p)));

  // Combine and sort activities
  const recentActivities = [
    ...recentBerita.map((item) => ({
      ...item,
      type: "Berita" as const,
      icon: Newspaper,
      color: "text-indigo-600 bg-indigo-50",
    })),
    ...recentPengumuman.map((item) => ({
      ...item,
      type: "Pengumuman" as const,
      icon: Megaphone,
      color: "text-rose-600 bg-rose-50",
    })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  const budgetRealizationPercentage = latestBudget
    ? Math.round(
        (latestBudget.totalExpenditureRealization /
          latestBudget.totalExpenditureBudget) *
          100
      )
    : 0;

  return (
    <div className="w-full relative pb-10">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-2">
            Dashboard Utama
          </h1>
          <p className="text-sm md:text-base text-slate-500 max-w-xl">
            Ringkasan data, metrik, dan aktivitas operasional terbaru dari seluruh layanan portal Desa Nekmese.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {canManageKonten && (
            <>
              <Link
                href="/admin/berita/tambah"
                className="inline-flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 text-navy px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                Berita
              </Link>
              <Link
                href="/admin/pengumuman/tambah"
                className="inline-flex items-center justify-center bg-gradient-to-r from-turquoise to-teal-400 hover:from-turquoise/90 hover:to-teal-400/90 text-navy px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-md shadow-turquoise/20 hover:shadow-lg hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4 mr-2 stroke-[3]" />
                Pengumuman
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Metrics Grid (Glassmorphism Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8 relative z-10">
        {metrics.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group relative bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full opacity-50 pointer-events-none" />
              
              <div
                className={`inline-flex p-3 rounded-2xl mb-5 shadow-sm transition-transform duration-300 group-hover:scale-110 ${card.bgLight} ${card.textLight}`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-4xl font-black text-navy mb-1 tracking-tight drop-shadow-sm">
                {card.count}
              </p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                {card.title}
              </p>
              
              {/* Animated subtle arrow */}
              <div className="absolute bottom-6 right-6 opacity-100 translate-x-0 md:opacity-0 md:translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                <ArrowRight className="w-5 h-5 text-navy/40" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Grid: Financial Summary & Activity Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative z-10">
        
        {/* Financial Summary Widget */}
        {canManageKonten && (
          <div className="xl:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-navy">Transparansi Anggaran</h2>
                  <p className="text-sm text-slate-500 font-medium">Realisasi APBDes Tahun {latestBudget?.year || new Date().getFullYear()}</p>
                </div>
              </div>
              <Link href="/admin/anggaran" className="text-sm font-bold text-turquoise hover:text-teal-600 transition-colors flex items-center gap-1">
                Kelola <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {latestBudget ? (
              <div className="flex flex-col gap-6">
                {/* Top Row: Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Realisasi Pendapatan</p>
                    </div>
                    <p className="text-3xl font-black text-navy tracking-tight">{formatCompactRupiah(latestBudget.totalRevenueRealization)}</p>
                    <p className="text-xs font-semibold text-slate-400 mt-1">
                      dari target {formatCompactRupiah(latestBudget.totalRevenueBudget)}
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Realisasi Belanja</p>
                    </div>
                    <p className="text-3xl font-black text-navy tracking-tight">{formatCompactRupiah(latestBudget.totalExpenditureRealization)}</p>
                    <p className="text-xs font-semibold text-slate-400 mt-1">
                      dari pagu {formatCompactRupiah(latestBudget.totalExpenditureBudget)}
                    </p>
                  </div>
                </div>

                {/* Progress Bars with Data */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <div className="mb-6">
                    <div className="flex justify-between items-end mb-2">
                      <p className="text-sm font-bold text-navy">Pencapaian Pendapatan</p>
                      <p className="text-sm font-black text-teal-600">{Math.round((latestBudget.totalRevenueRealization / latestBudget.totalRevenueBudget) * 100)}%</p>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
                      <div 
                        className="bg-gradient-to-r from-teal-400 to-teal-500 h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${Math.round((latestBudget.totalRevenueRealization / latestBudget.totalRevenueBudget) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <p className="text-sm font-bold text-navy">Penyerapan Anggaran (Belanja)</p>
                      <p className="text-sm font-black text-amber-500">{budgetRealizationPercentage}%</p>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
                      <div 
                        className="bg-gradient-to-r from-amber-400 to-amber-500 h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${budgetRealizationPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <Wallet className="w-10 h-10 text-slate-300 mb-3" />
                <p className="text-sm font-semibold text-slate-500">Belum ada data anggaran yang direkam.</p>
                <Link href="/admin/anggaran" className="mt-3 text-xs font-bold text-turquoise uppercase tracking-widest">Tambah Data</Link>
              </div>
            )}
          </div>
        )}

        {/* Recent Activity Widget */}
        <div className={`bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm ${!canManageKonten ? 'xl:col-span-3' : ''}`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy">Aktivitas Terkini</h2>
              <p className="text-sm text-slate-500 font-medium">Update publikasi terakhir</p>
            </div>
          </div>

          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, idx) => {
                const Icon = activity.icon;
                return (
                  <div key={`${activity.type}-${activity.id}-${idx}`} className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors group">
                    <div className={`p-2.5 rounded-xl shrink-0 ${activity.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-navy line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {activity.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {activity.type}
                        </span>
                        <span className="text-slate-300 text-[10px]">•</span>
                        <div className="flex items-center text-[10px] font-semibold text-slate-400">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatIndonesianDate(activity.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-sm font-medium text-slate-400">Belum ada aktivitas publikasi.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
