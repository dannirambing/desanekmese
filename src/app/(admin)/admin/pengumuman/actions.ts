"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { clearChatCacheByCategory } from "@/lib/cache-invalidation";
import { UTApi } from "uploadthing/server";
import { isFileKeyReferenced, getUploadThingKey } from "@/lib/uploadthing-server";
import { createSafeAction } from "@/lib/action-utils";
import { announcementSchema, AnnouncementInput } from "@/lib/validations/pengumuman";

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-");
}

export async function deleteAnnouncement(formData: FormData) {
  return createSafeAction(formData, {
    permissions: ["MANAGE_PENGUMUMAN"],
    actionType: "DELETE",
    entityName: "Announcement",
    handler: async (data, adminId, fd) => {
      const id = fd.get("id") as string;

      const existing = await prisma.announcement.findUnique({
        where: { id },
        select: { title: true, imageUrl: true },
      });

      if (!existing) throw new Error("Pengumuman tidak ditemukan");

      await prisma.announcement.delete({ where: { id } });

      if (existing.imageUrl) {
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

      revalidatePath("/admin/pengumuman");
      revalidatePath("/pengumuman");
      revalidateTag("announcement", "max");
      await clearChatCacheByCategory("PENGUMUMAN");

      return { entityId: id, details: `Menghapus pengumuman: ${existing.title}` };
    },
  });
}

export async function createAnnouncement(formData: FormData) {
  const result = await createSafeAction(formData, {
    permissions: ["MANAGE_PENGUMUMAN"],
    schema: announcementSchema,
    actionType: "CREATE",
    entityName: "Announcement",
    handler: async (validatedData, adminId, fd) => {
      const { title, content, category, status } = validatedData as AnnouncementInput;
      const imageUrl = (fd.get("imageUrl") as string) || null;

      const announcement = await prisma.announcement.create({
        data: {
          title,
          slug: generateSlug(title),
          content,
          status,
          imageUrl,
          category,
          createdById: adminId,
        },
      });

      revalidatePath("/admin/pengumuman");
      revalidatePath("/pengumuman");
      revalidateTag("announcement", "max");
      await clearChatCacheByCategory("PENGUMUMAN");

      return { entityId: announcement.id, details: `Membuat pengumuman baru: ${title}` };
    },
  });

  if (result.success) {
    redirect("/admin/pengumuman");
  }
  return result;
}

export async function updateAnnouncement(id: string, formData: FormData) {
  const result = await createSafeAction(formData, {
    permissions: ["MANAGE_PENGUMUMAN"],
    schema: announcementSchema,
    actionType: "UPDATE",
    entityName: "Announcement",
    handler: async (validatedData, adminId, fd) => {
      const { title, content, category, status } = validatedData as AnnouncementInput;
      const imageUrl = (fd.get("imageUrl") as string) || null;
      const removeImage = fd.get("removeImage") === "true";

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
          status,
          imageUrl: finalImageUrl,
          category,
          updatedById: adminId,
        },
      });

      if (existing.imageUrl && (removeImage || (imageUrl && imageUrl !== existing.imageUrl))) {
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

      revalidatePath("/admin/pengumuman");
      revalidatePath("/pengumuman");
      revalidateTag("announcement", "max");
      await clearChatCacheByCategory("PENGUMUMAN");

      return { entityId: id, details: `Memperbarui pengumuman: ${title}` };
    },
  });

  if (result.success) {
    redirect("/admin/pengumuman");
  }
  return result;
}
