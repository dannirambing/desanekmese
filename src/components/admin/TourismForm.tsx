"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tourismSchema, TourismInput } from "@/lib/validations/wisata";
import { Save } from "lucide-react";
import ImagePickerField from "./ImagePickerField";
import { useState, useTransition } from "react";
import { createTourismPlace, updateTourismPlace } from "@/app/(admin)/admin/wisata/actions";
import { useRouter } from "next/navigation";

interface TourismFormProps {
  initialData?: TourismInput & { id: string };
  initialImage?: { url: string; publicId: string; id: string } | null;
  categories: { id: string; name: string }[];
}

export default function TourismForm({ initialData, initialImage, categories }: TourismFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TourismInput>({
    resolver: zodResolver(tourismSchema),
    defaultValues: initialData || {
      name: "",
      location: "",
      description: "",
      categoryId: "",
      status: "DRAFT",
      facilities: "",
      mapUrl: "",
      openHours: "",
    },
  });

  const onSubmit = async (data: TourismInput) => {
    setServerError(null);
    
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("location", data.location);
    formData.append("description", data.description);
    formData.append("categoryId", data.categoryId);
    formData.append("status", data.status);
    if (data.facilities) formData.append("facilities", data.facilities);
    if (data.mapUrl) formData.append("mapUrl", data.mapUrl);
    if (data.openHours) formData.append("openHours", data.openHours);

    const imageUrl = (document.querySelector('input[name="imageUrl"]') as HTMLInputElement)?.value;
    const imageKey = (document.querySelector('input[name="imageKey"]') as HTMLInputElement)?.value;
    const removeImage = (document.querySelector('input[name="removeImage"]') as HTMLInputElement)?.value;

    if (imageUrl) formData.append("imageUrl", imageUrl);
    if (imageKey) formData.append("imageKey", imageKey);
    if (removeImage) formData.append("removeImage", removeImage);

    startTransition(async () => {
      let result;
      if (initialData?.id) {
        result = await updateTourismPlace(initialData.id, formData);
      } else {
        result = await createTourismPlace(formData);
      }

      if (!result.success) {
        setServerError(result.message || "Terjadi kesalahan saat menyimpan konten.");
      }
    });
  };

  const inputClass = (error?: any) => `w-full p-4 border rounded-xl font-bold focus:outline-none focus:ring-2 ${error ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-[#14b8a6]/40 text-[#0f172a]"}`;
  const labelClass = "block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2 tracking-widest";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl font-bold border border-red-200 text-sm">
          {serverError}
        </div>
      )}

      <ImagePickerField 
        label="Foto Destinasi" 
        title="Pilih Foto Wisata" 
        currentImage={initialImage?.url || null} 
      />

      <div>
        <label className={labelClass}>Nama Destinasi</label>
        <input {...register("name")} className={inputClass(errors.name)} />
        {errors.name && <p className="text-red-500 text-xs mt-1 font-bold">{errors.name.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Lokasi</label>
        <input {...register("location")} className={inputClass(errors.location)} />
        {errors.location && <p className="text-red-500 text-xs mt-1 font-bold">{errors.location.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Kategori Wisata</label>
        <select {...register("categoryId")} className={inputClass(errors.categoryId)}>
          <option value="">Pilih Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && <p className="text-red-500 text-xs mt-1 font-bold">{errors.categoryId.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Deskripsi Lengkap</label>
        <textarea {...register("description")} rows={6} className={inputClass(errors.description)} />
        {errors.description && <p className="text-red-500 text-xs mt-1 font-bold">{errors.description.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Fasilitas (Pisahkan dengan koma)</label>
        <input {...register("facilities")} placeholder="Toilet, Area Parkir, Gazebo" className={inputClass(errors.facilities)} />
        {errors.facilities && <p className="text-red-500 text-xs mt-1 font-bold">{errors.facilities.message}</p>}
      </div>

      <div>
        <label className={labelClass}>URL Google Maps</label>
        <input {...register("mapUrl")} placeholder="https://goo.gl/maps/..." className={inputClass(errors.mapUrl)} />
        {errors.mapUrl && <p className="text-red-500 text-xs mt-1 font-bold">{errors.mapUrl.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Jam Buka</label>
        <input {...register("openHours")} placeholder="08:00 - 17:00" className={inputClass(errors.openHours)} />
        {errors.openHours && <p className="text-red-500 text-xs mt-1 font-bold">{errors.openHours.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Status</label>
        <select {...register("status")} className={inputClass(errors.status)}>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
        {errors.status && <p className="text-red-500 text-xs mt-1 font-bold">{errors.status.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#14b8a6] text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#0f172a] transition-all flex justify-center items-center disabled:opacity-50"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            Menyimpan...
          </span>
        ) : (
          <>
            <Save className="mr-2" size={20} /> Simpan Destinasi
          </>
        )}
      </button>
    </form>
  );
}
