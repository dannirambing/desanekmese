"use client";

import { useState, useMemo } from "react";
import { Search, Calendar, RefreshCw, X, Megaphone, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatIndonesianDate, toIsoDateTime } from "@/lib/format-date";

interface Announcement {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: string;
  imageUrl: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export default function AnnouncementListWithFilter({
  announcements,
}: {
  announcements: Announcement[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Extract unique dates that have announcements (local date string YYYY-MM-DD)
  const availableDates = useMemo(() => {
    const dates = announcements.map((ann) => {
      const dateObj = new Date(ann.createdAt);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    });
    return Array.from(new Set(dates)).sort((a, b) => b.localeCompare(a));
  }, [announcements]);

  // Filter announcements
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((ann) => {
      const matchesSearch =
        ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ann.content.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesDate = true;
      if (selectedDate) {
        const annDateObj = new Date(ann.createdAt);
        const year = annDateObj.getFullYear();
        const month = String(annDateObj.getMonth() + 1).padStart(2, "0");
        const day = String(annDateObj.getDate()).padStart(2, "0");
        const annDateString = `${year}-${month}-${day}`;
        matchesDate = annDateString === selectedDate;
      }

      return matchesSearch && matchesDate;
    });
  }, [announcements, searchQuery, selectedDate]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedDate("");
  };

  return (
    <div className="space-y-8">
      {/* Search and Date Filter Bar */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-stone-400" />
            <input
              type="text"
              placeholder="Cari pengumuman..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all"
            />
          </div>

          {/* Date Picker Input */}
          <div className="relative">
            <Calendar className="absolute left-4 top-3.5 h-5 w-5 text-stone-400 pointer-events-none z-10" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              onClick={(e) => {
                try {
                  e.currentTarget.showPicker();
                } catch {}
              }}
              className={`w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-4 ${
                !selectedDate ? "text-transparent" : "text-stone-700"
              }`}
            />
            {!selectedDate && (
              <span className="absolute left-12 top-3.5 text-sm text-stone-400 pointer-events-none">
                Pilih tanggal...
              </span>
            )}
          </div>
        </div>

        {/* Quick Date Badges (Dates with Announcements) */}
        <div>
          <span className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
            Tanggal dengan Pengumuman (Klik untuk Filter):
          </span>
          <div className="flex flex-wrap gap-2">
            {availableDates.map((dateStr) => {
              const formatted = formatIndonesianDate(new Date(dateStr));
              const isActive = selectedDate === dateStr;
              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => setSelectedDate(isActive ? "" : dateStr)}
                  className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                    isActive
                      ? "bg-amber-500 text-stone-950 border-amber-500 shadow-md shadow-amber-500/10"
                      : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  {formatted}
                </button>
              );
            })}
            {availableDates.length === 0 && (
              <span className="text-xs text-stone-400 italic">Tidak ada tanggal aktif.</span>
            )}
          </div>
        </div>

        {/* Active Filters Clear Button */}
        {(searchQuery || selectedDate) && (
          <div className="flex items-center justify-between pt-4 border-t border-stone-100 text-xs text-stone-500">
            <div>
              Menampilkan <span className="font-bold text-stone-800">{filteredAnnouncements.length}</span> dari{" "}
              <span className="font-bold text-stone-800">{announcements.length}</span> pengumuman.
            </div>
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 text-red-600 hover:text-red-500 font-bold uppercase tracking-wider cursor-pointer border-none bg-transparent"
            >
              <X size={14} /> Bersihkan Filter
            </button>
          </div>
        )}
      </div>

      {/* Announcements List Output */}
      {filteredAnnouncements.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 shadow-sm max-w-4xl mx-auto">
          <Megaphone className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500 font-medium text-lg">
            Tidak ada pengumuman yang cocok dengan filter pencarian Anda.
          </p>
          {(searchQuery || selectedDate) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-4 inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              <RefreshCw size={14} /> Tampilkan Semua
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {filteredAnnouncements.map((announcement) => {
            return (
              <Link
                key={announcement.id}
                href={`/pengumuman/${announcement.slug}`}
                className="group block bg-white rounded-3xl border border-stone-200/80 p-6 md:p-8 shadow-sm hover:shadow-xl hover:border-amber-400/50 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Image/Icon */}
                  {announcement.imageUrl ? (
                    <div className="relative w-full md:w-44 aspect-[4/3] rounded-2xl overflow-hidden shrink-0 bg-stone-100">
                      <Image
                        src={announcement.imageUrl}
                        alt={announcement.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 200px"
                      />
                    </div>
                  ) : (
                    <div className="w-full md:w-44 aspect-[4/3] rounded-2xl shrink-0 bg-gradient-to-br from-amber-50 to-stone-100 flex items-center justify-center border border-stone-200/50">
                      <Megaphone className="w-10 h-10 text-amber-500/70" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between h-full space-y-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-stone-500 font-semibold mb-2">
                        <Calendar size={14} className="text-amber-500" />
                        <time dateTime={toIsoDateTime(announcement.createdAt)}>
                          {formatIndonesianDate(announcement.createdAt)}
                        </time>
                      </div>
                      <h3 className="text-xl font-bold text-stone-900 group-hover:text-amber-600 transition-colors mb-2 line-clamp-2 leading-snug">
                        {announcement.title}
                      </h3>
                      <p className="text-sm md:text-base text-stone-600 line-clamp-2 leading-relaxed font-light">
                        {announcement.content}
                      </p>
                    </div>

                    <div className="pt-2">
                      <span className="inline-flex items-center text-sm font-black text-amber-700 uppercase tracking-wider group-hover:text-amber-500 transition-colors">
                        Selengkapnya <ArrowRight size={16} className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
