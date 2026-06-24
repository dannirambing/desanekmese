import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Map, Sparkles, Store, Newspaper } from "lucide-react";

export default async function AdminDashboardPage() {
  const [wisata, budaya, umkm, berita] = await Promise.all([
    prisma.tourismPlace.count(),
    prisma.cultureItem.count(),
    prisma.productUMKM.count(),
    prisma.newsArticle.count(),
  ]);

  const cards = [
    {
      title: "Destinasi Wisata",
      count: wisata,
      href: "/admin/wisata",
      icon: Map,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Konten Budaya",
      count: budaya,
      href: "/admin/budaya",
      icon: Sparkles,
      color: "text-amber-600 bg-amber-50",
    },
    {
      title: "Produk UMKM",
      count: umkm,
      href: "/admin/umkm",
      icon: Store,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Berita Desa",
      count: berita,
      href: "/admin/berita",
      icon: Newspaper,
      color: "text-teal-600 bg-teal-50",
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-navy tracking-tight uppercase">
          Dashboard Admin
        </h1>
        <p className="text-sm text-navy/60 font-medium mt-1">
          Ringkasan konten portal Desa Nekmese.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className={`inline-flex p-3 rounded-xl mb-4 ${card.color}`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-black text-navy mb-1">{card.count}</p>
              <p className="text-sm font-bold text-navy/60 uppercase tracking-wide">
                {card.title}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
