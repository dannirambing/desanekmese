"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-session";
import { revalidatePath } from "next/cache";
import { RegulationType } from "@prisma/client";

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

  const regulation = await prisma.villageRegulation.update({
    where: { id },
    data: {
      ...data,
      updatedById: session.user.id,
    },
  });

  revalidatePath("/admin/peraturan");
  revalidatePath("/peraturan");
  return regulation;
}

// Hapus Peraturan
export async function deleteVillageRegulation(id: string) {
  await requireAdminSession(["MANAGE_PERATURAN"]);

  const regulation = await prisma.villageRegulation.delete({
    where: { id },
  });

  revalidatePath("/admin/peraturan");
  revalidatePath("/peraturan");
  return regulation;
}
