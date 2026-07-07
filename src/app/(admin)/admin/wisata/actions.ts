"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { clearChatCacheByCategory } from "@/lib/cache-invalidation";

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
  await requireAdminSession(["MANAGE_WISATA"]);
  const id = formData.get("id") as string;
  await prisma.tourismPlace.delete({ where: { id } });
  revalidatePath("/admin/wisata");
  revalidateTag("tourism", "max");
  await clearChatCacheByCategory("WISATA");
}

export async function createTourismPlace(formData: FormData) {
  const session = await requireAdminSession(["MANAGE_WISATA"]);
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const description = formData.get("description") as string;
  const categoryId = formData.get("categoryId") as string;
  const status =
    (formData.get("status") as "PUBLISHED" | "DRAFT") || "DRAFT";
  const facilitiesInput = formData.get("facilities") as string;
  const facilities = facilitiesInput
    ? facilitiesInput.split(",").map((f) => f.trim()).filter(Boolean)
    : [];
  const mapUrl = formData.get("mapUrl") as string | null;

  const place = await prisma.tourismPlace.create({
    data: {
      name,
      slug: generateSlug(name),
      location,
      description,
      status,
      categoryId,
      facilities,
      mapUrl,
      createdById: session.user.id,
    },
  });

  await syncTourismMedia(place.id, formData);

  revalidatePath("/admin/wisata");
  revalidatePath("/wisata");
  revalidateTag("tourism", "max");
  await clearChatCacheByCategory("WISATA");
  redirect("/admin/wisata");
}

export async function updateTourismPlace(id: string, formData: FormData) {
  const session = await requireAdminSession(["MANAGE_WISATA"]);
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const description = formData.get("description") as string;
  const categoryId = formData.get("categoryId") as string;
  const statusInput = formData.get("status") as "PUBLISHED" | "DRAFT" | null;
  const facilitiesInput = formData.get("facilities") as string;
  const facilities = facilitiesInput
    ? facilitiesInput.split(",").map((f) => f.trim()).filter(Boolean)
    : [];
  const mapUrl = formData.get("mapUrl") as string | null;

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
      facilities,
      mapUrl,
      updatedById: session.user.id,
    },
  });

  await syncTourismMedia(id, formData, existing.media[0]?.id);

  revalidatePath("/admin/wisata");
  revalidatePath("/wisata");
  revalidateTag("tourism", "max");
  await clearChatCacheByCategory("WISATA");
  redirect("/admin/wisata");
}
