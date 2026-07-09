import { notFound } from "next/navigation";
import Link from "next/link";
import { Megaphone, CalendarDays } from "lucide-react";
import SafeImage from "@/components/shared/SafeImage";
import HeroImageOverlay from "@/components/shared/HeroImageOverlay";
import { getAnnouncementBySlug } from "@/lib/queries";
import { formatIndonesianDate, toIsoDateTime } from "@/lib/format-date";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const announcement = await getAnnouncementBySlug(slug);

  if (!announcement) {
    return { title: "Pengumuman Tidak Ditemukan | Desa Nekmese" };
  }

  return {
    title: `${announcement.title} | Pengumuman Desa Nekmese`,
    description: announcement.content.slice(0, 160),
  };
}

export default async function PengumumanDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const announcement = await getAnnouncementBySlug(slug);

  if (!announcement || announcement.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="relative w-full h-[45vh] md:h-[55vh] bg-stone-200">
        {announcement.imageUrl ? (
          <SafeImage
            src={announcement.imageUrl}
            alt={announcement.title}
            className="object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-stone-400 bg-stone-100">
            <Megaphone className="w-16 h-16 text-amber-500/40 mb-2" />
            <span className="text-sm font-semibold tracking-wider uppercase text-stone-400">
              Pengumuman Resmi
            </span>
          </div>
        )}
        <HeroImageOverlay />
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-20">
        <article className="bg-white rounded-2xl shadow-lg border border-stone-200/60 p-6 md:p-16 max-w-3xl mx-auto">
          {/* Category label */}
          <div className="text-center mb-6">
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-stone-400 bg-stone-100 px-3 py-1 rounded">
              {announcement.category || "PENGUMUMAN RESMI"}
            </span>
          </div>

          {/* Headline - Large Sans-serif Centered with tight tracking */}
          <h1 className="text-3xl md:text-5xl font-black text-center text-stone-900 mb-6 leading-[1.2] tracking-tight max-w-2xl mx-auto">
            {announcement.title}
          </h1>

          {/* Divider Line Top */}
          <div className="border-t border-stone-200 mt-8 mb-3 max-w-xl mx-auto"></div>

          {/* Metadata: Byline and Date */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-stone-500 font-bold uppercase tracking-wider mb-3">
            <span className="flex items-center gap-1">
              <Megaphone size={12} className="text-stone-400" />
              Pemerintah Desa Nekmese
            </span>
            <span className="hidden sm:inline text-stone-300">•</span>
            <time dateTime={toIsoDateTime(announcement.createdAt)} className="flex items-center gap-1">
              <CalendarDays size={12} className="text-stone-400" />
              {formatIndonesianDate(announcement.createdAt)}
            </time>
          </div>

          {/* Divider Line Bottom */}
          <div className="border-b border-stone-200 mb-8 max-w-xl mx-auto"></div>

          {/* Body Content - Clean sans-serif, readable leading and text-lg */}
          <div className="text-stone-700 leading-relaxed text-base md:text-lg space-y-6 max-w-2xl mx-auto tracking-wide antialiased">
            {announcement.content.split("\n").map((paragraph, index) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;

              return (
                <p key={index} className="text-left font-medium">
                  {trimmed}
                </p>
              );
            })}
          </div>

          <div className="mt-16 pt-8 border-t border-stone-200/60 max-w-2xl mx-auto">
            <Link
              href="/pengumuman"
              className="inline-flex items-center text-xs font-black text-amber-800 hover:text-stone-950 transition-colors uppercase tracking-widest"
            >
              ← Kembali ke Daftar Pengumuman
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
