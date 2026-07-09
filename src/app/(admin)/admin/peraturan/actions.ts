"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-session";
import { revalidatePath } from "next/cache";
import { RegulationType } from "@prisma/client";
import { UTApi } from "uploadthing/server";
import { isFileKeyReferenced } from "@/lib/uploadthing-server";
import { createSafeAction } from "@/lib/action-utils";
import { regulationSchema, RegulationInput } from "@/lib/validations/peraturan";
import { clearChatCacheByCategory } from "@/lib/cache-invalidation";

// Tambah Peraturan Baru
export async function createVillageRegulation(formData: FormData) {
  return createSafeAction(formData, {
    permissions: ["MANAGE_PERATURAN"],
    schema: regulationSchema,
    actionType: "CREATE",
    entityName: "VillageRegulation",
    handler: async (validatedData, adminId, fd) => {
      const data = validatedData as RegulationInput;

      const regulation = await prisma.villageRegulation.create({
        data: {
          title: data.title,
          number: data.number,
          year: data.year,
          description: data.description,
          type: data.type,
          fileUrl: data.fileUrl,
          fileKey: data.fileKey,
          status: data.status,
          createdById: adminId,
          updatedById: adminId,
        },
      });

      await clearChatCacheByCategory("PERATURAN");
      revalidatePath("/admin/peraturan");
      revalidatePath("/peraturan");
      return { entityId: regulation.id, details: `Membuat Peraturan: ${data.number} - ${data.title}` };
    },
  });
}

// Edit/Update Peraturan
export async function updateVillageRegulation(id: string, formData: FormData) {
  return createSafeAction(formData, {
    permissions: ["MANAGE_PERATURAN"],
    schema: regulationSchema,
    actionType: "UPDATE",
    entityName: "VillageRegulation",
    handler: async (validatedData, adminId, fd) => {
      const data = validatedData as RegulationInput;

      // Cari file key lama untuk dihapus jika diubah
      const oldReg = await prisma.villageRegulation.findUnique({
        where: { id },
        select: { fileKey: true },
      });

      const regulation = await prisma.villageRegulation.update({
        where: { id },
        data: {
          title: data.title,
          number: data.number,
          year: data.year,
          description: data.description,
          type: data.type,
          fileUrl: data.fileUrl,
          fileKey: data.fileKey,
          status: data.status,
          updatedById: adminId,
        },
      });

      // Hapus dari UploadThing jika file diganti dan file lama tidak digunakan di tempat lain
      if (oldReg?.fileKey && oldReg.fileKey !== data.fileKey && !(await isFileKeyReferenced(oldReg.fileKey))) {
        const utapi = new UTApi();
        try {
          await utapi.deleteFiles(oldReg.fileKey);
        } catch (err) {
          console.error("Gagal menghapus file lama dari UploadThing:", err);
        }
      }

      await clearChatCacheByCategory("PERATURAN");
      revalidatePath("/admin/peraturan");
      revalidatePath("/peraturan");
      return { entityId: id, details: `Memperbarui Peraturan: ${data.number} - ${data.title}` };
    },
  });
}

// Hapus Peraturan
export async function deleteVillageRegulation(formData: FormData) {
  return createSafeAction(formData, {
    permissions: ["MANAGE_PERATURAN"],
    actionType: "DELETE",
    entityName: "VillageRegulation",
    handler: async (data, adminId, fd) => {
      const id = fd.get("id") as string;

      const oldReg = await prisma.villageRegulation.findUnique({
        where: { id },
        select: { number: true, title: true, fileKey: true },
      });

      if (!oldReg) throw new Error("Peraturan tidak ditemukan");

      await prisma.villageRegulation.delete({
        where: { id },
      });

      // Hapus dari UploadThing jika file tidak digunakan di tempat lain
      if (oldReg.fileKey && !(await isFileKeyReferenced(oldReg.fileKey))) {
        const utapi = new UTApi();
        try {
          await utapi.deleteFiles(oldReg.fileKey);
        } catch (err) {
          console.error("Gagal menghapus file dari UploadThing:", err);
        }
      }

      await clearChatCacheByCategory("PERATURAN");
      revalidatePath("/admin/peraturan");
      revalidatePath("/peraturan");
      return { entityId: id, details: `Menghapus Peraturan: ${oldReg.number} - ${oldReg.title}` };
    },
  });
}
