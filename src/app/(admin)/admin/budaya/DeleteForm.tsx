"use client";

import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteCultureItem } from "./actions";

export default function DeleteForm({ id }: { id: string }) {
  const handleDelete = async () => {
    const formData = new FormData();
    formData.append("id", id);
    await deleteCultureItem(formData);
  };

  return (
    <ConfirmDeleteButton
      onConfirm={handleDelete}
      title="Hapus Konten Budaya"
      message="Apakah Anda yakin ingin menghapus konten budaya ini secara permanen? Data yang dihapus tidak dapat dipulihkan."
    />
  );
}
