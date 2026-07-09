"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validations/login";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email atau password salah.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  const inputClass = (err?: any) => 
    `w-full pl-12 pr-4 py-4 bg-slate-50/50 border rounded-2xl font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-[#14b8a6]/10 transition-all duration-300 outline-none shadow-sm ${
      err ? "border-red-400 focus:border-red-400 focus:ring-red-200" : "border-slate-200 focus:border-[#14b8a6]"
    }`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            <Mail className={`w-5 h-5 transition-colors duration-300 ${errors.email ? "text-red-400" : "text-slate-400 group-focus-within:text-[#14b8a6]"}`} />
          </div>
          <input
            type="email"
            {...register("email")}
            autoComplete="email"
            placeholder="masukan email"
            className={inputClass(errors.email)}
          />
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1 font-bold">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2.5 ml-1">
          Kata Sandi
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className={`w-5 h-5 transition-colors duration-300 ${errors.password ? "text-red-400" : "text-slate-400 group-focus-within:text-[#14b8a6]"}`} />
          </div>
          <input
            type="password"
            {...register("password")}
            autoComplete="current-password"
            placeholder="Masukan Password"
            className={inputClass(errors.password)}
          />
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1 font-bold">{errors.password.message}</p>}
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

