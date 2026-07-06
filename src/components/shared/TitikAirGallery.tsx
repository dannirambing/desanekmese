"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type TitikAirGalleryProps = {
  images: string[];
};

export default function TitikAirGallery({ images }: TitikAirGalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <div className="mt-10">
      <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-4">
        Galeri Foto Lokasi
      </h3>
      <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200">
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          className="w-full aspect-video bg-slate-100"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full aspect-video">
                <Image
                  src={img}
                  alt={`Foto Lokasi ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
