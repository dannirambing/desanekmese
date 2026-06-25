import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Edit, Plus, Users, User } from "lucide-react";
import DeleteForm from "./DeleteForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPenggunaPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  const admins = await prisma.admin.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="w-full">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-navy tracking-tight uppercase">
            Kelola Pengguna
          </h1>
          <p className="text-sm text-navy/60 font-medium mt-1">
            Manajemen akses administrator desa.
          </p>
        </div>
        <Link 
          href="/admin/pengguna/tambah" 
          className="inline-flex items-center justify-center bg-turquoise hover:bg-turquoise/90 text-black px-6 py-3 rounded-full font-bold text-xs tracking-widest uppercase transition-all shadow-md shadow-turquoise/10"
        >
          <Plus className="w-4 h-4 mr-2 stroke-[3]" />
          Tambah Pengguna
        </Link>
      </div>

      {/* Kontainer Tabel */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase text-xs font-extrabold text-navy/70 tracking-wider">
              <tr>
                <th className="px-6 py-4.5">Nama & Email</th>
                <th className="px-6 py-4.5">Hak Akses</th>
                <th className="px-6 py-4.5">Dibuat Pada</th>
                <th className="px-6 py-4.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-navy/80">
              {admins.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-navy/40 font-semibold">
                    Belum ada data admin yang direkam.
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-extrabold text-navy text-base mb-1">
                        {admin.name || "Administrator"}
                      </div>
                      <div className="flex items-center text-xs text-navy/50 font-semibold">
                        <User className="w-3.5 h-3.5 mr-1 text-turquoise" />
                        {admin.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                        admin.role === "SUPER_ADMIN"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : admin.role === "ADMIN_KONTEN"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-teal-50 text-teal-700 border-teal-200"
                      }`}>
                        {admin.role === "SUPER_ADMIN" ? "Super Admin" : admin.role === "ADMIN_KONTEN" ? "Admin Konten" : "Admin UMKM"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border bg-green-50 text-green-700 border-green-200">
                        {new Date(admin.createdAt).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end items-center gap-1.5">
                        <Link 
                          href={`/admin/pengguna/${admin.id}/edit`} 
                          className="p-2 text-navy/40 hover:text-navy hover:bg-navy/5 rounded-xl transition-all"
                          title="Ubah Data"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <DeleteForm id={admin.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
