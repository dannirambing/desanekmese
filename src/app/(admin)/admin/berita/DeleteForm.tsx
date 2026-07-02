"use client";

import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteNewsArticle } from "./actions";

export default function DeleteForm({ id }: { id: string }) {
  const handleDelete = async () => {
    const formData = new FormData();
    formData.append("id", id);
    await deleteNewsArticle(formData);
  };

  return (
    <ConfirmDeleteButton
      onConfirm={handleDelete}
      title="Hapus Berita"
      message="Apakah Anda yakin ingin menghapus berita ini secara permanen? Data yang dihapus tidak dapat dipulihkan."
    />
  );
}
