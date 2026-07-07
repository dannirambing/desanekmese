"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function updateMyProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Sesi tidak valid.");
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!email || !name) {
    throw new Error("Harap isi Nama dan Email.");
  }

  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });

  if (existingAdmin && existingAdmin.id !== session.user.id) {
    throw new Error("Email ini sudah digunakan oleh pengguna lain.");
  }

  const updateData: {
    name: string;
    email: string;
    passwordHash?: string;
  } = {
    name,
    email,
  };

  if (password) {
    if (password !== confirmPassword) {
      throw new Error("Password dan Konfirmasi Password tidak cocok.");
    }
    updateData.passwordHash = await hashPassword(password);
  }

  await prisma.admin.update({
    where: { id: session.user.id },
    data: updateData,
  });

  revalidatePath("/admin/profil-saya");
  return { success: true, message: "Profil berhasil diperbarui." };
}
