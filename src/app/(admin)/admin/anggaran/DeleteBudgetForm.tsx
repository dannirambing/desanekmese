"use client";

import { Trash2 } from "lucide-react";
import { deleteBudget } from "./actions";

export default function DeleteBudgetForm({ id, year }: { id: string; year: number }) {
  return (
    <form
      action={deleteBudget}
      onSubmit={(e) => {
        if (
          !confirm(
            `Apakah Anda yakin ingin menghapus data anggaran tahun ${year} secara permanen? Semua rincian di dalamnya juga akan terhapus.`
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="p-2 text-navy/40 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
        title="Hapus Anggaran Tahun Ini"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </form>
  );
}
