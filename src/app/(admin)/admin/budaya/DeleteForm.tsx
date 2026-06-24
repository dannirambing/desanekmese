"use client";

import { Trash2 } from "lucide-react";
import { deleteCultureItem } from "./actions";

export default function DeleteForm({ id }: { id: string }) {
  return (
    <form
      action={deleteCultureItem}
      onSubmit={(e) => {
        if (
          !confirm(
            "Apakah Anda yakin ingin menghapus konten budaya ini secara permanen?"
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="p-2 text-navy/40 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
        title="Hapus Data Permanen"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </form>
  );
}
