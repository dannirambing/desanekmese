"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email atau password salah.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2.5 ml-1">
          Alamat Email
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-[#14b8a6] transition-colors duration-300" />
          </div>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="admin@desanekmese.id"
            className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-[#14b8a6]/10 focus:border-[#14b8a6] transition-all duration-300 outline-none shadow-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2.5 ml-1">
          Kata Sandi
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-[#14b8a6] transition-colors duration-300" />
          </div>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-[#14b8a6]/10 focus:border-[#14b8a6] transition-all duration-300 outline-none shadow-sm"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#14b8a6] hover:bg-[#0f172a] text-white py-7 rounded-2xl font-bold uppercase tracking-widest transition-all duration-300 hover:shadow-lg hover:shadow-[#14b8a6]/25 mt-2"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            Memproses...
          </span>
        ) : (
          "Masuk Ke Dashboard"
        )}
      </Button>
    </form>
  );
}
