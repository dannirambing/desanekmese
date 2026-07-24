"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, Map, ShoppingBag, Newspaper } from "lucide-react";

const sections = [
  { id: "kultur", label: "Kultur & Kearifan", icon: Sparkles },
  { id: "destinasi", label: "Destinasi Wisata", icon: Map },
  { id: "umkm", label: "Produk UMKM", icon: ShoppingBag },
  { id: "berita", label: "Berita & Pengumuman", icon: Newspaper },
];

export default function HomeSubNavbar() {
  const [activeSection, setActiveSection] = useState<string>("kultur");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const navRef = useRef<HTMLDivElement>(null);
  const isClickScrollRef = useRef<boolean>(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // 1. Cek visibilitas terhadap Hero Section (Seksi Kultur adalah batas atas)
      const kulturEl = document.getElementById("kultur");
      if (kulturEl) {
        const rect = kulturEl.getBoundingClientRect();
        const kulturTop = rect.top + window.scrollY;
        if (window.scrollY < kulturTop - 300) {
          setIsVisible(false);
          return;
        }
      }

      // 2. Cek visibilitas terhadap Footer
      const footerEl = document.querySelector("footer");
      if (footerEl) {
        const rect = footerEl.getBoundingClientRect();
        // Jika batas atas footer sudah masuk ke dalam viewport layar, sembunyikan navbar
        if (rect.top < window.innerHeight - 20) {
          setIsVisible(false);
          return;
        }
      }

      // Jika lolos kedua kondisi di atas, tampilkan navbar
      setIsVisible(true);

      // Jika scroll dipicu oleh klik tombol, lewatkan tracking aktif seksi sementara
      if (isClickScrollRef.current) return;

      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Pemicu awal
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  // Efek untuk menyelaraskan scroll horizontal menu aktif di layar kecil
  useEffect(() => {
    if (activeSection && navRef.current) {
      const activeButton = document.getElementById(`nav-btn-${activeSection}`);
      if (activeButton) {
        const container = navRef.current;
        const containerWidth = container.clientWidth;
        const buttonLeft = activeButton.offsetLeft;
        const buttonWidth = activeButton.clientWidth;

        container.scrollTo({
          left: buttonLeft - (containerWidth / 2) + (buttonWidth / 2),
          behavior: "smooth",
        });
      }
    }
  }, [activeSection]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      isClickScrollRef.current = true;
      setActiveSection(id);

      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      
      window.scrollTo({
        top: top - 90, // Menyesuaikan offset agar pas di bawah sticky header utama saja (karena sub-navbar berada di bawah)
        behavior: "smooth",
      });

      // Reset flag setelah animasi scroll selesai
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = setTimeout(() => {
        isClickScrollRef.current = false;
      }, 800); // 800ms cukup untuk smooth scroll selesai
    }
  };

  return (
    <div className={`fixed bottom-6 left-0 right-0 w-full z-30 pointer-events-none flex justify-center transition-all duration-500 transform ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
    }`}>
      <div className="container mx-auto px-6 pointer-events-auto">
        <div className="bg-white/90 backdrop-blur-md border border-slate-100/80 shadow-sm rounded-2xl lg:rounded-3xl p-2.5 transition-all duration-300">
          <nav
            ref={navRef}
            className="flex flex-row items-center justify-start lg:justify-center overflow-x-auto gap-1.5 pb-0.5 scrollbar-none"
          >
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  id={`nav-btn-${sec.id}`}
                  onClick={() => scrollToSection(sec.id)}
                  className={`flex items-center gap-2 lg:gap-3 px-3 py-2 lg:px-4 lg:py-3 rounded-xl lg:rounded-2xl text-[10px] lg:text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap text-left shrink-0 border ${
                    isActive
                      ? "bg-turquoise/10 text-turquoise border-turquoise/20 font-extrabold shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 border-transparent font-semibold"
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-turquoise" : "text-slate-400"} />
                  {sec.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
