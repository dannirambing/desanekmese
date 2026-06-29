"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import { createAdmin } from "../actions";

export default function TambahPenggunaPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Use React 19's useActionState for form handling
  const [error, submitAction, isPending] = useActionState(
    async (prevState: string | null, formData: FormData) => {
      try {
        await createAdmin(formData);
        return null; // Will redirect on success
      } catch (err) {
        return err instanceof Error ? err.message : "Gagal menyimpan perubahan";
      }
    },
    null
  );

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/pengguna"
        className="flex items-center text-sm font-bold text-slate-500 hover:text-[#0f172a] mb-6"
      >
        <ArrowLeft className="mr-2" size={16} /> KEMBALI
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-black text-[#0f172a] mb-6 uppercase tracking-tight">
          Tambah Pengguna Baru
        </h1>

        <form action={submitAction} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Masukkan nama admin"
              className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                Hak Akses (Role)
              </label>
              <select
                name="role"
                required
                className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] bg-white focus:ring-2 focus:ring-[#14b8a6] outline-none"
              >
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="ADMIN_KONTEN">Admin Konten</option>
                <option value="ADMIN_UMKM">Admin UMKM</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="admin@desanekmese.com"
                className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Masukkan password"
                  className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0f172a] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  placeholder="Ulangi password"
                  className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0f172a] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#14b8a6] text-white py-4 mt-2 rounded-xl font-black uppercase tracking-widest hover:bg-[#0f172a] transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Save className="mr-2" size={20} />
            {isPending ? "Menyimpan..." : "Simpan Pengguna"}
          </button>
        </form>
      </div>
    </div>
  );
}
