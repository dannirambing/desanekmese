import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getVillageProfile, getPublishedProfileSections } from "@/lib/queries";
import ProfileSidebar from "./ProfileSidebar";
import ExpandableText from "./ExpandableText";
import {
  Calendar,
  Building2,
  MapPin,
  Users,
  Award,
  BookOpen,
  Info,
  Compass,
  Map,
  Quote,
  Trophy,
  Droplets,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import DynamicWaterSourceMap from "@/components/public/DynamicWaterSourceMap";
import ZoomableImage from "@/components/shared/ZoomableImage";
import ScrollReveal from "@/components/shared/ScrollReveal";

export const metadata: Metadata = {
  title: "Profil Desa | Desa Nekmese",
  description: "Profil lengkap Desa Nekmese, Amarasi Selatan, Kabupaten Kupang. Sejarah, visi misi, demografi, potensi, dan sarana prasarana desa.",
};

export const revalidate = 60;

function getYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default async function ProfilPage() {
  const [profile, waterSources, dynamicSections] = await Promise.all([
    getVillageProfile(),
    prisma.waterSource.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { name: "asc" }
    }),
    getPublishedProfileSections(),
  ]);

  // Memisahkan butir-butir misi yang dipisahkan oleh baris baru
  const missionItems = profile.mission
    ? profile.mission.split("\n").filter((item) => item.trim() !== "")
    : [];

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-20 md:pt-44 md:pb-28 flex items-center justify-center bg-blue-950 overflow-hidden">
        {/* Gambar Background */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60 scale-102 transition-transform duration-[10s]"
          style={{
            backgroundImage:
              "url('https://azhuh458gn.ufs.sh/f/IDwrE8y2GhNiT3jd6hwEJvA74yPimMfuNFo6zp0Ia1S3eH2D')",
          }}
        />

        {/* Overlay Biru Malam */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-indigo-950/85 via-blue-900/55 to-indigo-950/90" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="inline-block font-semibold tracking-widest text-xs md:text-sm uppercase mb-3 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-teal-300 border border-teal-300/30 shadow-sm">
            Tentang Kami
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md mb-4">
            Profil Desa
          </h1>
          <p className="text-base md:text-xl text-indigo-100 font-light leading-relaxed max-w-2xl mx-auto drop-shadow-sm">
            Kenali lebih dekat sejarah, visi & misi, struktur organisasi, tata kelola, demografi, dan potensi pembangunan Desa Nekmese.
          </p>
        </div>
      </section>

      {/* Konten Halaman */}
      <section className="bg-slate-50/50 min-h-screen py-12 md:py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            
            {/* Navigasi Client-side Sidebar */}
            <ProfileSidebar dynamicSections={dynamicSections} />

            {/* Konten Server-side Utama (Sangat bagus untuk SEO & Performant) */}
            <div className="flex-1 space-y-20 lg:space-y-28 max-w-3xl">
              
              {/* SEKSI 1: SAMBUTAN KEPALA DESA */}
              <section id="sambutan" className="scroll-mt-32">
                <span className="block text-[#0f172a]/40 font-black tracking-widest text-[10px] uppercase mb-2">
                  Sambutan Resmi
                </span>
                <h2 className="text-3xl font-extrabold text-navy tracking-tight mb-8">
                  Sambutan Kepala Desa Nekmese
                </h2>

                <ScrollReveal>
                  <div className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden">
                  {profile.welcomeImageUrl ? (
                    <div className="relative w-44 h-56 rounded-2xl overflow-hidden shrink-0 shadow-md bg-slate-100 border border-slate-200/50 hover:scale-[1.02] transition-transform duration-300">
                      <Image
                        src={profile.welcomeImageUrl}
                        alt={profile.welcomeName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 176px, 176px"
                      />
                    </div>
                  ) : (
                    <div className="w-44 h-56 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-200 shrink-0 text-slate-400">
                      <Users size={32} />
                    </div>
                  )}
                  <div className="flex-1 space-y-4 relative">
                    <Quote className="absolute -top-4 -left-2 w-10 h-10 text-turquoise/10 rotate-180 pointer-events-none" />
                    <div className="border-l-4 border-turquoise pl-5 italic text-slate-600 font-medium text-base md:text-lg leading-relaxed relative z-10">
                      <ExpandableText text={profile.welcomeText} maxCollapsedHeight="max-h-24" />
                    </div>
                    <div className="pt-2">
                      <h4 className="font-extrabold text-navy text-lg">{profile.welcomeName}</h4>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                        {profile.welcomeRole}
                      </p>
                    </div>
                  </div>
                </div>
                </ScrollReveal>
              </section>

              {/* SEKSI 2: IDENTITAS DESA */}
              <section id="identitas" className="scroll-mt-32">
                <span className="block text-[#0f172a]/40 font-black tracking-widest text-[10px] uppercase mb-2">
                  Informasi Umum
                </span>
                <h2 className="text-3xl font-extrabold text-navy tracking-tight mb-8">
                  Identitas Desa
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Nama Desa", value: "Nekmese", icon: Building2 },
                    { label: "Kode Wilayah Desa", value: profile.villageCode, icon: Info },
                    { label: "Tahun Berdiri", value: profile.establishedYear, icon: Calendar },
                    { label: "Kecamatan", value: profile.district, icon: MapPin },
                    { label: "Kabupaten / Kota", value: profile.regency, icon: MapPin },
                    { label: "Provinsi", value: profile.province, icon: MapPin },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <ScrollReveal key={idx} delay={idx * 0.05} className="w-full">
                        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-4 w-full h-full">
                          <div className="p-3 bg-slate-50 text-turquoise rounded-xl">
                            <Icon size={20} />
                          </div>
                          <div>
                            <span className="block text-[10px] text-slate-450 font-bold uppercase tracking-wider">
                              {item.label}
                            </span>
                            <span className="font-extrabold text-[#0f172a] text-sm md:text-base mt-0.5 block">
                              {item.value}
                            </span>
                          </div>
                        </div>
                      </ScrollReveal>
                    );
                  })}
                </div>
              </section>

              {/* SEKSI 3: SEJARAH DESA */}
              <section id="sejarah" className="scroll-mt-32">
                <span className="block text-[#0f172a]/40 font-black tracking-widest text-[10px] uppercase mb-2">
                  Asal-Usul & Kronologi
                </span>
                <h2 className="text-3xl font-extrabold text-navy tracking-tight mb-8">
                  Sejarah Desa Nekmese
                </h2>
                <ScrollReveal>
                  <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                    <ExpandableText 
                      text={profile.history} 
                      maxCollapsedHeight="max-h-36"
                      className="text-slate-600 font-medium leading-relaxed text-base first-letter:text-5xl first-letter:font-black first-letter:text-turquoise first-letter:float-left first-letter:mr-2.5 first-letter:leading-none"
                    />
                  </div>
                </ScrollReveal>
              </section>

              {/* SEKSI 4: VISI & MISI */}
              <section id="visi-misi" className="scroll-mt-32">
                <span className="block text-[#0f172a]/40 font-black tracking-widest text-[10px] uppercase mb-2">
                  Arah Pembangunan
                </span>
                <h2 className="text-3xl font-extrabold text-navy tracking-tight mb-8">
                  Visi & Misi Desa
                </h2>

                <div className="space-y-6">
                  {/* Visi */}
                  <ScrollReveal>
                    <div className="bg-gradient-to-br from-navy to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-md">
                      <div className="absolute right-0 bottom-0 w-32 h-32 bg-turquoise/10 rounded-full blur-2xl pointer-events-none" />
                      <span className="block text-[10px] text-turquoise font-black uppercase tracking-widest mb-3">
                        Visi Desa
                      </span>
                      <p className="text-xl md:text-2xl font-bold leading-relaxed italic pr-4">
                        &ldquo;{profile.vision}&rdquo;
                      </p>
                    </div>
                  </ScrollReveal>

                  {/* Misi */}
                  <ScrollReveal delay={0.1}>
                    <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                      <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-6">
                        Misi Desa
                      </span>
                      <div className="space-y-4">
                        {missionItems.map((item, idx) => (
                          <div key={idx} className="flex gap-4 items-start hover:-translate-x-0.5 transition-transform duration-300">
                            <span className="w-8 h-8 rounded-xl bg-turquoise/10 text-turquoise flex items-center justify-center font-extrabold text-sm shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <p className="text-slate-600 font-medium text-base leading-relaxed pt-1">
                              {item.startsWith(String(idx + 1) + ".") ? item.replace(String(idx + 1) + ".", "").trim() : item}
                            </p>
                          </div>
                        ))}
                        {missionItems.length === 0 && (
                          <p className="text-slate-400 italic">Misi desa belum dikonfigurasi.</p>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              </section>

              {/* SEKSI 5: WILAYAH & GEOGRAFIS */}
              <section id="geografis" className="scroll-mt-32">
                <span className="block text-[#0f172a]/40 font-black tracking-widest text-[10px] uppercase mb-2">
                  Kondisi Wilayah
                </span>
                <h2 className="text-3xl font-extrabold text-navy tracking-tight mb-8">
                  Batas & Geografis Wilayah
                </h2>

                <div className="space-y-8">
                  {/* Compass boundaries */}
                  <ScrollReveal>
                    <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                    <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-6 text-center">
                      Batas-Batas Wilayah
                    </span>
                    
                    <div className="relative max-w-md mx-auto aspect-square md:aspect-[1.5/1] flex items-center justify-center my-4">
                      <div className="absolute w-20 h-20 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-slate-400 shadow-inner">
                        <Compass size={32} className="animate-[spin_40s_linear_infinite] text-turquoise" />
                      </div>
                      
                      {/* Utara */}
                      <div className="absolute top-0 text-center w-40 hover:scale-102 transition-transform duration-300">
                        <span className="block text-[9px] font-black uppercase text-turquoise tracking-widest mb-0.5">Utara</span>
                        <span className="font-extrabold text-navy text-sm leading-tight block">{profile.boundariesNorth || "—"}</span>
                      </div>
                      
                      {/* Selatan */}
                      <div className="absolute bottom-0 text-center w-40 hover:scale-102 transition-transform duration-300">
                        <span className="block text-[9px] font-black uppercase text-turquoise tracking-widest mb-0.5">Selatan</span>
                        <span className="font-extrabold text-navy text-sm leading-tight block">{profile.boundariesSouth || "—"}</span>
                      </div>
                      
                      {/* Barat */}
                      <div className="absolute left-0 text-right pr-6 w-36 md:w-44 hover:scale-102 transition-transform duration-300">
                        <span className="block text-[9px] font-black uppercase text-turquoise tracking-widest mb-0.5">Barat</span>
                        <span className="font-extrabold text-navy text-sm leading-tight block">{profile.boundariesWest || "—"}</span>
                      </div>
                      
                      {/* Timur */}
                      <div className="absolute right-0 text-left pl-6 w-36 md:w-44 hover:scale-102 transition-transform duration-300">
                        <span className="block text-[9px] font-black uppercase text-turquoise tracking-widest mb-0.5">Timur</span>
                        <span className="font-extrabold text-navy text-sm leading-tight block">{profile.boundariesEast || "—"}</span>
                      </div>
                    </div>
                  </div>
                  </ScrollReveal>

                  {/* Deskripsi Geografis */}
                  <ScrollReveal>
                    <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                    <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">
                      Kondisi Geografis
                    </span>
                    <div className="text-slate-600 leading-loose text-base md:text-lg space-y-6">
                      {profile.geography.split("\n").map((paragraph, index) => (
                        paragraph.trim() ? (
                          <p key={index} className="font-medium text-slate-700 text-left">
                            {paragraph}
                          </p>
                        ) : null
                      ))}
                    </div>
                  </div>
                  </ScrollReveal>

                  {/* Peta Wilayah */}
                  {profile.mapUrl && (
                    <ScrollReveal>
                      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                      <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">
                        Peta Lokasi Desa
                      </span>
                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                        <iframe
                          src={profile.mapUrl}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen={true}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title="Peta Desa Nekmese"
                        />
                      </div>
                    </div>
                    </ScrollReveal>
                  )}
                </div>
              </section>

              {/* SEKSI 6: DATA KEPENDUDUKAN */}
              <section id="kependudukan" className="scroll-mt-32">
                <span className="block text-[#0f172a]/40 font-black tracking-widest text-[10px] uppercase mb-2">
                  Demografi Warga
                </span>
                <h2 className="text-3xl font-extrabold text-navy tracking-tight mb-8">
                  Kependudukan & Statistik Desa
                </h2>

                <div className="space-y-6">
                  {/* Stat Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Total Penduduk", value: profile.populationTotal, unit: "Jiwa", color: "text-[#14b8a6]" },
                      { label: "Kepala Keluarga (KK)", value: profile.populationFamilies, unit: "KK", color: "text-amber-500" },
                      { label: "Penduduk Laki-Laki", value: profile.populationMale, unit: "Jiwa", color: "text-blue-500" },
                      { label: "Penduduk Perempuan", value: profile.populationFemale, unit: "Jiwa", color: "text-pink-500" },
                    ].map((stat, idx) => (
                      <ScrollReveal key={idx} delay={idx * 0.05} className="w-full">
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 w-full h-full">
                          <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                            {stat.label}
                          </span>
                          <div className="flex items-baseline gap-2 mt-2">
                            <span className={`text-2xl md:text-3xl font-black ${stat.color}`}>
                              {stat.value.toLocaleString("id-ID")}
                            </span>
                            <span className="text-xs text-slate-400 font-semibold">{stat.unit}</span>
                          </div>
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>

                  {/* Gender ratio bar chart */}
                  {profile.populationTotal > 0 && (
                    <ScrollReveal>
                      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                      <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">
                        Rasio Jenis Kelamin
                      </span>
                      
                      {(() => {
                        const malePct = Math.round((profile.populationMale / profile.populationTotal) * 100) || 50;
                        const femalePct = 100 - malePct;

                        return (
                          <div className="space-y-4">
                            <div className="h-6 w-full rounded-full overflow-hidden flex bg-slate-50 border border-slate-100/50 p-0.5">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full flex items-center justify-center text-[10px] font-black text-white rounded-full transition-all duration-550"
                                style={{ width: `${malePct}%` }}
                              >
                                {malePct}%
                              </div>
                              <div
                                className="bg-gradient-to-r from-pink-500 to-pink-600 h-full flex items-center justify-center text-[10px] font-black text-white rounded-full transition-all duration-550 -ml-1"
                                style={{ width: `${femalePct}%` }}
                              >
                                {femalePct}%
                              </div>
                            </div>

                            <div className="flex justify-between items-center text-xs font-bold text-slate-500 px-1">
                              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-500 rounded-full" /> Laki-Laki ({profile.populationMale.toLocaleString("id-ID")} Jiwa)</span>
                              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-pink-500 rounded-full" /> Perempuan ({profile.populationFemale.toLocaleString("id-ID")} Jiwa)</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                    </ScrollReveal>
                  )}
                </div>
              </section>

              {/* SEKSI 7: STRUKTUR ORGANISASI */}
              <section id="struktur" className="scroll-mt-32">
                <span className="block text-[#0f172a]/40 font-black tracking-widest text-[10px] uppercase mb-2">
                  Tata Pemerintahan
                </span>
                <h2 className="text-3xl font-extrabold text-navy tracking-tight mb-8">
                  Struktur Organisasi Pemerintahan Desa
                </h2>

                <ScrollReveal>
                  <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all duration-300">
                    {profile.structureImageUrl ? (
                      <ZoomableImage
                        src={profile.structureImageUrl}
                        alt="Struktur Organisasi Desa Nekmese"
                      />
                    ) : (
                      <div className="w-full aspect-[16/9] rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-200 text-slate-400 italic">
                        Bagan struktur organisasi belum diunggah.
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              </section>

              {/* SEKSI 8: POTENSI DESA */}
              <section id="potensi" className="scroll-mt-32">
                <span className="block text-[#0f172a]/40 font-black tracking-widest text-[10px] uppercase mb-2">
                  Sumber Daya & Ekonomi
                </span>
                <h2 className="text-3xl font-extrabold text-navy tracking-tight mb-8">
                  Potensi & Komoditas Unggulan
                </h2>

                <ScrollReveal>
                  <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                    <div className="text-slate-600 leading-loose text-base md:text-lg space-y-6">
                      {profile.potential.split("\n").map((paragraph, index) => (
                        paragraph.trim() ? (
                          <p key={index} className="font-medium text-slate-700 text-left">
                            {paragraph}
                          </p>
                        ) : null
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              </section>

              {/* SEKSI 9: LEMBAGA & SARANA */}
              <section id="lembaga" className="scroll-mt-32">
                <span className="block text-[#0f172a]/40 font-black tracking-widest text-[10px] uppercase mb-2">
                  Sosial & Fasilitas
                </span>
                <h2 className="text-3xl font-extrabold text-navy tracking-tight mb-8">
                  Lembaga Kemasyarakatan & Sarana
                </h2>

                <div className="space-y-8">
                  {/* Lembaga */}
                  <ScrollReveal>
                    <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                    <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">
                      Lembaga Kemasyarakatan Desa
                    </span>
                    <div className="text-slate-600 leading-loose text-base md:text-lg space-y-6">
                      {profile.organizations.split("\n").map((paragraph, index) => (
                        paragraph.trim() ? (
                          <p key={index} className="font-medium text-slate-700 text-left">
                            {paragraph}
                          </p>
                        ) : null
                      ))}
                    </div>
                  </div>
                  </ScrollReveal>

                  {/* Sarpras */}
                  <ScrollReveal>
                    <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                    <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">
                      Sarana & Prasarana Desa
                    </span>
                    <div className="text-slate-600 leading-loose text-base md:text-lg space-y-6">
                      {profile.facilities.split("\n").map((paragraph, index) => (
                        paragraph.trim() ? (
                          <p key={index} className="font-medium text-slate-700 text-left">
                            {paragraph}
                          </p>
                        ) : null
                      ))}
                    </div>
                  </div>
                  </ScrollReveal>

                  {/* Prestasi */}
                  <ScrollReveal delay={0.1}>
                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-8 text-stone-955 shadow-md flex items-start gap-4 hover:shadow-lg transition-all duration-300">
                    <div className="p-3 bg-white/20 text-stone-955 rounded-xl mt-1">
                      <Trophy size={24} className="stroke-2 text-stone-950" />
                    </div>
                    <div className="flex-1">
                      <span className="block text-[10px] text-stone-900/60 font-black uppercase tracking-widest mb-3">
                        Prestasi & Program Unggulan
                      </span>
                      <div className="text-stone-950 font-bold leading-loose text-base md:text-lg space-y-5">
                        {profile.achievements.split("\n").map((paragraph, index) => (
                          paragraph.trim() ? (
                            <p key={index} className="text-left tracking-wide">
                              {paragraph}
                            </p>
                          ) : null
                        ))}
                      </div>
                    </div>
                  </div>
                  </ScrollReveal>
                </div>
              </section>

              {/* SEKSI 10: LOKASI TITIK AIR */}
              <section id="titik-air" className="scroll-mt-32">
                <span className="block text-[#0f172a]/40 font-black tracking-widest text-[10px] uppercase mb-2">
                  Infrastruktur Air Bersih
                </span>
                <h2 className="text-3xl font-extrabold text-navy tracking-tight mb-8">
                  Lokasi Titik Air
                </h2>

                <ScrollReveal>
                  <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                    <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <p className="text-slate-600 font-medium leading-relaxed text-sm md:text-base max-w-2xl">
                      Peta persebaran fasilitas air bersih dan sumber air yang dapat diakses oleh warga di sekitar wilayah Desa Nekmese.
                    </p>
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-bold text-xs uppercase tracking-wider shrink-0">
                      <Droplets className="w-4 h-4" />
                      {waterSources.length} Titik Lokasi
                    </div>
                  </div>
                  
                  <DynamicWaterSourceMap sources={waterSources} />
                  
                  {/* Daftar Mata Air */}
                  {waterSources.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-slate-100">
                      <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">
                        Daftar Mata Air & Fasilitas
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {waterSources.map((source) => (
                          <Link 
                            key={source.id} 
                            href={`/profil/titik-air/${source.slug}`}
                            className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 hover:border-turquoise/30 hover:shadow-md hover:shadow-turquoise/5 bg-slate-50/50 hover:bg-white transition-all group"
                          >
                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 overflow-hidden relative group-hover:scale-105 transition-transform">
                              {source.imageUrl ? (
                                <Image src={source.imageUrl} alt={source.name} fill className="object-cover" sizes="48px" />
                              ) : (
                                <Droplets className="w-6 h-6" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-navy text-sm mb-1 truncate group-hover:text-turquoise transition-colors">{source.name}</h4>
                              <p className="text-xs text-slate-500 line-clamp-2">{source.description}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                </ScrollReveal>
              </section>

              {/* SECTION DINAMIS YANG DIBUAT ADMIN */}
              {dynamicSections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-32">
                  <span className="block text-[#0f172a]/40 font-black tracking-widest text-[10px] uppercase mb-2">
                    Profil Tambahan
                  </span>
                  <h2 className="text-3xl font-extrabold text-navy tracking-tight mb-8">
                    {section.title}
                  </h2>

                  {section.description && (
                    <p className="text-slate-500 font-medium text-sm -mt-4 mb-6 leading-relaxed">
                      {section.description}
                    </p>
                  )}

                  <ScrollReveal>
                    <div className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-8 shadow-sm space-y-12">
                      {section.items.map((item, itemIdx) => {
                        const youtubeId = item.contentType === "YOUTUBE" ? getYouTubeId(item.youtubeUrl) : null;
                        
                        return (
                          <div 
                            key={item.id} 
                            id={`${section.id}-${item.id}`}
                            className="scroll-mt-32 border-b border-slate-100 last:border-0 pb-10 last:pb-0 space-y-4"
                          >
                            <h3 className="text-xl font-extrabold text-navy tracking-tight">
                              {item.title}
                            </h3>

                            {/* TEXT CONTENT */}
                            {item.contentType === "TEXT" && item.content && (
                              <div className="text-slate-650 font-medium leading-relaxed text-base space-y-4">
                                {item.content.split("\n").map((paragraph, pIdx) => (
                                  paragraph.trim() ? (
                                    <p key={pIdx}>{paragraph}</p>
                                  ) : null
                                ))}
                              </div>
                            )}

                            {/* IMAGE CONTENT */}
                            {item.contentType === "IMAGE" && item.imageUrl && (
                              <div className="space-y-3">
                                <div className="max-w-2xl mx-auto">
                                  <ZoomableImage
                                    src={item.imageUrl}
                                    alt={item.title}
                                  />
                                </div>
                                {item.content && (
                                  <p className="text-xs text-slate-500 font-medium text-center italic">
                                    {item.content}
                                  </p>
                                )}
                              </div>
                            )}

                            {/* YOUTUBE CONTENT */}
                            {item.contentType === "YOUTUBE" && youtubeId && (
                              <div className="space-y-4">
                                <div className="relative aspect-video w-full max-w-2xl mx-auto rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                                  <iframe
                                    src={`https://www.youtube.com/embed/${youtubeId}`}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title={item.title}
                                  />
                                </div>
                                {item.content && (
                                  <div className="text-slate-650 font-medium leading-relaxed text-sm max-w-2xl mx-auto">
                                    {item.content.split("\n").map((paragraph, pIdx) => (
                                      paragraph.trim() ? (
                                        <p key={pIdx}>{paragraph}</p>
                                      ) : null
                                    ))}
                                  </div>
                                  )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </ScrollReveal>
                </section>
              ))}

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
// Trigger HMR
