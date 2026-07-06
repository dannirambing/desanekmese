"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { PublishStatus } from "@prisma/client";
import { requireAdminSession } from "@/lib/auth-session";

const waterSourceSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  latitude: z.coerce.number({ message: "Latitude harus berupa angka" }),
  longitude: z.coerce.number({ message: "Longitude harus berupa angka" }),
  imageUrl: z.string().nullable().optional(),
  images: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

export async function createWaterSource(prevState: any, formData: FormData) {
  try {
    const session = await requireAdminSession(["SUPER_ADMIN", "ADMIN_KONTEN"]);
    const imagesRaw = formData.get("images") as string | null;
    let images: string[] = [];
    if (imagesRaw) {
      try {
        images = JSON.parse(imagesRaw);
      } catch (e) {}
    }

    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      latitude: formData.get("latitude"),
      longitude: formData.get("longitude"),
      imageUrl: formData.get("imageUrl") as string | null,
      images,
      status: formData.get("status") as PublishStatus,
    };

    const validatedFields = waterSourceSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Validasi gagal. Pastikan semua data diisi dengan benar.",
      };
    }

    let slug = generateSlug(validatedFields.data.name);
    
    // Check if slug exists
    const existing = await prisma.waterSource.findUnique({
      where: { slug }
    });
    
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    await prisma.waterSource.create({
      data: {
        ...validatedFields.data,
        slug,
        createdById: session.user.id,
      },
    });

    revalidatePath("/admin/titik-air");
    revalidatePath("/profil");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create water source:", error);
    return {
      success: false,
      error: error.message || "Gagal menambahkan titik air",
    };
  }
}

export async function updateWaterSource(id: string, prevState: any, formData: FormData) {
  try {
    const session = await requireAdminSession(["SUPER_ADMIN", "ADMIN_KONTEN"]);
    const imagesRaw = formData.get("images") as string | null;
    let images: string[] = [];
    if (imagesRaw) {
      try {
        images = JSON.parse(imagesRaw);
      } catch (e) {}
    }

    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      latitude: formData.get("latitude"),
      longitude: formData.get("longitude"),
      imageUrl: formData.get("imageUrl") as string | null,
      images,
      status: formData.get("status") as PublishStatus,
    };

    const validatedFields = waterSourceSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Validasi gagal. Pastikan semua data diisi dengan benar.",
      };
    }

    let slug = generateSlug(validatedFields.data.name);
    
    // Check if slug exists but not this item
    const existing = await prisma.waterSource.findFirst({
      where: { 
        slug,
        id: { not: id }
      }
    });
    
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    await prisma.waterSource.update({
      where: { id },
      data: {
        ...validatedFields.data,
        slug,
        updatedById: session.user.id,
      },
    });

    revalidatePath("/admin/titik-air");
    revalidatePath("/profil");
    revalidatePath(`/profil/titik-air/${slug}`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update water source:", error);
    return {
      success: false,
      error: error.message || "Gagal mengubah titik air",
    };
  }
}

export async function deleteWaterSource(id: string) {
  try {
    await requireAdminSession(["SUPER_ADMIN", "ADMIN_KONTEN"]);
    await prisma.waterSource.delete({
      where: { id },
    });
    
    revalidatePath("/admin/titik-air");
    revalidatePath("/profil");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete water source:", error);
    return { success: false, error: "Gagal menghapus titik air" };
  }
}
