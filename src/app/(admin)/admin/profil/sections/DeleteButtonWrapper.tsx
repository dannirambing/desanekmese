"use client";

import { useTransition } from "react";
import { deleteProfileSection } from "./actions";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { useRouter } from "next/navigation";

export default function DeleteButtonWrapper({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    const formData = new FormData();
    formData.append("id", id);
    
    return new Promise<void>((resolve, reject) => {
      startTransition(async () => {
        try {
          const res = await deleteProfileSection(formData);
          if (res.success) {
            router.refresh();
            resolve();
          } else {
            alert(res.message || "Gagal menghapus section.");
            reject(new Error(res.message));
          }
        } catch (err) {
          reject(err);
        }
      });
    });
  };

  return (
    <ConfirmDeleteButton
      onConfirm={handleDelete}
      title="Hapus Section Profil"
      message={`Apakah Anda yakin ingin menghapus section "${title}" beserta seluruh item daftar isi di dalamnya secara permanen?`}
    />
  );
}
