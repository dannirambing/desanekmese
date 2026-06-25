import HeroSection from "@/components/shared/HeroSection";
import SectionTitle from "@/components/shared/SectionTitle";
import DestinationCard from "@/components/shared/DestinationCard";
import CultureSection from "@/components/shared/CultureSection";
import UMKMSection from "@/components/shared/UMKMSection";
import {
  getFeaturedDestinations,
  getPublishedUMKMProducts,
  getPublishedCultureItems,
  getHeroSettings,
} from "@/lib/queries";

export const revalidate = 60;

export default async function Home() {
  // PERBAIKAN: Ubah localProducts menjadi publishedUMKMProducts
  const [publishedUMKMProducts, featuredDestinations, publishedCultureItems, heroSettings] = await Promise.all([
    getPublishedUMKMProducts(),
    getFeaturedDestinations(),
    getPublishedCultureItems(),
    getHeroSettings(),
  ]);

  return (
    <>
      <HeroSection settings={heroSettings} />

      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-6">
          <SectionTitle
            subtitle="Jelajahi Alam Kami"
            title="Destinasi Unggulan Nekmese"
          />

          {featuredDestinations.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100 mt-10">
              <p className="text-gray-400 text-lg">
                Belum ada destinasi wisata yang dipublikasikan saat ini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
              {featuredDestinations.map((dest) => {
                const imageUrl =
                  dest.media.length > 0
                    ? dest.media[0].url
                    : "/placeholder-image.jpg";

                return (
                  <DestinationCard
                    key={dest.id}
                    title={dest.name}
                    location={dest.location}
                    image={imageUrl}
                    slug={dest.slug}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      <CultureSection cultureItems={publishedCultureItems}/>
      {/* Sekarang variabel ini sudah terdefinisi dengan benar */}
      <UMKMSection products={publishedUMKMProducts} />
    </>
  );
}