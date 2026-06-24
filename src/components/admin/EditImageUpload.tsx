"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";

import { compressImage } from "@/lib/compress-image";
import { useUploadThing } from "@/lib/uploadthing";

type EditImageUploadProps = {
  currentImage: string | null;
  currentMediaId?: string | null;
};

export default function EditImageUpload({
  currentImage,
  currentMediaId,
}: EditImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentImage);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadedKey, setUploadedKey] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      const file = res[0];
      if (!file) return;

      setPreview(file.ufsUrl);
      setUploadedUrl(file.ufsUrl);
      setUploadedKey(file.key);
      setRemoveImage(false);
    },
    onUploadError: (error) => {
      alert(`Gagal upload: ${error.message}`);
      setPreview(currentImage);
      setUploadedUrl(null);
      setUploadedKey(null);
      setRemoveImage(false);
      if (inputRef.current) inputRef.current.value = "";
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploadedUrl(null);
    setUploadedKey(null);
    setIsCompressing(true);

    try {
      const compressed = await compressImage(file);
      await startUpload([compressed]);
    } catch {
      alert("Gagal memproses gambar. Silakan coba lagi.");
      setPreview(currentImage);
      if (inputRef.current) inputRef.current.value = "";
    } finally {
      setIsCompressing(false);
    }
  };

  const isProcessing = isCompressing || isUploading;

  const handleRemove = () => {
    setPreview(null);
    setUploadedUrl(null);
    setUploadedKey(null);
    setRemoveImage(true);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-black uppercase tracking-widest text-[#0f172a]/70">
        Foto Destinasi
      </label>

      <div className="relative border-2 border-dashed border-slate-200 rounded-2xl h-48 flex items-center justify-center bg-slate-50 overflow-hidden">
        {preview ? (
          <div className="relative w-full h-full">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />

            {isProcessing && (
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
                <span className="text-xs font-bold text-white">
                  {isCompressing ? "Mengompresi..." : "Mengupload..."}
                </span>
              </div>
            )}

            {!isProcessing && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ) : (
          <label className="cursor-pointer text-center w-full h-full flex flex-col items-center justify-center">
            <Upload className="text-slate-400 mb-2" />
            <span className="text-xs font-bold text-[#0f172a]/50">
              KLIK UNTUK UPLOAD
            </span>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isProcessing}
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>

      <input type="hidden" name="removeImage" value={removeImage ? "true" : "false"} />
      {currentMediaId && (
        <input type="hidden" name="currentMediaId" value={currentMediaId} />
      )}
      {uploadedUrl && (
        <input type="hidden" name="imageUrl" value={uploadedUrl} />
      )}
      {uploadedKey && (
        <input type="hidden" name="imageKey" value={uploadedKey} />
      )}
    </div>
  );
}
