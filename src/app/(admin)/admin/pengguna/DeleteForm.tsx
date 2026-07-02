"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteAdmin } from "./actions";

export default function DeleteForm({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Apakah Anda yakin ingin menghapus admin ini secara permanen?")) {
      startTransition(async () => {
        try {
          const formData = new FormData();
          formData.append("id", id);
          await deleteAdmin(formData);
        } catch (error) {
          console.error("Gagal menghapus admin pengguna:", error);
          alert("Gagal menghapus admin pengguna. Silakan coba lagi.");
        }
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 text-navy/40 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center"
      title="Hapus Data Permanen"
    >
      {isPending ? (
        <Loader2 className="w-5 h-5 animate-spin text-red-600" />
      ) : (
        <Trash2 className="w-5 h-5" />
      )}
    </button>
  );
}
