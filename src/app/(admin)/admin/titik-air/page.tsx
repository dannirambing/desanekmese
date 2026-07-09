import { requireAdminSession } from "@/lib/auth-session";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, MapPin, Edit, Eye } from "lucide-react";
import DeleteForm from "./DeleteForm";
import AdminTableFilters from "@/components/admin/AdminTableFilters";
import AdminTablePagination from "@/components/admin/AdminTablePagination";
import { Prisma } from "@prisma/client";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function WaterSourceAdminPage({ searchParams }: PageProps) {
  await requireAdminSession(["MANAGE_AIR"]);

  const params = await searchParams;
  const search = params.search || "";
  const status = params.status || "";
  const page = parseInt(params.page || "1", 10);
  const itemsPerPage = 10;
  const skip = (page - 1) * itemsPerPage;

  // Build where query
  const where: Prisma.WaterSourceWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status && (status === "PUBLISHED" || status === "DRAFT")) {
    where.status = status as "PUBLISHED" | "DRAFT";
  }

  // Fetch paginated water sources
  const [sources, totalItems] = await Promise.all([
    prisma.waterSource.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: itemsPerPage,
      skip,
    }),
    prisma.waterSource.count({ where }),
  ]);

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-navy tracking-tight uppercase">
            Kelola Titik Air
          </h1>
          <p className="text-sm text-navy/60 font-medium mt-1">
            Manajemen data dan lokasi persebaran titik air desa.
          </p>
        </div>
        <Link
          href="/admin/titik-air/create"
          className="inline-flex items-center justify-center bg-turquoise hover:bg-turquoise/90 text-black px-6 py-3 rounded-full font-bold text-xs tracking-widest uppercase transition-all shadow-md shadow-turquoise/10"
        >
          <Plus className="w-4 h-4 mr-2 stroke-[3]" />
          Tambah Titik Air
        </Link>
      </div>

      <AdminTableFilters placeholder="Cari titik air (nama)..." />

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4">Nama & Lokasi</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sources.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                    <MapPin className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="font-medium">Belum ada data titik air.</p>
                  </td>
                </tr>
              ) : (
                sources.map((source) => (
                  <tr key={source.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {source.imageUrl || (source.images && source.images.length > 0) ? (
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                            <img src={source.imageUrl || source.images[0]} alt={source.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5 text-slate-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-[#0f172a]">{source.name}</p>
                          <p className="text-xs text-slate-500 truncate max-w-xs">{source.latitude}, {source.longitude}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${source.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                        {source.status === 'PUBLISHED' ? 'Aktif' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end items-center gap-1.5">
                        <Link 
                          href={`/profil/titik-air/${source.slug}`} 
                          target="_blank" 
                          className="p-2 text-navy/40 hover:text-turquoise hover:bg-turquoise/5 rounded-xl transition-all"
                          title="Lihat Halaman Publik"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <Link 
                          href={`/admin/titik-air/${source.id}/edit`} 
                          className="p-2 text-navy/40 hover:text-navy hover:bg-navy/5 rounded-xl transition-all"
                          title="Ubah Data"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <DeleteForm id={source.id} name={source.name} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminTablePagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}
