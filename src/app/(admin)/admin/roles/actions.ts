"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-session";

export async function createRole(formData: FormData) {
  await requireAdminSession(["ALL_ACCESS"]);

  const name = formData.get("name") as string;
  const permissions = formData.getAll("permissions") as string[];

  if (!name) {
    throw new Error("Nama peran wajib diisi.");
  }

  const existing = await prisma.role.findUnique({ where: { name } });
  if (existing) {
    throw new Error("Peran dengan nama ini sudah ada.");
  }

  await prisma.role.create({
    data: {
      name,
      permissions,
      isSystem: false,
    }
  });

  revalidatePath("/admin/roles");
  redirect("/admin/roles");
}

export async function updateRole(id: string, formData: FormData) {
  await requireAdminSession(["ALL_ACCESS"]);

  const name = formData.get("name") as string;
  const permissions = formData.getAll("permissions") as string[];

  if (!name) {
    throw new Error("Nama peran wajib diisi.");
  }

  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) {
    throw new Error("Peran tidak ditemukan.");
  }

  if (role.isSystem && role.name === "Super Admin" && !permissions.includes("ALL_ACCESS")) {
    throw new Error("Super Admin harus memiliki semua akses.");
  }

  const existing = await prisma.role.findUnique({ where: { name } });
  if (existing && existing.id !== id) {
    throw new Error("Peran dengan nama ini sudah ada.");
  }

  await prisma.role.update({
    where: { id },
    data: {
      name,
      permissions,
    }
  });

  revalidatePath("/admin/roles");
  redirect("/admin/roles");
}

export async function deleteRole(formData: FormData) {
  await requireAdminSession(["ALL_ACCESS"]);

  const id = formData.get("id") as string;
  if (!id) return;

  const role = await prisma.role.findUnique({ where: { id }, include: { _count: { select: { admins: true } } } });
  
  if (!role) throw new Error("Peran tidak ditemukan.");
  if (role.isSystem) throw new Error("Peran sistem tidak dapat dihapus.");
  if (role._count.admins > 0) throw new Error("Tidak dapat menghapus peran karena masih ada pengguna yang menggunakannya.");

  await prisma.role.delete({ where: { id } });
  revalidatePath("/admin/roles");
}
