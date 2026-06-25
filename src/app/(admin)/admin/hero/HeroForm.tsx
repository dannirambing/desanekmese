"use client";

import { useState, useTransition } from "react";
import { Sliders, Save, ArrowLeft, Image as ImageIcon, Upload } from "lucide-react";
import Link from "next/link";
import { updateHeroSettings } from "./actions";
import ImagePickerModal from "@/components/admin/ImagePickerModal";

interface HeroSettings {
  imageUrl: string;
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  subTagline: string;
  description: string;
}

export default function HeroForm({ initialSettings }: { initialSettings: HeroSettings }) {
  const [imageUrl, setImageUrl] = useState(initialSettings.imageUrl);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await updateHeroSettings(formData);
      } catch (err: any) {
        setError(err.message || "Gagal menyimpan perubahan");
      }
    });
  };

  return (
    <div className="max-w-3xl w-full mx-auto">
      <Link
        href="/admin"
        className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-[#0f172a]/40 hover:text-[#0f172a] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Dashboard
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-teal-50 rounded-xl text-turquoise">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#0f172a] uppercase tracking-tight">
              Edit Hero Section
            </h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Ubah Konten Banner Utama Halaman Depan
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="block text-[10px] font-black uppercase text-[#0f172a]/70">
              Gambar Latar Hero Section
            </label>
            
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Preview Hero Background"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <ImageIcon className="w-8 h-8 mb-2" />
                  <span className="text-xs font-bold uppercase tracking-wider">Belum Ada Gambar</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsPickerOpen(true)}
                className="inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-[#0f172a] px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border border-slate-200 cursor-pointer"
              >
                <Upload className="w-4 h-4 mr-2" />
                Ubah Gambar Latar
              </button>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="inline-flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border border-red-100 cursor-pointer"
                >
                  Hapus
                </button>
              )}
            </div>

            <input type="hidden" name="imageUrl" value={imageUrl} />

            <ImagePickerModal
              open={isPickerOpen}
              onOpenChange={setIsPickerOpen}
              onSelect={(url) => setImageUrl(url)}
              title="Pilih Gambar Hero"
              description="Pilih gambar yang sudah ada dari galeri atau unggah baru untuk dijadikan latar belakang."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                Tagline Atas (Slogan)
              </label>
              <input
                name="tagline"
                required
                defaultValue={initialSettings.tagline}
                placeholder="Desa Nekmese, Timor · NTT"
                className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                Sub-Tagline Terjemahan
              </label>
              <input
                name="subTagline"
                required
                defaultValue={initialSettings.subTagline}
                placeholder="Satu Hati · Berjalan di Atas Batu dan Air"
                className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                Judul Baris 1
              </label>
              <input
                name="titleLine1"
                required
                defaultValue={initialSettings.titleLine1}
                placeholder="Nekaf Mese,"
                className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                Judul Baris 2 (Motto)
              </label>
              <input
                name="titleLine2"
                required
                defaultValue={initialSettings.titleLine2}
                placeholder="Atoni Meto Nao Fatu Nao Oe."
                className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
              Deskripsi Panjang
            </label>
            <textarea
              name="description"
              required
              rows={4}
              defaultValue={initialSettings.description}
              placeholder="Deskripsi singkat mengenai Desa..."
              className="w-full p-4 border border-slate-200 rounded-xl font-semibold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#14b8a6] text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#0f172a] transition-all flex justify-center items-center disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <Save className="mr-2" size={20} />
            {isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </div>
  );
}
