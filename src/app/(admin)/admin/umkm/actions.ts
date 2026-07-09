"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { clearChatCacheByCategory } from "@/lib/cache-invalidation";
import { UTApi } from "uploadthing/server";
import { isFileKeyReferenced, getUploadThingKey } from "@/lib/uploadthing-server";
import { createSafeAction } from "@/lib/action-utils";
import { umkmSchema } from "@/lib/validations/umkm";
import { z } from "zod";

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-");
}

export const createUMKMProduct = async (formData: FormData) => {
  const result = await createSafeAction(formData, {
    schema: umkmSchema,
    permissions: ["MANAGE_UMKM"],
    actionType: "CREATE",
    entityName: "ProductUMKM",
    handler: async (data, adminId) => {
      const umkm = await prisma.productUMKM.create({
        data: {
          name: data.name,
          slug: generateSlug(data.name),
          description: data.description,
          price: data.price,
          ownerName: data.ownerName,
          orderUrl: data.orderUrl,
          orderType: data.orderType,
          status: data.status,
          imageUrl: data.removeImage ? null : data.newImageUrl,
          createdById: adminId,
        },
      });

      revalidatePath("/admin/umkm");
      revalidatePath("/umkm");
      revalidatePath("/");
      revalidateTag("umkm", "max");
      await clearChatCacheByCategory("UMKM");
      
      return { entityId: umkm.id, details: `Merekam produk UMKM baru: ${umkm.name}` };
    },
  });

  if (result.success) {
    redirect("/admin/umkm");
  }
  return result;
};

export const updateUMKMProduct = async (id: string, formData: FormData) => {
  const result = await createSafeAction(formData, {
    schema: umkmSchema,
    permissions: ["MANAGE_UMKM"],
    actionType: "UPDATE",
    entityName: "ProductUMKM",
    handler: async (data, adminId) => {
      const existing = await prisma.productUMKM.findUnique({ where: { id } });
      if (!existing) throw new Error("Produk tidak ditemukan");

      const imageUrl = data.removeImage ? null : (data.newImageUrl || existing.imageUrl);

      await prisma.productUMKM.update({
        where: { id },
        data: {
          name: data.name,
          slug: generateSlug(data.name),
          description: data.description,
          price: data.price,
          ownerName: data.ownerName,
          orderUrl: data.orderUrl,
          orderType: data.orderType,
          status: data.status,
          imageUrl,
          updatedById: adminId,
        },
      });

      if (existing.imageUrl && (data.removeImage || (data.newImageUrl && data.newImageUrl !== existing.imageUrl))) {
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

      revalidatePath("/admin/umkm");
      revalidatePath("/umkm");
      revalidatePath("/");
      revalidateTag("umkm", "max");
      await clearChatCacheByCategory("UMKM");
      
      return { entityId: id, details: `Memperbarui produk UMKM: ${data.name}` };
    },
  });

  if (result.success) {
    redirect("/admin/umkm");
  }
  return result;
};

export const deleteUMKMProduct = async (data: { id: string }) => {
  const formData = new FormData();
  formData.append("id", data.id);

  return createSafeAction(formData, {
    schema: z.object({ id: z.string() }),
    permissions: ["MANAGE_UMKM"],
    actionType: "DELETE",
    entityName: "ProductUMKM",
    handler: async (validData, adminId) => {
      const existing = await prisma.productUMKM.findUnique({
        where: { id: validData.id },
        select: { imageUrl: true },
      });

      await prisma.productUMKM.delete({ where: { id: validData.id } });

      if (existing?.imageUrl) {
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

      revalidatePath("/admin/umkm");
      revalidatePath("/umkm");
      revalidatePath("/");
      revalidateTag("umkm", "max");
      await clearChatCacheByCategory("UMKM");
      
      return { entityId: validData.id, details: "Menghapus produk UMKM permanen" };
    },
  });
};

export const bulkDeleteUMKM = async (data: { ids: string[] }) => {
  const formData = new FormData();
  formData.append("ids", JSON.stringify(data.ids));

  const schema = z.object({
    ids: z.string().transform((str) => {
      try {
        return JSON.parse(str);
      } catch {
        return [];
      }
    }).pipe(z.array(z.string())),
  });

  return createSafeAction(formData, {
    schema,
    permissions: ["MANAGE_UMKM"],
    actionType: "DELETE",
    entityName: "ProductUMKM",
    handler: async (validData, adminId) => {
      const items = await prisma.productUMKM.findMany({
        where: { id: { in: validData.ids } },
        select: { imageUrl: true },
      });

      await prisma.productUMKM.deleteMany({
        where: { id: { in: validData.ids } },
      });

      const utapi = new UTApi();
      for (const item of items) {
        if (item.imageUrl) {
          const key = getUploadThingKey(item.imageUrl);
          if (key && !(await isFileKeyReferenced(key))) {
            try {
              await utapi.deleteFiles(key);
            } catch (err) {
              console.error("Gagal menghapus file dari UploadThing:", err);
            }
          }
        }
      }

      revalidatePath("/admin/umkm");
      revalidatePath("/umkm");
      revalidatePath("/");
      revalidateTag("umkm", "max");
      await clearChatCacheByCategory("UMKM");
      
      return { entityId: "BULK", details: `Menghapus ${validData.ids.length} produk UMKM secara massal` };
    },
  });
};
