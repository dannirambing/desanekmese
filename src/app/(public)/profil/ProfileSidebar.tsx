"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Info, Building2, BookOpen, Compass, MapPin, Users, Map, Award, TrendingUp, Droplets, Video, Shield, LucideIcon } from "lucide-react";

interface ProfileSubItem {
  id: string;
  title: string;
}

interface ProfileSectionData {
  id: string;
  title: string;
  items: ProfileSubItem[];
}

interface ProfileSidebarProps {
  dynamicSections?: ProfileSectionData[];
}

interface SectionMenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export default function ProfileSidebar({ dynamicSections = [] }: ProfileSidebarProps) {
  const [activeSection, setActiveSection] = useState<string>("sambutan");
  const navRef = useRef<HTMLElement>(null);

  const staticSections: SectionMenuItem[] = useMemo(() => {
    const findId = (title: string, fallback: string) => {
      const found = dynamicSections.find(sec => sec.title.toLowerCase() === title.toLowerCase());
      return found ? found.id : fallback;
    };
    return [
      { id: "sambutan", label: "Sambutan Kepala Desa", icon: Info },
      { id: "identitas", label: "Identitas Desa", icon: Building2 },
      { id: "sejarah", label: "Sejarah Desa", icon: BookOpen },
      { id: "visi-misi", label: "Visi & Misi", icon: Compass },
      { id: "geografis", label: "Wilayah Geografis", icon: MapPin },
      { id: "kependudukan", label: "Kependudukan", icon: Users },
      { id: "struktur", label: "Struktur Organisasi", icon: Map },
      { id: "potensi", label: "Potensi Desa", icon: Award },
      { id: "lembaga", label: "Lembaga Desa", icon: TrendingUp },
      { id: "titik-air", label: "Lokasi Titik Air", icon: Droplets },
      { id: findId("Peta Titik Kumpul Desa", "titik-kumpul"), label: "Peta Titik Kumpul Desa", icon: Shield },
      { id: findId("Video Profil Desa", "video-profil"), label: "Video Profil Desa", icon: Video },
    ];
  }, [dynamicSections]);

  // Menggabungkan section bawaan dan seksi dinamis dari database tanpa duplikat
  const sections = useMemo(() => {
    const filteredDynamic = dynamicSections.filter(sec => 
      !staticSections.some(s => s.id === sec.id || s.label.toLowerCase() === sec.title.toLowerCase())
    );
    const dynamicList = filteredDynamic.map((sec) => ({
      id: sec.id,
      label: sec.title,
      icon: BookOpen,
    }));
    return [...staticSections, ...dynamicList];
  }, [staticSections, dynamicSections]);

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
  }, [sections]);

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

  const scrollToSubSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 140,
        behavior: "smooth",
      });
    }
  };

  return (
    <aside className="w-full lg:w-80 sticky top-[76px] lg:top-32 bg-white/90 backdrop-blur-md lg:bg-white rounded-2xl lg:rounded-3xl p-2.5 lg:p-6 border border-slate-100/80 shadow-sm shrink-0 z-30 transition-all duration-300">
      <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest text-[#0f172a]/40 mb-4 px-3">
        Daftar Isi Profil
      </span>
      <nav 
        ref={navRef}
        className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1.5 pb-0.5 lg:pb-0 scrollbar-none w-full"
      >
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          const dynSec = dynamicSections.find(ds => ds.id === sec.id);
          const hasItems = dynSec && dynSec.items && dynSec.items.length > 0;

          return (
            <div key={sec.id} className="flex flex-col gap-0.5 w-auto shrink-0 lg:w-full">
              <button
                id={`nav-btn-${sec.id}`}
                onClick={() => scrollToSection(sec.id)}
                className={`flex items-center gap-2 lg:gap-3 px-3 py-2 lg:px-4 lg:py-3 rounded-xl lg:rounded-2xl text-[10px] lg:text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap lg:whitespace-normal text-left w-auto lg:w-full border ${
                  isActive
                    ? "bg-turquoise/10 text-turquoise border-turquoise/20 font-extrabold shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 border-transparent font-semibold"
                }`}
              >
                <Icon size={14} className={isActive ? "text-turquoise" : "text-slate-400"} />
                {sec.label}
              </button>

              {/* Sub-bagian (Daftar Isi Anak) */}
              {hasItems && (
                <div className="hidden lg:flex flex-col gap-1 pl-4 border-l border-slate-200/60 ml-6 mt-1 mb-2.5 animate-in slide-in-from-top-1 duration-200">
                  {dynSec.items.map((item) => {
                    const subId = `${sec.id}-${item.id}`;
                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollToSubSection(subId)}
                        className="text-[9px] font-bold text-slate-500 hover:text-turquoise text-left py-1 truncate uppercase tracking-wider cursor-pointer pl-2 hover:translate-x-0.5 transition-transform"
                        title={item.title}
                      >
                        • {item.title}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

