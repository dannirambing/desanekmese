"use client";

import { useOptimistic, useTransition, useState } from "react";
import Link from "next/link";
import { Edit, Eye, Newspaper, Trash2, Loader2, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatIndonesianDate } from "@/lib/format-date";
import ConfirmDeleteButton from "./ConfirmDeleteButton";
import { deleteNewsArticle, deleteBulkNewsArticles } from "@/app/(admin)/admin/berita/actions";

interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  status: string;
  createdAt: Date;
  publishedAt: Date | null;
}

export default function BeritaTable({ initialArticles }: { initialArticles: Article[] }) {
  const [isPending, startTransition] = useTransition();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const [optimisticArticles, addOptimisticAction] = useOptimistic(
    initialArticles,
    (state, action: { type: "delete" | "deleteBulk"; ids: string[] }) => {
      if (action.type === "delete" || action.type === "deleteBulk") {
        return state.filter((article) => !action.ids.includes(article.id));
      }
      return state;
    }
  );

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      addOptimisticAction({ type: "delete", ids: [id] });
      const formData = new FormData();
      formData.append("id", id);
      await deleteNewsArticle(formData);
    });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    const confirm = window.confirm(`Hapus ${selectedIds.size} berita secara permanen?`);
    if (!confirm) return;

    setIsBulkDeleting(true);
    startTransition(async () => {
      const idsToDelete = Array.from(selectedIds);
      addOptimisticAction({ type: "deleteBulk", ids: idsToDelete });
      await deleteBulkNewsArticles(idsToDelete);
      setSelectedIds(new Set());
      setIsBulkDeleting(false);
    });
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === optimisticArticles.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(optimisticArticles.map((a) => a.id)));
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Toolbar Bulk Action */}
      {selectedIds.size > 0 && (
        <div className="bg-turquoise/10 px-6 py-3 border-b border-turquoise/20 flex items-center justify-between">
          <span className="text-sm font-bold text-navy">
            {selectedIds.size} berita dipilih
          </span>
          <button
            onClick={handleBulkDelete}
            disabled={isBulkDeleting}
            className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all disabled:opacity-50"
          >
            {isBulkDeleting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            Hapus Terpilih
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 uppercase text-xs font-extrabold text-navy/70 tracking-wider">
            <tr>
              <th className="px-6 py-4.5 w-12">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-turquoise focus:ring-turquoise/40"
                  checked={optimisticArticles.length > 0 && selectedIds.size === optimisticArticles.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-6 py-4.5">Judul Berita</th>
              <th className="px-6 py-4.5">Tanggal</th>
              <th className="px-6 py-4.5">Status</th>
              <th className="px-6 py-4.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-navy/80">
            {optimisticArticles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-navy/40 font-semibold">
                  Belum ada berita yang direkam.
                </td>
              </tr>
            ) : (
              optimisticArticles.map((article) => {
                const displayDate = article.publishedAt ?? article.createdAt;

                return (
                  <tr key={article.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-turquoise focus:ring-turquoise/40"
                        checked={selectedIds.has(article.id)}
                        onChange={() => toggleSelect(article.id)}
                      />
                    </td>
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
                        
                        <ConfirmDeleteButton
                          onConfirm={() => handleDelete(article.id)}
                          title="Hapus Berita"
                          message="Hapus berita ini secara permanen?"
                        />
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
  );
}
