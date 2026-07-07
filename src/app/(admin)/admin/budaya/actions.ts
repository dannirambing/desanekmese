"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { clearChatCacheByCategory } from "@/lib/cache-invalidation";
import { UTApi } from "uploadthing/server";
import { isFileKeyReferenced } from "@/lib/uploadthing-server";

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
    const media = await prisma.mediaFile.findUnique({ where: { id: currentMediaId } });
    await prisma.mediaFile.delete({ where: { id: currentMediaId } });
    if (media?.publicId && !(await isFileKeyReferenced(media.publicId))) {
      const utapi = new UTApi();
      try {
        await utapi.deleteFiles(media.publicId);
      } catch (err) {
        console.error("Gagal menghapus file dari UploadThing:", err);
      }
    }
    return;
  }

  if (imageUrl && imageKey) {
    if (currentMediaId) {
      const media = await prisma.mediaFile.findUnique({ where: { id: currentMediaId } });
      await prisma.mediaFile.update({
        where: { id: currentMediaId },
        data: { url: imageUrl, publicId: imageKey },
      });
      if (media?.publicId && media.publicId !== imageKey && !(await isFileKeyReferenced(media.publicId))) {
        const utapi = new UTApi();
        try {
          await utapi.deleteFiles(media.publicId);
        } catch (err) {
          console.error("Gagal menghapus file lama dari UploadThing:", err);
        }
      }
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
  await requireAdminSession(["MANAGE_BUDAYA"]);
  const id = formData.get("id") as string;

  // Hapus semua file media yang terasosiasi dari UploadThing jika tidak digunakan di tempat lain
  const item = await prisma.cultureItem.findUnique({
    where: { id },
    include: { media: true },
  });

  await prisma.cultureItem.delete({ where: { id } });

  if (item?.media && item.media.length > 0) {
    const keys = item.media.map((m) => m.publicId).filter(Boolean);
    for (const key of keys) {
      if (!(await isFileKeyReferenced(key))) {
        const utapi = new UTApi();
        try {
          await utapi.deleteFiles(key);
        } catch (err) {
          console.error("Gagal menghapus media budaya dari UploadThing:", err);
        }
      }
    }
  }

  revalidatePath("/admin/budaya");
  revalidateTag("culture", "max");
  await clearChatCacheByCategory("BUDAYA");
}

export async function createCultureItem(formData: FormData) {
  const session = await requireAdminSession(["MANAGE_BUDAYA"]);
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
      createdById: session.user.id,
    },
  });

  await syncCultureMedia(item.id, formData);

  revalidatePath("/admin/budaya");
  revalidatePath("/budaya");
  revalidateTag("culture", "max");
  await clearChatCacheByCategory("BUDAYA");
  redirect("/admin/budaya");
}

export async function updateCultureItem(id: string, formData: FormData) {
  const session = await requireAdminSession(["MANAGE_BUDAYA"]);
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
      updatedById: session.user.id,
    },
  });

  await syncCultureMedia(id, formData, existing.media[0]?.id);

  revalidatePath("/admin/budaya");
  revalidatePath("/budaya");
  revalidateTag("culture", "max");
  await clearChatCacheByCategory("BUDAYA");
  redirect("/admin/budaya");
}

export async function createCultureCategory(formData: FormData) {
  await requireAdminSession(["MANAGE_BUDAYA"]);
  const name = formData.get("name") as string;
  if (!name?.trim()) return;

  await prisma.cultureCategory.create({ data: { name: name.trim() } });
  revalidatePath("/admin/budaya");
  revalidatePath("/admin/budaya/tambah");
  await clearChatCacheByCategory("BUDAYA");
}
