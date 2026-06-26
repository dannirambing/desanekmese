"use client";

import { useState, useEffect } from "react";
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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 120,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  return (
    <aside className="w-full lg:w-80 lg:sticky lg:top-32 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm shrink-0 z-20">
      <span className="block text-[10px] font-black uppercase tracking-widest text-[#0f172a]/40 mb-4 px-3">
        Daftar Isi Profil
      </span>
      <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1.5 pb-3 lg:pb-0 scrollbar-none">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap lg:whitespace-normal text-left shrink-0 lg:shrink ${
                isActive
                  ? "bg-turquoise/10 text-turquoise border border-turquoise/20 font-bold"
                  : "text-slate-600 hover:bg-slate-50 border border-transparent font-medium"
              }`}
            >
              <Icon size={16} className={isActive ? "text-turquoise" : "text-slate-400"} />
              {sec.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
