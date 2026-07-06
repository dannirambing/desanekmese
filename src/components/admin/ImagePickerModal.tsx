"use client";

import { useEffect, useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { getMediaAssets } from "@/app/(admin)/admin/galeri/actions";
import ImageUpload from "@/components/admin/ImageUpload";
import { Search, Loader2, Image as ImageIcon, Check } from "lucide-react";

interface MediaAsset {
  id: string;
  url: string;
  publicId: string;
  name: string | null;
  createdAt: Date;
}

interface ImagePickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  title?: string;
  description?: string;
}

export default function ImagePickerModal({
  open,
  onOpenChange,
  onSelect,
  title = "Pilih Gambar",
  description = "Pilih gambar yang sudah ada dari galeri atau unggah gambar baru.",
}: ImagePickerModalProps) {
  const [activeTab, setActiveTab] = useState<"gallery" | "upload">("gallery");
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // Load assets when modal is opened or when activeTab is switched to gallery
  useEffect(() => {
    if (open && activeTab === "gallery") {
      startTransition(async () => {
        try {
          const fetchedAssets = await getMediaAssets();
          setAssets(fetchedAssets);
        } catch (error) {
          console.error("Gagal memuat galeri:", error);
        }
      });
    }
  }, [open, activeTab]);

  const filteredAssets = assets.filter((asset) => {
    const name = asset.name || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase()) || asset.url.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSelect = (url: string) => {
    onSelect(url);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col p-6 overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-black text-navy uppercase tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-150 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab("gallery")}
            className={`px-6 py-3 font-bold text-xs uppercase tracking-wider transition-all border-b-2 -mb-[2px] ${
              activeTab === "gallery"
                ? "border-turquoise text-turquoise"
                : "border-transparent text-slate-400 hover:text-[#0f172a]"
            }`}
          >
            Pilih dari Galeri
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`px-6 py-3 font-bold text-xs uppercase tracking-wider transition-all border-b-2 -mb-[2px] ${
              activeTab === "upload"
                ? "border-turquoise text-turquoise"
                : "border-transparent text-slate-400 hover:text-[#0f172a]"
            }`}
          >
            Unggah Baru
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto min-h-[300px] pr-1">
          {activeTab === "gallery" ? (
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari gambar berdasarkan nama..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-xs font-bold text-navy outline-none focus:ring-2 focus:ring-[#14b8a6] bg-slate-50/50"
                />
              </div>

              {isPending ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-turquoise" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Memuat galeri...
                  </span>
                </div>
              ) : filteredAssets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/20">
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {searchQuery ? "Gambar tidak ditemukan" : "Galeri media kosong"}
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2.5">
                  {filteredAssets.map((asset) => (
                    <div
                      key={asset.id}
                      onClick={() => handleSelect(asset.url)}
                      className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer hover:border-turquoise hover:shadow-md transition-all duration-200"
                    >
                      <img
                        src={asset.url}
                        alt={asset.name || "Aset Media"}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-turquoise text-white p-1.5 rounded-full shadow-lg scale-90 group-hover:scale-100 transition-transform duration-200">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      </div>
                      {/* Name tag */}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent p-1.5 text-[8px] font-bold text-white truncate">
                        {asset.name || "Gambar Galeri"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="py-6 max-w-lg mx-auto">
              <ImageUpload
                name="modalImageUrl"
                keyName="modalImageKey"
                label="Unggah Gambar ke Galeri"
                onUploadComplete={(url) => {
                  handleSelect(url);
                }}
              />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center mt-4">
                Gambar akan otomatis terkompresi sebelum diunggah.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
