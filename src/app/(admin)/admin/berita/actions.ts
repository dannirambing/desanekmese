"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { clearChatCacheByCategory } from "@/lib/cache-invalidation";
import { UTApi } from "uploadthing/server";
import { isFileKeyReferenced } from "@/lib/uploadthing-server";
import { createSafeAction } from "@/lib/action-utils";
import { newsArticleSchema, NewsArticleInput } from "@/lib/validations/berita";

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
  return createSafeAction(formData, {
    permissions: ["MANAGE_BERITA"],
    actionType: "DELETE",
    entityName: "NewsArticle",
    handler: async (data, adminId, fd) => {
      const id = fd.get("id") as string;
      const article = await prisma.newsArticle.findUnique({
        where: { id },
        include: { media: true },
      });

      if (!article) throw new Error("Berita tidak ditemukan");

      await prisma.newsArticle.delete({ where: { id } });

      if (article.media && article.media.length > 0) {
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
      
      return { entityId: id, details: `Menghapus berita: ${article.title}` };
    },
  });
}

export async function createNewsArticle(formData: FormData) {
  const result = await createSafeAction(formData, {
    permissions: ["MANAGE_BERITA"],
    schema: newsArticleSchema,
    actionType: "CREATE",
    entityName: "NewsArticle",
    handler: async (validatedData, adminId, fd) => {
      const { title, summary, content, status } = validatedData as NewsArticleInput;
      
      const article = await prisma.newsArticle.create({
        data: {
          title,
          slug: generateSlug(title),
          summary,
          content,
          status,
          publishedAt: status === "PUBLISHED" ? new Date() : null,
          createdById: adminId,
        },
      });

      await syncNewsMedia(article.id, fd);

      revalidatePath("/admin/berita");
      revalidatePath("/berita");
      revalidateTag("news", "max");
      await clearChatCacheByCategory("BERITA");
      
      return { entityId: article.id, details: `Membuat berita baru: ${title}` };
    },
  });

  if (result.success) {
    redirect("/admin/berita");
  }
  return result;
}

export async function updateNewsArticle(id: string, formData: FormData) {
  const result = await createSafeAction(formData, {
    permissions: ["MANAGE_BERITA"],
    schema: newsArticleSchema,
    actionType: "UPDATE",
    entityName: "NewsArticle",
    handler: async (validatedData, adminId, fd) => {
      const { title, summary, content, status } = validatedData as NewsArticleInput;

      const existing = await prisma.newsArticle.findUnique({
        where: { id },
        include: { media: { take: 1 } },
      });

      if (!existing) {
        throw new Error("Berita tidak ditemukan");
      }

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
          updatedById: adminId,
        },
      });

      await syncNewsMedia(id, fd, existing.media[0]?.id);

      revalidatePath("/admin/berita");
      revalidatePath("/berita");
      revalidateTag("news", "max");
      await clearChatCacheByCategory("BERITA");
      
      return { entityId: id, details: `Memperbarui berita: ${title}` };
    },
  });

  if (result.success) {
    redirect("/admin/berita");
  }
  return result;
}

export async function deleteBulkNewsArticles(ids: string[]) {
  const session = await requireAdminSession(["MANAGE_BERITA"]);

  const articles = await prisma.newsArticle.findMany({
    where: { id: { in: ids } },
    include: { media: true },
  });

  await prisma.newsArticle.deleteMany({
    where: { id: { in: ids } },
  });

  // Hapus gambar terkait dari UploadThing
  for (const article of articles) {
    if (article.media && article.media.length > 0) {
      const keys = article.media.map((m) => m.publicId).filter(Boolean);
      for (const key of keys) {
        if (!(await isFileKeyReferenced(key))) {
          const utapi = new UTApi();
          try {
            await utapi.deleteFiles(key);
          } catch (err) {
            console.error("Gagal menghapus media bulk dari UploadThing:", err);
          }
        }
      }
    }
  }

  // Audit Log Bulk
  prisma.auditLog
    .create({
      data: {
        action: "DELETE",
        entity: "NewsArticle",
        entityId: "BULK",
        details: `Menghapus ${ids.length} berita secara massal`,
        adminId: session.user.id,
      },
    })
    .catch((err) => console.error("Gagal menyimpan Audit Log Bulk:", err));

  revalidatePath("/admin/berita");
  revalidateTag("news", "max");
  
  return { success: true };
}
