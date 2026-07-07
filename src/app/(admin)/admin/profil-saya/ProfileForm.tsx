"use client";

import { useState } from "react";
import { Save, Eye, EyeOff } from "lucide-react";
import { updateMyProfile } from "./actions";

interface AdminData {
  id: string;
  name: string | null;
  email: string;
}

export default function ProfileForm({ admin }: { admin: AdminData }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await updateMyProfile(formData);
      setMessage({ type: "success", text: result.message });
      // Clear password fields on success
      const form = e.target as HTMLFormElement;
      form.password.value = "";
      form.confirmPassword.value = "";
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Gagal memperbarui profil" });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-black text-[#0f172a] mb-6 uppercase tracking-tight">
          Profil Saya
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <div className={`p-4 border rounded-xl text-sm font-semibold ${
              message.type === "success" 
                ? "bg-green-50 border-green-200 text-green-700" 
                : "bg-red-50 border-red-200 text-red-600"
            }`}>
              {message.text}
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
              defaultValue={admin.name || ""}
              placeholder="Masukkan nama"
              className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              defaultValue={admin.email}
              placeholder="admin@desanekmese.com"
              className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Ubah Password</h3>
            <p className="text-xs text-slate-400 font-medium mb-4">
              Kosongkan field di bawah ini jika tidak ingin mengubah password.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                Password Baru (Opsional)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Masukkan password baru"
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
                Konfirmasi Password Baru
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Ulangi password baru"
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
            {isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </div>
  );
}
