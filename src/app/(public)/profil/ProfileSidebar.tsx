"use client";

import { useState, useEffect, useRef } from "react";
import { Info, Building2, BookOpen, Compass, MapPin, Users, Map, Award, TrendingUp } from "lucide-react";

const sections = [
  { id: "sambutan", label: "Sambutan Kepala Desa", icon: Info },
  { id: "identitas", label: "Identitas Desa", icon: Building2 },
  { id: "sejarah", label: "Sejarah Desa", icon: BookOpen },
  { id: "visi-misi", label: "Visi & Misi", icon: Compass },
  { id: "geografis", label: "Wilayah & Geografis", icon: MapPin },
  { id: "kependudukan", label: "Kependudukan", icon: Users },
  { id: "struktur", label: "Struktur Pemerintahan", icon: Map },
  { id: "potensi", label: "Potensi & Komoditas", icon: Award },
  { id: "lembaga", label: "Lembaga Desa", icon: TrendingUp },
];

export default function ProfileSidebar() {
  const [activeSection, setActiveSection] = useState<string>("sambutan");
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
      window.scrollTo({
        top: el.offsetTop - 140, // Offset ditinggikan agar pas di bawah sticky header + sticky mobile sidebar
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  return (
    <aside className="w-full lg:w-80 sticky top-[76px] lg:top-32 bg-white/90 backdrop-blur-md lg:bg-white rounded-2xl lg:rounded-3xl p-2.5 lg:p-6 border border-slate-100/80 shadow-sm shrink-0 z-30 transition-all duration-300">
      <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest text-[#0f172a]/40 mb-4 px-3">
        Daftar Isi Profil
      </span>
      <nav 
        ref={navRef}
        className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1.5 pb-0.5 lg:pb-0 scrollbar-none"
      >
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              id={`nav-btn-${sec.id}`}
              onClick={() => scrollToSection(sec.id)}
              className={`flex items-center gap-2 lg:gap-3 px-3 py-2 lg:px-4 lg:py-3 rounded-xl lg:rounded-2xl text-[10px] lg:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap lg:whitespace-normal text-left shrink-0 lg:shrink ${
                isActive
                  ? "bg-turquoise/10 text-turquoise border border-turquoise/20 font-bold shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 border border-transparent font-medium"
              }`}
            >
              <Icon size={14} className={isActive ? "text-turquoise" : "text-slate-400"} />
              {sec.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
