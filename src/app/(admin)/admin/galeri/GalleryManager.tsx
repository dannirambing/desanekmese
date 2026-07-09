"use client";

import { useEffect, useState, useTransition } from "react";
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
  AlertCircle,
  CheckCircle2,
  Lock
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/admin/ImageUpload";
import { deleteMediaAsset, getMediaUsage, syncExistingMedia } from "./actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AdminTableFilters from "@/components/admin/AdminTableFilters";
import AdminTablePagination from "@/components/admin/AdminTablePagination";

interface MediaAsset {
  id: string;
  url: string;
  publicId: string;
  name: string | null;
  createdAt: Date;
}

interface GalleryManagerProps {
  initialAssets: MediaAsset[];
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
}

export default function GalleryManager({ 
  initialAssets,
  totalItems,
  itemsPerPage,
  currentPage
}: GalleryManagerProps) {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const [prevInitialAssets, setPrevInitialAssets] = useState<MediaAsset[]>(initialAssets);
  const [assets, setAssets] = useState<MediaAsset[]>(initialAssets);

  if (initialAssets !== prevInitialAssets) {
    setPrevInitialAssets(initialAssets);
    setAssets(initialAssets);
  }

  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isSyncing, setIsSyncing] = useState(false);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [usages, setUsages] = useState<{ type: string; name: string; link: string }[]>([]);
  const [isLoadingUsages, setIsLoadingUsages] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<MediaAsset | null>(null);
  const [deleteUsages, setDeleteUsages] = useState<{ type: string; name: string; link: string }[]>([]);
  const [isLoadingDeleteUsages, setIsLoadingDeleteUsages] = useState(false);
  const [prevAssetToDelete, setPrevAssetToDelete] = useState<MediaAsset | null>(null);
  if (assetToDelete !== prevAssetToDelete) {
    setPrevAssetToDelete(assetToDelete);
    if (!assetToDelete) {
      setDeleteUsages([]);
      setIsLoadingDeleteUsages(false);
    } else {
      setIsLoadingDeleteUsages(true);
    }
  }

  // Cek penggunaan media sebelum konfirmasi hapus
  useEffect(() => {
    if (!assetToDelete) {
      return;
    }
    const fetchDeleteUsages = async () => {
      try {
        const usageData = await getMediaUsage(assetToDelete.url);
        setDeleteUsages(usageData);
      } catch (error) {
        console.error("Gagal mendeteksi penggunaan:", error);
      } finally {
        setIsLoadingDeleteUsages(false);
      }
    };
    fetchDeleteUsages();
  }, [assetToDelete]);

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
        const err = error as Error;
        alert(err.message || "Gagal menghapus gambar");
      }
    });
  };

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
      <AdminTableFilters 
        placeholder="Cari gambar berdasarkan nama..." 
        showStatusFilter={false} 
      />

      {/* Grid Galeri */}
      {assets.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl py-24 text-center shadow-sm">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-base font-black text-navy uppercase mb-1">
            {search ? "Tidak ditemukan kecocokan" : "Galeri Media Kosong"}
          </h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            {search ? "Coba kata kunci pencarian yang lain." : "Unggah gambar baru untuk memulai galeri Anda."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3.5">
            {assets.map((asset) => (
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
                  <div className="absolute inset-0 bg-black/50 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 px-2">
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

          <AdminTablePagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalItems / itemsPerPage)}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
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
        <DialogContent className="sm:max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl overflow-hidden">
          <DialogHeader className="text-center sm:text-left">
            <div className="mx-auto sm:mx-0 w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6 text-red-500 animate-pulse" />
            </div>
            <DialogTitle className="text-xl font-black text-[#0f172a] uppercase tracking-tight">
              Hapus Gambar?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-medium">
              Apakah Anda yakin ingin menghapus gambar ini dari galeri? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          {assetToDelete && (
            <div className="space-y-4 my-4 w-full overflow-hidden">
              {/* Media Card Preview */}
              <div className="flex flex-col sm:flex-row gap-4 p-3.5 border border-slate-100 bg-slate-50/70 rounded-2xl shadow-inner w-full overflow-hidden">
                <div className="relative w-full sm:w-20 h-24 sm:h-20 rounded-xl overflow-hidden border border-slate-200 bg-white shrink-0 shadow-sm">
                  <img 
                    src={assetToDelete.url} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <span className="text-[10px] font-black text-turquoise uppercase tracking-widest block">Gambar yang akan dihapus</span>
                  <p className="text-xs font-black text-navy break-all uppercase leading-tight" title={assetToDelete.name || "Gambar Galeri"}>
                    {assetToDelete.name || "Gambar Galeri"}
                  </p>
                  <p className="text-[9px] text-slate-400 font-semibold break-all leading-normal select-all bg-white p-1.5 rounded border border-slate-200/50 block w-full max-w-full">
                    {assetToDelete.url}
                  </p>
                </div>
              </div>

              {/* Usage Status Check */}
              {isLoadingDeleteUsages ? (
                <div className="flex flex-col items-center justify-center py-6 bg-slate-50/50 rounded-2xl border border-slate-100 gap-2.5 w-full">
                  <Loader2 className="w-5 h-5 animate-spin text-turquoise" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Memeriksa Penggunaan...</span>
                </div>
              ) : deleteUsages.length > 0 ? (
                <div className="bg-red-50/80 border-l-4 border-red-500 text-red-700 p-4 rounded-r-2xl rounded-l-md text-xs space-y-2.5 shadow-sm w-full overflow-hidden">
                  <p className="font-black uppercase tracking-widest flex items-center gap-2 text-red-800">
                    <Lock className="w-4 h-4 text-red-500 shrink-0" />
                    Penghapusan Dicegah
                  </p>
                  <p className="font-semibold text-red-700/90">
                    Gambar ini sedang aktif digunakan pada modul berikut:
                  </p>
                  <div className="divide-y divide-red-100/50 border border-red-100 rounded-xl overflow-hidden bg-white/50 w-full">
                    {deleteUsages.map((use, idx) => (
                      <div key={idx} className="p-2.5 text-[10px] text-red-900 leading-normal flex flex-col gap-1 w-full overflow-hidden">
                        <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded font-black uppercase text-[8px] w-fit shrink-0">
                          {use.type}
                        </span>
                        <span className="font-bold break-all w-full">{use.name}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[9px] font-medium text-red-600/80 pt-1 leading-relaxed">
                    *Harap ganti atau lepaskan tautan gambar pada konten-konten di atas sebelum Anda dapat menghapusnya secara permanen dari galeri desa.
                  </p>
                </div>
              ) : (
                <div className="bg-emerald-50/80 border-l-4 border-emerald-500 text-emerald-700 p-4 rounded-r-2xl rounded-l-md text-xs space-y-1.5 shadow-sm flex items-start gap-3 w-full">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black uppercase tracking-widest text-emerald-800">Aman untuk Dihapus</p>
                    <p className="font-medium text-emerald-600/90 text-[10px] leading-relaxed mt-0.5">
                      Gambar ini bebas dari ketergantungan modul lain dan aman untuk dihapus secara permanen.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 mt-2">
            <Button
              variant="outline"
              disabled={isPending}
              onClick={() => setAssetToDelete(null)}
              className="w-full sm:w-auto border-slate-200 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider rounded-xl px-5 py-3 h-auto"
            >
              Batal
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteUsages.length > 0 || isLoadingDeleteUsages || isPending}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-xs uppercase tracking-widest rounded-xl px-5 py-3 h-auto flex items-center justify-center gap-2 shadow-md hover:shadow-red-600/10 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              Hapus Permanen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
