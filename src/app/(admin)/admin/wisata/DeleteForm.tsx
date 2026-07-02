"use client";

import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteTourismPlace } from "./actions";

export default function DeleteForm({ id }: { id: string }) {
  const handleDelete = async () => {
    const formData = new FormData();
    formData.append("id", id);
    await deleteTourismPlace(formData);
  };

  return (
    <ConfirmDeleteButton
      onConfirm={handleDelete}
      title="Hapus Destinasi Wisata"
      message="Apakah Anda yakin ingin menghapus destinasi wisata ini secara permanen? Data yang dihapus tidak dapat dipulihkan."
    />
  );
}