import HeroSection from "@/components/shared/HeroSection";
import HomeSubNavbar from "./HomeSubNavbar";
import { Suspense } from "react";
import { getHeroSettings } from "@/lib/queries";

// Import Wrapper Server Components
import CultureSectionWrapper from "@/components/shared/CultureSectionWrapper";
import DestinationSectionWrapper from "@/components/shared/DestinationSectionWrapper";
import UMKMSectionWrapper from "@/components/shared/UMKMSectionWrapper";
import NewsAndAnnouncementSectionWrapper from "@/components/shared/NewsAndAnnouncementSectionWrapper";

// Import Skeletons
import CultureSectionSkeleton from "@/components/shared/skeletons/CultureSectionSkeleton";
import DestinationSectionSkeleton from "@/components/shared/skeletons/DestinationSectionSkeleton";
import UMKMSectionSkeleton from "@/components/shared/skeletons/UMKMSectionSkeleton";
import NewsAndAnnouncementSectionSkeleton from "@/components/shared/skeletons/NewsAndAnnouncementSectionSkeleton";

export const revalidate = 60;

export default async function Home() {
  // Hanya fetch data HeroSection yang berada di "above the fold"
  const heroSettings = await getHeroSettings();

  return (
    <>
      <HeroSection settings={heroSettings} />

      {/* Navigasi Sub-Navbar Horizontal Lengket (Daftar Isi Beranda) */}
      <HomeSubNavbar />

      {/* Bagian Kultur dipindah ke sini, tepat setelah Hero Section */}
      <div id="kultur" className="scroll-mt-32">
        <Suspense fallback={<CultureSectionSkeleton />}>
          <CultureSectionWrapper />
        </Suspense>
      </div>

      {/* Bagian Destinasi — komponen baru yang lebih kaya */}
      <div id="destinasi" className="scroll-mt-32">
        <Suspense fallback={<DestinationSectionSkeleton />}>
          <DestinationSectionWrapper />
        </Suspense>
      </div>

      {/* Sekarang variabel ini sudah terdefinisi dengan benar */}
      <div id="umkm" className="scroll-mt-32">
        <Suspense fallback={<UMKMSectionSkeleton />}>
          <UMKMSectionWrapper />
        </Suspense>
      </div>

      {/* Seksi Berita & Pengumuman Desa */}
      <div id="berita" className="scroll-mt-32">
        <Suspense fallback={<NewsAndAnnouncementSectionSkeleton />}>
          <NewsAndAnnouncementSectionWrapper />
        </Suspense>
      </div>
    </>
  );
}