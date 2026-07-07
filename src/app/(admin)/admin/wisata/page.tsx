import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Edit, Plus, Eye, MapPin } from "lucide-react";
import DeleteForm from "./DeleteForm";
import { cn } from "@/lib/utils";
import AdminTableFilters from "@/components/admin/AdminTableFilters";
import AdminTablePagination from "@/components/admin/AdminTablePagination";
import { Prisma } from "@prisma/client";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    category?: string;
    page?: string;
  }>;
}

export default async function AdminWisataPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const status = params.status || "";
  const category = params.category || "";
  const page = parseInt(params.page || "1", 10);
  const itemsPerPage = 10;
  const skip = (page - 1) * itemsPerPage;

  // Build where query
  const where: Prisma.TourismPlaceWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status && (status === "PUBLISHED" || status === "DRAFT")) {
    where.status = status as "PUBLISHED" | "DRAFT";
  }

  if (category) {
    where.categoryId = category;
  }

  // Fetch data
  const [destinations, totalItems, dbCategories] = await Promise.all([
    prisma.tourismPlace.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { category: true },
      take: itemsPerPage,
      skip,
    }),
    prisma.tourismPlace.count({ where }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const categoryOptions = dbCategories.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  return (
    <div className="w-full">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-navy tracking-tight uppercase">
            Kelola Wisata
          </h1>
          <p className="text-sm text-navy/60 font-medium mt-1">
            Manajemen artikel, publikasi, dan draf destinasi pariwisata desa.
          </p>
        </div>
        <Link 
          href="/admin/wisata/tambah" 
          className="inline-flex items-center justify-center bg-turquoise hover:bg-turquoise/90 text-black px-6 py-3 rounded-full font-bold text-xs tracking-widest uppercase transition-all shadow-md shadow-turquoise/10 animate-fade-in"
        >
          <Plus className="w-4 h-4 mr-2 stroke-[3]" />
          Tambah Wisata
        </Link>
      </div>

      <AdminTableFilters
        placeholder="Cari wisata (nama, lokasi)..."
        categories={categoryOptions}
        categoryLabel="Kategori Wisata"
      />

      {/* Kontainer Tabel */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase text-xs font-extrabold text-navy/70 tracking-wider">
              <tr>
                <th className="px-6 py-4.5">Detail Destinasi</th>
                <th className="px-6 py-4.5">Kategori</th>
                <th className="px-6 py-4.5">Status</th>
                <th className="px-6 py-4.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-navy/80">
              {destinations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-navy/40 font-semibold">
                    Belum ada data objek wisata yang direkam.
                  </td>
                </tr>
              ) : (
                destinations.map((dest) => (
                  <tr key={dest.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-extrabold text-navy text-base mb-1">{dest.name}</div>
                      <div className="flex items-center text-xs text-navy/50 font-semibold">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-turquoise" />
                        {dest.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-navy/5 text-navy px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                        {dest.category?.name || "Umum"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border",
                        dest.status === "PUBLISHED" 
                          ? "bg-green-50 text-green-700 border-green-200" 
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      )}>
                        {dest.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end items-center gap-1.5">
                        <Link 
                          href={`/destinasi/${dest.slug}`} 
                          target="_blank" 
                          className="p-2 text-navy/40 hover:text-turquoise hover:bg-turquoise/5 rounded-xl transition-all"
                          title="Lihat Halaman Publik"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <Link 
                          href={`/admin/wisata/${dest.id}/edit`} 
                          className="p-2 text-navy/40 hover:text-navy hover:bg-navy/5 rounded-xl transition-all"
                          title="Ubah Data"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <DeleteForm id={dest.id} />
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