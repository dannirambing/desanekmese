"use client";

import { useRef, useState } from "react";
import { Loader2, FileText, Upload, X, AlertTriangle } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";

type DocumentUploadProps = {
  name?: string;
  keyName?: string;
  label?: string;
  initialUrl?: string;
  initialKey?: string;
  onUploadComplete?: (url: string, key: string) => void;
  onRemove?: () => void;
  suggestedName?: string;
};

export default function DocumentUpload({
  name = "fileUrl",
  keyName = "fileKey",
  label = "File Peraturan (PDF)",
  initialUrl = "",
  initialKey = "",
  onUploadComplete,
  onRemove,
  suggestedName = "",
}: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(initialUrl || null);
  const [uploadedKey, setUploadedKey] = useState<string | null>(initialKey || null);
  const [fileName, setFileName] = useState<string | null>(initialUrl ? "Dokumen Peraturan (PDF)" : null);

  const [warning, setWarning] = useState<string | null>(null);

  const { startUpload, isUploading } = useUploadThing("documentUploader", {
    onClientUploadComplete: (res) => {
      const file = res[0];
      if (!file) return;

      setUploadedUrl(file.ufsUrl);
      setUploadedKey(file.key);
      setFileName(file.name);
      onUploadComplete?.(file.ufsUrl, file.key);
    },
    onUploadError: (error) => {
      alert(`Gagal upload dokumen: ${error.message}`);
      setUploadedUrl(null);
      setUploadedKey(null);
      setFileName(null);
      setWarning(null);
      if (inputRef.current) inputRef.current.value = "";
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
    if (!file) return;

    // Batasi maksimal 16MB secara klien
    if (file.size > 16 * 1024 * 1024) {
      alert("Ukuran dokumen melebihi batas maksimal 16MB. Silakan kompresi terlebih dahulu.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    // Ganti nama file secara dinamis jika suggestedName dikirimkan
    if (suggestedName) {
      const sanitizedSuggestedName = suggestedName
        .replace(/[^a-zA-Z0-9-]/g, "_")
        .replace(/_+/g, "_")
        .replace(/(^_+|_+$)/g, ""); // Bersihkan underscore di awal/akhir
      
      const fileExtension = file.name.split('.').pop() || "pdf";
      file = new File([file], `${sanitizedSuggestedName}.${fileExtension}`, { type: file.type });
    }

    setUploadedUrl(null);
    setUploadedKey(null);
    setFileName(file.name);

    // Jika file lebih dari 2MB, ingatkan admin untuk kompresi demi efisiensi
    if (file.size > 2 * 1024 * 1024) {
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      setWarning(`Dokumen Anda cukup besar (${sizeInMB} MB). Demi kenyamanan warga desa yang membuka melalui HP, disarankan untuk mengompresi dokumen terlebih dahulu sebelum diunggah.`);
    } else {
      setWarning(null);
    }

    try {
      await startUpload([file]);
    } catch {
      alert("Gagal memproses dokumen. Silakan coba lagi.");
      setFileName(null);
      setWarning(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    setUploadedUrl(null);
    setUploadedKey(null);
    setFileName(null);
    setWarning(null);
    if (inputRef.current) inputRef.current.value = "";
    onRemove?.();
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-black uppercase text-navy/70">
        {label}
      </label>

      <div className="relative border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50 min-h-36 overflow-hidden">
        {fileName || uploadedUrl ? (
          <div className="flex flex-col items-center gap-2 text-center w-full px-4">
            <FileText className="h-10 w-10 text-red-500 animate-bounce" />
            <span className="text-xs font-bold text-navy max-w-xs truncate" title={fileName || "Dokumen PDF"}>
              {fileName || "Dokumen PDF"}
            </span>

            {isUploading && (
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
                <span className="text-xs font-bold text-white">Mengupload Dokumen...</span>
              </div>
            )}

            {!isUploading && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                title="Hapus file"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ) : (
          <label className="cursor-pointer text-center w-full py-4 block">
            <Upload className="mx-auto text-slate-400 mb-2 h-8 w-8" />
            <span className="text-xs font-black text-navy/50 uppercase tracking-wider block">
              Klik untuk upload dokumen PDF (Maks. 16MB)
            </span>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              disabled={isUploading}
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>

      {warning && (
        <div className="flex gap-2.5 p-3.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-xs font-semibold leading-relaxed">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            {warning}{" "}
            <a 
              href="https://www.ilovepdf.com/compress_pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-teal-600 hover:text-teal-700 underline font-bold"
            >
              Kompres PDF di iLovePDF
            </a>
          </div>
        </div>
      )}

      {uploadedUrl && <input type="hidden" name={name} value={uploadedUrl} />}
      {uploadedKey && <input type="hidden" name={keyName} value={uploadedKey} />}
    </div>
  );
}
