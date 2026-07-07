"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { clearChatCacheByCategory } from "@/lib/cache-invalidation";
import type { OrderChannel } from "@prisma/client";
import { UTApi } from "uploadthing/server";
import { isFileKeyReferenced, getUploadThingKey } from "@/lib/uploadthing-server";

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
  await requireAdminSession(["MANAGE_UMKM"]);
  const id = formData.get("id") as string;

  const existing = await prisma.productUMKM.findUnique({
    where: { id },
    select: { imageUrl: true },
  });

  await prisma.productUMKM.delete({ where: { id } });

  if (existing?.imageUrl) {
    const key = getUploadThingKey(existing.imageUrl);
    if (key && !(await isFileKeyReferenced(key))) {
      const utapi = new UTApi();
      try {
        await utapi.deleteFiles(key);
      } catch (err) {
        console.error("Gagal menghapus file dari UploadThing:", err);
      }
    }
  }

  revalidatePath("/admin/umkm");
  revalidatePath("/umkm");
  revalidateTag("umkm", "max");
  await clearChatCacheByCategory("UMKM");
}

export async function createUMKMProduct(formData: FormData) {
  const session = await requireAdminSession(["MANAGE_UMKM"]);
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
      createdById: session.user.id,
    },
  });

  revalidatePath("/admin/umkm");
  revalidatePath("/umkm");
  revalidatePath("/");
  revalidateTag("umkm", "max");
  await clearChatCacheByCategory("UMKM");
  redirect("/admin/umkm");
}

export async function updateUMKMProduct(id: string, formData: FormData) {
  const session = await requireAdminSession(["MANAGE_UMKM"]);
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
      updatedById: session.user.id,
    },
  });

  // Clean up replaced or removed file from UploadThing jika tidak digunakan di tempat lain
  if (existing.imageUrl && (data.removeImage || (data.newImageUrl && data.newImageUrl !== existing.imageUrl))) {
    const key = getUploadThingKey(existing.imageUrl);
    if (key && !(await isFileKeyReferenced(key))) {
      const utapi = new UTApi();
      try {
        await utapi.deleteFiles(key);
      } catch (err) {
        console.error("Gagal menghapus file lama dari UploadThing:", err);
      }
    }
  }

  revalidatePath("/admin/umkm");
  revalidatePath("/umkm");
  revalidatePath("/");
  revalidateTag("umkm", "max");
  await clearChatCacheByCategory("UMKM");
  redirect("/admin/umkm");
}
