"use client";

import { useActionState, useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteRole } from "./actions";

export default function DeleteForm({ id }: { id: string }) {
  const [isPending, setIsPending] = useState(false);

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault();
    if (confirm("Apakah Anda yakin ingin menghapus peran ini?")) {
      setIsPending(true);
      const formData = new FormData();
      formData.append("id", id);
      try {
        await deleteRole(formData);
      } catch (error) {
        alert(error instanceof Error ? error.message : "Terjadi kesalahan.");
      } finally {
        setIsPending(false);
      }
    }
  }

  return (
    <form onSubmit={handleDelete}>
      <button
        type="submit"
        disabled={isPending}
        className={`p-2 rounded-xl transition-all text-red-500 hover:text-red-600 hover:bg-red-50 ${
          isPending ? "opacity-50 cursor-not-allowed" : ""
        }`}
        title="Hapus Peran"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </form>
  );
}
