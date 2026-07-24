"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/action-utils";
import { relatedLinkSchema, RelatedLinkInput } from "@/lib/validations/link-terkait";

// Tambah Link Baru
export async function createRelatedLink(formData: FormData) {
  return createSafeAction(formData, {
    permissions: ["MANAGE_LINKS"],
    schema: relatedLinkSchema,
    actionType: "CREATE",
    entityName: "RelatedLink",
    handler: async (validatedData, adminId) => {
      const data = validatedData as RelatedLinkInput;

      const link = await prisma.relatedLink.create({
        data: {
          title: data.title,
          url: data.url,
          order: data.order,
          status: data.status,
          createdById: adminId,
          updatedById: adminId,
        },
      });

      revalidatePath("/");
      return { entityId: link.id, details: `Membuat Link Terkait: ${data.title} (${data.url})` };
    },
  });
}

// Update Link
export async function updateRelatedLink(id: string, formData: FormData) {
  return createSafeAction(formData, {
    permissions: ["MANAGE_LINKS"],
    schema: relatedLinkSchema,
    actionType: "UPDATE",
    entityName: "RelatedLink",
    handler: async (validatedData, adminId) => {
      const data = validatedData as RelatedLinkInput;

      const link = await prisma.relatedLink.update({
        where: { id },
        data: {
          title: data.title,
          url: data.url,
          order: data.order,
          status: data.status,
          updatedById: adminId,
        },
      });

      revalidatePath("/");
      return { entityId: link.id, details: `Memperbarui Link Terkait: ${data.title} (${data.url})` };
    },
  });
}

// Hapus Link
export async function deleteRelatedLink(id: string) {
  const formData = new FormData();
  return createSafeAction(formData, {
    permissions: ["MANAGE_LINKS"],
    actionType: "DELETE",
    entityName: "RelatedLink",
    handler: async () => {
      const link = await prisma.relatedLink.delete({
        where: { id },
      });

      revalidatePath("/");
      return { entityId: id, details: `Menghapus Link Terkait: ${link.title}` };
    },
  });
}
