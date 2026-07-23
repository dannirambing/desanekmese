"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { clearChatCacheByCategory } from "@/lib/cache-invalidation";
import { createSafeAction } from "@/lib/action-utils";
import { ActionType, SectionContentType } from "@prisma/client";
import { isFileKeyReferenced, getUploadThingKey } from "@/lib/uploadthing-server";
import { UTApi } from "uploadthing/server";
import { z } from "zod";

// Skema validasi section profil
const profileSectionSchema = z.object({
  title: z.string().min(1, "Judul section wajib diisi"),
  description: z.string().optional(),
  order: z.preprocess((val) => parseInt(val as string) || 0, z.number()),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  itemsJson: z.string().min(2, "Data item section tidak valid"),
});

/**
 * Menghapus gambar dari UploadThing jika tidak dirujuk oleh entitas manapun di database
 */
async function cleanUnusedImage(imageUrl: string | null | undefined) {
  if (!imageUrl) return;
  const key = getUploadThingKey(imageUrl);
  if (key && !(await isFileKeyReferenced(key))) {
    const utapi = new UTApi();
    try {
      await utapi.deleteFiles(key);
    } catch (err) {
      console.error("Gagal menghapus file dari UploadThing:", err);
    }
  }
}

/**
 * Server Action untuk membuat Section Profil Baru
 */
export const createProfileSection = async (formData: FormData) => {
  return createSafeAction(formData, {
    schema: profileSectionSchema,
    permissions: ["MANAGE_PROFIL"],
    actionType: ActionType.CREATE,
    entityName: "ProfileSection",
    handler: async (data, adminId) => {
      const items = JSON.parse(data.itemsJson) as {
        title: string;
        contentType: SectionContentType;
        content?: string;
        imageUrl?: string;
        youtubeUrl?: string;
        order: number;
      }[];

      const section = await prisma.profileSection.create({
        data: {
          title: data.title,
          description: data.description,
          order: data.order,
          status: data.status,
          createdById: adminId,
          items: {
            create: items.map((item) => ({
              title: item.title,
              contentType: item.contentType,
              content: item.content || null,
              imageUrl: item.imageUrl || null,
              youtubeUrl: item.youtubeUrl || null,
              order: item.order,
            })),
          },
        },
      });

      revalidatePath("/profil");
      revalidatePath("/admin/profil/sections");
      revalidateTag("profile-sections", "max");
      await clearChatCacheByCategory("PROFIL");

      return { entityId: section.id, details: `Section profil "${data.title}" berhasil dibuat.` };
    },
  });
};

/**
 * Server Action untuk memperbarui Section Profil
 */
export const updateProfileSection = async (id: string, formData: FormData) => {
  return createSafeAction(formData, {
    schema: profileSectionSchema,
    permissions: ["MANAGE_PROFIL"],
    actionType: ActionType.UPDATE,
    entityName: "ProfileSection",
    handler: async (data, adminId) => {
      const items = JSON.parse(data.itemsJson) as {
        id?: string;
        title: string;
        contentType: SectionContentType;
        content?: string;
        imageUrl?: string;
        youtubeUrl?: string;
        order: number;
      }[];

      // Ambil data section dan item yang lama untuk proses pembersihan gambar
      const existing = await prisma.profileSection.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!existing) {
        throw new Error("Section profil tidak ditemukan");
      }

      // Update basic fields
      await prisma.profileSection.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          order: data.order,
          status: data.status,
          updatedById: adminId,
        },
      });

      // Proses sinkronisasi item:
      // Dapatkan list ID item yang dipertahankan
      const incomingItemIds = items.map(item => item.id).filter(Boolean) as string[];
      
      // Cari item-item lama yang dihapus
      const removedItems = existing.items.filter(item => !incomingItemIds.includes(item.id));

      // Hapus item-item lama dari database
      if (removedItems.length > 0) {
        await prisma.profileSectionItem.deleteMany({
          where: {
            id: { in: removedItems.map(item => item.id) }
          }
        });

        // Hapus berkas gambar terkait yang tidak dirujuk lagi
        for (const item of removedItems) {
          if (item.contentType === "IMAGE" && item.imageUrl) {
            await cleanUnusedImage(item.imageUrl);
          }
        }
      }

      // Update / Create incoming items
      for (const item of items) {
        if (item.id) {
          // Cari data item sebelum di-update untuk cek pergantian gambar
          const prevItem = existing.items.find(x => x.id === item.id);
          
          await prisma.profileSectionItem.update({
            where: { id: item.id },
            data: {
              title: item.title,
              contentType: item.contentType,
              content: item.content || null,
              imageUrl: item.imageUrl || null,
              youtubeUrl: item.youtubeUrl || null,
              order: item.order,
            }
          });

          // Cek jika gambar diubah atau dihapus, hapus gambar lama
          if (prevItem && prevItem.imageUrl && prevItem.imageUrl !== item.imageUrl) {
            await cleanUnusedImage(prevItem.imageUrl);
          }
        } else {
          // Create new item
          await prisma.profileSectionItem.create({
            data: {
              sectionId: id,
              title: item.title,
              contentType: item.contentType,
              content: item.content || null,
              imageUrl: item.imageUrl || null,
              youtubeUrl: item.youtubeUrl || null,
              order: item.order,
            }
          });
        }
      }

      revalidatePath("/profil");
      revalidatePath("/admin/profil/sections");
      revalidateTag("profile-sections", "max");
      await clearChatCacheByCategory("PROFIL");

      return { entityId: id, details: `Section profil "${data.title}" diperbarui.` };
    },
  });
};

/**
 * Server Action untuk menghapus Section Profil beserta item-item di dalamnya
 */
export const deleteProfileSection = async (formData: FormData) => {
  return createSafeAction(formData, {
    permissions: ["MANAGE_PROFIL"],
    actionType: ActionType.DELETE,
    entityName: "ProfileSection",
    handler: async (data, adminId, fd) => {
      const id = fd.get("id") as string;

      const existing = await prisma.profileSection.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!existing) {
        throw new Error("Section profil tidak ditemukan");
      }

      // Hapus section dari database (cascading delete otomatis menghapus ProfileSectionItem)
      await prisma.profileSection.delete({
        where: { id },
      });

      // Bersihkan file-file gambar yang tidak terpakai
      for (const item of existing.items) {
        if (item.contentType === "IMAGE" && item.imageUrl) {
          await cleanUnusedImage(item.imageUrl);
        }
      }

      revalidatePath("/profil");
      revalidatePath("/admin/profil/sections");
      revalidateTag("profile-sections", "max");
      await clearChatCacheByCategory("PROFIL");

      return { entityId: id, details: `Section profil "${existing.title}" dihapus.` };
    },
  });
};
