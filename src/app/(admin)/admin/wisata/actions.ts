"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-");
}

async function syncTourismMedia(
  tourismPlaceId: string,
  formData: FormData,
  existingMediaId?: string | null
) {
  const imageUrl = formData.get("imageUrl") as string | null;
  const imageKey = formData.get("imageKey") as string | null;
  const removeImage = formData.get("removeImage") === "true";
  const currentMediaId =
    (formData.get("currentMediaId") as string | null) || existingMediaId;

  if (removeImage && currentMediaId) {
    await prisma.mediaFile.delete({ where: { id: currentMediaId } });
    return;
  }

  if (imageUrl && imageKey) {
    if (currentMediaId) {
      await prisma.mediaFile.update({
        where: { id: currentMediaId },
        data: { url: imageUrl, publicId: imageKey },
      });
    } else {
      await prisma.mediaFile.create({
        data: {
          url: imageUrl,
          publicId: imageKey,
          tourismPlaceId,
        },
      });
    }
  }
}

export async function deleteTourismPlace(formData: FormData) {
  await requireAdminSession(["SUPER_ADMIN", "ADMIN_KONTEN"]);
  const id = formData.get("id") as string;
  await prisma.tourismPlace.delete({ where: { id } });
  revalidatePath("/admin/wisata");
  revalidateTag("tourism", "max");
}

export async function createTourismPlace(formData: FormData) {
  await requireAdminSession(["SUPER_ADMIN", "ADMIN_KONTEN"]);
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const description = formData.get("description") as string;
  const categoryId = formData.get("categoryId") as string;
  const status =
    (formData.get("status") as "PUBLISHED" | "DRAFT") || "DRAFT";

  const place = await prisma.tourismPlace.create({
    data: {
      name,
      slug: generateSlug(name),
      location,
      description,
      status,
      categoryId,
    },
  });

  await syncTourismMedia(place.id, formData);

  revalidatePath("/admin/wisata");
  revalidatePath("/wisata");
  revalidateTag("tourism", "max");
  redirect("/admin/wisata");
}

export async function updateTourismPlace(id: string, formData: FormData) {
  await requireAdminSession(["SUPER_ADMIN", "ADMIN_KONTEN"]);
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const description = formData.get("description") as string;
  const categoryId = formData.get("categoryId") as string;
  const statusInput = formData.get("status") as "PUBLISHED" | "DRAFT" | null;

  const existing = await prisma.tourismPlace.findUnique({
    where: { id },
    include: { media: { take: 1 } },
  });

  if (!existing) {
    throw new Error("Destinasi tidak ditemukan");
  }

  await prisma.tourismPlace.update({
    where: { id },
    data: {
      name,
      slug: generateSlug(name),
      location,
      description,
      categoryId,
      status: statusInput || existing.status,
    },
  });

  await syncTourismMedia(id, formData, existing.media[0]?.id);

  revalidatePath("/admin/wisata");
  revalidatePath("/wisata");
  revalidateTag("tourism", "max");
  redirect("/admin/wisata");
}
