"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-session";
import { revalidatePath } from "next/cache";
import { RegulationType } from "@prisma/client";
import { UTApi } from "uploadthing/server";
import { isFileKeyReferenced } from "@/lib/uploadthing-server";

// Skema input sederhana
interface RegulationInput {
  title: string;
  number: string;
  year: number;
  description?: string;
  type: RegulationType;
  fileUrl: string;
  fileKey?: string;
  status: "DRAFT" | "PUBLISHED";
}

// Tambah Peraturan Baru
export async function createVillageRegulation(data: RegulationInput) {
  const session = await requireAdminSession(["MANAGE_PERATURAN"]);

  const regulation = await prisma.villageRegulation.create({
    data: {
      ...data,
      createdById: session.user.id,
      updatedById: session.user.id,
    },
  });

  revalidatePath("/admin/peraturan");
  revalidatePath("/peraturan");
  return regulation;
}

// Edit/Update Peraturan
export async function updateVillageRegulation(id: string, data: RegulationInput) {
  const session = await requireAdminSession(["MANAGE_PERATURAN"]);

  // Cari file key lama untuk dihapus jika diubah
  const oldReg = await prisma.villageRegulation.findUnique({
    where: { id },
    select: { fileKey: true },
  });

  const regulation = await prisma.villageRegulation.update({
    where: { id },
    data: {
      ...data,
      updatedById: session.user.id,
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

  revalidatePath("/admin/peraturan");
  revalidatePath("/peraturan");
  return regulation;
}

// Hapus Peraturan
export async function deleteVillageRegulation(id: string) {
  await requireAdminSession(["MANAGE_PERATURAN"]);

  const oldReg = await prisma.villageRegulation.findUnique({
    where: { id },
    select: { fileKey: true },
  });

  const regulation = await prisma.villageRegulation.delete({
    where: { id },
  });

  // Hapus dari UploadThing jika file tidak digunakan di tempat lain
  if (oldReg?.fileKey && !(await isFileKeyReferenced(oldReg.fileKey))) {
    const utapi = new UTApi();
    try {
      await utapi.deleteFiles(oldReg.fileKey);
    } catch (err) {
      console.error("Gagal menghapus file dari UploadThing:", err);
    }
  }

  revalidatePath("/admin/peraturan");
  revalidatePath("/peraturan");
  return regulation;
}
