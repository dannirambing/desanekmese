"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteBudgetDetail } from "../actions";

export default function DeleteDetailButton({
  detailId,
  budgetId,
  category,
}: {
  detailId: string;
  budgetId: string;
  category: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (
      confirm(
        `Apakah Anda yakin ingin menghapus pos "${category}" secara permanen?`
      )
    ) {
      startTransition(async () => {
        try {
          const formData = new FormData();
          formData.append("detailId", detailId);
          formData.append("budgetId", budgetId);
          await deleteBudgetDetail(formData);
        } catch (error) {
          console.error("Gagal menghapus rincian anggaran:", error);
          alert("Gagal menghapus rincian anggaran. Silakan coba lagi.");
        }
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer disabled:opacity-50 inline-flex items-center justify-center"
      title="Hapus Pos"
    >
      {isPending ? (
        <Loader2 size={16} className="animate-spin text-red-600" />
      ) : (
        <Trash2 size={16} />
      )}
    </button>
  );
}
