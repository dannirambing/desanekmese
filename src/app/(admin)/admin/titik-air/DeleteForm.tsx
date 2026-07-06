"use client";

import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteWaterSource } from "./actions";

export default function DeleteForm({ id, name }: { id: string; name: string }) {
  const handleDelete = async () => {
    const result = await deleteWaterSource(id);
    if (result && !result.success) {
      alert(result.error);
    }
  };

  return (
    <ConfirmDeleteButton
      onConfirm={handleDelete}
      title="Hapus Titik Air"
      message={`Apakah Anda yakin ingin menghapus titik air "${name}" secara permanen? Data yang dihapus tidak dapat dipulihkan.`}
    />
  );
}
