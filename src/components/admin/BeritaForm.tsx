"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsArticleSchema, NewsArticleInput } from "@/lib/validations/berita";
import { Save, Loader2 } from "lucide-react";
import ImagePickerField from "./ImagePickerField";
import { useState, useTransition } from "react";
import { createNewsArticle, updateNewsArticle } from "@/app/(admin)/admin/berita/actions";
import { useRouter } from "next/navigation";

interface BeritaFormProps {
  initialData?: NewsArticleInput & { id: string };
  initialMedia?: { id: string; url: string; publicId: string } | null;
}

export default function BeritaForm({ initialData, initialMedia }: BeritaFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewsArticleInput>({
    resolver: zodResolver(newsArticleSchema),
    defaultValues: initialData || {
      title: "",
      summary: "",
      content: "",
      status: "DRAFT",
    },
  });

  const onSubmit = async (data: NewsArticleInput) => {
    setServerError(null);
    
    // Convert to FormData
    const formData = new FormData();
    formData.append("title", data.title);
    if (data.summary) formData.append("summary", data.summary);
    formData.append("content", data.content);
    formData.append("status", data.status);

    // Get image data from the DOM (since ImagePickerField uses hidden inputs)
    const imageUrl = (document.querySelector('input[name="imageUrl"]') as HTMLInputElement)?.value;
    const imageKey = (document.querySelector('input[name="imageKey"]') as HTMLInputElement)?.value;
    const removeImage = (document.querySelector('input[name="removeImage"]') as HTMLInputElement)?.value;

    if (imageUrl) formData.append("imageUrl", imageUrl);
    if (imageKey) formData.append("imageKey", imageKey);
    if (removeImage) formData.append("removeImage", removeImage);

    startTransition(async () => {
      let result;
      if (initialData?.id) {
        result = await updateNewsArticle(initialData.id, formData);
      } else {
        result = await createNewsArticle(formData);
      }

      if (!result.success) {
        setServerError(result.message || "Terjadi kesalahan.");
      }
      // If success, the Server Action handles the redirect.
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl font-bold border border-red-200 text-sm">
          {serverError}
        </div>
      )}

      <ImagePickerField 
        label="Foto Berita" 
        title="Pilih Foto Berita" 
        currentImage={initialMedia?.url || null} 
      />

      <div>
        <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">
          Judul Berita
        </label>
        <input
          {...register("title")}
          className={`w-full p-4 border rounded-xl font-bold focus:outline-none focus:ring-2 ${
            errors.title ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-turquoise/40"
          }`}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1 font-bold">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
          Ringkasan Singkat
        </label>
        <input
          {...register("summary")}
          placeholder="Deskripsi singkat untuk preview"
          className={`w-full p-4 border rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:ring-2 ${
            errors.summary ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-turquoise/40"
          }`}
        />
        {errors.summary && <p className="text-red-500 text-xs mt-1 font-bold">{errors.summary.message}</p>}
      </div>

      <div>
        <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
          Isi Berita
        </label>
        <textarea
          {...register("content")}
          rows={10}
          className={`w-full p-4 border rounded-xl font-semibold text-[#0f172a] focus:outline-none focus:ring-2 ${
            errors.content ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-turquoise/40"
          }`}
        />
        {errors.content && <p className="text-red-500 text-xs mt-1 font-bold">{errors.content.message}</p>}
      </div>

      <div>
        <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
          Status
        </label>
        <select
          {...register("status")}
          className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] bg-white focus:outline-none focus:ring-2 focus:ring-turquoise/40"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
        {errors.status && <p className="text-red-500 text-xs mt-1 font-bold">{errors.status.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#14b8a6] text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#0f172a] transition-all flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? <Loader2 className="mr-2 animate-spin" size={20} /> : <Save className="mr-2" size={20} />}
        {isPending ? "Menyimpan..." : "Simpan Berita"}
      </button>
    </form>
  );
}
