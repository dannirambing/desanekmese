import { requireAdminSession } from "@/lib/auth-session";
import ImagePickerField from "@/components/admin/ImagePickerField";
import { createCultureItem } from "@/app/(admin)/admin/budaya/actions";
import { prisma } from "@/lib/prisma";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function TambahBudayaPage() {
  await requireAdminSession(["MANAGE_BUDAYA"]);

  const categories = await prisma.cultureCategory.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/budaya"
        className="flex items-center text-sm font-bold text-slate-500 hover:text-[#0f172a] mb-6"
      >
        <ArrowLeft className="mr-2" size={16} /> KEMBALI
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-black text-[#0f172a] mb-6 uppercase tracking-tight">
          Tambah Konten Budaya
        </h1>

        <form action={createCultureItem} className="space-y-6">
          <ImagePickerField label="Foto Budaya" title="Pilih Foto Budaya" />

          <div>
            <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">
              Nama / Judul
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full p-4 border border-slate-200 rounded-xl font-bold"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
              Ringkasan Singkat
            </label>
            <input
              name="summary"
              placeholder="Deskripsi singkat untuk kartu dan preview"
              className="w-full p-4 border border-slate-200 rounded-xl font-semibold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
              Kategori Budaya
            </label>
            <select
              name="categoryId"
              required
              className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] bg-white focus:ring-2 focus:ring-[#14b8a6] outline-none"
            >
              <option value="">Pilih kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <p className="text-xs text-amber-600 mt-2 font-semibold">
                Belum ada kategori. Jalankan seed database terlebih dahulu.
              </p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
              Deskripsi Lengkap
            </label>
            <textarea
              name="description"
              rows={6}
              required
              className="w-full p-4 border border-slate-200 rounded-xl font-semibold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
            />
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
            <Save className="mr-2" size={20} /> Simpan Konten Budaya
          </button>
        </form>
      </div>
    </div>
  );
}
