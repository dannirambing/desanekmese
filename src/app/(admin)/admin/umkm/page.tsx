import { requireAdminSession } from "@/lib/auth-session";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import AdminTableFilters from "@/components/admin/AdminTableFilters";
import AdminTablePagination from "@/components/admin/AdminTablePagination";
import { Prisma } from "@prisma/client";
import UmkmTable from "@/components/admin/UmkmTable";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function AdminUmkmPage({ searchParams }: PageProps) {
  await requireAdminSession(["MANAGE_UMKM"]);

  const params = await searchParams;
  const search = params.search || "";
  const status = params.status || "";
  const page = parseInt(params.page || "1", 10);
  const itemsPerPage = 10;
  const skip = (page - 1) * itemsPerPage;

  // Build where query
  const where: Prisma.ProductUMKMWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { ownerName: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status && (status === "PUBLISHED" || status === "DRAFT")) {
    where.status = status as "PUBLISHED" | "DRAFT";
  }

  // Fetch paginated products
  const [products, totalItems] = await Promise.all([
    prisma.productUMKM.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: itemsPerPage,
      skip,
      select: {
        id: true,
        name: true,
        slug: true,
        ownerName: true,
        price: true,
        orderType: true,
        status: true,
      }
    }),
    prisma.productUMKM.count({ where }),
  ]);

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-navy tracking-tight uppercase">
            Kelola UMKM
          </h1>
          <p className="text-sm text-navy/60 font-medium mt-1">
            Manajemen produk lokal, link pemesanan, dan publikasi.
          </p>
        </div>
        <Link
          href="/admin/umkm/tambah"
          className="inline-flex items-center justify-center bg-turquoise hover:bg-turquoise/90 text-black px-6 py-3 rounded-full font-bold text-xs tracking-widest uppercase transition-all shadow-md shadow-turquoise/10"
        >
          <Plus className="w-4 h-4 mr-2 stroke-[3]" />
          Tambah Produk
        </Link>
      </div>

      <AdminTableFilters placeholder="Cari produk (nama, pemilik)..." />

      <UmkmTable initialProducts={products} />

      <AdminTablePagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}
