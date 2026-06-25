"use client";

import { useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import ImagePickerModal from "./ImagePickerModal";

interface ImagePickerFieldProps {
  name?: string;
  currentImage?: string | null;
  label?: string;
  title?: string;
  description?: string;
}

export default function ImagePickerField({
  name = "imageUrl",
  currentImage = null,
  label = "Gambar",
  title = "Pilih Gambar",
  description = "Pilih gambar yang sudah ada dari galeri atau unggah baru.",
}: ImagePickerFieldProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(currentImage);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [removeImage, setRemoveImage] = useState(false);

  const handleSelect = (url: string) => {
    setImageUrl(url);
    setRemoveImage(false);
  };

  const handleRemove = () => {
    setImageUrl(null);
    setRemoveImage(true);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-black uppercase tracking-widest text-[#0f172a]/70">
        {label}
      </label>

      <div className="relative border-2 border-dashed border-slate-200 rounded-2xl h-48 flex items-center justify-center bg-slate-50 overflow-hidden">
        {imageUrl && !removeImage ? (
          <div className="relative w-full h-full">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-md transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="w-full h-full flex flex-col items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 transition-all cursor-pointer"
          >
            <Upload className="mb-2 w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              PILIH / UNGGAH GAMBAR
            </span>
          </button>
        )}
      </div>

      {/* Hidden inputs to submit with form */}
      {!removeImage && imageUrl && (
        <input type="hidden" name={name} value={imageUrl} />
      )}
      {/* We can output a dummy imageKey to satisfy other systems if needed, but usually just url is needed. */}
      {imageUrl && !removeImage && (
        <input type="hidden" name="imageKey" value="selected-from-gallery" />
      )}
      <input
        type="hidden"
        name="removeImage"
        value={removeImage ? "true" : "false"}
      />

      <ImagePickerModal
        open={isPickerOpen}
        onOpenChange={setIsPickerOpen}
        onSelect={handleSelect}
        title={title}
        description={description}
      />
    </div>
  );
}
