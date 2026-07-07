"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Beranda", href: "/" },
  {
    name: "Profil",
    href: "/profil",
    submenu: [
      { name: "Sambutan Kades", href: "/profil#sambutan", description: "Kata pengantar resmi Kepala Desa Nekmese." },
      { name: "Identitas Desa", href: "/profil#identitas", description: "Informasi dasar & administratif wilayah." },
      { name: "Sejarah Desa", href: "/profil#sejarah", description: "Asal-usul & sejarah terbentuknya desa." },
      { name: "Visi & Misi", href: "/profil#visi-misi", description: "Cita-cita & rencana arah pembangunan." },
      { name: "Wilayah Geografis", href: "/profil#geografis", description: "Batas wilayah & bentang alam Nekmese." },
      { name: "Kependudukan", href: "/profil#kependudukan", description: "Statistik jumlah warga & demografi." },
      { name: "Struktur Organisasi", href: "/profil#struktur", description: "Bagan pemerintahan & pamong desa." },
      { name: "Potensi Desa", href: "/profil#potensi", description: "Komoditas & keunggulan lokal warga." },
      { name: "Lembaga Desa", href: "/profil#lembaga", description: "Lembaga kemasyarakatan aktif desa." },
      { name: "Lokasi Titik Air", href: "/profil#titik-air", description: "Pemetaan & sebaran sumber air bersih." },
    ],
  },
  { name: "Wisata", href: "/wisata" },
  { name: "Budaya", href: "/budaya" },
  { name: "UMKM", href: "/umkm" },
  {
    name: "Berita",
    href: "/berita",
    submenu: [
      { name: "Berita Terbaru", href: "/berita?tab=news", description: "Kabar seputar kegiatan & aktivitas desa." },
      { name: "Laporan Anggaran", href: "/berita?tab=budget", description: "Transparansi anggaran pendapatan & belanja desa." },
    ],
  },
  { name: "Pengumuman", href: "/pengumuman" },
  { name: "Peraturan", href: "/peraturan" },
];

const DARK_HERO_EXACT = ["/", "/profil", "/umkm"];
const DARK_HERO_PREFIX = ["/wisata", "/budaya", "/berita", "/pengumuman", "/destinasi", "/peraturan"];

function isActivePath(pathname: string, href: string) {
  if (href === "/wisata" && pathname.startsWith("/destinasi/")) return true;
  return pathname === href || (href !== "/" && pathname.startsWith(href + "/"));
}

function hasDarkHeroAtTop(pathname: string | null) {
  if (!pathname) return true; // Default to true during SSR to prevent flash
  if (DARK_HERO_EXACT.includes(pathname)) return true;
  return DARK_HERO_PREFIX.some(prefix => pathname === prefix || pathname.startsWith(prefix + "/"));
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const useSolidStyle = isScrolled || !hasDarkHeroAtTop(pathname);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMobileOpen(false);
      const scrolled = window.scrollY > 50;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  const navLinkClass = (href: string) => {
    const isActive = isActivePath(pathname, href);
    return cn(
      "group relative transition-colors duration-300 py-1",
      useSolidStyle
        ? isActive ? "text-teal-600 font-bold" : "text-slate-600 hover:text-teal-600"
        : isActive ? "text-white font-bold" : "text-white/80 hover:text-white",
      !useSolidStyle && "drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
    );
  };

  const underlineClass = (href: string) => {
    const isActive = isActivePath(pathname, href);
    return cn(
      "absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300",
      useSolidStyle ? "bg-teal-600" : "bg-white",
      isActive ? "w-full" : "w-0 group-hover:w-1/2"
    );
  };

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 ease-in-out",
        useSolidStyle
          ? "bg-white/95 backdrop-blur-sm shadow-md h-16 md:h-20"
          : "h-20 md:h-28 bg-gradient-to-b from-black/80 via-black/45 to-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/favicon.ico"
            alt="Logo Desa Nekmese"
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
            priority
          />
          <span
            className={cn(
              "text-xl sm:text-2xl font-extrabold tracking-tighter transition-colors duration-300",
              useSolidStyle ? "text-navy" : "text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]"
            )}
          >
            Desa Nekmese

          </span>
        </Link>

        <nav
          className={cn(
            "hidden lg:flex items-center gap-5 xl:gap-8 font-semibold tracking-wide uppercase text-xs",
            useSolidStyle ? "text-slate-700" : "text-white/95"
          )}
        >
          {menuItems.map((item) => {
            if (item.submenu) {
              const isParentActive = item.submenu.some(sub => isActivePath(pathname, sub.href));
              return (
                <div key={item.name} className="relative group py-5">
                  <button
                    type="button"
                    className={cn(
                      "flex items-center gap-1 transition-colors duration-300 font-bold uppercase tracking-wider text-xs cursor-pointer",
                      useSolidStyle
                        ? isParentActive ? "text-teal-600 font-bold" : "text-slate-600 hover:text-teal-600"
                        : isParentActive ? "text-white font-bold" : "text-white/80 hover:text-white",
                      !useSolidStyle && "drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
                    )}
                  >
                    {item.name}
                    <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
                  </button>

                  {/* Mega Dropdown Menu */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                    <div className="bg-white border border-slate-100 shadow-2xl rounded-2xl p-3 w-[280px] grid gap-1.5 text-slate-800 text-xs normal-case font-semibold">
                      {item.submenu.map((sub) => {
                        const isSubActive = isActivePath(pathname, sub.href);
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={cn(
                              "group/sub flex flex-col gap-0.5 p-3 rounded-xl hover:bg-slate-50 transition-colors",
                              isSubActive && "bg-teal-50/50"
                            )}
                          >
                            <span className={cn(
                              "font-extrabold text-navy group-hover/sub:text-teal-600 transition-colors",
                              isSubActive && "text-teal-600"
                            )}>
                              {sub.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium leading-relaxed">
                              {sub.description}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={navLinkClass(item.href)}
              >
                {item.name}
                <span className={underlineClass(item.href)} />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            asChild
            className={cn(
              "hidden sm:inline-flex rounded-full px-6 md:px-8 uppercase font-semibold text-xs tracking-widest transition-all duration-300",
              useSolidStyle
                ? "bg-teal-600 hover:bg-teal-700 text-white"
                : "bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:border-white/40"
            )}
          >
            <Link href="/wisata">Mulai Jelajah</Link>
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "lg:hidden size-10",
                  useSolidStyle
                    ? "text-navy hover:bg-gray-100"
                    : "text-white hover:bg-white/15 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
                )}
                aria-label="Buka menu navigasi"
              >
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex h-full w-[min(100vw-2rem,20rem)] flex-col gap-0 p-0 bg-white/95 backdrop-blur-xl border-l border-gray-100 shadow-2xl overflow-y-auto"
            >
              <SheetHeader className="border-b border-gray-100 px-6 py-5 text-left shrink-0">
                <SheetTitle className="text-xl font-extrabold tracking-tighter text-navy flex items-center gap-2">
                  <Image
                    src="/favicon.ico"
                    alt="Logo Desa Nekmese"
                    width={24}
                    height={24}
                    className="w-6 h-6 object-contain"
                  />
                  <span>
                    Desa <span className="text-teal-600">Nekmese</span>
                  </span>
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col px-4 py-4 space-y-1.5 flex-1 overflow-y-auto">
                {menuItems.map((item) => {
                  if (item.submenu) {
                    return (
                      <div key={item.name} className="flex flex-col space-y-1 py-1">
                        <span className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-navy/40">
                          {item.name}
                        </span>
                        <div className="flex flex-col pl-3 border-l border-slate-100 ml-4 space-y-1">
                          {item.submenu.map((sub) => (
                            <SheetClose asChild key={sub.href}>
                              <Link
                                href={sub.href}
                                className={cn(
                                  "rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors",
                                  isActivePath(pathname, sub.href)
                                    ? "bg-teal-50 text-teal-700"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-teal-600"
                                )}
                              >
                                {sub.name}
                              </Link>
                            </SheetClose>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "rounded-lg px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors",
                          isActivePath(pathname, item.href)
                            ? "bg-teal-50 text-teal-700"
                            : "text-slate-600 hover:bg-slate-50 hover:text-teal-600"
                        )}
                      >
                        {item.name}
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>

              <div className="border-t border-gray-100 p-5 shrink-0 bg-white">
                <SheetClose asChild>
                  <Button
                    asChild
                    className="w-full rounded-full bg-teal-600 hover:bg-teal-700 text-white uppercase font-bold text-xs tracking-widest shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                  >
                    <Link href="/wisata">Mulai Jelajah</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
