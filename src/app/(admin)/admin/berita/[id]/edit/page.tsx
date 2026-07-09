import { requireAdminSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { updateNewsArticle } from "@/app/(admin)/admin/berita/actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { notFound } from "next/navigation";
import ImagePickerField from "@/components/admin/ImagePickerField";
import AuditTrailInfo from "@/components/admin/AuditTrailInfo";

export default async function EditBeritaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession(["MANAGE_BERITA"]);

  const { id } = await params;
  const article = await prisma.newsArticle.findUnique({
    where: { id },
    include: { 
      media: { take: 1 },
      createdBy: { select: { name: true } },
      updatedBy: { select: { name: true } },
    },
  });

  if (!article) notFound();

  const currentMedia = article.media[0] ?? null;
  const updateArticleWithId = updateNewsArticle.bind(null, article.id);

  return (
    <div className="max-w-3xl w-full mx-auto">
      <Link
        href="/admin/berita"
        className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-[#0f172a]/40 hover:text-[#0f172a] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-black text-[#0f172a] uppercase mb-8">
          Ubah Berita
        </h1>

        <form action={updateArticleWithId} className="space-y-6">
          <ImagePickerField
            currentImage={currentMedia?.url ?? null}
            label="Foto Berita"
            title="Pilih Foto Berita"
          />

          <div>
            <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
              Judul Berita
            </label>
            <input
              name="title"
              defaultValue={article.title}
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
              defaultValue={article.summary ?? ""}
              className="w-full p-4 border border-slate-200 rounded-xl font-semibold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
              Isi Berita
            </label>
            <textarea
              name="content"
              rows={10}
              defaultValue={article.content}
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
              defaultValue={article.status}
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

        <AuditTrailInfo
          createdBy={article.createdBy}
          updatedBy={article.updatedBy}
          createdAt={article.createdAt}
          updatedAt={article.updatedAt}
        />
      </div>
    </div>
  );
}
