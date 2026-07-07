import imageCompression from "browser-image-compression";

const COMPRESS_OPTIONS = {
  maxSizeMB: 0.8,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  initialQuality: 0.8,
  fileType: "image/webp",
};

export async function compressImage(
  file: File,
  onProgress?: (percent: number) => void
): Promise<File> {
  // Hanya proses jika file adalah gambar
  if (!file.type.startsWith("image/")) {
    return file;
  }

  // Jika file sudah berupa WebP dan ukurannya kecil (<= 300 KB), lewati kompresi
  if (file.type === "image/webp" && file.size <= 300 * 1024) {
    onProgress?.(100);
    return file;
  }

  try {
    const options = {
      ...COMPRESS_OPTIONS,
      onProgress,
    };
    const compressedBlob = await imageCompression(file, options);
    
    // Ganti ekstensi file menjadi .webp
    const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
    
    return new File([compressedBlob], newName, { type: "image/webp" });
  } catch (error) {
    console.error("Gagal kompresi gambar ke format WebP:", error);
    return file;
  }
}
