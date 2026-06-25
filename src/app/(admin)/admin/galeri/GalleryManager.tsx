"use client";

import { useState, useTransition } from "react";
import { 
  Search, 
  Upload, 
  RefreshCw, 
  Copy, 
  Trash2, 
  Eye, 
  Check, 
  ExternalLink, 
  Loader2, 
  Image as ImageIcon,
  AlertCircle
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/admin/ImageUpload";
import { deleteMediaAsset, getMediaUsage, syncExistingMedia } from "./actions";
import Link from "next/link";

interface MediaAsset {
  id: string;
  url: string;
  publicId: string;
  name: string | null;
  createdAt: Date;
}

interface GalleryManagerProps {
  initialAssets: MediaAsset[];
}

export default function GalleryManager({ initialAssets }: GalleryManagerProps) {
  const [assets, setAssets] = useState<MediaAsset[]>(initialAssets);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [usages, setUsages] = useState<{ type: string; name: string; link: string }[]>([]);
  const [isLoadingUsages, setIsLoadingUsages] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<MediaAsset | null>(null);

  // Sync assets
  const handleSync = () => {
    setIsSyncing(true);
    startTransition(async () => {
      try {
        await syncExistingMedia();
        // Reload page or re-fetch (simplest is reloading window state or just alerting success)
        window.location.reload();
      } catch (error) {
        alert("Gagal melakukan sinkronisasi");
      } finally {
        setIsSyncing(false);
      }
    });
  };

  // Copy URL
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  // View details and usages
  const handleViewDetails = (asset: MediaAsset) => {
    setSelectedAsset(asset);
    setIsLoadingUsages(true);
    setUsages([]);
    startTransition(async () => {
      try {
        const usageData = await getMediaUsage(asset.url);
        setUsages(usageData);
      } catch (error) {
        console.error("Gagal mendeteksi penggunaan:", error);
      } finally {
        setIsLoadingUsages(false);
      }
    });
  };

  // Delete asset
  const handleDelete = () => {
    if (!assetToDelete) return;
    startTransition(async () => {
      try {
        await deleteMediaAsset(assetToDelete.id);
        setAssets(assets.filter((a) => a.id !== assetToDelete.id));
        setAssetToDelete(null);
      } catch (error) {
        alert("Gagal menghapus gambar");
      }
    });
  };

  const filteredAssets = assets.filter((asset) => {
    const name = asset.name || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase()) || asset.url.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="w-full">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-navy tracking-tight uppercase">
            Galeri Media
          </h1>
          <p className="text-sm text-navy/60 font-medium mt-1">
            Kelola semua aset gambar yang digunakan di portal Desa Nekmese.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSync}
            disabled={isSyncing}
            variant="outline"
            className="border-slate-200 hover:bg-slate-50 font-bold text-xs tracking-wider uppercase rounded-full px-5 py-3 h-auto"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
            Sinkronkan Media
          </Button>
          <Button 
            onClick={() => setIsUploadOpen(true)}
            className="bg-turquoise hover:bg-turquoise/90 text-black px-6 py-3 rounded-full font-bold text-xs tracking-widest uppercase transition-all shadow-md shadow-turquoise/10 h-auto"
          >
            <Upload className="w-4 h-4 mr-2 stroke-[3]" />
            Unggah Gambar
          </Button>
        </div>
      </div>

      {/* Control Panel (Pencarian & Ringkasan) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari gambar berdasarkan nama..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-xs font-bold text-navy outline-none focus:ring-2 focus:ring-[#14b8a6] bg-slate-50/50"
          />
        </div>
        <div className="text-right text-xs font-bold text-slate-400 uppercase tracking-widest">
          Total: <span className="text-navy">{filteredAssets.length}</span> Gambar
        </div>
      </div>

      {/* Grid Galeri */}
      {filteredAssets.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl py-24 text-center shadow-sm">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-base font-black text-navy uppercase mb-1">
            {searchQuery ? "Tidak ditemukan kecocokan" : "Galeri Media Kosong"}
          </h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            {searchQuery ? "Coba kata kunci pencarian yang lain." : "Unggah gambar baru untuk memulai galeri Anda."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3.5">
          {filteredAssets.map((asset) => (
            <div 
              key={asset.id}
              className="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-turquoise/30 transition-all duration-200 flex flex-col"
            >
              {/* Thumbnail */}
              <div className="relative aspect-square bg-slate-50 border-b border-slate-100 overflow-hidden">
                <img 
                  src={asset.url} 
                  alt={asset.name || "Aset Media"}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 px-2">
                  <button
                    onClick={() => handleViewDetails(asset)}
                    className="p-1.5 bg-white text-navy hover:bg-turquoise hover:text-white rounded-lg transition-all shadow-md cursor-pointer"
                    title="Lihat Detail & Penggunaan"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleCopyUrl(asset.url)}
                    className="p-1.5 bg-white text-navy hover:bg-turquoise hover:text-white rounded-lg transition-all shadow-md cursor-pointer"
                    title="Salin URL"
                  >
                    {copiedUrl === asset.url ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => setAssetToDelete(asset)}
                    className="p-1.5 bg-white text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all shadow-md cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Info panel */}
              <div className="p-2 flex-1 flex flex-col justify-between">
                <p className="text-[10px] font-bold text-navy truncate uppercase tracking-wide" title={asset.name || "Gambar Galeri"}>
                  {asset.name || "Gambar Galeri"}
                </p>
                <div className="flex items-center justify-between text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 pt-1.5 border-t border-slate-100">
                  <span>{new Date(asset.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                  <span className="text-[7px] bg-slate-100 px-1 rounded-sm text-slate-500">
                    {asset.publicId === "external" ? "Ext" : "UT"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL UNTUK UNGGAH GAMBAR */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-navy uppercase tracking-tight">
              Unggah Gambar Baru
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Aset akan disimpan secara permanen di Galeri Media.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ImageUpload 
              name="galleryUploadUrl"
              keyName="galleryUploadKey"
              label="Unggah File Gambar"
              onUploadComplete={() => {
                // Reload to see new image
                window.location.reload();
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL DETIL DAN PENGGUNAAN GAMBAR */}
      <Dialog open={selectedAsset !== null} onOpenChange={(open) => !open && setSelectedAsset(null)}>
        {selectedAsset && (
          <DialogContent className="sm:max-w-2xl bg-white border border-slate-200 rounded-2xl p-6 shadow-xl max-h-[85vh] flex flex-col overflow-hidden">
            <DialogHeader>
              <DialogTitle className="text-lg font-black text-navy uppercase tracking-tight truncate pr-8">
                {selectedAsset.name || "Detail Aset Gambar"}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Rincian data dan penggunaan berkas gambar di dalam portal.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto space-y-6 py-4 pr-1">
              <div className="relative aspect-video rounded-xl overflow-hidden border bg-slate-50">
                <img 
                  src={selectedAsset.url} 
                  alt={selectedAsset.name || "Aset"} 
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Copy URL Section */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase text-navy/70">
                  URL Gambar
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={selectedAsset.url}
                    className="flex-1 p-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-slate-50 outline-none select-all"
                  />
                  <Button
                    onClick={() => handleCopyUrl(selectedAsset.url)}
                    className="bg-turquoise hover:bg-turquoise/90 text-black px-4 rounded-xl font-bold text-xs uppercase"
                  >
                    {copiedUrl === selectedAsset.url ? <Check className="w-4 h-4 mr-1 stroke-[3]" /> : <Copy className="w-4 h-4 mr-1" />}
                    {copiedUrl === selectedAsset.url ? "Disalin" : "Salin"}
                  </Button>
                </div>
              </div>

              {/* Usages Section */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase text-navy/70 tracking-widest border-b pb-2">
                  Digunakan Pada Modul
                </h4>
                {isLoadingUsages ? (
                  <div className="flex items-center justify-center py-6 gap-2 text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin text-turquoise" />
                    <span className="text-xs font-bold uppercase tracking-wider">Mendeteksi penggunaan...</span>
                  </div>
                ) : usages.length === 0 ? (
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                      Gambar ini belum dikaitkan dengan konten apa pun (Bebas Dihapus).
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                    {usages.map((use, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50/30 hover:bg-slate-50">
                        <div>
                          <span className="text-[9px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide mr-2">
                            {use.type}
                          </span>
                          <span className="text-xs font-bold text-navy">{use.name}</span>
                        </div>
                        <Link
                          href={use.link}
                          className="inline-flex items-center text-[10px] font-black uppercase text-turquoise hover:text-[#0f172a] transition-colors"
                        >
                          Ubah Konten <ExternalLink className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* CONFIRMATION DIALOG UNTUK DELETE */}
      <Dialog open={assetToDelete !== null} onOpenChange={(open) => !open && setAssetToDelete(null)}>
        <DialogContent className="sm:max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-red-600 uppercase tracking-tight flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Hapus Gambar?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Apakah Anda yakin ingin menghapus gambar ini dari galeri? Aksi ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          {assetToDelete && (
            <div className="flex gap-4 p-4 border border-slate-100 bg-slate-50/50 rounded-xl my-2">
              <img 
                src={assetToDelete.url} 
                alt="Gambar yang akan dihapus" 
                className="w-16 h-16 object-cover rounded-lg border bg-white"
              />
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <p className="text-xs font-black text-navy truncate uppercase">{assetToDelete.name || "Gambar Galeri"}</p>
                <p className="text-[9px] text-slate-400 font-semibold truncate mt-1">{assetToDelete.url}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setAssetToDelete(null)}
              className="border-slate-200 font-bold text-xs uppercase rounded-xl px-4 py-2.5 h-auto"
            >
              Batal
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase rounded-xl px-4 py-2.5 h-auto"
            >
              Hapus Permanen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
