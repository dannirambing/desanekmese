"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LayoutDashboard, Map, Sparkles, Store, Newspaper, Users, Sliders, Image as ImageIcon, Megaphone, FileText, TrendingUp, Menu, X, Bot, Droplets, Scale, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import AuthSessionProvider from "@/components/admin/AuthSessionProvider";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans text-slate-900">
      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 w-full h-16 bg-white/95 backdrop-blur-md z-30 flex items-center justify-between px-5 border-b border-slate-200 shadow-sm transition-all">
        <Link href="/admin" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <Image src="/favicon.ico" alt="Logo Desa Nekmese" width={28} height={28} className="object-contain" style={{ width: "auto", height: "auto" }} priority />
          <h2 className="text-slate-900 font-black text-xl tracking-tighter">
            Desa <span className="text-[#14b8a6]">Nekmese</span>
          </h2>
        </Link>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-500 hover:text-slate-900 focus:outline-none p-2 rounded-md hover:bg-slate-100 transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-gradient-to-b from-slate-900 to-slate-950 w-64 fixed h-screen z-40 transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.1)] border-r border-slate-800/40",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 md:h-24 hidden md:flex items-center px-8 border-b border-slate-800/50 shrink-0 gap-2.5">
          <Image src="/favicon.ico" alt="Logo Desa Nekmese" width={24} height={24} className="object-contain" style={{ width: "auto", height: "auto" }} priority />
          <h2 className="text-white font-black text-2xl tracking-tighter">
            Desa <span className="text-[#14b8a6]">Nekmese</span>
          </h2>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
          {status === "loading" ? (
            <div className="space-y-3 px-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            [
              { name: "Dashboard", href: "/admin", icon: LayoutDashboard, perms: [] }, // Everyone has dashboard access
              { name: "Edit Hero Section", href: "/admin/hero", icon: Sliders, perms: ["MANAGE_HERO"] },
              { name: "Kelola Profil Desa", href: "/admin/profil", icon: FileText, perms: ["MANAGE_PROFIL"] },
              { name: "Kelola Titik Air", href: "/admin/titik-air", icon: Droplets, perms: ["MANAGE_AIR"] },
              { name: "Kelola Wisata", href: "/admin/wisata", icon: Map, perms: ["MANAGE_WISATA"] },
              { name: "Kelola Budaya", href: "/admin/budaya", icon: Sparkles, perms: ["MANAGE_BUDAYA"] },
              { name: "Kelola UMKM", href: "/admin/umkm", icon: Store, perms: ["MANAGE_UMKM"] },
              { name: "Kelola Berita", href: "/admin/berita", icon: Newspaper, perms: ["MANAGE_BERITA"] },
              { name: "Kelola Pengumuman", href: "/admin/pengumuman", icon: Megaphone, perms: ["MANAGE_PENGUMUMAN"] },
              { name: "Kelola Anggaran", href: "/admin/anggaran", icon: TrendingUp, perms: ["MANAGE_BUDGET"] },
              { name: "Galeri Media", href: "/admin/galeri", icon: ImageIcon, perms: ["MANAGE_GALERI"] },
              { name: "Peraturan Desa", href: "/admin/peraturan", icon: Scale, perms: ["MANAGE_PERATURAN"] },
              { name: "Kelola Link Terkait", href: "/admin/link-terkait", icon: Link2, perms: ["MANAGE_LINKS"] },
              { name: "Kelola Peran & Hak Akses", href: "/admin/roles", icon: Sparkles, perms: ["ALL_ACCESS"] },
              { name: "Kelola Pengguna", href: "/admin/pengguna", icon: Users, perms: ["ALL_ACCESS"] },
              { name: "Log Chatbot AI", href: "/admin/chatbot-log", icon: Bot, perms: ["ALL_ACCESS"] },
            ]
              .filter((item) => {
                if (!session?.user?.permissions) return false;
                if (session.user.permissions.includes("ALL_ACCESS")) return true;
                if (item.perms.length === 0) return true; // Dashboard
                return item.perms.some(p => session.user.permissions.includes(p));
              })
              .map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "group flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-[#14b8a6]/15 to-transparent text-[#14b8a6] border-l-4 border-[#14b8a6] rounded-r-xl"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 hover:translate-x-1 rounded-xl border-l-4 border-transparent"
                    )}
                  >
                    <Icon className={cn("w-5 h-5 transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-110")} /> 
                    {item.name}
                  </Link>
                );
              })
          )}
        </nav>

        <AdminLogoutButton />
      </aside>

      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-24 md:pt-8 relative max-w-full overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthSessionProvider>
      <AdminShell>{children}</AdminShell>
    </AuthSessionProvider>
  );
}
