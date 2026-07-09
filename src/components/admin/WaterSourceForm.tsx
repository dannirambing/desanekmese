"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, MapPin, Target, Image as ImageIcon, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import ImagePickerModal from "@/components/admin/ImagePickerModal";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import AuditTrailInfo from "@/components/admin/AuditTrailInfo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { waterSourceSchema, WaterSourceInput } from "@/lib/validations/titik-air";

import { WaterSource, Admin } from "@prisma/client";

export default function WaterSourceForm({
  initialData,
  onSubmit,
}: {
  initialData?: Partial<WaterSource> & {
    createdBy?: Pick<Admin, "name"> | null;
    updatedBy?: Pick<Admin, "name"> | null;
  };
  onSubmit: (formData: FormData) => Promise<any>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.imageUrl || null);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);

  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<WaterSourceInput>({
    resolver: zodResolver(waterSourceSchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      latitude: initialData?.latitude ?? undefined,
      longitude: initialData?.longitude ?? undefined,
      mapUrl: initialData?.mapUrl || "",
      status: initialData?.status || "PUBLISHED",
    },
  });

  const watchLatitude = watch("latitude");
  const watchLongitude = watch("longitude");

  const handleGetLocation = () => {
    setIsLocating(true);
    setGeoError(null);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue("latitude", position.coords.latitude, { shouldValidate: true });
          setValue("longitude", position.coords.longitude, { shouldValidate: true });
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

  const handleFormSubmit = async (data: WaterSourceInput) => {
    setServerError(null);
    
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("latitude", data.latitude.toString());
    formData.append("longitude", data.longitude.toString());
    if (data.mapUrl) formData.append("mapUrl", data.mapUrl);
    formData.append("status", data.status);
    
    if (imageUrl) formData.append("imageUrl", imageUrl);
    if (images.length > 0) formData.append("images", JSON.stringify(images));
    
    // For update action, append id if exists
    if (initialData?.id) {
      formData.append("id", initialData.id);
    }

    startTransition(async () => {
      const result = await onSubmit(formData);
      if (result && !result.success) {
        setServerError(result.message || "Gagal menyimpan data");
      } else if (result?.success) {
        router.push("/admin/titik-air");
      }
    });
  };

  const inputClass = (error?: any) => `w-full p-4 border rounded-xl font-bold focus:outline-none focus:ring-2 ${error ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-[#14b8a6]/40 text-[#0f172a]"}`;

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

        {serverError && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-semibold">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
              Nama Titik Air <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name")}
              placeholder="Contoh: Mata Air Oebau"
              className={inputClass(errors.name)}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1 font-bold">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="Jelaskan mengenai titik air ini (kondisi, kegunaan, dll)..."
              className={inputClass(errors.description)}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1 font-bold">{errors.description.message}</p>}
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
                  <span className="flex items-center gap-2 animate-pulse"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Mencari lokasi...</span>
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
                  type="number"
                  step="any"
                  {...register("latitude")}
                  placeholder="-10.123456"
                  className={inputClass(errors.latitude)}
                />
                {errors.latitude && <p className="text-red-500 text-xs mt-1 font-bold">{errors.latitude.message}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  {...register("longitude")}
                  placeholder="123.456789"
                  className={inputClass(errors.longitude)}
                />
                {errors.longitude && <p className="text-red-500 text-xs mt-1 font-bold">{errors.longitude.message}</p>}
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">
              Anda dapat menggunakan fitur GPS otomatis di atas, atau menyalin koordinat manual dari Google Maps (klik kanan pada peta).
            </p>
            
            <div className="mt-4">
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Link Google Maps (Opsional)</label>
              <input
                type="url"
                {...register("mapUrl")}
                placeholder="https://maps.app.goo.gl/..."
                className={inputClass(errors.mapUrl)}
              />
              {errors.mapUrl && <p className="text-red-500 text-xs mt-1 font-bold">{errors.mapUrl.message}</p>}
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
              {...register("status")}
              className={inputClass(errors.status)}
            >
              <option value="DRAFT">Draft (Sembunyikan)</option>
              <option value="PUBLISHED">Published (Tampilkan)</option>
            </select>
            {errors.status && <p className="text-red-500 text-xs mt-1 font-bold">{errors.status.message}</p>}
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center bg-navy hover:bg-navy/90 text-white px-8 py-4 rounded-full font-bold uppercase text-xs tracking-widest transition-all shadow-xl shadow-navy/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
                </span>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Simpan Titik Air
                </>
              )}
            </button>
          </div>
        </form>

        {initialData && initialData.createdAt && (
          <AuditTrailInfo
            createdBy={initialData.createdBy || null}
            updatedBy={initialData.updatedBy || null}
            createdAt={initialData.createdAt}
            updatedAt={initialData.updatedAt || initialData.createdAt}
          />
        )}
      </div>
    </div>
  );
}
