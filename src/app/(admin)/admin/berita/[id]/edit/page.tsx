import { requireAdminSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import BeritaForm from "@/components/admin/BeritaForm";
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

        <BeritaForm 
          initialData={{
            id: article.id,
            title: article.title,
            summary: article.summary,
            content: article.content,
            status: article.status,
          }}
          initialMedia={currentMedia}
        />

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
