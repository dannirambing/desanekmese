import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Edit, Plus, Eye, Megaphone } from "lucide-react";
import DeleteForm from "./DeleteForm";
import { cn } from "@/lib/utils";
import { formatIndonesianDate } from "@/lib/format-date";

export default async function AdminPengumumanPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-navy tracking-tight uppercase">
            Kelola Pengumuman
          </h1>
          <p className="text-sm text-navy/60 font-medium mt-1">
            Manajemen dokumen pengumuman, pemberitahuan, dan draf informasi desa.
          </p>
        </div>
        <Link
          href="/admin/pengumuman/tambah"
          className="inline-flex items-center justify-center bg-turquoise hover:bg-turquoise/90 text-black px-6 py-3 rounded-full font-bold text-xs tracking-widest uppercase transition-all shadow-md shadow-turquoise/10"
        >
          <Plus className="w-4 h-4 mr-2 stroke-[3]" />
          Tambah Pengumuman
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase text-xs font-extrabold text-navy/70 tracking-wider">
              <tr>
                <th className="px-6 py-4.5">Judul Pengumuman</th>
                <th className="px-6 py-4.5">Tanggal Dibuat</th>
                <th className="px-6 py-4.5">Status</th>
                <th className="px-6 py-4.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-navy/80">
              {announcements.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-16 text-center text-navy/40 font-semibold"
                  >
                    Belum ada pengumuman yang direkam.
                  </td>
                </tr>
              ) : (
                announcements.map((announcement) => {
                  return (
                    <tr
                      key={announcement.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-extrabold text-navy text-base mb-1">
                          {announcement.title}
                        </div>
                        {announcement.content && (
                          <div className="flex items-start text-xs text-navy/50 font-semibold line-clamp-1">
                            <Megaphone className="w-3.5 h-3.5 mr-1 text-turquoise shrink-0 mt-0.5" />
                            {announcement.content.slice(0, 100)}...
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-navy/60">
                        {formatIndonesianDate(announcement.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border",
                            announcement.status === "PUBLISHED"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          )}
                        >
                          {announcement.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end items-center gap-1.5">
                          {announcement.status === "PUBLISHED" && (
                            <Link
                              href={`/pengumuman/${announcement.slug}`}
                              target="_blank"
                              className="p-2 text-navy/40 hover:text-turquoise hover:bg-turquoise/5 rounded-xl transition-all"
                              title="Lihat Halaman Publik"
                            >
                              <Eye className="w-5 h-5" />
                            </Link>
                          )}
                          <Link
                            href={`/admin/pengumuman/${announcement.id}/edit`}
                            className="p-2 text-navy/40 hover:text-navy hover:bg-navy/5 rounded-xl transition-all"
                            title="Ubah Data"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <DeleteForm id={announcement.id} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
