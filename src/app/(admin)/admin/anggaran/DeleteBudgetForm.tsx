"use client";

import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteBudget } from "./actions";

export default function DeleteBudgetForm({ id, year }: { id: string; year: number }) {
  const handleDelete = async () => {
    const formData = new FormData();
    formData.append("id", id);
    await deleteBudget(formData);
  };

  return (
    <ConfirmDeleteButton
      onConfirm={handleDelete}
      title="Hapus Anggaran Tahun Ini"
      message={`Apakah Anda yakin ingin menghapus data anggaran tahun ${year} secara permanen? Semua rincian di dalamnya juga akan terhapus.`}
    />
  );
}
