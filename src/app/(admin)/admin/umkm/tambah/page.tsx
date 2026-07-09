import { requireAdminSession } from "@/lib/auth-session";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import UmkmForm from "@/components/admin/UmkmForm";

export default async function TambahUmkmPage() {
  await requireAdminSession(["MANAGE_UMKM"]);

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/umkm"
        className="flex items-center text-sm font-bold text-slate-500 hover:text-[#0f172a] mb-6"
      >
        <ArrowLeft className="mr-2" size={16} /> KEMBALI
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-black text-[#0f172a] mb-6 uppercase tracking-tight">
          Tambah Produk UMKM
        </h1>

        <UmkmForm />
      </div>
    </div>
  );
}
