import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Edit, Plus, Eye, Sparkles } from "lucide-react";
import DeleteForm from "./DeleteForm";
import { cn } from "@/lib/utils";

export default async function AdminBudayaPage() {
  const cultureItems = await prisma.cultureItem.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-navy tracking-tight uppercase">
            Kelola Budaya
          </h1>
          <p className="text-sm text-navy/60 font-medium mt-1">
            Manajemen konten budaya, kearifan lokal, dan tradisi desa.
          </p>
        </div>
        <Link
          href="/admin/budaya/tambah"
          className="inline-flex items-center justify-center bg-turquoise hover:bg-turquoise/90 text-black px-6 py-3 rounded-full font-bold text-xs tracking-widest uppercase transition-all shadow-md shadow-turquoise/10"
        >
          <Plus className="w-4 h-4 mr-2 stroke-[3]" />
          Tambah Budaya
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase text-xs font-extrabold text-navy/70 tracking-wider">
              <tr>
                <th className="px-6 py-4.5">Detail Budaya</th>
                <th className="px-6 py-4.5">Kategori</th>
                <th className="px-6 py-4.5">Status</th>
                <th className="px-6 py-4.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-navy/80">
              {cultureItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-16 text-center text-navy/40 font-semibold"
                  >
                    Belum ada konten budaya yang direkam.
                  </td>
                </tr>
              ) : (
                cultureItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-extrabold text-navy text-base mb-1">
                        {item.name}
                      </div>
                      {item.summary && (
                        <div className="flex items-start text-xs text-navy/50 font-semibold line-clamp-1">
                          <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500 shrink-0 mt-0.5" />
                          {item.summary}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-xs font-bold tracking-wide border border-amber-100">
                        {item.category?.name || "Umum"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border",
                          item.status === "PUBLISHED"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        )}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end items-center gap-1.5">
                        <Link
                          href={`/budaya/${item.slug}`}
                          target="_blank"
                          className="p-2 text-navy/40 hover:text-turquoise hover:bg-turquoise/5 rounded-xl transition-all"
                          title="Lihat Halaman Publik"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <Link
                          href={`/admin/budaya/${item.id}/edit`}
                          className="p-2 text-navy/40 hover:text-navy hover:bg-navy/5 rounded-xl transition-all"
                          title="Ubah Data"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <DeleteForm id={item.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
