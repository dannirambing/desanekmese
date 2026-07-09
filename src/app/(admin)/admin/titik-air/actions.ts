"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdminSession } from "@/lib/auth-session";
import { UTApi } from "uploadthing/server";
import { isFileKeyReferenced, getUploadThingKey } from "@/lib/uploadthing-server";
import { createSafeAction } from "@/lib/action-utils";
import { waterSourceSchema, WaterSourceInput } from "@/lib/validations/titik-air";

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

export async function createWaterSource(formData: FormData) {
  return createSafeAction(formData, {
    permissions: ["MANAGE_AIR"],
    schema: waterSourceSchema,
    actionType: "CREATE",
    entityName: "WaterSource",
    handler: async (validatedData, adminId, fd) => {
      const data = validatedData as WaterSourceInput;

      let slug = generateSlug(data.name);
      
      const existing = await prisma.waterSource.findUnique({
        where: { slug }
      });
      
      if (existing) {
        slug = `${slug}-${Date.now()}`;
      }

      const waterSource = await prisma.waterSource.create({
        data: {
          ...data,
          slug,
          createdById: adminId,
        },
      });

      revalidatePath("/admin/titik-air");
      revalidatePath("/profil");
      
      return { entityId: waterSource.id, details: `Membuat Titik Air: ${data.name}` };
    },
  });
}

export async function updateWaterSource(id: string, formData: FormData) {
  return createSafeAction(formData, {
    permissions: ["MANAGE_AIR"],
    schema: waterSourceSchema,
    actionType: "UPDATE",
    entityName: "WaterSource",
    handler: async (validatedData, adminId, fd) => {
      const data = validatedData as WaterSourceInput;

      let slug = generateSlug(data.name);
      
      const existing = await prisma.waterSource.findFirst({
        where: { 
          slug,
          id: { not: id }
        }
      });
      
      if (existing) {
        slug = `${slug}-${Date.now()}`;
      }

      const current = await prisma.waterSource.findUnique({
        where: { id },
        select: { imageUrl: true, images: true },
      });

      await prisma.waterSource.update({
        where: { id },
        data: {
          ...data,
          slug,
          updatedById: adminId,
        },
      });

      if (current) {
        const keysToClean: string[] = [];

        if (current.imageUrl && current.imageUrl !== data.imageUrl) {
          const key = getUploadThingKey(current.imageUrl);
          if (key) keysToClean.push(key);
        }

        if (current.images && current.images.length > 0) {
          const newImages = data.images || [];
          current.images.forEach((oldImg) => {
            if (!newImages.includes(oldImg)) {
              const key = getUploadThingKey(oldImg);
              if (key) keysToClean.push(key);
            }
          });
        }

        for (const key of keysToClean) {
          if (!(await isFileKeyReferenced(key))) {
            const utapi = new UTApi();
            try {
              await utapi.deleteFiles(key);
            } catch (err) {
              console.error("Gagal menghapus file lama dari UploadThing:", err);
            }
          }
        }
      }

      revalidatePath("/admin/titik-air");
      revalidatePath("/profil");
      revalidatePath(`/profil/titik-air/${slug}`);
      
      return { entityId: id, details: `Memperbarui Titik Air: ${data.name}` };
    },
  });
}

export async function deleteWaterSource(formData: FormData) {
  return createSafeAction(formData, {
    permissions: ["MANAGE_AIR"],
    actionType: "DELETE",
    entityName: "WaterSource",
    handler: async (data, adminId, fd) => {
      const id = fd.get("id") as string;
      const current = await prisma.waterSource.findUnique({
        where: { id },
        select: { name: true, imageUrl: true, images: true },
      });

      if (!current) throw new Error("Data tidak ditemukan");

      await prisma.waterSource.delete({
        where: { id },
      });

      const keysToClean: string[] = [];
      const coverKey = getUploadThingKey(current.imageUrl);
      if (coverKey) keysToClean.push(coverKey);

      if (current.images && current.images.length > 0) {
        current.images.forEach((imgUrl) => {
          const key = getUploadThingKey(imgUrl);
          if (key) keysToClean.push(key);
        });
      }

      for (const key of keysToClean) {
        if (!(await isFileKeyReferenced(key))) {
          const utapi = new UTApi();
          try {
            await utapi.deleteFiles(key);
          } catch (err) {
            console.error("Gagal menghapus file dari UploadThing:", err);
          }
        }
      }
      
      revalidatePath("/admin/titik-air");
      revalidatePath("/profil");
      
      return { entityId: id, details: `Menghapus Titik Air: ${current.name}` };
    },
  });
}
