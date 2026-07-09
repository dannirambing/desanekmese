import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://desanekmese.vercel.app").replace(/\/$/, "");

  // Rute-rute statis publik
  const staticPaths = [
    "",
    "/profil",
    "/peraturan",
    "/wisata",
    "/budaya",
    "/umkm",
    "/berita",
    "/pengumuman",
    "/terms",
    "/privacy",
  ];

  const staticEntries = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: path === "" ? 1.0 : 0.8,
  }));

  try {
    // Ambil data dinamis yang dipublikasikan dari database
    const [berita, budaya, wisata, pengumuman, titikAir, umkm] = await Promise.all([
      prisma.newsArticle.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.cultureItem.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.tourismPlace.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.announcement.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.waterSource.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.productUMKM.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const beritaEntries = berita.map((item) => ({
      url: `${baseUrl}/berita/${item.slug}`,
      lastModified: new Date(item.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    const budayaEntries = budaya.map((item) => ({
      url: `${baseUrl}/budaya/${item.slug}`,
      lastModified: new Date(item.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    const wisataEntries = wisata.map((item) => ({
      url: `${baseUrl}/destinasi/${item.slug}`,
      lastModified: new Date(item.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    const pengumumanEntries = pengumuman.map((item) => ({
      url: `${baseUrl}/pengumuman/${item.slug}`,
      lastModified: new Date(item.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    const titikAirEntries = titikAir.map((item) => ({
      url: `${baseUrl}/profil/titik-air/${item.slug}`,
      lastModified: new Date(item.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

    const umkmEntries = umkm.map((item) => ({
      url: `${baseUrl}/umkm/${item.slug}`,
      lastModified: new Date(item.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    return [
      ...staticEntries,
      ...beritaEntries,
      ...budayaEntries,
      ...wisataEntries,
      ...pengumumanEntries,
      ...titikAirEntries,
      ...umkmEntries,
    ];
  } catch (error) {
    console.error("Gagal membuat sitemap dinamis:", error);
    // Kembalikan hanya entri statis jika database error/tidak terhubung
    return staticEntries;
  }
}
