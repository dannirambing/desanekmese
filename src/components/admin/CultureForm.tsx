"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cultureSchema, CultureInput } from "@/lib/validations/budaya";
import { Save, Play } from "lucide-react";
import ImagePickerField from "./ImagePickerField";
import { useState, useTransition } from "react";
import { createCultureItem, updateCultureItem } from "@/app/(admin)/admin/budaya/actions";
import { getYouTubeEmbedUrl } from "@/lib/utils";

interface CultureFormProps {
  initialData?: CultureInput & { id: string };
  initialImage?: { url: string; publicId: string; id: string } | null;
  categories: { id: string; name: string }[];
}

export default function CultureForm({ initialData, initialImage, categories }: CultureFormProps) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CultureInput>({
    resolver: zodResolver(cultureSchema),
    defaultValues: {
      name: initialData?.name || "",
      summary: initialData?.summary || "",
      description: initialData?.description || "",
      categoryId: initialData?.categoryId || "",
      status: initialData?.status || "DRAFT",
      youtubeUrl: initialData?.youtubeUrl || "",
    },
  });

  const watchYoutubeUrl = watch("youtubeUrl");

  const onSubmit = async (data: CultureInput) => {
    setServerError(null);
    
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.summary) formData.append("summary", data.summary);
    formData.append("description", data.description);
    formData.append("categoryId", data.categoryId);
    formData.append("status", data.status);
    if (data.youtubeUrl) formData.append("youtubeUrl", data.youtubeUrl);

    const imageUrl = (document.querySelector('input[name="imageUrl"]') as HTMLInputElement)?.value;
    const imageKey = (document.querySelector('input[name="imageKey"]') as HTMLInputElement)?.value;
    const removeImage = (document.querySelector('input[name="removeImage"]') as HTMLInputElement)?.value;

    if (imageUrl) formData.append("imageUrl", imageUrl);
    if (imageKey) formData.append("imageKey", imageKey);
    if (removeImage) formData.append("removeImage", removeImage);

    startTransition(async () => {
      let result;
      if (initialData?.id) {
        result = await updateCultureItem(initialData.id, formData);
      } else {
        result = await createCultureItem(formData);
      }

      if (!result.success) {
        setServerError(result.message || "Terjadi kesalahan saat menyimpan konten.");
      }
    });
  };

  const inputClass = (error?: unknown) => `w-full p-4 border rounded-xl font-bold focus:outline-none focus:ring-2 ${error ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-[#14b8a6]/40 text-[#0f172a]"}`;
  const labelClass = "block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2 tracking-widest";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl font-bold border border-red-200 text-sm">
          {serverError}
        </div>
      )}

      <ImagePickerField 
        label="Foto Budaya" 
        title="Pilih Foto Budaya" 
        currentImage={initialImage?.url || null} 
      />

      <div>
        <label className={labelClass}>Nama / Judul</label>
        <input {...register("name")} className={inputClass(errors.name)} />
        {errors.name && <p className="text-red-500 text-xs mt-1 font-bold">{errors.name.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Ringkasan Singkat</label>
        <input {...register("summary")} placeholder="Deskripsi singkat untuk kartu" className={inputClass(errors.summary)} />
        {errors.summary && <p className="text-red-500 text-xs mt-1 font-bold">{errors.summary.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Kategori Budaya</label>
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
        <label className={labelClass}>Tautan Video YouTube (Opsional)</label>
        <input 
          {...register("youtubeUrl")} 
          placeholder="Contoh: https://www.youtube.com/watch?v=... atau https://youtu.be/..." 
          className={inputClass(errors.youtubeUrl)} 
        />
        {errors.youtubeUrl && <p className="text-red-500 text-xs mt-1 font-bold">{errors.youtubeUrl.message}</p>}
        
        {/* Live Preview Video */}
        {watchYoutubeUrl && getYouTubeEmbedUrl(watchYoutubeUrl) && (
          <div className="mt-3 bg-stone-50 border border-slate-200/80 rounded-xl p-4 shadow-sm">
            <p className="text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest flex items-center gap-1.5">
              <Play className="text-amber-500 animate-pulse fill-current ml-0.5" size={12} /> Pratinjau Video YouTube
            </p>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black shadow-inner">
              <iframe
                src={getYouTubeEmbedUrl(watchYoutubeUrl) || ""}
                title="Pratinjau YouTube"
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
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
            <Save className="mr-2" size={20} /> Simpan Konten Budaya
          </>
        )}
      </button>
    </form>
  );
}
