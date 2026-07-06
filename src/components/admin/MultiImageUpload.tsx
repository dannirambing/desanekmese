"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { compressImage } from "@/lib/compress-image";
import { useUploadThing } from "@/lib/uploadthing";

type MultiImageUploadProps = {
  label?: string;
  maxFiles?: number;
  initialUrls?: string[];
  onUploadComplete?: (urls: string[]) => void;
};

export default function MultiImageUpload({
  label = "Galeri Foto",
  maxFiles = 5,
  initialUrls = [],
  onUploadComplete,
}: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Store uploaded URLs and previews of currently uploading/compressing files
  const [urls, setUrls] = useState<string[]>(initialUrls);
  const [isCompressing, setIsCompressing] = useState(false);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      const uploadedUrls = res.map((file) => file.ufsUrl);
      const newUrls = [...urls, ...uploadedUrls];
      setUrls(newUrls);
      onUploadComplete?.(newUrls);
    },
    onUploadError: (error) => {
      alert(`Gagal upload: ${error.message}`);
      if (inputRef.current) inputRef.current.value = "";
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (urls.length + files.length > maxFiles) {
      alert(`Maksimal ${maxFiles} foto diperbolehkan.`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setIsCompressing(true);

    try {
      const compressedFiles = await Promise.all(
        files.map((file) => compressImage(file))
      );
      await startUpload(compressedFiles);
    } catch {
      alert("Gagal memproses gambar. Silakan coba lagi.");
      if (inputRef.current) inputRef.current.value = "";
    } finally {
      setIsCompressing(false);
      if (inputRef.current) inputRef.current.value = ""; // Reset input after upload
    }
  };

  const isProcessing = isCompressing || isUploading;

  const handleRemove = (indexToRemove: number) => {
    const newUrls = urls.filter((_, i) => i !== indexToRemove);
    setUrls(newUrls);
    onUploadComplete?.(newUrls);
  };

  return (
    <div className="space-y-4">
      <label className="text-xs font-black uppercase text-navy/70">
        {label} <span className="text-navy/40 font-semibold normal-case">({urls.length}/{maxFiles})</span>
      </label>

      {/* Upload Box */}
      {urls.length < maxFiles && (
        <div className="relative border-2 border-dashed border-slate-300 rounded-2xl h-32 flex flex-col items-center justify-center bg-slate-50 overflow-hidden hover:bg-slate-100 transition-colors">
          <input
            type="file"
            accept="image/*"
            multiple
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
            onChange={handleFileChange}
            ref={inputRef}
            disabled={isProcessing}
          />

          {isProcessing ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-turquoise" />
              <span className="text-xs font-bold text-slate-500">
                {isCompressing ? "Mengompresi..." : "Mengupload..."}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-slate-400 gap-2">
              <Upload className="h-6 w-6" />
              <div className="text-center">
                <p className="text-xs font-bold text-slate-600">Klik atau seret foto</p>
                <p className="text-[10px] text-slate-400">Maks. {maxFiles - urls.length} foto lagi</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Gallery Previews */}
      {urls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {urls.map((url, index) => (
            <div key={index} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square">
              <img
                src={url}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 bg-white/90 hover:bg-red-50 text-red-500 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                title="Hapus foto"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
