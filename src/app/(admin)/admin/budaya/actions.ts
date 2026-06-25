"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-");
}

async function syncCultureMedia(
  cultureItemId: string,
  formData: FormData,
  existingMediaId?: string | null
) {
  const imageUrl = formData.get("imageUrl") as string | null;
  const imageKey = formData.get("imageKey") as string | null;
  const removeImage = formData.get("removeImage") === "true";
  const currentMediaId =
    (formData.get("currentMediaId") as string | null) || existingMediaId;

  if (removeImage && currentMediaId) {
    await prisma.mediaFile.delete({ where: { id: currentMediaId } });
    return;
  }

  if (imageUrl && imageKey) {
    if (currentMediaId) {
      await prisma.mediaFile.update({
        where: { id: currentMediaId },
        data: { url: imageUrl, publicId: imageKey },
      });
    } else {
      await prisma.mediaFile.create({
        data: {
          url: imageUrl,
          publicId: imageKey,
          cultureItemId,
        },
      });
    }
  }
}

export async function deleteCultureItem(formData: FormData) {
  await requireAdminSession(["SUPER_ADMIN", "ADMIN_KONTEN"]);
  const id = formData.get("id") as string;
  await prisma.cultureItem.delete({ where: { id } });
  revalidatePath("/admin/budaya");
  revalidateTag("culture", "max");
}

export async function createCultureItem(formData: FormData) {
  await requireAdminSession(["SUPER_ADMIN", "ADMIN_KONTEN"]);
  const name = formData.get("name") as string;
  const summary = (formData.get("summary") as string) || null;
  const description = formData.get("description") as string;
  const categoryId = formData.get("categoryId") as string;
  const status =
    (formData.get("status") as "PUBLISHED" | "DRAFT") || "DRAFT";

  const item = await prisma.cultureItem.create({
    data: {
      name,
      slug: generateSlug(name),
      summary,
      description,
      status,
      categoryId,
    },
  });

  await syncCultureMedia(item.id, formData);

  revalidatePath("/admin/budaya");
  revalidatePath("/budaya");
  revalidateTag("culture", "max");
  redirect("/admin/budaya");
}

export async function updateCultureItem(id: string, formData: FormData) {
  await requireAdminSession(["SUPER_ADMIN", "ADMIN_KONTEN"]);
  const name = formData.get("name") as string;
  const summary = (formData.get("summary") as string) || null;
  const description = formData.get("description") as string;
  const categoryId = formData.get("categoryId") as string;
  const statusInput = formData.get("status") as "PUBLISHED" | "DRAFT" | null;

  const existing = await prisma.cultureItem.findUnique({
    where: { id },
    include: { media: { take: 1 } },
  });

  if (!existing) {
    throw new Error("Konten budaya tidak ditemukan");
  }

  await prisma.cultureItem.update({
    where: { id },
    data: {
      name,
      slug: generateSlug(name),
      summary,
      description,
      categoryId,
      status: statusInput || existing.status,
    },
  });

  await syncCultureMedia(id, formData, existing.media[0]?.id);

  revalidatePath("/admin/budaya");
  revalidatePath("/budaya");
  revalidateTag("culture", "max");
  redirect("/admin/budaya");
}

export async function createCultureCategory(formData: FormData) {
  await requireAdminSession(["SUPER_ADMIN", "ADMIN_KONTEN"]);
  const name = formData.get("name") as string;
  if (!name?.trim()) return;

  await prisma.cultureCategory.create({ data: { name: name.trim() } });
  revalidatePath("/admin/budaya");
  revalidatePath("/admin/budaya/tambah");
}
