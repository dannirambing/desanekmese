"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-session";
import { revalidatePath, revalidateTag } from "next/cache";
import { clearChatCacheByCategory } from "@/lib/cache-invalidation";
import { UTApi } from "uploadthing/server";
import { isFileKeyReferenced, getUploadThingKey } from "@/lib/uploadthing-server";

export async function updateVillageProfile(formData: FormData) {
  await requireAdminSession(["MANAGE_PROFIL"]);

  const welcomeName = formData.get("welcomeName") as string;
  const welcomeRole = formData.get("welcomeRole") as string;
  const welcomeText = formData.get("welcomeText") as string;
  const welcomeImageUrl = formData.get("welcomeImageUrl") as string | null;
  
  const history = formData.get("history") as string;
  const vision = formData.get("vision") as string;
  const mission = formData.get("mission") as string;

  const villageCode = formData.get("villageCode") as string;
  const district = formData.get("district") as string;
  const regency = formData.get("regency") as string;
  const province = formData.get("province") as string;
  const establishedYear = formData.get("establishedYear") as string;

  const boundariesNorth = formData.get("boundariesNorth") as string;
  const boundariesEast = formData.get("boundariesEast") as string;
  const boundariesSouth = formData.get("boundariesSouth") as string;
  const boundariesWest = formData.get("boundariesWest") as string;
  const mapUrl = formData.get("mapUrl") as string | null;
  const geography = formData.get("geography") as string;

  const populationTotal = parseInt(formData.get("populationTotal") as string) || 0;
  const populationMale = parseInt(formData.get("populationMale") as string) || 0;
  const populationFemale = parseInt(formData.get("populationFemale") as string) || 0;
  const populationFamilies = parseInt(formData.get("populationFamilies") as string) || 0;

  const structureImageUrl = formData.get("structureImageUrl") as string | null;

  const potential = formData.get("potential") as string;
  const organizations = formData.get("organizations") as string;
  const facilities = formData.get("facilities") as string;
  const achievements = formData.get("achievements") as string;

  // Ambil data sebelum diubah untuk proses pembersihan berkas
  const existing = await prisma.villageProfile.findUnique({
    where: { id: "main" },
    select: { welcomeImageUrl: true, structureImageUrl: true },
  });

  // Cek field konten utama yang kosong (untuk panduan kelengkapan, bukan memblokir)
  const incompleteFields: string[] = [];
  if (!welcomeName) incompleteFields.push("Nama Kepala Desa");
  if (!welcomeRole) incompleteFields.push("Jabatan Kepala Desa");
  if (!welcomeText) incompleteFields.push("Teks Sambutan");
  if (!villageCode) incompleteFields.push("Kode Wilayah Desa");
  if (!establishedYear) incompleteFields.push("Tahun Berdiri");
  if (!district) incompleteFields.push("Kecamatan");
  if (!regency) incompleteFields.push("Kabupaten / Kota");
  if (!province) incompleteFields.push("Provinsi");
  if (!history) incompleteFields.push("Sejarah Desa");
  if (!vision) incompleteFields.push("Visi Desa");
  if (!mission) incompleteFields.push("Misi Desa");
  if (!geography) incompleteFields.push("Kondisi Geografis");
  if (!potential) incompleteFields.push("Potensi Desa");
  if (!organizations) incompleteFields.push("Lembaga Kemasyarakatan");
  if (!facilities) incompleteFields.push("Sarana & Prasarana");
  if (!achievements) incompleteFields.push("Prestasi & Program Unggulan");

  await prisma.villageProfile.upsert({
    where: { id: "main" },
    update: {
      welcomeName,
      welcomeRole,
      welcomeText,
      welcomeImageUrl,
      history,
      vision,
      mission,
      villageCode,
      district,
      regency,
      province,
      establishedYear,
      boundariesNorth,
      boundariesEast,
      boundariesSouth,
      boundariesWest,
      mapUrl,
      geography,
      populationTotal,
      populationMale,
      populationFemale,
      populationFamilies,
      structureImageUrl,
      potential,
      organizations,
      facilities,
      achievements,
    },
    create: {
      id: "main",
      welcomeName,
      welcomeRole,
      welcomeText,
      welcomeImageUrl,
      history,
      vision,
      mission,
      villageCode,
      district,
      regency,
      province,
      establishedYear,
      boundariesNorth,
      boundariesEast,
      boundariesSouth,
      boundariesWest,
      mapUrl,
      geography,
      populationTotal,
      populationMale,
      populationFemale,
      populationFamilies,
      structureImageUrl,
      potential,
      organizations,
      facilities,
      achievements,
    },
  });

  // Clean up replaced images from UploadThing jika tidak digunakan di tempat lain
  if (existing) {
    const keysToClean: string[] = [];

    if (existing.welcomeImageUrl && existing.welcomeImageUrl !== welcomeImageUrl) {
      const key = getUploadThingKey(existing.welcomeImageUrl);
      if (key) keysToClean.push(key);
    }

    if (existing.structureImageUrl && existing.structureImageUrl !== structureImageUrl) {
      const key = getUploadThingKey(existing.structureImageUrl);
      if (key) keysToClean.push(key);
    }

    for (const key of keysToClean) {
      if (!(await isFileKeyReferenced(key))) {
        const utapi = new UTApi();
        try {
          await utapi.deleteFiles(key);
        } catch (err) {
          console.error("Gagal menghapus file lama dari UploadThing:", err);
        }
      }
    }
  }

  revalidatePath("/profil");
  revalidateTag("profile", "max");
  await clearChatCacheByCategory("PROFIL");

  return {
    success: true,
    incompleteFields,
  };
}
