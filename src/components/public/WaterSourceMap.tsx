"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

// Fix for default marker icon in react-leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export interface WaterSourceData {
  id: string;
  name: string;
  slug: string;
  description: string;
  latitude: number;
  longitude: number;
  imageUrl: string | null;
}

// Component to dynamically fit maps zoom/center based on all sources
function MapBoundsFit({ sources }: { sources: WaterSourceData[] }) {
  const map = useMap();

  useEffect(() => {
    if (sources.length === 0) return;

    if (sources.length === 1) {
      map.setView([sources[0].latitude, sources[0].longitude], 15);
    } else {
      const bounds = L.latLngBounds(sources.map((s) => [s.latitude, s.longitude]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [sources, map]);

  return null;
}

export default function WaterSourceMap({ sources }: { sources: WaterSourceData[] }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsMounted(true), 0);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-[400px] sm:h-[450px] md:h-[550px] bg-slate-100 rounded-3xl flex items-center justify-center border border-slate-200">
        <div className="animate-pulse flex flex-col items-center">
          <MapPin className="w-8 h-8 text-slate-300 mb-2" />
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Memuat Peta...</span>
        </div>
      </div>
    );
  }

  // Set center to the first source or default to a coordinate in Kupang
  const center: [number, number] = sources.length > 0
    ? [sources[0].latitude, sources[0].longitude]
    : [-10.2974, 123.754]; // Approximate Nekmese coordinates

  return (
    <div className="w-full h-[400px] sm:h-[450px] md:h-[550px] rounded-3xl overflow-hidden border-4 border-white shadow-xl shadow-slate-200/50 relative z-0">
      <MapContainer 
        center={center} 
        zoom={14} 
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <MapBoundsFit sources={sources} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {sources.map((source) => (
          <Marker 
            key={source.id} 
            position={[source.latitude, source.longitude]}
          >
            <Popup className="rounded-2xl">
              <div className="w-[180px] sm:w-[220px] overflow-hidden bg-white">
                {source.imageUrl && (
                  <div className="w-full h-16 sm:h-24 overflow-hidden bg-slate-100">
                    <img 
                      src={source.imageUrl} 
                      alt={source.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-3">
                  <h3 className="font-bold text-[#0f172a] text-xs sm:text-sm mb-0.5 sm:mb-1">{source.name}</h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1 sm:line-clamp-2 mb-2 sm:mb-3 leading-relaxed">
                    {source.description}
                  </p>
                  <Link 
                    href={`/profil/titik-air/${source.slug}`}
                    className="inline-flex w-full items-center justify-center bg-[#14b8a6] hover:bg-[#0d9488] text-white py-1.5 sm:py-2 px-3 rounded-lg text-[10px] sm:text-xs font-bold transition-colors"
                  >
                    Lihat Detail <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
