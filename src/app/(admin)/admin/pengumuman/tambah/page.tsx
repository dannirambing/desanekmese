import { requireAdminSession } from "@/lib/auth-session";
import ImagePickerField from "@/components/admin/ImagePickerField";
import { createAnnouncement } from "@/app/(admin)/admin/pengumuman/actions";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function TambahPengumumanPage() {
  await requireAdminSession(["MANAGE_PENGUMUMAN"]);

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/pengumuman"
        className="flex items-center text-sm font-bold text-slate-500 hover:text-[#0f172a] mb-6"
      >
        <ArrowLeft className="mr-2" size={16} /> KEMBALI
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-black text-[#0f172a] mb-6 uppercase tracking-tight">
          Tambah Pengumuman
        </h1>

        <form action={createAnnouncement} className="space-y-6">
          <ImagePickerField label="Foto / Banner Pengumuman" title="Pilih Foto Pengumuman" />

          <div>
            <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">
              Judul Pengumuman
            </label>
            <input
              type="text"
              name="title"
              required
              className="w-full p-4 border border-slate-200 rounded-xl font-bold"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
              Isi Pengumuman
            </label>
            <textarea
              name="content"
              rows={10}
              required
              className="w-full p-4 border border-slate-200 rounded-xl font-semibold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
              Kategori Pengumuman
            </label>
            <select
              name="category"
              defaultValue="Umum"
              className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] bg-white focus:ring-2 focus:ring-[#14b8a6] outline-none"
            >
              <option value="Umum">Umum (General)</option>
              <option value="Layanan Publik">Layanan Publik (Administrasi KTP, KK, dll.)</option>
              <option value="Kegiatan Desa">Kegiatan Desa (Agenda & Program)</option>
              <option value="Pembangunan">Pembangunan (Infrastruktur)</option>
              <option value="Keuangan">Keuangan (Transparansi & APBDes)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
              Status
            </label>
            <select
              name="status"
              defaultValue="DRAFT"
              className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] bg-white focus:ring-2 focus:ring-[#14b8a6] outline-none"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#14b8a6] text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#0f172a] transition-all flex justify-center items-center"
          >
            <Save className="mr-2" size={20} /> Simpan Pengumuman
          </button>
        </form>
      </div>
    </div>
  );
}
