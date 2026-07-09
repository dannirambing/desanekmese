import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-session";
import GalleryManager from "./GalleryManager";
import { syncExistingMedia } from "./actions";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminGaleriPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  await requireAdminSession(["MANAGE_GALERI"]);

  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const search = params.search || "";

  const itemsPerPage = 24;
  const skip = (page - 1) * itemsPerPage;

  const where: Prisma.MediaAssetWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { url: { contains: search, mode: "insensitive" } },
    ];
  }

  // Hitung total item berdasarkan filter
  let totalItems = await prisma.mediaAsset.count({ where });

  let assets = await prisma.mediaAsset.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip,
    take: itemsPerPage,
  });

  // Sinkronisasi otomatis saat pertama kali dibuka jika galeri kosong sama sekali
  if (totalItems === 0 && !search) {
    try {
      await syncExistingMedia();
      totalItems = await prisma.mediaAsset.count();
      assets = await prisma.mediaAsset.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: itemsPerPage,
      });
    } catch (e) {
      console.error("Gagal melakukan sinkronisasi otomatis pertama kali:", e);
    }
  }

  return (
    <GalleryManager 
      initialAssets={assets} 
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      currentPage={page}
    />
  );
}
