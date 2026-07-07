"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Scale } from "lucide-react";
import Link from "next/link";
import DocumentUpload from "@/components/admin/DocumentUpload";
import AuditTrailInfo from "@/components/admin/AuditTrailInfo";
import { RegulationType } from "@prisma/client";

interface RegulationFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<any>;
}

export default function RegulationForm({ initialData, onSubmit }: RegulationFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [fileUrl, setFileUrl] = useState<string>(initialData?.fileUrl || "");
  const [fileKey, setFileKey] = useState<string>(initialData?.fileKey || "");

  const [title, setTitle] = useState(initialData?.title || "");
  const [number, setNumber] = useState(initialData?.number || "");
  const [year, setYear] = useState(initialData?.year || new Date().getFullYear());
  const [type, setType] = useState<RegulationType>(initialData?.type || "PERATURAN_DESA");
  const [description, setDescription] = useState(initialData?.description || "");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(initialData?.status || "DRAFT");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Judul peraturan wajib diisi.");
      return;
    }
    if (!number.trim()) {
      setError("Nomor peraturan wajib diisi.");
      return;
    }
    if (!year) {
      setError("Tahun peraturan wajib diisi.");
      return;
    }
    if (!fileUrl) {
      setError("File dokumen PDF peraturan wajib diunggah.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await onSubmit({
          title,
          number,
          year: parseInt(year.toString()),
          type,
          description,
          fileUrl,
          fileKey,
          status,
        });

        if (res && res.error) {
          setError(res.error);
        } else {
          router.push("/admin/peraturan");
        }
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat menyimpan data.");
      }
    });
  };

  const getSuggestedFileName = () => {
    let prefix = "Peraturan";
    if (type === "PERATURAN_DESA") prefix = "Perdes";
    else if (type === "KEPUTUSAN_KEPALA_DESA") prefix = "SK-Kades";
    else if (type === "PERATURAN_BERSAMA") prefix = "Peraturan-Bersama";

    const cleanNumber = number.replace(/[/\\?%*:|"<> ]/g, "-");
    const cleanTitle = title.replace(/[/\\?%*:|"<> ]/g, "_").substring(0, 50);
    return `${prefix}_No_${cleanNumber}_Tahun_${year}_${cleanTitle}`;
  };

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

        {error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nomor Peraturan */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-navy/70">
                Nomor Peraturan / Surat Keputusan
              </label>
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Contoh: 02/2025"
                required
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/40 focus:border-turquoise bg-slate-50/50"
              />
            </div>

            {/* Tahun Peraturan */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-navy/70">
                Tahun
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value) || new Date().getFullYear())}
                placeholder="Contoh: 2025"
                required
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/40 focus:border-turquoise bg-slate-50/50"
              />
            </div>
          </div>

          {/* Judul Peraturan */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-navy/70">
              Judul Peraturan / Ketetapan
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Kebersihan Lingkungan dan Ketertiban Umum"
              required
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/40 focus:border-turquoise bg-slate-50/50"
            />
          </div>

          {/* Jenis Peraturan & Status Publikasi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-navy/70">
                Jenis Dokumen Hukum
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as RegulationType)}
                className="w-full border border-slate-200 bg-slate-50/50 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-turquoise/40 focus:border-turquoise cursor-pointer"
              >
                <option value="PERATURAN_DESA">Peraturan Desa (Perdes)</option>
                <option value="KEPUTUSAN_KEPALA_DESA">Keputusan Kepala Desa</option>
                <option value="PERATURAN_BERSAMA">Peraturan Bersama Kepala Desa</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-navy/70">
                Status Publikasi
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
                className="w-full border border-slate-200 bg-slate-50/50 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-turquoise/40 focus:border-turquoise cursor-pointer"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>

          {/* Deskripsi/Ringkasan */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-navy/70">
              Ringkasan / Deskripsi Peraturan
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Masukkan ringkasan atau pokok pikiran peraturan desa..."
              rows={4}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/40 focus:border-turquoise bg-slate-50/50"
            />
          </div>

          {/* Pengunggah File PDF */}
          <DocumentUpload
            initialUrl={fileUrl}
            initialKey={fileKey}
            suggestedName={getSuggestedFileName()}
            onUploadComplete={(url, key) => {
              setFileUrl(url);
              setFileKey(key);
            }}
            onRemove={() => {
              setFileUrl("");
              setFileKey("");
            }}
          />

          {/* Audit Trail */}
          {initialData && (
            <AuditTrailInfo
              createdBy={initialData.createdBy}
              updatedBy={initialData.updatedBy}
              createdAt={initialData.createdAt}
              updatedAt={initialData.updatedAt}
            />
          )}

          {/* Tombol Simpan */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-navy text-white hover:bg-navy/90 p-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isPending ? "Menyimpan..." : "Simpan Peraturan"}
          </button>
        </form>
      </div>
    </div>
  );
}
