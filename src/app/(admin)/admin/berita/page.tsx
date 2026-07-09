import { requireAdminSession } from "@/lib/auth-session";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Edit, Plus, Eye, Newspaper } from "lucide-react";
import DeleteForm from "./DeleteForm";
import { cn } from "@/lib/utils";
import { formatIndonesianDate } from "@/lib/format-date";
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

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase text-xs font-extrabold text-navy/70 tracking-wider">
              <tr>
                <th className="px-6 py-4.5">Judul Berita</th>
                <th className="px-6 py-4.5">Tanggal</th>
                <th className="px-6 py-4.5">Status</th>
                <th className="px-6 py-4.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-navy/80">
              {articles.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-16 text-center text-navy/40 font-semibold"
                  >
                    Belum ada berita yang direkam.
                  </td>
                </tr>
              ) : (
                articles.map((article) => {
                  const displayDate = article.publishedAt ?? article.createdAt;

                  return (
                    <tr
                      key={article.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-extrabold text-navy text-base mb-1">
                          {article.title}
                        </div>
                        {article.summary && (
                          <div className="flex items-start text-xs text-navy/50 font-semibold line-clamp-1">
                            <Newspaper className="w-3.5 h-3.5 mr-1 text-turquoise shrink-0 mt-0.5" />
                            {article.summary}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-navy/60">
                        {formatIndonesianDate(displayDate)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border",
                            article.status === "PUBLISHED"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          )}
                        >
                          {article.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end items-center gap-1.5">
                          {article.status === "PUBLISHED" && (
                            <Link
                              href={`/berita/${article.slug}`}
                              target="_blank"
                              className="p-2 text-navy/40 hover:text-turquoise hover:bg-turquoise/5 rounded-xl transition-all"
                              title="Lihat Halaman Publik"
                            >
                              <Eye className="w-5 h-5" />
                            </Link>
                          )}
                          <Link
                            href={`/admin/berita/${article.id}/edit`}
                            className="p-2 text-navy/40 hover:text-navy hover:bg-navy/5 rounded-xl transition-all"
                            title="Ubah Data"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <DeleteForm id={article.id} />
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

      <AdminTablePagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}
