"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import type { OrderChannel } from "@prisma/client";

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-");
}

function parseProductForm(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseInt(formData.get("price") as string, 10);
  const ownerName = formData.get("ownerName") as string;
  const orderUrl = formData.get("orderUrl") as string;
  const orderType = formData.get("orderType") as OrderChannel;
  const status =
    (formData.get("status") as "PUBLISHED" | "DRAFT") || "DRAFT";
  const newImageUrl = formData.get("imageUrl") as string | null;
  const removeImage = formData.get("removeImage") === "true";

  return { name, description, price, ownerName, orderUrl, orderType, status, newImageUrl, removeImage };
}

export async function deleteUMKMProduct(formData: FormData) {
  await requireAdminSession(["SUPER_ADMIN", "ADMIN_UMKM"]);
  const id = formData.get("id") as string;
  await prisma.productUMKM.delete({ where: { id } });
  revalidatePath("/admin/umkm");
  revalidatePath("/umkm");
  revalidateTag("umkm", "max");
}

export async function createUMKMProduct(formData: FormData) {
  await requireAdminSession(["SUPER_ADMIN", "ADMIN_UMKM"]);
  const data = parseProductForm(formData);

  await prisma.productUMKM.create({
    data: {
      name: data.name,
      slug: generateSlug(data.name),
      description: data.description,
      price: data.price,
      ownerName: data.ownerName,
      orderUrl: data.orderUrl,
      orderType: data.orderType,
      status: data.status,
      imageUrl: data.removeImage ? null : data.newImageUrl,
    },
  });

  revalidatePath("/admin/umkm");
  revalidatePath("/umkm");
  revalidatePath("/");
  revalidateTag("umkm", "max");
  redirect("/admin/umkm");
}

export async function updateUMKMProduct(id: string, formData: FormData) {
  await requireAdminSession(["SUPER_ADMIN", "ADMIN_UMKM"]);
  const data = parseProductForm(formData);

  const existing = await prisma.productUMKM.findUnique({ where: { id } });
  if (!existing) throw new Error("Produk tidak ditemukan");

  const imageUrl = data.removeImage ? null : (data.newImageUrl || existing.imageUrl);

  await prisma.productUMKM.update({
    where: { id },
    data: {
      name: data.name,
      slug: generateSlug(data.name),
      description: data.description,
      price: data.price,
      ownerName: data.ownerName,
      orderUrl: data.orderUrl,
      orderType: data.orderType,
      status: data.status,
      imageUrl,
    },
  });

  revalidatePath("/admin/umkm");
  revalidatePath("/umkm");
  revalidatePath("/");
  revalidateTag("umkm", "max");
  redirect("/admin/umkm");
}
