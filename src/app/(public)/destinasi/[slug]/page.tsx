import { notFound } from "next/navigation";
import SafeImage from "@/components/shared/SafeImage";
import HeroImageOverlay from "@/components/shared/HeroImageOverlay";
import { getTourismPlaceBySlug } from "@/lib/queries";
import { Map } from "lucide-react";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export default async function DetailWisataPage({ params }: PageProps) {
  const { slug } = await params;
  const place = await getTourismPlaceBySlug(slug);

  if (!place) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="relative w-full h-[50vh] md:h-[65vh] bg-stone-200">
        {place.media && place.media.length > 0 ? (
          <SafeImage
            src={place.media[0].url}
            alt={place.name}
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-stone-400">
            Gambar tidak tersedia
          </div>
        )}
        <HeroImageOverlay />
      </div>

      <div className="container mx-auto px-6 -mt-20 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-5xl mx-auto flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-2/3">
            <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 mb-4 leading-tight">
              {place.name}
            </h1>
            <p className="text-stone-500 mb-8 font-semibold tracking-wide text-sm">{place.location}</p>
            <div className="text-stone-600 leading-loose text-base md:text-lg space-y-6">
              {place.description.split("\n").map((paragraph, index) => (
                paragraph.trim() ? (
                  <p key={index} className="font-medium text-stone-700 text-justify tracking-wide">
                    {paragraph}
                  </p>
                ) : null
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-stone-50 p-6 rounded-2xl border">
              <h3 className="text-[11px] font-extrabold uppercase text-stone-400 tracking-widest mb-6 flex items-center gap-3">
                <span className="w-5 h-px bg-stone-300 block"></span>
                Informasi
              </h3>
              <p className="text-sm">
                Jam: {place.openHours || "08:00 - 17:00 WITA"}
              </p>
              {place.mapUrl && (
                <a
                  href={place.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex items-center justify-center gap-2 w-full bg-stone-900 text-white py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-gold transition-colors"
                >
                  <Map size={16} /> Buka di Google Maps
                </a>
              )}
            </div>
            <div className="bg-stone-50 p-6 rounded-2xl border">
              <h3 className="text-[11px] font-extrabold uppercase text-stone-400 tracking-widest mb-6 flex items-center gap-3">
                <span className="w-5 h-px bg-stone-300 block"></span>
                Fasilitas
              </h3>
              <ul className="space-y-2">
                {place.facilities.map((f, i) => (
                  <li key={i} className="text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
