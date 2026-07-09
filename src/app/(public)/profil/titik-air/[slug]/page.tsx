import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, MapPin, Calendar, ExternalLink } from "lucide-react";
import TitikAirGallery from "@/components/shared/TitikAirGallery";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const source = await prisma.waterSource.findUnique({ where: { slug } });
  
  if (!source) {
    return {
      title: "Titik Air Tidak Ditemukan",
    };
  }

  return {
    title: `${source.name} | Titik Air Desa Nekmese`,
    description: source.description.substring(0, 160),
  };
}

export default async function WaterSourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const source = await prisma.waterSource.findUnique({ where: { slug } });

  if (!source || source.status !== "PUBLISHED") {
    notFound();
  }

  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${source.latitude},${source.longitude}`;

  return (
    <>
      <section className="relative w-full pt-32 pb-20 md:pt-40 md:pb-24 flex items-center justify-center bg-slate-900 overflow-hidden">
        {source.imageUrl && (
          <div className="absolute inset-0 z-0 opacity-40">
            <Image
              src={source.imageUrl}
              alt={source.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <Link
            href="/profil#titik-air"
            className="inline-flex items-center text-xs font-bold text-slate-300 hover:text-white uppercase tracking-widest mb-6 transition-colors bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Profil Desa
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-md mb-6 leading-tight">
            {source.name}
          </h1>
          <div className="flex items-center justify-center gap-2 text-teal-300 font-semibold text-xs tracking-widest uppercase drop-shadow-sm bg-black/20 backdrop-blur-sm px-5 py-2 rounded-full inline-flex border border-white/5">
            <MapPin className="w-4 h-4" />
            <span>Fasilitas Air Bersih Desa</span>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 min-h-screen py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-10">
            {source.imageUrl && (
              <div className="relative w-full aspect-[21/9] bg-slate-100">
                <Image
                  src={source.imageUrl}
                  alt={source.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-6">
                  <div>
                    <h2 className="text-[11px] font-extrabold uppercase text-slate-400 tracking-widest mb-5 flex items-center gap-3">
                      <span className="w-8 h-px bg-slate-200 block"></span>
                      Deskripsi Lokasi
                    </h2>
                    <div className="text-slate-600 leading-loose text-base md:text-lg space-y-6">
                      {source.description.split("\n").map((paragraph, index) => (
                        paragraph.trim() ? (
                          <p key={index} className="font-medium text-slate-700 text-left">
                            {paragraph}
                          </p>
                        ) : null
                      ))}
                    </div>
                  </div>

                  {source.images && source.images.length > 0 && (
                    <TitikAirGallery images={source.images} />
                  )}
                </div>

                <div className="w-full md:w-80 shrink-0 space-y-6">
                  <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 shadow-sm">
                    <h3 className="text-[11px] font-extrabold uppercase text-slate-400 tracking-widest mb-6 flex items-center gap-3">
                      <span className="w-5 h-px bg-slate-200 block"></span>
                      Informasi Geografis
                    </h3>
                    
                    <div className="space-y-5">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center shrink-0 shadow-inner">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div className="pt-0.5">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Koordinat Lokasi</p>
                          <p className="text-sm font-black text-slate-700 font-mono tracking-tight">{source.latitude}, {source.longitude}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-inner">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div className="pt-0.5">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Terakhir Diperbarui</p>
                          <p className="text-sm font-bold text-slate-700">
                            {new Date(source.updatedAt || source.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric"
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <a
                      href={source.mapUrl || googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-8 w-full flex items-center justify-center gap-2 bg-[#0f172a] hover:bg-[#1e293b] text-white px-5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                      Buka di Google Maps <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
