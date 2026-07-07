"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { createRole, updateRole } from "./actions";
import { AVAILABLE_PERMISSIONS } from "@/lib/permissions";

interface RoleData {
  id?: string;
  name?: string;
  permissions?: string[];
  isSystem?: boolean;
}

export default function RoleForm({ role }: { role?: RoleData }) {
  const isEdit = !!role;
  const isSystem = role?.isSystem || false;
  
  const formAction = isEdit ? updateRole.bind(null, role.id!) : createRole;

  const [error, submitAction, isPending] = useActionState(
    async (prevState: string | null, formData: FormData) => {
      try {
        await formAction(formData);
        return null;
      } catch (err) {
        return err instanceof Error ? err.message : "Gagal menyimpan peran";
      }
    },
    null
  );

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/roles"
        className="flex items-center text-sm font-bold text-slate-500 hover:text-[#0f172a] mb-6"
      >
        <ArrowLeft className="mr-2" size={16} /> KEMBALI
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-black text-[#0f172a] mb-6 uppercase tracking-tight">
          {isEdit ? "Edit Peran" : "Tambah Peran Baru"}
        </h1>

        <form action={submitAction} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">
              Nama Peran
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={role?.name || ""}
              placeholder="Masukkan nama peran (contoh: Admin Galeri)"
              className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
              disabled={isSystem}
            />
            {isSystem && (
              <input type="hidden" name="name" value={role?.name || ""} />
            )}
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 mb-4 uppercase tracking-widest">
              Hak Akses
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AVAILABLE_PERMISSIONS.map((perm) => (
                <label 
                  key={perm.id} 
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all hover:bg-slate-50 ${
                    role?.permissions?.includes(perm.id) ? "border-[#14b8a6] bg-teal-50/10" : "border-slate-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    name="permissions"
                    value={perm.id}
                    defaultChecked={role?.permissions?.includes(perm.id)}
                    className="w-5 h-5 rounded border-slate-300 text-turquoise focus:ring-turquoise accent-turquoise"
                  />
                  <div className="ml-3">
                    <div className="font-bold text-sm text-navy">{perm.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{perm.id}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#14b8a6] text-white py-4 mt-2 rounded-xl font-black uppercase tracking-widest hover:bg-[#0f172a] transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Save className="mr-2" size={20} />
            {isPending ? "Menyimpan..." : "Simpan Peran"}
          </button>
        </form>
      </div>
    </div>
  );
}
