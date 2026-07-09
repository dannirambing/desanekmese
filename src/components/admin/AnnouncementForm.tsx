"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { announcementSchema, AnnouncementInput } from "@/lib/validations/pengumuman";
import { Save, ArrowLeft } from "lucide-react";
import ImagePickerField from "./ImagePickerField";
import { useState, useTransition } from "react";
import { createAnnouncement, updateAnnouncement } from "@/app/(admin)/admin/pengumuman/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AnnouncementFormProps {
  initialData?: AnnouncementInput & { id: string };
  initialImage?: string | null;
}

export default function AnnouncementForm({ initialData, initialImage }: AnnouncementFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnnouncementInput>({
    resolver: zodResolver(announcementSchema),
    defaultValues: initialData || {
      title: "",
      content: "",
      category: "Umum",
      status: "DRAFT",
    },
  });

  const onSubmit = async (data: AnnouncementInput) => {
    setServerError(null);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("category", data.category);
    formData.append("status", data.status);

    const imageUrl = (document.querySelector('input[name="imageUrl"]') as HTMLInputElement)?.value;
    const imageKey = (document.querySelector('input[name="imageKey"]') as HTMLInputElement)?.value;
    const removeImage = (document.querySelector('input[name="removeImage"]') as HTMLInputElement)?.value;

    if (imageUrl) formData.append("imageUrl", imageUrl);
    if (imageKey) formData.append("imageKey", imageKey);
    if (removeImage) formData.append("removeImage", removeImage);

    startTransition(async () => {
      let result;
      if (initialData?.id) {
        result = await updateAnnouncement(initialData.id, formData);
      } else {
        result = await createAnnouncement(formData);
      }

      if (result && !result.success) {
        setServerError(result.message || "Terjadi kesalahan saat menyimpan pengumuman.");
      }
    });
  };

  const inputClass = (error?: any) =>
    `w-full p-4 border rounded-xl font-bold focus:outline-none focus:ring-2 ${
      error ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-[#14b8a6]/40 text-[#0f172a]"
    }`;
  const labelClass = "block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2 tracking-widest";

  return (
    <div className="max-w-3xl w-full mx-auto">
      <Link
        href="/admin/pengumuman"
        className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-[#0f172a]/40 hover:text-[#0f172a] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-black text-[#0f172a] uppercase mb-8">
          {initialData ? "Ubah Pengumuman" : "Tambah Pengumuman"}
        </h1>

        {serverError && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl font-bold border border-red-200 text-sm mb-6">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <ImagePickerField
            currentImage={initialImage || null}
            label="Foto / Banner Pengumuman"
            title="Pilih Foto Pengumuman"
          />

          <div>
            <label className={labelClass}>Judul Pengumuman</label>
            <input {...register("title")} className={inputClass(errors.title)} placeholder="Masukkan judul pengumuman..." />
            {errors.title && <p className="text-red-500 text-xs mt-1 font-bold">{errors.title.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Isi Pengumuman</label>
            <textarea
              {...register("content")}
              rows={10}
              className={inputClass(errors.content)}
              placeholder="Tuliskan isi pengumuman secara detail..."
            />
            {errors.content && <p className="text-red-500 text-xs mt-1 font-bold">{errors.content.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Kategori Pengumuman</label>
            <select {...register("category")} className={inputClass(errors.category)}>
              <option value="Umum">Umum (General)</option>
              <option value="Layanan Publik">Layanan Publik (Administrasi KTP, KK, dll.)</option>
              <option value="Kegiatan Desa">Kegiatan Desa (Agenda & Program)</option>
              <option value="Pembangunan">Pembangunan (Infrastruktur)</option>
              <option value="Keuangan">Keuangan (Transparansi & APBDes)</option>
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1 font-bold">{errors.category.message}</p>}
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
            className="w-full bg-[#14b8a6] text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#0f172a] transition-all flex justify-center items-center disabled:opacity-50 cursor-pointer"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Menyimpan...
              </span>
            ) : (
              <>
                <Save className="mr-2" size={20} /> Simpan Pengumuman
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
