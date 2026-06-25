import ImagePickerField from "@/components/admin/ImagePickerField";
import { createTourismPlace } from "@/app/(admin)/admin/wisata/actions";
import { prisma } from "@/lib/prisma";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function TambahWisataPage() {
  const categories = await prisma.category.findMany();

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/wisata"
        className="flex items-center text-sm font-bold text-slate-500 hover:text-[#0f172a] mb-6"
      >
        <ArrowLeft className="mr-2" size={16} /> KEMBALI
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-black text-[#0f172a] mb-6 uppercase tracking-tight">
          Tambah Destinasi Baru
        </h1>

        <form action={createTourismPlace} className="space-y-6">
          <ImagePickerField label="Foto Destinasi" title="Pilih Foto Wisata" />

          <div>
            <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">
              Nama Wisata
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full p-4 border border-slate-200 rounded-xl font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                Lokasi
              </label>
              <input
                name="location"
                required
                className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                Kategori
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
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
              Deskripsi
            </label>
            <textarea
              name="description"
              rows={5}
              required
              className="w-full p-4 border border-slate-200 rounded-xl font-semibold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
              Fasilitas (pisahkan dengan koma)
            </label>
            <input
              name="facilities"
              placeholder="Contoh: Gazebo, Toilet, Spot Foto, Area Parkir"
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
            <Save className="mr-2" size={20} /> Simpan Destinasi
          </button>
        </form>
      </div>
    </div>
  );
}
