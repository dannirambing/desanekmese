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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-lg mb-4">
            {source.name}
          </h1>
          <div className="flex items-center justify-center gap-2 text-teal-400 font-bold text-sm tracking-wider uppercase drop-shadow-sm">
            <MapPin className="w-4 h-4" />
            <span>Titik Air Desa Nekmese</span>
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
                    <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-3">
                      Deskripsi
                    </h2>
                    <div className="prose prose-slate prose-p:text-slate-600 prose-p:leading-relaxed max-w-none">
                      <p className="whitespace-pre-line text-lg text-slate-700 font-medium">
                        {source.description}
                      </p>
                    </div>
                  </div>

                  {source.images && source.images.length > 0 && (
                    <TitikAirGallery images={source.images} />
                  )}
                </div>

                <div className="w-full md:w-80 shrink-0 space-y-6">
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest mb-4">
                      Informasi Lokasi
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Koordinat</p>
                          <p className="text-sm font-bold text-slate-700 mt-0.5">{source.latitude}, {source.longitude}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ditambahkan Pada</p>
                          <p className="text-sm font-bold text-slate-700 mt-0.5">
                            {new Date(source.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric"
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <a
                      href={googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 w-full flex items-center justify-center gap-2 bg-[#0f172a] hover:bg-[#1e293b] text-white px-5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                    >
                      Buka di Google Maps <ExternalLink className="w-4 h-4" />
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
