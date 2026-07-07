"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";

import { compressImage } from "@/lib/compress-image";
import { useUploadThing } from "@/lib/uploadthing";

type ImageUploadProps = {
  name?: string;
  keyName?: string;
  label?: string;
  onUploadComplete?: (url: string, key: string) => void;
};

export default function ImageUpload({
  name = "imageUrl",
  keyName = "imageKey",
  label = "Foto Destinasi",
  onUploadComplete,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadedKey, setUploadedKey] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressProgress, setCompressProgress] = useState(0);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      const file = res[0];
      if (!file) return;

      setPreview(file.ufsUrl);
      setUploadedUrl(file.ufsUrl);
      setUploadedKey(file.key);
      onUploadComplete?.(file.ufsUrl, file.key);
    },
    onUploadError: (error) => {
      alert(`Gagal upload: ${error.message}`);
      setPreview(null);
      setUploadedUrl(null);
      setUploadedKey(null);
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
    setCompressProgress(0);

    try {
      const compressed = await compressImage(file, (percent) => {
        setCompressProgress(Math.round(percent));
      });
      await startUpload([compressed]);
    } catch {
      alert("Gagal memproses gambar. Silakan coba lagi.");
      setPreview(null);
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
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-black uppercase text-navy/70">
        {label}
      </label>

      <div className="relative border-2 border-dashed border-slate-300 rounded-2xl h-48 flex items-center justify-center bg-slate-50 overflow-hidden">
        {preview ? (
          <>
            <img
              src={preview}
              className="w-full h-full object-cover"
              alt="Preview"
            />

            {isProcessing && (
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
                <span className="text-xs font-bold text-white">
                  {isCompressing 
                    ? `Mengompresi (${compressProgress}%)...` 
                    : "Mengupload..."}
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
          </>
        ) : (
          <label className="cursor-pointer text-center">
            <Upload className="mx-auto text-slate-400 mb-2" />
            <span className="text-sm font-bold text-navy/50">
              Klik untuk upload
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

      {uploadedUrl && <input type="hidden" name={name} value={uploadedUrl} />}
      {uploadedKey && (
        <input type="hidden" name={keyName} value={uploadedKey} />
      )}
    </div>
  );
}
