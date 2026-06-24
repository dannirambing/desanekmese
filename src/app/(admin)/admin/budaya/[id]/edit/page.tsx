import { prisma } from "@/lib/prisma";
import { updateCultureItem } from "@/app/(admin)/admin/budaya/actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { notFound } from "next/navigation";
import EditImageUpload from "@/components/admin/EditImageUpload";

export default async function EditBudayaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, categories] = await Promise.all([
    prisma.cultureItem.findUnique({
      where: { id },
      include: { media: { take: 1 } },
    }),
    prisma.cultureCategory.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!item) notFound();

  const currentMedia = item.media[0] ?? null;
  const updateItemWithId = updateCultureItem.bind(null, item.id);

  return (
    <div className="max-w-3xl w-full mx-auto">
      <Link
        href="/admin/budaya"
        className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-[#0f172a]/40 hover:text-[#0f172a] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-black text-[#0f172a] uppercase mb-8">
          Ubah Konten Budaya
        </h1>

        <form action={updateItemWithId} className="space-y-6">
          <EditImageUpload
            currentImage={currentMedia?.url ?? null}
            currentMediaId={currentMedia?.id ?? null}
          />

          <div>
            <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
              Nama / Judul
            </label>
            <input
              name="name"
              defaultValue={item.name}
              required
              className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
              Ringkasan Singkat
            </label>
            <input
              name="summary"
              defaultValue={item.summary ?? ""}
              className="w-full p-4 border border-slate-200 rounded-xl font-semibold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
              Kategori Budaya
            </label>
            <select
              name="categoryId"
              defaultValue={item.categoryId}
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

          <div>
            <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
              Deskripsi Lengkap
            </label>
            <textarea
              name="description"
              rows={6}
              defaultValue={item.description}
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
              defaultValue={item.status}
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
