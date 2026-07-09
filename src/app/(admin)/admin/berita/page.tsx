import { requireAdminSession } from "@/lib/auth-session";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import AdminTableFilters from "@/components/admin/AdminTableFilters";
import AdminTablePagination from "@/components/admin/AdminTablePagination";
import { Prisma } from "@prisma/client";
import BeritaTable from "@/components/admin/BeritaTable";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function AdminBeritaPage({ searchParams }: PageProps) {
  await requireAdminSession(["MANAGE_BERITA"]);

  const params = await searchParams;
  const search = params.search || "";
  const status = params.status || "";
  const page = parseInt(params.page || "1", 10);
  const itemsPerPage = 10;
  const skip = (page - 1) * itemsPerPage;

  // Build where query
  const where: Prisma.NewsArticleWhereInput = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { summary: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status && (status === "PUBLISHED" || status === "DRAFT")) {
    where.status = status as "PUBLISHED" | "DRAFT";
  }

  // Fetch paginated articles
  const [articles, totalItems] = await Promise.all([
    prisma.newsArticle.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: itemsPerPage,
      skip,
    }),
    prisma.newsArticle.count({ where }),
  ]);

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-navy tracking-tight uppercase">
            Kelola Berita
          </h1>
          <p className="text-sm text-navy/60 font-medium mt-1">
            Manajemen artikel berita, publikasi, dan draf informasi desa.
          </p>
        </div>
        <Link
          href="/admin/berita/tambah"
          className="inline-flex items-center justify-center bg-turquoise hover:bg-turquoise/90 text-black px-6 py-3 rounded-full font-bold text-xs tracking-widest uppercase transition-all shadow-md shadow-turquoise/10"
        >
          <Plus className="w-4 h-4 mr-2 stroke-[3]" />
          Tambah Berita
        </Link>
      </div>

      <AdminTableFilters placeholder="Cari berita (judul, ringkasan)..." />

      <BeritaTable initialArticles={articles} />

      <AdminTablePagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}
