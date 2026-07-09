"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-session";
import { revalidatePath, revalidateTag } from "next/cache";
import { clearChatCacheByCategory } from "@/lib/cache-invalidation";
import { UTApi } from "uploadthing/server";
import { isFileKeyReferenced } from "@/lib/uploadthing-server";
import { createSafeAction } from "@/lib/action-utils";
import { tourismSchema } from "@/lib/validations/wisata";
import { ActionType } from "@prisma/client";

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-");
}

async function syncTourismMedia(tourismPlaceId: string, formData: FormData, existingMediaId?: string | null) {
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
        data: { url: imageUrl, publicId: imageKey, tourismPlaceId },
      });
    }
  }
}

export const createTourismPlace = async (formData: FormData) => {
  return createSafeAction(formData, {
    schema: tourismSchema,
    permissions: ["MANAGE_WISATA"],
    actionType: ActionType.CREATE,
    entityName: "TourismPlace",
    handler: async (data, adminId, fd) => {
      const facilities = data.facilities
        ? data.facilities.split(",").map((f) => f.trim()).filter(Boolean)
        : [];

      const place = await prisma.tourismPlace.create({
        data: {
          name: data.name,
          slug: generateSlug(data.name),
          location: data.location,
          description: data.description,
          status: data.status,
          categoryId: data.categoryId,
          facilities,
          mapUrl: data.mapUrl,
          createdById: adminId,
        },
      });

      await syncTourismMedia(place.id, fd);

      revalidatePath("/admin/wisata");
      revalidatePath("/wisata");
      revalidateTag("tourism", "max");
      await clearChatCacheByCategory("WISATA");
      
      return { entityId: place.id, details: `Destinasi wisata ${data.name} dibuat` };
    }
  });
};

export const updateTourismPlace = async (id: string, formData: FormData) => {
  return createSafeAction(formData, {
    schema: tourismSchema,
    permissions: ["MANAGE_WISATA"],
    actionType: ActionType.UPDATE,
    entityName: "TourismPlace",
    handler: async (data, adminId, fd) => {
      const existing = await prisma.tourismPlace.findUnique({
        where: { id },
        include: { media: { take: 1 } },
      });

      if (!existing) throw new Error("Destinasi tidak ditemukan");

      const facilities = data.facilities
        ? data.facilities.split(",").map((f) => f.trim()).filter(Boolean)
        : [];

      await prisma.tourismPlace.update({
        where: { id },
        data: {
          name: data.name,
          slug: generateSlug(data.name),
          location: data.location,
          description: data.description,
          categoryId: data.categoryId,
          status: data.status,
          facilities,
          mapUrl: data.mapUrl,
          updatedById: adminId,
        },
      });

      await syncTourismMedia(id, fd, existing.media[0]?.id);

      revalidatePath("/admin/wisata");
      revalidatePath("/wisata");
      revalidateTag("tourism", "max");
      await clearChatCacheByCategory("WISATA");
      
      return { entityId: id, details: `Destinasi wisata ${data.name} diperbarui` };
    }
  });
};

export const deleteTourismPlace = async (formData: FormData) => {
  return createSafeAction(formData, {
    permissions: ["MANAGE_WISATA"],
    actionType: ActionType.DELETE,
    entityName: "TourismPlace",
    handler: async (data, adminId, fd) => {
      const id = fd.get("id") as string;
      const place = await prisma.tourismPlace.findUnique({
        where: { id },
        include: { media: true },
      });

      if (place) {
        await prisma.tourismPlace.delete({ where: { id } });
        if (place.media && place.media.length > 0) {
          const keys = place.media.map((m) => m.publicId).filter(Boolean);
          for (const key of keys) {
            if (!(await isFileKeyReferenced(key))) {
              const utapi = new UTApi();
              try { await utapi.deleteFiles(key); } catch (err) {}
            }
          }
        }
      }

      revalidatePath("/admin/wisata");
      revalidatePath("/wisata");
      revalidateTag("tourism", "max");
      await clearChatCacheByCategory("WISATA");
      
      return { entityId: id, details: `Destinasi dengan ID ${id} dihapus` };
    }
  });
};

export const deleteTourismPlaces = async (formData: FormData) => {
  return createSafeAction(formData, {
    permissions: ["MANAGE_WISATA"],
    actionType: ActionType.DELETE,
    entityName: "TourismPlace",
    handler: async (data, adminId, fd) => {
      const idsStr = fd.get("ids") as string;
      const ids = JSON.parse(idsStr) as string[];

      const places = await prisma.tourismPlace.findMany({
        where: { id: { in: ids } },
        include: { media: true },
      });

      await prisma.tourismPlace.deleteMany({ where: { id: { in: ids } } });

      for (const place of places) {
        if (place.media && place.media.length > 0) {
          const keys = place.media.map((m) => m.publicId).filter(Boolean);
          for (const key of keys) {
            if (!(await isFileKeyReferenced(key))) {
              const utapi = new UTApi();
              try { await utapi.deleteFiles(key); } catch (err) {}
            }
          }
        }
      }

      revalidatePath("/admin/wisata");
      revalidatePath("/wisata");
      revalidateTag("tourism", "max");
      await clearChatCacheByCategory("WISATA");
      
      return { entityId: "bulk", details: `${ids.length} destinasi dihapus` };
    }
  });
};
