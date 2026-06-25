import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-session";
import GalleryManager from "./GalleryManager";
import { syncExistingMedia } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminGaleriPage() {
  await requireAdminSession(["SUPER_ADMIN", "ADMIN_KONTEN", "ADMIN_UMKM"]);

  let assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Sinkronisasi otomatis saat pertama kali dibuka jika galeri kosong
  if (assets.length === 0) {
    try {
      await syncExistingMedia();
      assets = await prisma.mediaAsset.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      console.error("Gagal melakukan sinkronisasi otomatis pertama kali:", e);
    }
  }

  return <GalleryManager initialAssets={assets} />;
}
