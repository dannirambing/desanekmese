"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-session";
import { revalidatePath, revalidateTag } from "next/cache";
import { clearChatCacheByCategory } from "@/lib/cache-invalidation";
import { UTApi } from "uploadthing/server";
import { isFileKeyReferenced } from "@/lib/uploadthing-server";
import { createSafeAction } from "@/lib/action-utils";
import { cultureSchema } from "@/lib/validations/budaya";
import { ActionType } from "@prisma/client";

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-");
}

async function syncCultureMedia(cultureItemId: string, formData: FormData, existingMediaId?: string | null) {
  const imageUrl = formData.get("imageUrl") as string | null;
  const imageKey = formData.get("imageKey") as string | null;
  const removeImage = formData.get("removeImage") === "true";
  const currentMediaId = (formData.get("currentMediaId") as string | null) || existingMediaId;

  if (removeImage && currentMediaId) {
    const media = await prisma.mediaFile.findUnique({ where: { id: currentMediaId } });
    if (media) {
      await prisma.mediaFile.delete({ where: { id: currentMediaId } });
      if (media.publicId && !(await isFileKeyReferenced(media.publicId))) {
        const utapi = new UTApi();
        try { await utapi.deleteFiles(media.publicId); } catch (err) {}
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
        try { await utapi.deleteFiles(media.publicId); } catch (err) {}
      }
    } else {
      await prisma.mediaFile.create({
        data: { url: imageUrl, publicId: imageKey, cultureItemId },
      });
    }
  }
}

export const createCultureItem = async (formData: FormData) => {
  return createSafeAction(formData, {
    schema: cultureSchema,
    permissions: ["MANAGE_BUDAYA"],
    actionType: ActionType.CREATE,
    entityName: "CultureItem",
    handler: async (data, adminId, fd) => {
      const item = await prisma.cultureItem.create({
        data: {
          name: data.name,
          slug: generateSlug(data.name),
          summary: data.summary,
          description: data.description,
          status: data.status,
          categoryId: data.categoryId,
          createdById: adminId,
        },
      });

      await syncCultureMedia(item.id, fd);

      revalidatePath("/admin/budaya");
      revalidatePath("/budaya");
      revalidateTag("culture", "max");
      await clearChatCacheByCategory("BUDAYA");
      
      return { entityId: item.id, details: `Budaya ${data.name} dibuat` };
    }
  });
};

export const updateCultureItem = async (id: string, formData: FormData) => {
  return createSafeAction(formData, {
    schema: cultureSchema,
    permissions: ["MANAGE_BUDAYA"],
    actionType: ActionType.UPDATE,
    entityName: "CultureItem",
    handler: async (data, adminId, fd) => {
      const existing = await prisma.cultureItem.findUnique({
        where: { id },
        include: { media: { take: 1 } },
      });

      if (!existing) throw new Error("Konten budaya tidak ditemukan");

      await prisma.cultureItem.update({
        where: { id },
        data: {
          name: data.name,
          slug: generateSlug(data.name),
          summary: data.summary,
          description: data.description,
          categoryId: data.categoryId,
          status: data.status,
          updatedById: adminId,
        },
      });

      await syncCultureMedia(id, fd, existing.media[0]?.id);

      revalidatePath("/admin/budaya");
      revalidatePath("/budaya");
      revalidateTag("culture", "max");
      await clearChatCacheByCategory("BUDAYA");
      
      return { entityId: id, details: `Budaya ${data.name} diperbarui` };
    }
  });
};

export const deleteCultureItem = async (formData: FormData) => {
  return createSafeAction(formData, {
    permissions: ["MANAGE_BUDAYA"],
    actionType: ActionType.DELETE,
    entityName: "CultureItem",
    handler: async (data, adminId, fd) => {
      const id = fd.get("id") as string;
      const item = await prisma.cultureItem.findUnique({
        where: { id },
        include: { media: true },
      });

      if (item) {
        await prisma.cultureItem.delete({ where: { id } });
        if (item.media && item.media.length > 0) {
          const keys = item.media.map((m) => m.publicId).filter(Boolean);
          for (const key of keys) {
            if (!(await isFileKeyReferenced(key))) {
              const utapi = new UTApi();
              try { await utapi.deleteFiles(key); } catch (err) {}
            }
          }
        }
      }

      revalidatePath("/admin/budaya");
      revalidatePath("/budaya");
      revalidateTag("culture", "max");
      await clearChatCacheByCategory("BUDAYA");
      
      return { entityId: id, details: `Budaya dengan ID ${id} dihapus` };
    }
  });
};

export const deleteCultureItems = async (formData: FormData) => {
  return createSafeAction(formData, {
    permissions: ["MANAGE_BUDAYA"],
    actionType: ActionType.DELETE,
    entityName: "CultureItem",
    handler: async (data, adminId, fd) => {
      const idsStr = fd.get("ids") as string;
      const ids = JSON.parse(idsStr) as string[];

      const items = await prisma.cultureItem.findMany({
        where: { id: { in: ids } },
        include: { media: true },
      });

      await prisma.cultureItem.deleteMany({ where: { id: { in: ids } } });

      for (const item of items) {
        if (item.media && item.media.length > 0) {
          const keys = item.media.map((m) => m.publicId).filter(Boolean);
          for (const key of keys) {
            if (!(await isFileKeyReferenced(key))) {
              const utapi = new UTApi();
              try { await utapi.deleteFiles(key); } catch (err) {}
            }
          }
        }
      }

      revalidatePath("/admin/budaya");
      revalidatePath("/budaya");
      revalidateTag("culture", "max");
      await clearChatCacheByCategory("BUDAYA");
      
      return { entityId: "bulk", details: `${ids.length} item budaya dihapus` };
    }
  });
};

export async function createCultureCategory(formData: FormData) {
  await requireAdminSession(["MANAGE_BUDAYA"]);
  const name = formData.get("name") as string;
  if (!name?.trim()) return;

  await prisma.cultureCategory.create({ data: { name: name.trim() } });
  revalidatePath("/admin/budaya");
  revalidatePath("/admin/budaya/tambah");
  await clearChatCacheByCategory("BUDAYA");
}
