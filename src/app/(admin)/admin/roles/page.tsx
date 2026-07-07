import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Edit, Plus, Shield, Users } from "lucide-react";
import DeleteForm from "./DeleteForm";
import { requireAdminSession } from "@/lib/auth-session";
import { AVAILABLE_PERMISSIONS } from "@/lib/permissions";

export default async function AdminRolesPage() {
  await requireAdminSession(["ALL_ACCESS"]);

  const roles = await prisma.role.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { admins: true }
      }
    }
  });

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-navy tracking-tight uppercase">
            Kelola Peran & Hak Akses
          </h1>
          <p className="text-sm text-navy/60 font-medium mt-1">
            Manajemen tingkatan peran dan kontrol akses fitur aplikasi.
          </p>
        </div>
        <Link 
          href="/admin/roles/tambah" 
          className="inline-flex items-center justify-center bg-turquoise hover:bg-turquoise/90 text-black px-6 py-3 rounded-full font-bold text-xs tracking-widest uppercase transition-all shadow-md shadow-turquoise/10"
        >
          <Plus className="w-4 h-4 mr-2 stroke-[3]" />
          Tambah Peran
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase text-xs font-extrabold text-navy/70 tracking-wider">
              <tr>
                <th className="px-6 py-4.5">Nama Peran</th>
                <th className="px-6 py-4.5">Hak Akses</th>
                <th className="px-6 py-4.5">Pengguna</th>
                <th className="px-6 py-4.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-navy/80">
              {roles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-navy/40 font-semibold">
                    Belum ada data peran yang direkam.
                  </td>
                </tr>
              ) : (
                roles.map((role) => (
                  <tr key={role.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-extrabold text-navy text-base mb-1 flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-turquoise" />
                        {role.name}
                        {role.isSystem && (
                          <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500">
                            Sistem
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {role.permissions.map(p => {
                          const permName = AVAILABLE_PERMISSIONS.find(ap => ap.id === p)?.name || p;
                          return (
                            <span key={p} className="px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase bg-slate-50 text-slate-600 border border-slate-200">
                              {permName}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm font-bold text-slate-500">
                        <Users className="w-4 h-4 mr-1.5" />
                        {role._count.admins} Akun
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end items-center gap-1.5">
                        <Link 
                          href={`/admin/roles/${role.id}/edit`} 
                          className="p-2 text-navy/40 hover:text-navy hover:bg-navy/5 rounded-xl transition-all"
                          title="Ubah Peran"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        {!role.isSystem && <DeleteForm id={role.id} />}
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
