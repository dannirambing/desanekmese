"use client";

import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
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
  const handleDelete = async () => {
    const formData = new FormData();
    formData.append("detailId", detailId);
    formData.append("budgetId", budgetId);
    await deleteBudgetDetail(formData);
  };

  return (
    <ConfirmDeleteButton
      onConfirm={handleDelete}
      title="Hapus Pos Anggaran"
      message={`Apakah Anda yakin ingin menghapus pos "${category}" secara permanen?`}
      buttonClassName="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer disabled:opacity-50 inline-flex items-center justify-center"
    />
  );
}
