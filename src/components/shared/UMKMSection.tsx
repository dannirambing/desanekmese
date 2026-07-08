"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionTitle from "./SectionTitle";
import ProductCard from "./ProductCard";
import type { ProductUMKM } from "@prisma/client";
import { motion, type Variants } from "framer-motion";

interface UMKMStats {
  productCount: number;
  ownerCount: number;
}

type UMKMSectionProps = {
  products: ProductUMKM[];
  stats: UMKMStats;
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" },
  }),
};

export default function UMKMSection({ products, stats }: UMKMSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-24 bg-stone-50 overflow-hidden relative">
      {/* Aksen dekorasi latar belakang serasi dengan CultureSection */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-stone-100 -skew-x-12 translate-x-20 z-0 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6">
        {/* ── Section Header & Stats (Flipped Layout: Stats Kiri, Tulisan Kanan) ── */}
        <div className="flex flex-col lg:flex-row-reverse lg:items-end lg:justify-between gap-10 mb-16 pb-8 border-b border-stone-200/60">
          {/* Tulisan berada di sebelah kanan */}
          <div className="max-w-2xl">
            <SectionTitle
              subtitle="Dukung Ekonomi Lokal"
              title="Karya Tangan & Hasil Bumi"
              alignment="left"
            />
            <p className="mt-4 text-slate-600 font-medium text-base md:text-lg leading-relaxed">
              Dukung kesejahteraan pengrajin dan petani Desa Nekmese dengan membeli produk anyaman tenun asli Buna, hasil bumi segar, serta kerajinan tangan berkualitas tinggi.
            </p>
          </div>

          {/* Statistik Cepat berada di sebelah kiri */}
          <div className="flex items-center gap-6 px-6 py-4 bg-white border border-stone-200/50 rounded-2xl shadow-sm self-start lg:self-auto flex-shrink-0">
            <div>
              <span className="block text-3xl font-black text-amber-500">
                {stats.productCount}+
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                Produk Unggulan
              </span>
            </div>
            <div className="w-px h-10 bg-slate-200"></div>
            <div>
              <span className="block text-3xl font-black text-amber-500">
                {stats.ownerCount}+
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                Produsen Lokal
              </span>
            </div>
          </div>
        </div>

        {/* ── Grid Produk UMKM ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="flex w-full"
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </div>

        {/* ── Button Eksplorasi: Desain Bulat Hitam Premium (Selaras dengan Budaya & Wisata) ── */}
        <div className="mt-16 flex justify-center">
          <Link href="/umkm">
            <button className="flex items-center justify-center gap-3 bg-[#0f172a] hover:bg-[#14b8a6] text-white px-8 py-4 rounded-full font-bold uppercase text-xs tracking-widest transition-all hover:gap-4 w-full sm:w-auto shadow-xl shadow-[#0f172a]/10">
              Eksplorasi Produk UMKM <ArrowRight size={16} strokeWidth={3} />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

