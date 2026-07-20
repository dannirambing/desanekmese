import { requireAdminSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { updateCultureItem } from "@/app/(admin)/admin/budaya/actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { notFound } from "next/navigation";
import CultureForm from "@/components/admin/CultureForm";
import AuditTrailInfo from "@/components/admin/AuditTrailInfo";

export default async function EditBudayaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession(["MANAGE_BUDAYA"]);

  const { id } = await params;
  const [item, categories] = await Promise.all([
    prisma.cultureItem.findUnique({
      where: { id },
      include: { 
        media: { take: 1 },
        createdBy: { select: { name: true } },
        updatedBy: { select: { name: true } },
      },
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

        <CultureForm 
          initialData={{
            id: item.id,
            name: item.name,
            summary: item.summary,
            description: item.description,
            categoryId: item.categoryId,
            status: item.status,
            youtubeUrl: item.youtubeUrl,
          }}
          initialImage={currentMedia}
          categories={categories}
        />

        <AuditTrailInfo
          createdBy={item.createdBy}
          updatedBy={item.updatedBy}
          createdAt={item.createdAt}
          updatedAt={item.updatedAt}
        />
      </div>
    </div>
  );
}
