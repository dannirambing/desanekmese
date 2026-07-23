import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-session";
import Link from "next/link";
import { Plus, Edit2, ArrowLeft, Layers } from "lucide-react";
import DeleteButtonWrapper from "./DeleteButtonWrapper";

export const dynamic = "force-dynamic";

export default async function SectionsPage() {
  // Verifikasi sesi admin
  await requireAdminSession(["MANAGE_PROFIL"]);

  // Ambil data semua section dinamis
  const sections = await prisma.profileSection.findMany({
    include: {
      items: {
        select: { id: true }
      }
    },
    orderBy: { order: "asc" }
  });

  return (
    <div className="max-w-5xl w-full mx-auto pb-16">
      <Link
        href="/admin/profil"
        className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-[#0f172a]/40 hover:text-[#0f172a] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Kelola Profil
      </Link>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-50 rounded-xl text-turquoise">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#0f172a] uppercase tracking-tight">
                Section Profil Dinamis
              </h1>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                Kelola bagian tambahan di halaman profil beserta daftar isinya
              </p>
            </div>
          </div>
          <Link
            href="/admin/profil/sections/tambah"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#14b8a6] hover:bg-[#0f172a] text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-[#14b8a6]/20"
          >
            <Plus className="w-4 h-4" /> Tambah Section
          </Link>
        </div>

        {sections.length === 0 ? (
          <div className="border-2 border-dashed border-slate-100 rounded-2xl p-16 text-center text-slate-400">
            <Layers className="w-12 h-12 mx-auto mb-3 opacity-35 text-slate-500" />
            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Belum Ada Section Dinamis</p>
            <p className="text-xs text-slate-450 uppercase tracking-wider mt-1">
              Silakan tambahkan section profil baru untuk menampilkan konten tambahan di halaman /profil.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Judul Section</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Jumlah Item (Sub-bagian)</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Urutan</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 pr-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sections.map((section) => (
                  <tr key={section.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 pl-4 font-bold text-navy text-sm max-w-xs truncate">
                      {section.title}
                      {section.description && (
                        <span className="block text-[10px] text-slate-400 font-medium truncate mt-0.5">
                          {section.description}
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-xs font-bold text-slate-600">
                      {section.items.length} Sub-bagian
                    </td>
                    <td className="py-4 text-xs font-extrabold text-slate-600">
                      {section.order}
                    </td>
                    <td className="py-4 text-xs">
                      {section.status === "PUBLISHED" ? (
                        <span className="inline-flex px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold uppercase tracking-wider text-[9px]">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full font-bold uppercase tracking-wider text-[9px]">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Link
                          href={`/admin/profil/sections/${section.id}`}
                          className="p-2 text-navy/40 hover:text-turquoise hover:bg-slate-100 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                          title="Edit Section"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <DeleteButtonWrapper id={section.id} title={section.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
