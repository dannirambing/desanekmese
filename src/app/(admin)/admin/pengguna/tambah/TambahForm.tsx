"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import { createAdmin } from "../actions";

export default function TambahForm({ roles }: { roles: { id: string, name: string }[] }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    roleId?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // Use React 19's useActionState for form handling
  const [error, submitAction, isPending] = useActionState(
    async (prevState: string | null, formData: FormData) => {
      const name = (formData.get("name") as string)?.trim();
      const roleId = formData.get("roleId") as string;
      const email = (formData.get("email") as string)?.trim().toLowerCase();
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      const newErrors: typeof errors = {};
      if (!name) {
        newErrors.name = "Nama lengkap wajib diisi";
      } else if (name.length < 3) {
        newErrors.name = "Nama lengkap minimal 3 karakter";
      } else if (!/^[a-zA-Z\s'.]+$/.test(name)) {
        newErrors.name = "Nama lengkap hanya boleh berisi huruf, spasi, tanda petik, dan titik";
      }

      if (!roleId) {
        newErrors.roleId = "Role wajib dipilih";
      }

      if (!email) {
        newErrors.email = "Email wajib diisi";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = "Format email tidak valid";
      } else if (email !== email.toLowerCase()) {
        newErrors.email = "Email tidak boleh mengandung huruf kapital/besar";
      }

      if (!password) {
        newErrors.password = "Password wajib diisi";
      } else if (password.length < 8) {
        newErrors.password = "Password minimal 8 karakter";
      }

      if (!confirmPassword) {
        newErrors.confirmPassword = "Konfirmasi password wajib diisi";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Password dan Konfirmasi Password tidak cocok";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return "Harap periksa kembali input Anda.";
      }

      setErrors({});

      try {
        await createAdmin(formData);
        return null; // Will redirect on success
      } catch (err) {
        return err instanceof Error ? err.message : "Gagal menyimpan perubahan";
      }
    },
    null
  );

  const handleInputChange = (fieldName: keyof typeof errors) => {
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    }
  };

  const handleEmailInput = (e: React.FormEvent<HTMLInputElement>) => {
    // Automatically convert input value to lowercase for best user experience
    const target = e.currentTarget;
    target.value = target.value.toLowerCase();
    handleInputChange("email");
  };

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
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold" role="alert">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name-input" className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">
              Nama Lengkap
            </label>
            <input
              id="name-input"
              type="text"
              name="name"
              required
              placeholder="Masukkan nama admin"
              onChange={() => handleInputChange("name")}
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={`w-full p-4 border rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none transition-colors ${
                errors.name ? "border-red-500 focus:ring-red-500/20" : "border-slate-200"
              }`}
            />
            {errors.name && (
              <p id="name-error" className="mt-1.5 text-xs font-bold text-red-500" role="alert">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="role-select" className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                Hak Akses (Role)
              </label>
              <select
                id="role-select"
                name="roleId"
                required
                onChange={() => handleInputChange("roleId")}
                aria-invalid={errors.roleId ? "true" : "false"}
                aria-describedby={errors.roleId ? "roleId-error" : undefined}
                className={`w-full p-4 border rounded-xl font-bold text-[#0f172a] bg-white focus:ring-2 focus:ring-[#14b8a6] outline-none transition-colors ${
                  errors.roleId ? "border-red-500 focus:ring-red-500/20" : "border-slate-200"
                }`}
              >
                <option value="">-- Pilih Peran --</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
              {errors.roleId && (
                <p id="roleId-error" className="mt-1.5 text-xs font-bold text-red-500" role="alert">{errors.roleId}</p>
              )}
            </div>

            <div>
              <label htmlFor="email-input" className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                Email
              </label>
              <input
                id="email-input"
                type="email"
                name="email"
                required
                placeholder="admin@desanekmese.com"
                onInput={handleEmailInput}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`w-full p-4 border rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none transition-colors ${
                  errors.email ? "border-red-500 focus:ring-red-500/20" : "border-slate-200"
                }`}
              />
              {errors.email && (
                <p id="email-error" className="mt-1.5 text-xs font-bold text-red-500" role="alert">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="password-input" className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password-input"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Masukkan password"
                  onChange={() => handleInputChange("password")}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className={`w-full p-4 border rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none pr-12 transition-colors ${
                    errors.password ? "border-red-500 focus:ring-red-500/20" : "border-slate-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0f172a] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1.5 text-xs font-bold text-red-500" role="alert">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword-input" className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword-input"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  placeholder="Ulangi password"
                  onChange={() => handleInputChange("confirmPassword")}
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                  aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                  className={`w-full p-4 border rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none pr-12 transition-colors ${
                    errors.confirmPassword ? "border-red-500 focus:ring-red-500/20" : "border-slate-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Sembunyikan konfirmasi password" : "Tampilkan konfirmasi password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0f172a] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p id="confirmPassword-error" className="mt-1.5 text-xs font-bold text-red-500" role="alert">{errors.confirmPassword}</p>
              )}
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
