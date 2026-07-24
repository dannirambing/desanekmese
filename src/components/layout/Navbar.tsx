"use client";

import { useState, useEffect, useMemo } from "react";
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

interface NavbarProps {
  dynamicSections?: {
    id: string;
    title: string;
    items: { id: string; title: string }[];
  }[];
  relatedLinks?: {
    id: string;
    title: string;
    url: string;
  }[];
}

export default function Navbar({ dynamicSections = [], relatedLinks = [] }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  const useSolidStyle = isScrolled || !hasDarkHeroAtTop(pathname);

  const menuItems = useMemo(() => {
    // Helper to dynamically resolve database section IDs to avoid broken hash anchors
    const findId = (title: string, fallback: string) => {
      const found = dynamicSections.find(sec => sec.title.toLowerCase() === title.toLowerCase());
      return found ? found.id : fallback;
    };

    const staticProfileItems = [
      { name: "Sambutan Kepala Desa", href: "/profil#sambutan", description: "Kata pengantar resmi Kepala Desa Nekmese." },
      { name: "Identitas Desa", href: "/profil#identitas", description: "Informasi dasar & administratif wilayah." },
      { name: "Sejarah Desa", href: "/profil#sejarah", description: "Asal-usul & sejarah terbentuknya desa." },
      { name: "Visi & Misi", href: "/profil#visi-misi", description: "Cita-cita & rencana arah pembangunan." },
      { name: "Wilayah Geografis", href: "/profil#geografis", description: "Batas wilayah & bentang alam Nekmese." },
      { name: "Kependudukan", href: "/profil#kependudukan", description: "Statistik jumlah warga & demografi." },
      { name: "Struktur Organisasi", href: "/profil#struktur", description: "Bagan pemerintahan & pamong desa." },
      { name: "Potensi Desa", href: "/profil#potensi", description: "Komoditas & keunggulan lokal warga." },
      { name: "Lembaga Desa", href: "/profil#lembaga", description: "Lembaga kemasyarakatan aktif desa." },
      { name: "Lokasi Titik Air", href: "/profil#titik-air", description: "Pemetaan & sebaran sumber air bersih." },
      { name: "Peta Titik Kumpul Desa", href: `/profil#${findId("Peta Titik Kumpul Desa", "titik-kumpul")}`, description: "Peta titik kumpul evakuasi darurat desa." },
      { name: "Video Profil Desa", href: `/profil#${findId("Video Profil Desa", "video-profil")}`, description: "Dokumentasi video profil Desa Nekmese." },
    ];

    // Filter dynamicSections to prevent duplicate menu entries
    const filteredDynamic = dynamicSections.filter(sec => 
      !staticProfileItems.some(item => 
        item.name.toLowerCase() === sec.title.toLowerCase() || 
        item.href.endsWith(`#${sec.id}`)
      )
    );

    const allProfileSubmenu = [
      ...staticProfileItems,
      ...filteredDynamic.map((sec) => ({
        name: sec.title,
        href: `/profil#${sec.id}`,
        description: `Informasi mengenai ${sec.title} Desa Nekmese.`,
      })),
    ];

    return [
      { name: "Beranda", href: "/" },
      {
        name: "Profil",
        href: "/profil",
        submenu: allProfileSubmenu,
      },
      { name: "Wisata", href: "/wisata" },
      { name: "Budaya", href: "/budaya" },
      { name: "UMKM", href: "/umkm" },
      ...(relatedLinks.length > 0
        ? [
            {
              name: "Layanan",
              href: "#",
              submenu: relatedLinks.map((link) => ({
                name: link.title,
                href: link.url,
                description: `Akses sistem informasi ${link.title}.`,
              })),
            },
          ]
        : []),
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
  }, [dynamicSections, relatedLinks]);

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

      // Expand submenus containing active path
      const initialExpanded: Record<string, boolean> = {};
      menuItems.forEach((item) => {
        if (item.submenu) {
          const hasActiveChild = item.submenu.some((sub) => isActivePath(pathname, sub.href));
          if (hasActiveChild) {
            initialExpanded[item.name] = true;
          }
        }
      });
      setExpandedMenus(initialExpanded);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname, menuItems]);

  const navLinkClass = (href: string) => {
    const isActive = isActivePath(pathname, href);
    return cn(
      "group relative transition-colors duration-300 py-1",
      useSolidStyle
        ? isActive ? "text-turquoise font-bold" : "text-slate-600 hover:text-turquoise"
        : isActive ? "text-white font-bold" : "text-white/80 hover:text-white",
      !useSolidStyle && "drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
    );
  };

  const underlineClass = (href: string) => {
    const isActive = isActivePath(pathname, href);
    return cn(
      "absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300",
      useSolidStyle ? "bg-turquoise" : "bg-white",
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
              "text-lg sm:text-xl xl:text-2xl font-extrabold tracking-tighter transition-colors duration-300",
              useSolidStyle ? "text-navy" : "text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]"
            )}
          >
            Desa Nekmese
          </span>
        </Link>

        <nav
          className={cn(
            "hidden lg:flex items-center lg:gap-3 xl:gap-6 font-semibold tracking-wide uppercase lg:text-[11px] xl:text-xs",
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
                        ? isParentActive ? "text-turquoise font-bold" : "text-slate-600 hover:text-turquoise"
                        : isParentActive ? "text-white font-bold" : "text-white/80 hover:text-white",
                      !useSolidStyle && "drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
                    )}
                  >
                    {item.name}
                    <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
                  </button>

                  {/* Mega Dropdown Menu */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                    <div className="bg-white border border-slate-100 shadow-2xl rounded-2xl p-3 w-[285px] max-h-[380px] overflow-y-auto scrollbar-custom grid gap-1.5 text-slate-800 text-xs normal-case font-semibold">
                      {item.submenu.map((sub) => {
                        const isExternal = sub.href.startsWith("http");
                        const isSubActive = isActivePath(pathname, sub.href);
                        if (isExternal) {
                          return (
                            <a
                              key={sub.href}
                              href={sub.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/sub flex flex-col gap-0.5 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                            >
                              <span className="font-extrabold text-navy group-hover/sub:text-turquoise transition-colors">
                                {sub.name}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium leading-relaxed">
                                {sub.description}
                              </span>
                            </a>
                          );
                        }
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={cn(
                              "group/sub flex flex-col gap-0.5 p-3 rounded-xl hover:bg-slate-50 transition-colors",
                              isSubActive && "bg-turquoise/5"
                            )}
                          >
                            <span className={cn(
                              "font-extrabold text-navy group-hover/sub:text-turquoise transition-colors",
                              isSubActive && "text-turquoise"
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
              "hidden sm:inline-flex lg:hidden xl:inline-flex rounded-full px-6 md:px-8 uppercase font-semibold text-xs tracking-widest transition-all duration-300",
              useSolidStyle
                ? "bg-turquoise hover:bg-turquoise/90 text-white"
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
                    Desa <span className="text-turquoise">Nekmese</span>
                  </span>
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col px-4 py-4 space-y-1.5 flex-1 overflow-y-auto">
                {menuItems.map((item) => {
                  if (item.submenu) {
                    const isParentActive = item.submenu.some((sub) => isActivePath(pathname, sub.href));
                    const isExpanded = !!expandedMenus[item.name];

                    return (
                      <div key={item.name} className="flex flex-col space-y-1 py-1">
                        <button
                          type="button"
                          onClick={() => {
                            setExpandedMenus((prev) => ({
                              ...prev,
                              [item.name]: !prev[item.name],
                            }));
                          }}
                          className={cn(
                            "flex items-center justify-between w-full rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors",
                            isParentActive
                              ? "text-turquoise font-extrabold bg-turquoise/5"
                              : "text-slate-700 hover:bg-slate-50"
                          )}
                        >
                          <span>{item.name}</span>
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 transition-transform duration-300 text-slate-500",
                              isExpanded && "rotate-180",
                              isParentActive && "text-turquoise"
                            )}
                          />
                        </button>
                        <div
                          className={cn(
                            "grid transition-all duration-300 ease-in-out pl-3 border-l border-slate-100 ml-6",
                            isExpanded
                              ? "grid-rows-[1fr] opacity-100 py-1"
                              : "grid-rows-[0fr] opacity-0 pointer-events-none"
                          )}
                        >
                          <div className="overflow-hidden space-y-1 flex flex-col">
                            {item.submenu.map((sub) => {
                              const isExternal = sub.href.startsWith("http");
                              if (isExternal) {
                                return (
                                  <SheetClose asChild key={sub.href}>
                                    <a
                                      href={sub.href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors text-slate-600 hover:bg-slate-50 hover:text-turquoise"
                                    >
                                      {sub.name}
                                    </a>
                                  </SheetClose>
                                );
                              }
                              return (
                                <SheetClose asChild key={sub.href}>
                                  <Link
                                    href={sub.href}
                                    className={cn(
                                      "rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors",
                                      isActivePath(pathname, sub.href)
                                        ? "bg-turquoise/10 text-turquoise font-extrabold"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-turquoise"
                                    )}
                                  >
                                    {sub.name}
                                  </Link>
                                </SheetClose>
                              );
                            })}
                          </div>
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
                            ? "bg-turquoise/10 text-turquoise font-extrabold"
                            : "text-slate-600 hover:bg-slate-50 hover:text-turquoise"
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
                    className="w-full rounded-full bg-turquoise hover:bg-turquoise/90 text-white uppercase font-bold text-xs tracking-widest shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
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
