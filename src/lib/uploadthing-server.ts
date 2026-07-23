import { prisma } from "./prisma";

/**
 * Mendapatkan key berkas UploadThing dari URL berkas.
 * Contoh URL: https://utfs.io/f/key-file-name.ext atau https://ufs.sh/f/key-file-name.ext
 */
export function getUploadThingKey(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.includes("/f/")) {
    const parts = url.split("/f/");
    return parts[parts.length - 1];
  }
  return null;
}

/**
 * Memeriksa apakah file key masih digunakan oleh data/model lain di database.
 */
export async function isFileKeyReferenced(key: string): Promise<boolean> {
  if (!key) return false;

  // 1. Periksa MediaAsset
  const mediaAsset = await prisma.mediaAsset.findFirst({
    where: {
      OR: [
        { publicId: key },
        { url: { contains: key } }
      ]
    }
  });
  if (mediaAsset) return true;

  // 2. Periksa MediaFile (Gambar Wisata, Budaya, Berita)
  const mediaFile = await prisma.mediaFile.findFirst({
    where: {
      OR: [
        { publicId: key },
        { url: { contains: key } }
      ]
    }
  });
  if (mediaFile) return true;

  // 3. Periksa VillageRegulation
  const regulation = await prisma.villageRegulation.findFirst({
    where: {
      OR: [
        { fileKey: key },
        { fileUrl: { contains: key } }
      ]
    }
  });
  if (regulation) return true;

  // 4. Periksa ProductUMKM
  const product = await prisma.productUMKM.findFirst({
    where: {
      imageUrl: { contains: key }
    }
  });
  if (product) return true;

  // 5. Periksa Announcement
  const announcement = await prisma.announcement.findFirst({
    where: {
      imageUrl: { contains: key }
    }
  });
  if (announcement) return true;

  // 6. Periksa VillageProfile
  const profile = await prisma.villageProfile.findFirst({
    where: {
      OR: [
        { welcomeImageUrl: { contains: key } },
        { structureImageUrl: { contains: key } }
      ]
    }
  });
  if (profile) return true;

  // 7. Periksa WaterSource
  const waterSource = await prisma.waterSource.findFirst({
    where: {
      imageUrl: { contains: key }
    }
  });
  if (waterSource) return true;

  // Periksa array images dalam WaterSource secara aman
  const waterSources = await prisma.waterSource.findMany({
    where: {
      images: {
        isEmpty: false
      }
    },
    select: { images: true }
  });
  const isReferencedInWaterSourceImages = waterSources.some(ws => 
    ws.images.some(img => img.includes(key))
  );
  if (isReferencedInWaterSourceImages) return true;

  const hero = await prisma.heroSettings.findFirst({
    where: {
      imageUrl: { contains: key }
    }
  });
  if (hero) return true;

  // 9. Periksa ProfileSectionItem
  const sectionItem = await prisma.profileSectionItem.findFirst({
    where: {
      imageUrl: { contains: key }
    }
  });
  if (sectionItem) return true;

  return false;
}

