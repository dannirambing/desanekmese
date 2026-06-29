"use client";

import { Trash2 } from "lucide-react";
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
  return (
    <form
      action={deleteBudgetDetail}
      onSubmit={(e) => {
        if (
          !confirm(
            `Apakah Anda yakin ingin menghapus pos "${category}" secara permanen?`
          )
        ) {
          e.preventDefault();
        }
      }}
      className="inline-block"
    >
      <input type="hidden" name="detailId" value={detailId} />
      <input type="hidden" name="budgetId" value={budgetId} />
      <button
        type="submit"
        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
        title="Hapus Pos"
      >
        <Trash2 size={16} />
      </button>
    </form>
  );
}
