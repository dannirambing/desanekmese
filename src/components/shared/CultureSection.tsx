"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import SectionTitle from "./SectionTitle";

// Mendefinisikan tipe data yang diterima dari database
interface CultureItem {
  name: string;
  category?: { name: string };
  media: { url: string }[];
}

interface CultureSectionProps {
  cultureItems: CultureItem[];
}

export default function CultureSection({ cultureItems = [] }: CultureSectionProps) {
  // Mengambil 2 data budaya teratas dari database
  const mainItem = cultureItems[0];
  const secondaryItem = cultureItems[1];

  // Ekstraksi Gambar & Teks (dengan fallback ke placeholder jika data kosong)
  const mainImage = mainItem?.media?.[0]?.url || "https://azhuh458gn.ufs.sh/f/IDwrE8y2GhNiFiq1eWAfVkoyK8aqUEzhAuwH3QBrdvnObJpP";
  const mainTitle = mainItem?.name || "Tenun Motif Buna";
  const mainCategory = mainItem?.category?.name || "Mahakarya";

  const secondaryImage = secondaryItem?.media?.[0]?.url || "https://azhuh458gn.ufs.sh/f/IDwrE8y2GhNiFiq1eWAfVkoyK8aqUEzhAuwH3QBrdvnObJpP";
  const secondaryTitle = secondaryItem?.name || "Kehidupan Tradisional Nekmese";

  return (
    <section className="py-24 bg-stone-50 overflow-hidden relative">
      {/* Dekorasi Latar Belakang (Aksen Motif) */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-stone-100 -skew-x-12 translate-x-20 z-0" />
      
      <div className="container relative z-10 mx-auto px-6">
        <SectionTitle 
          subtitle="Warisan Leluhur Atoni Meto" 
          title="Kearifan & Mahakarya Desa" 
          alignment="left"
        />

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-8 mt-16 items-center">
          
          {/* Kolom Kiri: Komposisi Gambar Tumpang Tindih (Dinamic Database) */}
          <div className="w-full lg:w-1/2 relative h-[500px] md:h-[600px]">
            {/* Gambar Utama */}
            <motion.div
              initial={{ opacity: 1, x: 0 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="absolute top-0 left-0 w-3/4 h-4/5 rounded-2xl overflow-hidden shadow-2xl z-10 bg-stone-200"
            >
              <Image
                src={mainImage}
                alt={mainTitle}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white pr-4">
                <span className="text-amber-400 font-bold tracking-widest text-[10px] uppercase block mb-1">
                  {mainCategory}
                </span>
                <h4 className="text-lg md:text-xl font-bold leading-tight drop-shadow-md">
                  {mainTitle}
                </h4>
              </div>
            </motion.div>

            {/* Gambar Pendukung */}
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="absolute bottom-0 right-0 w-3/5 h-2/3 rounded-2xl overflow-hidden shadow-xl z-20 border-4 border-stone-50 bg-stone-200"
            >
              <Image
                src={secondaryImage}
                alt={secondaryTitle}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 30vw"
              />
            </motion.div>
          </div>

          {/* Kolom Kanan: Teks Storytelling */}
          <div className="w-full lg:w-1/2 lg:pl-12 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-3xl md:text-4xl font-black text-[#0f172a] mb-6 leading-tight tracking-tight">
                Helai Benang, <span className="text-[#14b8a6]">Untaian Doa.</span>
              </h3>
              
              <div className="space-y-6 text-slate-600 font-medium text-base md:text-lg leading-relaxed">
                <p>
                  Bagi masyarakat Desa Nekmese, tenun bukanlah sekadar pakaian pelindung tubuh. Setiap helai benang yang diikat dan dicelup warna alami adalah manifestasi dari doa, harapan, dan sejarah perjalanan suku yang diwariskan dari para pendahulu.
                </p>
                <p>
                  Di bawah naungan <i className="font-bold text-[#0f172a]">Ume Kbubu</i> (Rumah Bulat tradisional), kearifan lokal terus dijaga. Harmoni antara manusia, alam, dan Sang Pencipta tercermin dalam setiap motif yang dikerjakan dengan penuh kesabaran oleh tangan-tangan terampil perempuan desa.
                </p>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-6">
                <Link href="/budaya">
                  {/* Perbaikan kontras warna teks tombol (menjadi text-white) */}
                  <button className="flex items-center justify-center gap-3 bg-[#0f172a] hover:bg-[#14b8a6] text-white px-8 py-4 rounded-full font-bold uppercase text-xs tracking-widest transition-all hover:gap-4 w-full sm:w-auto shadow-xl shadow-[#0f172a]/10">
                    Eksplorasi Budaya <ArrowRight size={16} strokeWidth={3} />
                  </button>
                </Link>
                
                {/* Statistik Cepat Budaya */}
                <div className="flex items-center gap-6 px-4">
                  <div>
                    <span className="block text-2xl font-black text-amber-500">20+</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Motif Tenun</span>
                  </div>
                  <div className="w-px h-10 bg-slate-200"></div>
                  <div>
                    <span className="block text-2xl font-black text-amber-500">100%</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Warna Alami</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}