"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { clearChatCacheByCategory } from "@/lib/cache-invalidation";

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-");
}

export async function deleteAnnouncement(formData: FormData) {
  await requireAdminSession(["MANAGE_PENGUMUMAN"]);
  const id = formData.get("id") as string;
  await prisma.announcement.delete({ where: { id } });
  revalidatePath("/admin/pengumuman");
  revalidatePath("/pengumuman");
  revalidateTag("announcement", "max");
  await clearChatCacheByCategory("PENGUMUMAN");
}

export async function createAnnouncement(formData: FormData) {
  const session = await requireAdminSession(["MANAGE_PENGUMUMAN"]);
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const status = (formData.get("status") as "PUBLISHED" | "DRAFT") || "DRAFT";
  const imageUrl = (formData.get("imageUrl") as string) || null;
  const category = (formData.get("category") as string) || "Umum";

  await prisma.announcement.create({
    data: {
      title,
      slug: generateSlug(title),
      content,
      status,
      imageUrl,
      category,
      createdById: session.user.id,
    },
  });

  revalidatePath("/admin/pengumuman");
  revalidatePath("/pengumuman");
  revalidateTag("announcement", "max");
  await clearChatCacheByCategory("PENGUMUMAN");
  redirect("/admin/pengumuman");
}

export async function updateAnnouncement(id: string, formData: FormData) {
  const session = await requireAdminSession(["MANAGE_PENGUMUMAN"]);
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const statusInput = formData.get("status") as "PUBLISHED" | "DRAFT" | null;
  const imageUrl = (formData.get("imageUrl") as string) || null;
  const removeImage = formData.get("removeImage") === "true";
  const category = (formData.get("category") as string) || "Umum";

  const existing = await prisma.announcement.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Pengumuman tidak ditemukan");
  }

  const finalImageUrl = removeImage ? null : (imageUrl || existing.imageUrl);

  await prisma.announcement.update({
    where: { id },
    data: {
      title,
      slug: generateSlug(title),
      content,
      status: statusInput || existing.status,
      imageUrl: finalImageUrl,
      category: category || existing.category,
      updatedById: session.user.id,
    },
  });

  revalidatePath("/admin/pengumuman");
  revalidatePath("/pengumuman");
  revalidateTag("announcement", "max");
  await clearChatCacheByCategory("PENGUMUMAN");
  redirect("/admin/pengumuman");
}
