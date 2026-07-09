"use client";

import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteWaterSource } from "./actions";

export default function DeleteForm({ id, name }: { id: string; name: string }) {
  const handleDelete = async () => {
    const formData = new FormData();
    formData.append("id", id);
    const result = await deleteWaterSource(formData);
    if (result && !result.success) {
      alert(result.message || "Terjadi kesalahan");
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
