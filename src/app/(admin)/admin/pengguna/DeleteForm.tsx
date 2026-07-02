"use client";

import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteAdmin } from "./actions";

export default function DeleteForm({ id }: { id: string }) {
  const handleDelete = async () => {
    const formData = new FormData();
    formData.append("id", id);
    await deleteAdmin(formData);
  };

  return (
    <ConfirmDeleteButton
      onConfirm={handleDelete}
      title="Hapus Admin"
      message="Apakah Anda yakin ingin menghapus akun admin ini secara permanen?"
    />
  );
}
