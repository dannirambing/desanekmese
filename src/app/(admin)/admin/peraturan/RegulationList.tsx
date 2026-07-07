"use client";

import { Edit, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import AdminTableFilters from "@/components/admin/AdminTableFilters";
import AdminTablePagination from "@/components/admin/AdminTablePagination";
import { deleteVillageRegulation } from "./actions";
import { RegulationType } from "@prisma/client";

interface Regulation {
  id: string;
  title: string;
  number: string;
  year: number;
  description: string | null;
  type: RegulationType;
  fileUrl: string;
  status: "DRAFT" | "PUBLISHED";
}

interface RegulationListProps {
  regulations: Regulation[];
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
}

export default function RegulationList({
  regulations,
  totalItems,
  itemsPerPage,
  currentPage,
}: RegulationListProps) {
  const router = useRouter();

  // Konversi enum ke teks ramah pengguna
  const getTypeText = (type: RegulationType) => {
    switch (type) {
      case "PERATURAN_DESA":
        return "Peraturan Desa";
      case "KEPUTUSAN_KEPALA_DESA":
        return "Keputusan Kepala Desa";
      case "PERATURAN_BERSAMA":
        return "Peraturan Bersama";
      default:
        return type;
    }
  };

  const filterCategories = [
    { label: "Peraturan Desa", value: "PERATURAN_DESA" },
    { label: "Keputusan Kepala Desa", value: "KEPUTUSAN_KEPALA_DESA" },
    { label: "Peraturan Bersama", value: "PERATURAN_BERSAMA" },
  ];

  return (
    <div className="space-y-6">
      {/* Panel Kontrol & Filter */}
      <AdminTableFilters
        placeholder="Cari berdasarkan nomor atau judul peraturan..."
        categories={filterCategories}
        categoryLabel="Jenis Peraturan"
      />

      {/* Tabel Peraturan */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-black uppercase tracking-wider text-navy/40">
                <th className="px-6 py-4">Nomor & Tahun</th>
                <th className="px-6 py-4">Judul Peraturan</th>
                <th className="px-6 py-4">Jenis Peraturan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Dokumen</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-semibold text-navy">
              {regulations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold uppercase tracking-wider">
                    Tidak ada data peraturan desa.
                  </td>
                </tr>
              ) : (
                regulations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/30 transition-colors">
                    {/* Nomor & Tahun */}
                    <td className="px-6 py-4">
                      <div className="font-extrabold">{reg.number}</div>
                      <div className="text-xs text-slate-400 font-bold tracking-wide mt-0.5">Tahun {reg.year}</div>
                    </td>

                    {/* Judul Peraturan */}
                    <td className="px-6 py-4 max-w-xs md:max-w-md">
                      <p className="font-bold text-navy truncate" title={reg.title}>
                        {reg.title}
                      </p>
                      {reg.description && (
                        <p className="text-xs text-slate-400 font-medium truncate mt-0.5" title={reg.description}>
                          {reg.description}
                        </p>
                      )}
                    </td>

                    {/* Jenis Peraturan */}
                    <td className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      {getTypeText(reg.type)}
                    </td>

                    {/* Status Publikasi */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          reg.status === "PUBLISHED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {reg.status === "PUBLISHED" ? "Published" : "Draft"}
                      </span>
                    </td>

                    {/* Dokumen Link */}
                    <td className="px-6 py-4">
                      <a
                        href={reg.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-turquoise text-turquoise hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
                      >
                        <FileText size={14} />
                        PDF <ExternalLink size={10} />
                      </a>
                    </td>

                    {/* Tombol Aksi */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit */}
                        <Link
                          href={`/admin/peraturan/${reg.id}/edit`}
                          className="p-2 text-navy/40 hover:text-turquoise hover:bg-teal-50 rounded-xl transition-all flex items-center justify-center cursor-pointer"
                          title="Edit Peraturan"
                        >
                          <Edit size={18} />
                        </Link>

                        {/* Hapus */}
                        <ConfirmDeleteButton
                          title="Hapus Peraturan"
                          message={`Apakah Anda yakin ingin menghapus peraturan "${reg.number}" secara permanen?`}
                          onConfirm={async () => {
                            await deleteVillageRegulation(reg.id);
                            router.refresh();
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigasi Halaman */}
      <AdminTablePagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalItems / itemsPerPage)}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}
