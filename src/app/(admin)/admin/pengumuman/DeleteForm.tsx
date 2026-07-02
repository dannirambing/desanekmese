"use client";

import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteAnnouncement } from "./actions";

export default function DeleteForm({ id }: { id: string }) {
  const handleDelete = async () => {
    const formData = new FormData();
    formData.append("id", id);
    await deleteAnnouncement(formData);
  };

  return (
    <ConfirmDeleteButton
      onConfirm={handleDelete}
      title="Hapus Pengumuman"
      message="Apakah Anda yakin ingin menghapus pengumuman ini secara permanen? Data yang dihapus tidak dapat dipulihkan."
    />
  );
}
