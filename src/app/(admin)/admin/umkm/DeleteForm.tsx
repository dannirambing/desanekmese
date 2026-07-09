"use client";

import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteUMKMProduct } from "./actions";

export default function DeleteForm({ id }: { id: string }) {
  const handleDelete = async () => {
    await deleteUMKMProduct({ id });
  };

  return (
    <ConfirmDeleteButton
      onConfirm={handleDelete}
      title="Hapus Produk UMKM"
      message="Apakah Anda yakin ingin menghapus produk UMKM ini secara permanen? Data yang dihapus tidak dapat dipulihkan."
    />
  );
}
