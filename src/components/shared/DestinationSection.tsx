"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { MapPin, ArrowRight, Mountain } from "lucide-react";
import SectionTitle from "./SectionTitle";

interface DestinationItem {
  id: string;
  name: string;
  location: string;
  slug: string;
  description?: string | null;
  category?: { name: string } | null;
  media: { url: string }[];
}

interface DestinationStats {
  destinasiCount: number;
  mediaCount: number;
  kategoriCount: number;
}

interface DestinationSectionProps {
  destinations: DestinationItem[];
  stats: DestinationStats;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

const FALLBACK_DESCS = [
  "Nikmati keindahan alam Nekmese yang memukau dan menakjubkan.",
  "Jelajahi panorama alam nan hijau dan udara pegunungan yang segar.",
  "Temukan pesona tersembunyi di balik lembah dan perbukitan Nekmese.",
];

export default function DestinationSection({
  destinations,
  stats,
}: DestinationSectionProps) {
  const hasData = destinations.length > 0;

  return (
    <section className="py-24 bg-white overflow-hidden relative">
      {/* Aksen dekorasi latar belakang serasi dengan CultureSection (Flipped) */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-stone-50 -skew-x-12 -translate-x-20 z-0 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6">
        {/* ── Section Header & Stats (Selaras dengan Desain Profil & Budaya) ── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-16 pb-8 border-b border-slate-100">
          <div className="max-w-2xl">
            <SectionTitle
              subtitle="Jelajahi Alam Kami"
              title="Destinasi Unggulan Nekmese"
              alignment="left"
            />
            <p className="mt-4 text-slate-600 font-medium text-base md:text-lg leading-relaxed">
              Batu karang yang kokoh, air mengalir yang jernih, dan panorama alam nan asri. Temukan surga tersembunyi yang membentuk harmoni kehidupan di jantung Desa Nekmese.
            </p>
          </div>

          {/* Statistik Cepat: Selaras dengan model CultureSection */}
          <div className="flex items-center gap-6 px-6 py-4 bg-stone-50 border border-stone-200/50 rounded-2xl shadow-sm self-start lg:self-auto flex-shrink-0">
            <div>
              <span className="block text-3xl font-black text-amber-500">
                {stats.destinasiCount}+
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                Destinasi
              </span>
            </div>
            <div className="w-px h-10 bg-slate-200"></div>
            <div>
              <span className="block text-3xl font-black text-amber-500">
                {stats.mediaCount}+
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                Spot Foto
              </span>
            </div>
            <div className="w-px h-10 bg-slate-200"></div>
            <div>
              <span className="block text-3xl font-black text-amber-500">
                {stats.kategoriCount}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                Kategori
              </span>
            </div>
          </div>
        </div>

        {/* ── Grid Destinasi ── */}
        {!hasData ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {destinations.map((dest, i) => {
              const imageUrl = dest.media.length > 0 ? dest.media[0].url : null;
              const desc =
                dest.description || FALLBACK_DESCS[i % FALLBACK_DESCS.length];
              const category = dest.category?.name ?? "Wisata Alam";

              return (
                <motion.div
                  key={dest.id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                >
                  <DestinationCard
                    title={dest.name}
                    location={dest.location}
                    description={desc}
                    category={category}
                    image={imageUrl}
                    slug={dest.slug}
                  />
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ── Button Eksplorasi: Desain Selaras dengan CultureSection ── */}
        <div className="mt-16 flex justify-center">
          <Link href="/wisata">
            <button className="flex items-center justify-center gap-3 bg-[#0f172a] hover:bg-[#14b8a6] text-white px-8 py-4 rounded-full font-bold uppercase text-xs tracking-widest transition-all hover:gap-4 w-full sm:w-auto shadow-xl shadow-[#0f172a]/10">
              Eksplorasi Semua Wisata <ArrowRight size={16} strokeWidth={3} />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Komponen Destination Card Diperbarui ─── */
interface CardProps {
  title: string;
  image: string | null;
  location: string;
  description: string;
  category: string;
  slug: string;
}

function DestinationCard({
  title,
  image,
  location,
  description,
  category,
  slug,
}: CardProps) {
  return (
    <Link
      href={`/destinasi/${slug}`}
      className="group relative block aspect-[4/5] rounded-2xl overflow-hidden shadow-xl bg-stone-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5"
    >
      {/* Gambar Latar */}
      {image ? (
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-active:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-stone-200">
          <Mountain size={44} className="text-stone-400" />
        </div>
      )}

      {/* Overlay Gelap dengan Paduan Gradasi Teal Khas Nekmese */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#14b8a6]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Konten Teks di Atas Overlay (Gaya Overlay CultureSection) */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end text-white z-10">
        <div>
          {/* Tag Kategori (Aksen Amber Leluhur) */}
          <span className="text-amber-400 font-bold tracking-widest text-[10px] uppercase block mb-1">
            {category}
          </span>

          {/* Judul Destinasi */}
          <h3 className="text-xl md:text-2xl font-black leading-tight drop-shadow-md mb-2 group-hover:text-amber-300 transition-colors duration-300">
            {title}
          </h3>

          {/* Penanda Lokasi */}
          <div className="flex items-center gap-1.5 text-white/80 mb-3 text-xs font-semibold">
            <MapPin size={13} className="text-[#14b8a6] flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          {/* Deskripsi Singkat */}
          <p className="text-xs text-white/70 leading-relaxed line-clamp-2 transition-all duration-300 opacity-90 group-hover:text-white">
            {description}
          </p>

          {/* Panah Navigasi Detail */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/80 group-hover:text-amber-400 transition-colors duration-300">
            <span>Detail Wisata</span>
            <ArrowRight
              size={12}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Komponen Empty State ─── */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 rounded-2xl border border-stone-200/50 bg-stone-50"
    >
      <div className="w-20 h-20 rounded-full bg-turquoise/10 border border-turquoise/20 flex items-center justify-center mb-6">
        <Mountain size={36} className="text-turquoise/60" />
      </div>
      <h3 className="text-[#0f172a] text-xl font-black mb-2">Belum Ada Destinasi</h3>
      <p className="text-slate-500 text-sm text-center max-w-xs leading-relaxed">
        Destinasi wisata unggulan Nekmese sedang dalam tahap kurasi dan akan segera dipublikasikan.
      </p>
    </motion.div>
  );
}

