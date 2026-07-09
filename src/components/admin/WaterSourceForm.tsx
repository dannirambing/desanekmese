"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, MapPin, Target, Image as ImageIcon, Upload } from "lucide-react";
import Link from "next/link";
import ImagePickerModal from "@/components/admin/ImagePickerModal";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import AuditTrailInfo from "@/components/admin/AuditTrailInfo";

import { WaterSource } from "@prisma/client";

export default function WaterSourceForm({
  initialData,
  onSubmit,
}: {
  initialData?: Partial<WaterSource>;
  onSubmit: (prevState: unknown, formData: FormData) => Promise<{ success: boolean; error?: string } | unknown>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.imageUrl || null);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);

  const [latitude, setLatitude] = useState<string>(initialData?.latitude?.toString() || "");
  const [longitude, setLongitude] = useState<string>(initialData?.longitude?.toString() || "");
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const handleGetLocation = () => {
    setIsLocating(true);
    setGeoError(null);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
          setIsLocating(false);
        },
        (error) => {
          setIsLocating(false);
          setGeoError("Gagal mendapatkan lokasi: " + error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    } else {
      setIsLocating(false);
      setGeoError("Geolocation tidak didukung di perangkat ini.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("imageUrl", imageUrl || "");
    formData.set("images", JSON.stringify(images));

    startTransition(async () => {
      const result = await onSubmit(null, formData);
      if (result && !result.success) {
        setError(result.error);
      } else if (result?.success) {
        router.push("/admin/titik-air");
      }
    });
  };

  return (
    <div className="max-w-3xl w-full mx-auto pb-16">
      <Link
        href="/admin/titik-air"
        className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-[#0f172a]/40 hover:text-[#0f172a] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar Titik Air
      </Link>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-teal-50 rounded-xl text-turquoise">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#0f172a] uppercase tracking-tight">
              {initialData ? "Edit Titik Air" : "Tambah Titik Air"}
            </h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Kelola informasi sumber air / titik air di Desa Nekmese
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
              Nama Titik Air <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              required
              defaultValue={initialData?.name}
              placeholder="Contoh: Mata Air Oebau"
              className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              required
              rows={4}
              defaultValue={initialData?.description}
              placeholder="Jelaskan mengenai titik air ini (kondisi, kegunaan, dll)..."
              className="w-full p-4 border border-slate-200 rounded-xl font-medium text-slate-700 focus:ring-2 focus:ring-[#14b8a6] outline-none leading-relaxed"
            />
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-[10px] font-black uppercase text-[#0f172a]/70">
                Koordinat Lokasi <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isLocating}
                className="inline-flex items-center text-xs font-bold bg-[#14b8a6]/10 text-[#14b8a6] hover:bg-[#14b8a6]/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                {isLocating ? (
                  <span className="animate-pulse">Mencari lokasi...</span>
                ) : (
                  <>
                    <Target className="w-3.5 h-3.5 mr-1.5" /> Gunakan GPS Saat Ini
                  </>
                )}
              </button>
            </div>
            
            {geoError && (
              <div className="mb-4 text-xs font-semibold text-red-500 bg-red-50 p-2 rounded-lg">
                {geoError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Latitude</label>
                <input
                  name="latitude"
                  type="number"
                  step="any"
                  required
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="-10.123456"
                  className="w-full p-3 border border-slate-200 rounded-xl font-medium text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Longitude</label>
                <input
                  name="longitude"
                  type="number"
                  step="any"
                  required
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="123.456789"
                  className="w-full p-3 border border-slate-200 rounded-xl font-medium text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">
              Anda dapat menggunakan fitur GPS otomatis di atas, atau menyalin koordinat manual dari Google Maps (klik kanan pada peta).
            </p>
            
            <div className="mt-4">
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Link Google Maps (Opsional)</label>
              <input
                name="mapUrl"
                type="url"
                defaultValue={initialData?.mapUrl || ""}
                placeholder="https://maps.app.goo.gl/..."
                className="w-full p-3 border border-slate-200 rounded-xl font-medium text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1 font-medium">Tautan untuk tombol &apos;Buka di Google Maps&apos;</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-3">
              Foto Lokasi
            </label>
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <ImageIcon className="w-8 h-8 mb-2" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Belum Ada Foto</span>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={() => setIsImagePickerOpen(true)}
                className="flex-1 inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-[#0f172a] py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border border-slate-200 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 mr-1.5" /> Pilih Foto
              </button>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl(null)}
                  className="inline-flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-xl font-bold text-xs uppercase transition-all border border-red-100 cursor-pointer"
                >
                  Hapus
                </button>
              )}
            </div>
            <ImagePickerModal
              open={isImagePickerOpen}
              onOpenChange={setIsImagePickerOpen}
              onSelect={(url) => setImageUrl(url)}
              title="Pilih Foto Utama"
              description="Pilih dari pustaka media atau unggah foto baru."
            />
          </div>

          <div className="pt-4 border-t border-slate-100">
            <MultiImageUpload
              label="Galeri Foto Tambahan"
              maxFiles={5}
              initialUrls={images}
              onUploadComplete={(urls) => setImages(urls)}
            />
            <p className="text-[10px] text-slate-400 mt-2 font-medium">
              Format: JPG, PNG, WEBP. Otomatis dikompresi agar ringan. Maksimal 5 foto tambahan.
            </p>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
              Status Publikasi
            </label>
            <select
              name="status"
              defaultValue={initialData?.status || "PUBLISHED"}
              className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none bg-white"
            >
              <option value="DRAFT">Draft (Sembunyikan)</option>
              <option value="PUBLISHED">Published (Tampilkan)</option>
            </select>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center bg-navy hover:bg-navy/90 text-white px-8 py-4 rounded-full font-bold uppercase text-xs tracking-widest transition-all shadow-xl shadow-navy/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Menyimpan..." : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Simpan Titik Air
                </>
              )}
            </button>
          </div>
        </form>

        {initialData && initialData.createdAt && (
          <AuditTrailInfo
            createdBy={initialData.createdBy}
            updatedBy={initialData.updatedBy}
            createdAt={initialData.createdAt}
            updatedAt={initialData.updatedAt}
          />
        )}
      </div>
    </div>
  );
}
