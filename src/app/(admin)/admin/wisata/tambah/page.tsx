import { requireAdminSession } from "@/lib/auth-session";
import TourismForm from "@/components/admin/TourismForm";
import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function TambahWisataPage() {
  await requireAdminSession(["MANAGE_WISATA"]);

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

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

        <TourismForm categories={categories} />
      </div>
    </div>
  );
}
