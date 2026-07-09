import { requireAdminSession } from "@/lib/auth-session";
import CultureForm from "@/components/admin/CultureForm";
import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
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

        <CultureForm categories={categories} />
      </div>
    </div>
  );
}
