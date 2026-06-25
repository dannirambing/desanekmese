import { prisma } from "@/lib/prisma";
import { updateTourismPlace } from "@/app/(admin)/admin/wisata/actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { notFound } from "next/navigation";
import ImagePickerField from "@/components/admin/ImagePickerField";

export default async function EditWisataPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [place, categories] = await Promise.all([
    prisma.tourismPlace.findUnique({
      where: { id },
      include: { media: { take: 1 } },
    }),
    prisma.category.findMany(),
  ]);

  if (!place) notFound();

  const currentMedia = place.media[0] ?? null;
  const updatePlaceWithId = updateTourismPlace.bind(null, place.id);

  return (
    <div className="max-w-3xl w-full mx-auto">
      <Link
        href="/admin/wisata"
        className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-[#0f172a]/40 hover:text-[#0f172a] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-black text-[#0f172a] uppercase mb-8">
          Ubah Data Destinasi
        </h1>

        <form action={updatePlaceWithId} className="space-y-6">
          <ImagePickerField
            currentImage={currentMedia?.url ?? null}
            label="Foto Destinasi"
            title="Pilih Foto Wisata"
          />

          <div>
            <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
              Nama Destinasi
            </label>
            <input
              name="name"
              defaultValue={place.name}
              required
              className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                Lokasi
              </label>
              <input
                name="location"
                defaultValue={place.location}
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
                defaultValue={place.categoryId}
                required
                className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] bg-white focus:ring-2 focus:ring-[#14b8a6] outline-none"
              >
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
              defaultValue={place.description}
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
              defaultValue={place.facilities.join(", ")}
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
              defaultValue={place.status}
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
            <Save className="mr-2" size={20} /> Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
}
