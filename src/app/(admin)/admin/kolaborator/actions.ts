"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/action-utils";
import { collaboratorSchema, CollaboratorInput } from "@/lib/validations/collaborator";

// Tambah Kolaborator Baru
export async function createCollaborator(formData: FormData) {
  return createSafeAction(formData, {
    permissions: ["MANAGE_COLLABORATORS"],
    schema: collaboratorSchema,
    actionType: "CREATE",
    entityName: "Collaborator",
    handler: async (validatedData, adminId) => {
      const data = validatedData as CollaboratorInput;

      const collaborator = await prisma.collaborator.create({
        data: {
          name: data.name,
          logoUrl: data.logoUrl,
          order: data.order,
          status: data.status,
          createdById: adminId,
          updatedById: adminId,
        },
      });

      revalidatePath("/");
      return { entityId: collaborator.id, details: `Membuat Kolaborator: ${data.name}` };
    },
  });
}

// Update Kolaborator
export async function updateCollaborator(id: string, formData: FormData) {
  return createSafeAction(formData, {
    permissions: ["MANAGE_COLLABORATORS"],
    schema: collaboratorSchema,
    actionType: "UPDATE",
    entityName: "Collaborator",
    handler: async (validatedData, adminId) => {
      const data = validatedData as CollaboratorInput;

      const collaborator = await prisma.collaborator.update({
        where: { id },
        data: {
          name: data.name,
          logoUrl: data.logoUrl,
          order: data.order,
          status: data.status,
          updatedById: adminId,
        },
      });

      revalidatePath("/");
      return { entityId: collaborator.id, details: `Memperbarui Kolaborator: ${data.name}` };
    },
  });
}

// Hapus Kolaborator
export async function deleteCollaborator(id: string) {
  const formData = new FormData();
  return createSafeAction(formData, {
    permissions: ["MANAGE_COLLABORATORS"],
    actionType: "DELETE",
    entityName: "Collaborator",
    handler: async () => {
      const collaborator = await prisma.collaborator.delete({
        where: { id },
      });

      revalidatePath("/");
      return { entityId: id, details: `Menghapus Kolaborator: ${collaborator.name}` };
    },
  });
}
