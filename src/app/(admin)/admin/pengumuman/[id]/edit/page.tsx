import { prisma } from "@/lib/prisma";
import { updateAnnouncement } from "@/app/(admin)/admin/pengumuman/actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { notFound } from "next/navigation";
import ImagePickerField from "@/components/admin/ImagePickerField";

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const announcement = await prisma.announcement.findUnique({
    where: { id },
  });

  if (!announcement) notFound();

  const updateAnnouncementWithId = updateAnnouncement.bind(null, announcement.id);

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
          Ubah Pengumuman
        </h1>

        <form action={updateAnnouncementWithId} className="space-y-6">
          <ImagePickerField
            currentImage={announcement.imageUrl}
            label="Foto / Banner Pengumuman"
            title="Pilih Foto Pengumuman"
          />

          <div>
            <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
              Judul Pengumuman
            </label>
            <input
              name="title"
              defaultValue={announcement.title}
              required
              className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
              Isi Pengumuman
            </label>
            <textarea
              name="content"
              rows={10}
              defaultValue={announcement.content}
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
              defaultValue={announcement.category}
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
              defaultValue={announcement.status}
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
