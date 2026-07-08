"use client";

import Link from "next/link";
import { ArrowRight, Megaphone, Newspaper, Calendar } from "lucide-react";
import SectionTitle from "./SectionTitle";
import NewsCard from "./NewsCard";
import { formatIndonesianDate, toIsoDateTime } from "@/lib/format-date";
import type { NewsArticle, Announcement, MediaFile } from "@prisma/client";
import { motion, type Variants } from "framer-motion";

interface NewsArticleWithMedia extends NewsArticle {
  media: MediaFile[];
}

interface NewsAndAnnouncementSectionProps {
  newsArticles: NewsArticleWithMedia[];
  announcements: Announcement[];
}

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" },
  }),
};

export default function NewsAndAnnouncementSection({
  newsArticles = [],
  announcements = [],
}: NewsAndAnnouncementSectionProps) {
  // Ambil maksimal 4 berita terbaru untuk halaman depan
  const latestNews = newsArticles.slice(0, 4);
  // Ambil maksimal 6 pengumuman terbaru
  const latestAnnouncements = announcements.slice(0, 6);

  // Jika kedua data kosong, jangan render seksi ini
  if (latestNews.length === 0 && latestAnnouncements.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Aksen dekorasi latar belakang serasi dengan DestinationSection (Flipped) */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-stone-50 -skew-x-12 -translate-x-20 z-0 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6">
        {/* ── Section Header & Stats (Selaras dengan Desain Profil, Budaya, Wisata & UMKM) ── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-16 pb-8 border-b border-stone-200/60">
          <div className="max-w-2xl">
            <SectionTitle
              subtitle="Kabar & Informasi"
              title="Berita & Pengumuman Desa"
              alignment="left"
            />
            <p className="mt-4 text-slate-600 font-medium text-base md:text-lg leading-relaxed">
              Ikuti terus rilis berita terbaru, liputan agenda kegiatan, serta informasi pengumuman penting resmi dari pemerintah Desa Nekmese.
            </p>
          </div>

          {/* Statistik Cepat: Selaras dengan Wisata & UMKM */}
          <div className="flex items-center gap-6 px-6 py-4 bg-stone-50 border border-stone-200/50 rounded-2xl shadow-sm self-start lg:self-auto flex-shrink-0">
            <div>
              <span className="block text-3xl font-black text-amber-500">
                {newsArticles.length}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                Rilis Berita
              </span>
            </div>
            <div className="w-px h-10 bg-slate-200"></div>
            <div>
              <span className="block text-3xl font-black text-amber-500">
                {announcements.length}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                Pengumuman
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mt-12">
          {/* Kolom Kiri: Berita Terbaru Desa Nekmese (Lebar 8 Kolom) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-6">
                <div className="p-2 bg-turquoise/10 text-turquoise rounded-xl">
                  <Newspaper size={20} className="stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-black text-navy uppercase tracking-wider">
                  Berita Terbaru Desa Nekmese
                </h3>
              </div>

              {latestNews.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-slate-400">Belum ada berita yang dipublikasikan.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {latestNews.map((article, i) => {
                    const imageUrl =
                      article.media.length > 0
                        ? article.media[0].url
                        : "/placeholder-image.jpg";
                    const displayDate = article.publishedAt ?? article.createdAt;

                    return (
                      <motion.div
                        key={article.id}
                        custom={i}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-40px" }}
                        className="flex"
                      >
                        <NewsCard
                          title={article.title}
                          summary={article.summary}
                          image={imageUrl}
                          slug={article.slug}
                          date={displayDate}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {latestNews.length > 0 && (
              <div className="mt-8">
                <Link href="/berita">
                  <button className="flex items-center justify-center gap-2 bg-[#0f172a] hover:bg-[#14b8a6] text-white px-6 py-3 rounded-full font-bold uppercase text-[10px] tracking-widest transition-all hover:gap-3 shadow-md shadow-[#0f172a]/10">
                    Lihat Semua Berita <ArrowRight size={14} strokeWidth={2.5} />
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Kolom Kanan: Pengumuman Desa (Lebar 4 Kolom) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-6">
                <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
                  <Megaphone size={20} className="stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-black text-navy uppercase tracking-wider">
                  Pengumuman Desa
                </h3>
              </div>

              {latestAnnouncements.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-slate-400">Belum ada pengumuman desa.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {latestAnnouncements.map((announcement, i) => (
                    <motion.div
                      key={announcement.id}
                      custom={i}
                      variants={cardVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-40px" }}
                    >
                      <Link
                        href={`/pengumuman/${announcement.slug}`}
                        className="group block bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-amber-400/50 transition-all duration-300 transform hover:-translate-y-0.5"
                      >
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-2">
                          <Calendar size={13} className="text-amber-500" />
                          <time dateTime={toIsoDateTime(announcement.createdAt)}>
                            {formatIndonesianDate(announcement.createdAt)}
                          </time>
                        </div>
                        <h4 className="text-base font-extrabold text-[#0f172a] group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
                          {announcement.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed font-light">
                          {announcement.content}
                        </p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {latestAnnouncements.length > 0 && (
              <div className="mt-8">
                <Link href="/pengumuman">
                  <button className="flex items-center justify-center gap-2 bg-[#0f172a] hover:bg-[#14b8a6] text-white px-6 py-3 rounded-full font-bold uppercase text-[10px] tracking-widest transition-all hover:gap-3 shadow-md shadow-[#0f172a]/10">
                    Semua Pengumuman <ArrowRight size={14} strokeWidth={2.5} />
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

