"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-session";
import { revalidatePath, revalidateTag } from "next/cache";

// Fungsi untuk sinkronisasi gambar yang sudah terunggah di modul lain ke tabel MediaAsset
export async function syncExistingMedia() {
  await requireAdminSession(["MANAGE_GALERI"]);

  // Ambil semua URL unik dari MediaFile, ProductUMKM, dan HeroSettings
  const mediaFiles = await prisma.mediaFile.findMany({ select: { url: true, publicId: true } });
  const umkmProducts = await prisma.productUMKM.findMany({ select: { imageUrl: true } });
  const heroSettings = await prisma.heroSettings.findMany({ select: { imageUrl: true } });

  const existingAssets = await prisma.mediaAsset.findMany({ select: { url: true } });
  const existingUrls = new Set(existingAssets.map((a) => a.url));

  const toCreate: { url: string; publicId: string; name: string }[] = [];

  // Sinkronkan data dari MediaFile
  for (const item of mediaFiles) {
    if (item.url && !existingUrls.has(item.url)) {
      toCreate.push({
        url: item.url,
        publicId: item.publicId || "external",
        name: item.url.split("/").pop() || "media-file",
      });
      existingUrls.add(item.url);
    }
  }

  // Sinkronkan data dari UMKM Products
  for (const item of umkmProducts) {
    if (item.imageUrl && !existingUrls.has(item.imageUrl)) {
      toCreate.push({
        url: item.imageUrl,
        publicId: "external",
        name: item.imageUrl.split("/").pop() || "umkm-product",
      });
      existingUrls.add(item.imageUrl);
    }
  }

  // Sinkronkan data dari HeroSettings
  for (const item of heroSettings) {
    if (item.imageUrl && !existingUrls.has(item.imageUrl)) {
      toCreate.push({
        url: item.imageUrl,
        publicId: "external",
        name: item.imageUrl.split("/").pop() || "hero-bg",
      });
      existingUrls.add(item.imageUrl);
    }
  }

  if (toCreate.length > 0) {
    await prisma.mediaAsset.createMany({
      data: toCreate,
      skipDuplicates: true,
    });
  }
}

// Mendapatkan data penggunaan gambar pada modul-modul web portal
export async function getMediaUsage(url: string) {
  await requireAdminSession(["MANAGE_GALERI"]);

  const usages: { type: string; name: string; link: string }[] = [];

  // 1. Periksa Destinasi Wisata
  const wisata = await prisma.tourismPlace.findFirst({
    where: { media: { some: { url } } },
  });
  if (wisata) {
    usages.push({ type: "Destinasi Wisata", name: wisata.name, link: `/admin/wisata/${wisata.id}/edit` });
  }

  // 2. Periksa Budaya
  const budaya = await prisma.cultureItem.findFirst({
    where: { media: { some: { url } }, },
  });
  if (budaya) {
    usages.push({ type: "Konten Budaya", name: budaya.name, link: `/admin/budaya/${budaya.id}/edit` });
  }

  // 3. Periksa Berita
  const berita = await prisma.newsArticle.findFirst({
    where: { media: { some: { url } } },
  });
  if (berita) {
    usages.push({ type: "Berita Desa", name: berita.title, link: `/admin/berita/${berita.id}/edit` });
  }

  // 4. Periksa Produk UMKM
  const umkm = await prisma.productUMKM.findFirst({
    where: { imageUrl: url },
  });
  if (umkm) {
    usages.push({ type: "Produk UMKM", name: umkm.name, link: `/admin/umkm/${umkm.id}/edit` });
  }

  // 5. Periksa Hero Section
  const hero = await prisma.heroSettings.findFirst({
    where: { imageUrl: url },
  });
  if (hero) {
    usages.push({ type: "Hero Section", name: "Spanduk Utama Halaman Depan", link: `/admin/hero` });
  }

  // 6. Periksa Pengumuman Desa
  const announcement = await prisma.announcement.findFirst({
    where: { imageUrl: url },
  });
  if (announcement) {
    usages.push({ type: "Pengumuman Desa", name: announcement.title, link: `/admin/pengumuman/${announcement.id}/edit` });
  }

  // 7. Periksa Profil Desa
  const profile = await prisma.villageProfile.findFirst({
    where: {
      OR: [
        { welcomeImageUrl: url },
        { structureImageUrl: url }
      ]
    }
  });
  if (profile) {
    usages.push({ type: "Profil Desa", name: "Informasi/Struktur Organisasi", link: `/admin/profil` });
  }

  // 8. Periksa Titik Air
  const waterSource = await prisma.waterSource.findFirst({
    where: {
      OR: [
        { imageUrl: url },
        { images: { has: url } }
      ]
    }
  });
  if (waterSource) {
    usages.push({ type: "Titik Air", name: waterSource.name, link: `/admin/titik-air/${waterSource.id}/edit` });
  }

  return usages;
}

// Menghapus aset gambar dari galeri media
export async function deleteMediaAsset(id: string) {
  await requireAdminSession(["MANAGE_GALERI"]);

  const asset = await prisma.mediaAsset.findUnique({
    where: { id },
  });

  if (!asset) {
    throw new Error("Aset media tidak ditemukan.");
  }

  // Periksa apakah gambar sedang digunakan pada modul mana pun
  const usages = await getMediaUsage(asset.url);

  if (usages.length > 0) {
    const modules = usages.map((u) => `${u.type} (${u.name})`);
    throw new Error(`Gambar tidak dapat dihapus karena masih digunakan pada: ${modules.join(", ")}`);
  }

  await prisma.mediaAsset.delete({
    where: { id },
  });

  revalidatePath("/admin/galeri");
}

// Mendapatkan semua aset gambar dalam galeri
export async function getMediaAssets() {
  await requireAdminSession(["MANAGE_GALERI"]);
  return prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
  });
}
