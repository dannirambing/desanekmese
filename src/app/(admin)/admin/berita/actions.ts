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

async function syncNewsMedia(
  newsArticleId: string,
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
          newsArticleId,
        },
      });
    }
  }
}

export async function deleteNewsArticle(formData: FormData) {
  await requireAdminSession(["SUPER_ADMIN", "ADMIN_KONTEN"]);
  const id = formData.get("id") as string;
  await prisma.newsArticle.delete({ where: { id } });
  revalidatePath("/admin/berita");
  revalidateTag("news", "max");
  await clearChatCacheByCategory("BERITA");
}

export async function createNewsArticle(formData: FormData) {
  const session = await requireAdminSession(["SUPER_ADMIN", "ADMIN_KONTEN"]);
  const title = formData.get("title") as string;
  const summary = (formData.get("summary") as string) || null;
  const content = formData.get("content") as string;
  const status =
    (formData.get("status") as "PUBLISHED" | "DRAFT") || "DRAFT";

  const article = await prisma.newsArticle.create({
    data: {
      title,
      slug: generateSlug(title),
      summary,
      content,
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
      createdById: session.user.id,
    },
  });

  await syncNewsMedia(article.id, formData);

  revalidatePath("/admin/berita");
  revalidatePath("/berita");
  revalidateTag("news", "max");
  await clearChatCacheByCategory("BERITA");
  redirect("/admin/berita");
}

export async function updateNewsArticle(id: string, formData: FormData) {
  const session = await requireAdminSession(["SUPER_ADMIN", "ADMIN_KONTEN"]);
  const title = formData.get("title") as string;
  const summary = (formData.get("summary") as string) || null;
  const content = formData.get("content") as string;
  const statusInput = formData.get("status") as "PUBLISHED" | "DRAFT" | null;

  const existing = await prisma.newsArticle.findUnique({
    where: { id },
    include: { media: { take: 1 } },
  });

  if (!existing) {
    throw new Error("Berita tidak ditemukan");
  }

  const status = statusInput || existing.status;
  const publishedAt =
    status === "PUBLISHED"
      ? existing.publishedAt ?? new Date()
      : null;

  await prisma.newsArticle.update({
    where: { id },
    data: {
      title,
      slug: generateSlug(title),
      summary,
      content,
      status,
      publishedAt,
      updatedById: session.user.id,
    },
  });

  await syncNewsMedia(id, formData, existing.media[0]?.id);

  revalidatePath("/admin/berita");
  revalidatePath("/berita");
  revalidateTag("news", "max");
  await clearChatCacheByCategory("BERITA");
  redirect("/admin/berita");
}
