"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import type { WaterSourceData } from "./WaterSourceMap";

const MapComponent = dynamic(() => import("./WaterSourceMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] sm:h-[450px] md:h-[550px] bg-slate-100 rounded-3xl flex items-center justify-center border border-slate-200">
      <div className="animate-pulse flex flex-col items-center">
        <MapPin className="w-8 h-8 text-slate-300 mb-2" />
        <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Memuat Peta...</span>
      </div>
    </div>
  ),
});

export default function DynamicWaterSourceMap({ sources }: { sources: WaterSourceData[] }) {
  return <MapComponent sources={sources} />;
}
