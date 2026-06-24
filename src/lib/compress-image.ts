import imageCompression from "browser-image-compression";

const COMPRESS_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  initialQuality: 0.85,
};

const SKIP_COMPRESS_BYTES = 500 * 1024;

export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  if (file.size <= SKIP_COMPRESS_BYTES) {
    return file;
  }

  try {
    return await imageCompression(file, COMPRESS_OPTIONS);
  } catch {
    return file;
  }
}
