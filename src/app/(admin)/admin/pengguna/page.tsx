import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Edit, Plus, User, Shield, CheckCircle2, XCircle } from "lucide-react";
import ToggleStatusForm from "./ToggleStatusForm";
import { requireAdminSession } from "@/lib/auth-session";
import AdminTableFilters from "@/components/admin/AdminTableFilters";
import AdminTablePagination from "@/components/admin/AdminTablePagination";
import { Prisma } from "@prisma/client";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    category?: string;
    page?: string;
  }>;
}

export default async function AdminPenggunaPage({ searchParams }: PageProps) {
  await requireAdminSession(["ALL_ACCESS"]);

  const params = await searchParams;
  const search = params.search || "";
  const status = params.status || "";
  const roleId = params.category || "";
  const page = parseInt(params.page || "1", 10);
  const itemsPerPage = 10;
  const skip = (page - 1) * itemsPerPage;

  // Build where query
  const where: Prisma.AdminWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status) {
    if (status === "ACTIVE") {
      where.isActive = true;
    } else if (status === "INACTIVE") {
      where.isActive = false;
    }
  }

  if (roleId) {
    where.roleId = roleId;
  }

  // Fetch paginated admins, total count, and roles for filtering
  const [admins, totalItems, roles] = await Promise.all([
    prisma.admin.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { role: true },
      take: itemsPerPage,
      skip,
    }),
    prisma.admin.count({ where }),
    prisma.role.findMany({
      orderBy: { name: "asc" }
    })
  ]);

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const roleOptions = roles.map(role => ({
    label: role.name,
    value: role.id
  }));

  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

  function formatRelativeTime(date: Date | null) {
    if (!date) return "Tidak pernah";
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 5) return "Sedang aktif";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    return `${diffDays} hari lalu`;
  }

  return (
    <div className="w-full">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-navy tracking-tight uppercase">
            Kelola Pengguna
          </h1>
          <p className="text-sm text-navy/60 font-medium mt-1">
            Manajemen akses administrator desa dan status aktivitas sesi.
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

      {/* Filter Tabel */}
      <AdminTableFilters 
        placeholder="Cari pengguna (nama, email)..." 
        statusOptions={[
          { label: "Semua Status", value: "" },
          { label: "Aktif", value: "ACTIVE" },
          { label: "Nonaktif", value: "INACTIVE" }
        ]}
        categories={roleOptions}
        categoryLabel="Peran"
      />

      {/* Kontainer Tabel */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase text-xs font-extrabold text-navy/70 tracking-wider">
              <tr>
                <th className="px-6 py-4.5">Nama & Email</th>
                <th className="px-6 py-4.5">Peran (Role)</th>
                <th className="px-6 py-4.5">Status</th>
                <th className="px-6 py-4.5">Aktivitas Sesi</th>
                <th className="px-6 py-4.5">Dibuat Pada</th>
                <th className="px-6 py-4.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-navy/80">
              {admins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-navy/40 font-semibold">
                    Belum ada data admin yang direkam atau cocok dengan filter.
                  </td>
                </tr>
              ) : (
                admins.map((admin) => {
                  const isOnline = admin.lastActiveAt && admin.lastActiveAt >= fiveMinutesAgo;

                  return (
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
                        <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border bg-blue-50 text-blue-700 border-blue-200 flex items-center inline-flex w-fit">
                          <Shield className="w-3 h-3 mr-1" />
                          {admin.role?.name || "Tidak ada peran"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border flex items-center inline-flex w-fit ${
                          admin.isActive 
                            ? "bg-green-50 text-green-700 border-green-200" 
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}>
                          {admin.isActive ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                          {admin.isActive ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isOnline ? (
                          <div className="flex items-center text-emerald-600 font-extrabold text-xs">
                            <span className="relative flex h-2 w-2 mr-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Aktif Sekarang
                          </div>
                        ) : (
                          <div className="text-slate-400 text-xs font-semibold">
                            {formatRelativeTime(admin.lastActiveAt)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border bg-slate-50 text-slate-700 border-slate-200">
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
                          {admin.role?.name !== "Super Admin" && (
                            <ToggleStatusForm id={admin.id} currentStatus={admin.isActive} />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginasi Tabel */}
      <AdminTablePagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}
