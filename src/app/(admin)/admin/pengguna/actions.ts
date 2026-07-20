"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { requireAdminSession } from "@/lib/auth-session";
import { createAdminSchema, updateAdminSchema } from "@/lib/validations/pengguna";

export async function createAdmin(formData: FormData) {
  const session = await requireAdminSession(["ALL_ACCESS"]);

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const roleId = formData.get("roleId") as string;

  const validation = createAdminSchema.safeParse({
    name,
    email,
    password,
    confirmPassword,
    roleId,
  });

  if (!validation.success) {
    throw new Error(validation.error.issues[0].message);
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
      roleId,
      isActive: true,
    },
  });

  revalidatePath("/admin/pengguna");
  redirect("/admin/pengguna");
}

export async function updateAdmin(id: string, formData: FormData) {
  const session = await requireAdminSession(["ALL_ACCESS"]);

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const roleId = formData.get("roleId") as string;

  const validation = updateAdminSchema.safeParse({
    name,
    email,
    password,
    confirmPassword,
    roleId,
  });

  if (!validation.success) {
    throw new Error(validation.error.issues[0].message);
  }

  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });

  if (existingAdmin && existingAdmin.id !== id) {
    throw new Error("Email ini sudah digunakan oleh admin lain.");
  }

  const updateData: {
    name: string;
    email: string;
    roleId?: string;
    passwordHash?: string;
  } = {
    name,
    email,
  };
  
  if (roleId) {
    updateData.roleId = roleId;
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

export async function toggleAdminStatus(id: string) {
  if (!id) return;

  const session = await requireAdminSession(["ALL_ACCESS"]);

  if (session?.user?.id === id) {
    throw new Error("Anda tidak dapat menonaktifkan akun Anda sendiri.");
  }

  const admin = await prisma.admin.findUnique({
    where: { id },
    include: { role: true },
  });

  if (!admin) {
    throw new Error("Admin tidak ditemukan.");
  }

  if (admin.role?.name === "Super Admin") {
    throw new Error("Akun Super Admin tidak dapat dinonaktifkan.");
  }

  await prisma.admin.update({
    where: { id },
    data: {
      isActive: !admin.isActive,
    },
  });

  revalidatePath("/admin/pengguna");
}
