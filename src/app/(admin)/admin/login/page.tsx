import { Suspense } from "react";
import LoginForm from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white tracking-tighter mb-2">
            Desa<span className="text-[#14b8a6]">Nekmese</span>
          </h1>
          <p className="text-white/50 text-sm font-medium">
            Panel Administrasi Desa
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-black text-[#0f172a] uppercase tracking-tight mb-6">
            Masuk Admin
          </h2>
          <Suspense fallback={<p className="text-sm text-slate-400">Memuat...</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
