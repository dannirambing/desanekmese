"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowDownCircle } from "lucide-react";

const HERO_POSTER =
  "https://images.unsplash.com/photo-1698737474049-2858da07eaff?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHRpbW9yfGVufDB8fDB8fHww";

export default function HeroSection() {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-stone-900 z-0">

      {/* Background Image menggantikan Video */}
      <img
        src={HERO_POSTER}
        alt="Pemandangan Desa Nekmese"
        className="absolute inset-0 z-0 w-full h-full object-cover brightness-90 pointer-events-none"
      />

      {/* Overlay Gradients */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-amber-950/70 via-stone-900/20 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-teal-900/40 via-transparent to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-stone-900/30 via-transparent to-stone-900/30" />

      {/* Konten Utama */}
      <div className="container relative z-30 mx-auto px-6 text-center text-white mt-16">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <span
            className="text-amber-300 font-bold tracking-[0.3em] uppercase mb-6 text-xs md:text-sm border border-amber-300/40 px-6 py-2 rounded-full backdrop-blur-sm bg-black/20 inline-block"
            style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}
          >
            Desa Nekmese, Timor · NTT
          </span>

          <div>
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-3 leading-[0.95] tracking-tighter max-w-5xl text-white"
              style={{
                textShadow:
                  "0 2px 16px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.7)",
              }}
            >
              Nekaf{" "}
              <span className="text-stone-200">Mese,</span>
            </h1>

            <h2
              className="text-2xl md:text-4xl lg:text-5xl font-light italic text-white/90 mb-3 tracking-wide"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
            >
              Atoni Meto Nao Fatu Nao Oe.
            </h2>

            <p
              className="text-amber-200/80 text-sm md:text-base font-light tracking-widest uppercase mb-10"
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.7)" }}
            >
              &quot;Satu Hati · Berjalan di Atas Batu dan Air&quot;
            </p>
          </div>

          <p
            className="max-w-xl mx-auto text-white/85 mb-12 text-base md:text-lg font-light leading-relaxed"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
          >
            Dari tanah Timor yang kuat bagai batu, dan jiwa yang mengalir bagai
            air, Desa Nekmese menyambut Anda dengan ketulusan budaya leluhur.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Button
              asChild
              size="lg"
              className="bg-turquoise/90 hover:bg-turquoise text-white rounded-full px-12 py-7 font-bold uppercase text-sm tracking-wider shadow-lg shadow-teal-900/40 transition-all hover:scale-105"
            >
              <Link href="/wisata">Jelajahi Destinasi</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Tombol Gulir */}
      <motion.div
        onClick={scrollToContent}
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        className="absolute bottom-8 z-30 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors cursor-pointer flex flex-col items-center gap-2"
      >
        <span className="text-xs uppercase tracking-[0.2em]">Gulir</span>
        <ArrowDownCircle size={28} strokeWidth={1} />
      </motion.div>
    </section>
  );
}