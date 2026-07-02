"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { clearChatCacheByCategory } from "@/lib/cache-invalidation";

export async function updateHeroSettings(formData: FormData) {
  await requireAdminSession(["SUPER_ADMIN", "ADMIN_KONTEN"]);

  const tagline = formData.get("tagline") as string;
  const titleLine1 = formData.get("titleLine1") as string;
  const titleLine2 = formData.get("titleLine2") as string;
  const subTagline = formData.get("subTagline") as string;
  const description = formData.get("description") as string;

  const newImageUrl = formData.get("imageUrl") as string | null;
  const removeImage = formData.get("removeImage") === "true";

  if (!tagline || !titleLine1 || !titleLine2 || !subTagline || !description) {
    throw new Error("Semua field wajib diisi");
  }

  const existing = await prisma.heroSettings.findUnique({
    where: { id: "main" },
  });

  const defaultImageUrl =
    "https://azhuh458gn.ufs.sh/f/IDwrE8y2GhNiT3jd6hwEJvA74yPimMfuNFo6zp0Ia1S3eH2D";

  let imageUrl = existing?.imageUrl || defaultImageUrl;

  if (removeImage) {
    imageUrl = defaultImageUrl;
  } else if (newImageUrl) {
    imageUrl = newImageUrl;
  }

  await prisma.heroSettings.upsert({
    where: { id: "main" },
    update: {
      imageUrl,
      tagline,
      titleLine1,
      titleLine2,
      subTagline,
      description,
    },
    create: {
      id: "main",
      imageUrl,
      tagline,
      titleLine1,
      titleLine2,
      subTagline,
      description,
    },
  });

  revalidatePath("/");
  revalidateTag("hero", "max");
  revalidateTag("hero-settings", "max");
  await clearChatCacheByCategory("PROFIL");
  redirect("/admin");
}
