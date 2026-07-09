"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Scale } from "lucide-react";
import Link from "next/link";
import DocumentUpload from "@/components/admin/DocumentUpload";
import AuditTrailInfo from "@/components/admin/AuditTrailInfo";
import { RegulationType, VillageRegulation } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { regulationSchema, RegulationInput } from "@/lib/validations/peraturan";

interface RegulationFormProps {
  initialData?: Partial<VillageRegulation> & {
    createdBy?: { name: string | null } | null;
    updatedBy?: { name: string | null } | null;
  };
  onSubmit: (formData: FormData) => Promise<any>;
}

export default function RegulationForm({ initialData, onSubmit }: RegulationFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegulationInput>({
    resolver: zodResolver(regulationSchema) as any,
    defaultValues: {
      title: initialData?.title || "",
      number: initialData?.number || "",
      year: initialData?.year || new Date().getFullYear(),
      type: initialData?.type || "PERATURAN_DESA",
      description: initialData?.description || "",
      status: initialData?.status || "DRAFT",
      fileUrl: initialData?.fileUrl || "",
      fileKey: initialData?.fileKey || "",
    },
  });

  const watchTitle = watch("title");
  const watchNumber = watch("number");
  const watchYear = watch("year");
  const watchType = watch("type");
  const watchFileUrl = watch("fileUrl");
  const watchFileKey = watch("fileKey");

  const handleFormSubmit = async (data: RegulationInput) => {
    setServerError(null);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("number", data.number);
    formData.append("year", data.year.toString());
    formData.append("type", data.type);
    if (data.description) formData.append("description", data.description);
    formData.append("fileUrl", data.fileUrl);
    if (data.fileKey) formData.append("fileKey", data.fileKey);
    formData.append("status", data.status);

    startTransition(async () => {
      const res = await onSubmit(formData);
      if (res && !res.success) {
        setServerError(res.message || "Gagal menyimpan peraturan desa.");
      } else {
        router.push("/admin/peraturan");
      }
    });
  };

  const getSuggestedFileName = () => {
    let prefix = "Peraturan";
    if (watchType === "PERATURAN_DESA") prefix = "Perdes";
    else if (watchType === "KEPUTUSAN_KEPALA_DESA") prefix = "SK-Kades";
    else if (watchType === "PERATURAN_BERSAMA") prefix = "Peraturan-Bersama";

    const cleanNumber = (watchNumber || "").replace(/[/\\?%*:|"<> ]/g, "-");
    const cleanTitle = (watchTitle || "").replace(/[/\\?%*:|"<> ]/g, "_").substring(0, 50);
    return `${prefix}_No_${cleanNumber}_Tahun_${watchYear || new Date().getFullYear()}_${cleanTitle}`;
  };

  const inputClass = (error?: any) =>
    `w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/40 focus:border-turquoise bg-slate-50/50 ${
      error ? "border-red-400 focus:ring-red-200" : ""
    }`;

  return (
    <div className="max-w-3xl w-full mx-auto pb-16">
      <Link
        href="/admin/peraturan"
        className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-navy/40 hover:text-navy mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar Peraturan
      </Link>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-turquoise/10 rounded-xl text-turquoise">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-navy uppercase tracking-tight">
              {initialData ? "Edit Peraturan Desa" : "Tambah Peraturan Desa"}
            </h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Kelola dokumen hukum dan keputusan resmi Desa Nekmese
            </p>
          </div>
        </div>

        {serverError && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-semibold">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nomor Peraturan */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-navy/70">
                Nomor Peraturan / Surat Keputusan
              </label>
              <input
                type="text"
                {...register("number")}
                placeholder="Contoh: 02/2025"
                className={inputClass(errors.number)}
              />
              {errors.number && <p className="text-red-500 text-xs font-bold">{errors.number.message}</p>}
            </div>

            {/* Tahun Peraturan */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-navy/70">
                Tahun
              </label>
              <input
                type="number"
                {...register("year")}
                placeholder="Contoh: 2025"
                className={inputClass(errors.year)}
              />
              {errors.year && <p className="text-red-500 text-xs font-bold">{errors.year.message}</p>}
            </div>
          </div>

          {/* Judul Peraturan */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-navy/70">
              Judul Peraturan / Ketetapan
            </label>
            <input
              type="text"
              {...register("title")}
              placeholder="Contoh: Kebersihan Lingkungan dan Ketertiban Umum"
              className={inputClass(errors.title)}
            />
            {errors.title && <p className="text-red-500 text-xs font-bold">{errors.title.message}</p>}
          </div>

          {/* Jenis Peraturan & Status Publikasi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-navy/70">
                Jenis Dokumen Hukum
              </label>
              <select
                {...register("type")}
                className="w-full border border-slate-200 bg-slate-50/50 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-turquoise/40 focus:border-turquoise cursor-pointer"
              >
                <option value="PERATURAN_DESA">Peraturan Desa (Perdes)</option>
                <option value="KEPUTUSAN_KEPALA_DESA">Keputusan Kepala Desa</option>
                <option value="PERATURAN_BERSAMA">Peraturan Bersama Kepala Desa</option>
              </select>
              {errors.type && <p className="text-red-500 text-xs font-bold">{errors.type.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-navy/70">
                Status Publikasi
              </label>
              <select
                {...register("status")}
                className="w-full border border-slate-200 bg-slate-50/50 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-turquoise/40 focus:border-turquoise cursor-pointer"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
              {errors.status && <p className="text-red-500 text-xs font-bold">{errors.status.message}</p>}
            </div>
          </div>

          {/* Deskripsi/Ringkasan */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-navy/70">
              Ringkasan / Deskripsi Peraturan
            </label>
            <textarea
              {...register("description")}
              placeholder="Masukkan ringkasan atau pokok pikiran peraturan desa..."
              rows={4}
              className={inputClass(errors.description)}
            />
            {errors.description && <p className="text-red-500 text-xs font-bold">{errors.description.message}</p>}
          </div>

          {/* Pengunggah File PDF */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-navy/70">
              File Dokumen (PDF)
            </label>
            <DocumentUpload
              initialUrl={watchFileUrl || ""}
              initialKey={watchFileKey || ""}
              suggestedName={getSuggestedFileName()}
              onUploadComplete={(url, key) => {
                setValue("fileUrl", url, { shouldValidate: true });
                setValue("fileKey", key || null, { shouldValidate: true });
              }}
              onRemove={() => {
                setValue("fileUrl", "", { shouldValidate: true });
                setValue("fileKey", "", { shouldValidate: true });
              }}
            />
            {errors.fileUrl && <p className="text-red-500 text-xs font-bold mt-1">{errors.fileUrl.message}</p>}
          </div>

          {/* Audit Trail */}
          {initialData && initialData.createdAt && (
            <AuditTrailInfo
              createdBy={initialData.createdBy || null}
              updatedBy={initialData.updatedBy || null}
              createdAt={initialData.createdAt}
              updatedAt={initialData.updatedAt || initialData.createdAt}
            />
          )}

          {/* Tombol Simpan */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-navy text-white hover:bg-navy/90 p-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Menyimpan...
              </span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Simpan Peraturan
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
