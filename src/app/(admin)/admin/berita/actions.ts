"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { clearChatCacheByCategory } from "@/lib/cache-invalidation";
import { UTApi } from "uploadthing/server";
import { isFileKeyReferenced } from "@/lib/uploadthing-server";

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
          newsArticleId,
        },
      });
    }
  }
}

export async function deleteNewsArticle(formData: FormData) {
  await requireAdminSession(["MANAGE_BERITA"]);
  const id = formData.get("id") as string;

  // Hapus semua file media yang terasosiasi dari UploadThing jika tidak digunakan di tempat lain
  const article = await prisma.newsArticle.findUnique({
    where: { id },
    include: { media: true },
  });

  await prisma.newsArticle.delete({ where: { id } });

  if (article?.media && article.media.length > 0) {
    const keys = article.media.map((m) => m.publicId).filter(Boolean);
    for (const key of keys) {
      if (!(await isFileKeyReferenced(key))) {
        const utapi = new UTApi();
        try {
          await utapi.deleteFiles(key);
        } catch (err) {
          console.error("Gagal menghapus media berita dari UploadThing:", err);
        }
      }
    }
  }

  revalidatePath("/admin/berita");
  revalidateTag("news", "max");
  await clearChatCacheByCategory("BERITA");
}

export async function createNewsArticle(formData: FormData) {
  const session = await requireAdminSession(["MANAGE_BERITA"]);
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
  const session = await requireAdminSession(["MANAGE_BERITA"]);
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
