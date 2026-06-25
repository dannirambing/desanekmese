"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LayoutDashboard, Map, Sparkles, Store, Newspaper, Users } from "lucide-react";
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
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-[#0f172a]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-[#0f172a] text-white px-3 py-2 rounded-lg text-xs font-bold uppercase"
      >
        Menu
      </button>

      <aside
        className={cn(
          "bg-[#0f172a] w-64 fixed h-screen z-40 transition-transform md:translate-x-0 flex flex-col shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-8 border-b border-white/10">
          <h2 className="text-white font-black text-xl tracking-tighter">
            Desa<span className="text-[#14b8a6]">Nekmese</span>
          </h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {status === "loading" ? (
            <div className="space-y-3 px-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            [
              { name: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["SUPER_ADMIN", "ADMIN_KONTEN", "ADMIN_UMKM"] },
              { name: "Kelola Wisata", href: "/admin/wisata", icon: Map, roles: ["SUPER_ADMIN", "ADMIN_KONTEN"] },
              { name: "Kelola Budaya", href: "/admin/budaya", icon: Sparkles, roles: ["SUPER_ADMIN", "ADMIN_KONTEN"] },
              { name: "Kelola UMKM", href: "/admin/umkm", icon: Store, roles: ["SUPER_ADMIN", "ADMIN_UMKM"] },
              { name: "Kelola Berita", href: "/admin/berita", icon: Newspaper, roles: ["SUPER_ADMIN", "ADMIN_KONTEN"] },
              { name: "Kelola Pengguna", href: "/admin/pengguna", icon: Users, roles: ["SUPER_ADMIN"] },
            ]
              .filter((item) => {
                if (!session?.user?.role) return false;
                return item.roles.includes(session.user.role);
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
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                      isActive
                        ? "bg-[#14b8a6] text-white shadow-lg shadow-[#14b8a6]/20"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className="w-5 h-5" /> {item.name}
                  </Link>
                );
              })
          )}
        </nav>

        <AdminLogoutButton />
      </aside>

      <main className="flex-1 md:ml-64 p-6 md:p-10 pt-16 md:pt-10">
        {children}
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
