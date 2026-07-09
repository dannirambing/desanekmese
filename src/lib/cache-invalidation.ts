import { prisma } from "@/lib/prisma";

export async function clearChatCacheByCategory(
  category: "WISATA" | "UMKM" | "ANGGARAN" | "PENGUMUMAN" | "BERITA" | "BUDAYA" | "PROFIL" | "PERATURAN"
) {
  try {
    const deleted = await prisma.chatCache.deleteMany({
      where: { category },
    });
    console.log(
      `[Cache Invalidation] Berhasil menghapus ${deleted.count} cache obrolan untuk kategori: ${category}`
    );
    return { success: true, count: deleted.count };
  } catch (err) {
    console.error(
      `[Cache Invalidation] Gagal menghapus cache obrolan untuk kategori ${category}:`,
      err
    );
    return { success: false, error: err };
  }
}
