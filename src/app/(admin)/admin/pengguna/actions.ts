"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createAdmin(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "SUPER_ADMIN") {
    throw new Error("Tidak memiliki izin (Hanya Super Admin).");
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const role = formData.get("role") as any;

  if (!email || !password || !name) {
    throw new Error("Harap isi semua field yang wajib.");
  }

  if (password !== confirmPassword) {
    throw new Error("Password dan Konfirmasi Password tidak cocok.");
  }

  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    throw new Error("Email ini sudah digunakan oleh admin lain.");
  }

  const passwordHash = await hashPassword(password);

  await prisma.admin.create({
    data: {
      name,
      email,
      passwordHash,
      role: role || "SUPER_ADMIN",
    },
  });

  revalidatePath("/admin/pengguna");
  redirect("/admin/pengguna");
}

export async function updateAdmin(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "SUPER_ADMIN") {
    throw new Error("Tidak memiliki izin (Hanya Super Admin).");
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const role = formData.get("role") as any;

  if (!email || !name) {
    throw new Error("Harap isi Nama dan Email.");
  }

  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });

  if (existingAdmin && existingAdmin.id !== id) {
    throw new Error("Email ini sudah digunakan oleh admin lain.");
  }

  const updateData: any = {
    name,
    email,
  };
  
  if (role) {
    updateData.role = role;
  }

  if (password) {
    if (password !== confirmPassword) {
      throw new Error("Password dan Konfirmasi Password tidak cocok.");
    }
    updateData.passwordHash = await hashPassword(password);
  }

  await prisma.admin.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/admin/pengguna");
  redirect("/admin/pengguna");
}

export async function deleteAdmin(formData: FormData) {
  const id = formData.get("id") as string;

  if (!id) return;

  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "SUPER_ADMIN") {
    throw new Error("Tidak memiliki izin (Hanya Super Admin).");
  }

  if (session?.user?.id === id) {
    throw new Error("Anda tidak dapat menghapus akun Anda sendiri.");
  }

  // Cek apakah ini admin terakhir
  const adminCount = await prisma.admin.count();
  if (adminCount <= 1) {
    throw new Error("Tidak dapat menghapus admin terakhir.");
  }

  await prisma.admin.delete({
    where: { id },
  });

  revalidatePath("/admin/pengguna");
}
