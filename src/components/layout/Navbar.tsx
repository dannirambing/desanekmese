"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
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
  { name: "Profil", href: "/profil" },
  { name: "Wisata", href: "/wisata" },
  { name: "Budaya", href: "/budaya" },
  { name: "UMKM", href: "/umkm" },
  { name: "Berita", href: "/berita" },
  { name: "Pengumuman", href: "/pengumuman" },
];

const DARK_HERO_EXACT = ["/", "/profil", "/umkm"];
const DARK_HERO_PREFIX = ["/wisata", "/budaya", "/berita", "/pengumuman", "/destinasi"];

function isActivePath(pathname: string, href: string) {
  if (href === "/wisata" && pathname.startsWith("/destinasi/")) return true;
  return pathname === href || (href !== "/" && pathname.startsWith(href + "/"));
}

function hasDarkHeroAtTop(pathname: string) {
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
            "hidden lg:flex items-center gap-5 xl:gap-8 font-medium tracking-wide uppercase text-sm",
            useSolidStyle ? "text-gray-700" : "text-white/95"
          )}
        >
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={navLinkClass(item.href)}
            >
              {item.name}
              <span className={underlineClass(item.href)} />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            asChild
            className={cn(
              "hidden sm:inline-flex rounded-full px-6 md:px-8 uppercase font-semibold text-xs tracking-widest transition-all duration-300",
              useSolidStyle
                ? "bg-turquoise hover:bg-turquoise-light text-white"
                : "bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-sm drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
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
              className="flex h-full w-[min(100vw-2rem,20rem)] flex-col gap-0 p-0"
            >
              <SheetHeader className="border-b px-6 py-5 text-left">
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

              <nav className="flex flex-col px-4 py-4">
                {menuItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "rounded-lg px-4 py-3 text-base font-medium uppercase tracking-wide transition-colors",
                        isActivePath(pathname, item.href)
                          ? "bg-turquoise/10 text-turquoise"
                          : "text-gray-700 hover:bg-gray-50 hover:text-turquoise"
                      )}
                    >
                      {item.name}
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              <div className="mt-auto border-t p-4">
                <SheetClose asChild>
                  <Button
                    asChild
                    className="w-full rounded-full bg-turquoise hover:bg-turquoise-light text-white uppercase font-semibold text-xs tracking-widest"
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
