import { Suspense } from "react";
import Image from "next/image";
import LoginForm from "@/components/admin/LoginForm";
import { getHeroSettings } from "@/lib/queries";

export const revalidate = 60; // Revalidate cache every 60 seconds

export default async function AdminLoginPage() {
  const heroSettings = await getHeroSettings();
  
  // Fallbacks in case settings are not yet configured
  const imageUrl = heroSettings?.imageUrl || "https://azhuh458gn.ufs.sh/f/IDwrE8y2GhNiT3jd6hwEJvA74yPimMfuNFo6zp0Ia1S3eH2D";
  const tagline = heroSettings?.tagline || "Portal Resmi";
  const titleLine1 = heroSettings?.titleLine1 || "Nekaf Mese,";
  const titleLine2 = heroSettings?.titleLine2 || "Atoni Meto Nao Fatu Nao Oe.";
  const description = heroSettings?.description || "Dari tanah Timor yang kuat bagai batu, dan jiwa yang mengalir bagai air, Desa Nekmese menyambut Anda dengan ketulusan.";
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* Left Column - Hero Image */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 items-end pb-16 px-12">
        <Image
          src={imageUrl}
          alt="Desa Nekmese"
          fill
          priority
          sizes="50vw"
          className="absolute inset-0 z-0 object-cover"
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
        
        <div className="relative z-20 w-full max-w-xl text-white">
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest text-[#14b8a6]">
            <span className="w-2 h-2 rounded-full bg-[#14b8a6] animate-pulse" />
            {tagline}
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter mb-4 leading-tight">
            {titleLine1} <br/>
            {titleLine2}
          </h1>
          <p className="text-slate-300 text-lg font-medium leading-relaxed max-w-md">
            {description}
          </p>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 sm:p-12 lg:p-16 relative overflow-hidden bg-white">
        {/* Subtle Pattern Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-[#14b8a6]/5 blur-3xl pointer-events-none" />
        
        {/* Top Spacer */}
        <div className="relative z-10 mb-auto" />

        {/* Center Form Container */}
        <div className="w-full max-w-sm mx-auto relative z-10 flex-1 flex flex-col justify-center my-12">
          
          <div className="mb-10">
            <div className="inline-block px-3 py-1.5 bg-[#14b8a6]/10 text-[#14b8a6] text-[10px] font-bold uppercase tracking-widest rounded-full mb-6">
              Sistem Informasi Terpadu Desa Nekmese
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Selamat Datang
            </h3>
            <p className="text-slate-500 text-sm mt-3 font-medium leading-relaxed">
              Masuk ke akun administrator untuk mulai mengelola konten dan data portal desa.
            </p>
          </div>

          <Suspense fallback={<p className="text-sm text-slate-400 animate-pulse">Memuat formulir...</p>}>
            <LoginForm />
          </Suspense>
          
        </div>

        {/* Bottom Footer */}
        <div className="relative z-10 mt-auto pt-8">
          <div className="flex flex-col items-center justify-center text-center gap-2 border-t border-slate-100 pt-6">
            
            <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
              <img
                src="https://azhuh458gn.ufs.sh/f/IDwrE8y2GhNislAmOuP0Dn3MJXmqKPzTlg6YCWejAh7EfapG"
                alt="Logo Unwira"
                width={12}
                height={12}
                className="grayscale opacity-60 object-contain"
              />
              <span>Lembaga Penelitian dan Pengabdian kepada Masyarakat UNWIRA</span>
            </div>
            
            <div className="flex items-center flex-wrap justify-center gap-3 text-[10px] font-medium text-slate-400">
              <span>Mitra: Pemdes Nekmese</span>
              <span className="w-1 h-1 rounded-full bg-slate-200 hidden sm:block" />
              <span>
                Pengembang:{" "}
                <a href="mailto:dannirambing@gmail.com" className="hover:text-[#14b8a6] transition-colors">
                  Danni Rambing
                </a>
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-200 hidden sm:block" />
              <span>&copy; {new Date().getFullYear()}</span>
            </div>

          </div>
        </div>
        
      </div>
      
    </div>
  );
}
