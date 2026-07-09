import { requireAdminSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import AuditTrailInfo from "@/components/admin/AuditTrailInfo";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import UmkmForm from "@/components/admin/UmkmForm";

export default async function EditUmkmPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession(["MANAGE_UMKM"]);

  const { id } = await params;
  const product = await prisma.productUMKM.findUnique({ 
    where: { id },
    include: {
      createdBy: { select: { name: true } },
      updatedBy: { select: { name: true } },
    }
  });

  if (!product) notFound();

  return (
    <div className="max-w-3xl w-full mx-auto">
      <Link
        href="/admin/umkm"
        className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-[#0f172a]/40 hover:text-[#0f172a] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-black text-[#0f172a] uppercase mb-8">
          Ubah Produk UMKM
        </h1>

        <UmkmForm 
          initialData={product}
          initialImage={product.imageUrl}
        />

        <AuditTrailInfo
          createdBy={product.createdBy}
          updatedBy={product.updatedBy}
          createdAt={product.createdAt}
          updatedAt={product.updatedAt}
        />
      </div>
    </div>
  );
}
