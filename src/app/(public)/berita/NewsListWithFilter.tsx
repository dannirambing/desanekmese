"use client";

import { useState, useMemo } from "react";
import { Search, Calendar, RefreshCw, X, Newspaper } from "lucide-react";
import NewsCard from "@/components/shared/NewsCard";
import { formatIndonesianDate } from "@/lib/format-date";

interface MediaFile {
  url: string;
}

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  status: string;
  publishedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  media: MediaFile[];
}

export default function NewsListWithFilter({
  articles,
}: {
  articles: NewsArticle[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Extract unique dates of publication (formatted as YYYY-MM-DD)
  const availableDates = useMemo(() => {
    const dates = articles.map((art) => {
      const dateVal = art.publishedAt ?? art.createdAt;
      const dateObj = new Date(dateVal);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    });
    return Array.from(new Set(dates)).sort((a, b) => b.localeCompare(a));
  }, [articles]);

  // Filter articles
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (art.summary && art.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
        art.content.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesDate = true;
      if (selectedDate) {
        const dateVal = art.publishedAt ?? art.createdAt;
        const artDateObj = new Date(dateVal);
        const year = artDateObj.getFullYear();
        const month = String(artDateObj.getMonth() + 1).padStart(2, "0");
        const day = String(artDateObj.getDate()).padStart(2, "0");
        const artDateString = `${year}-${month}-${day}`;
        matchesDate = artDateString === selectedDate;
      }

      return matchesSearch && matchesDate;
    });
  }, [articles, searchQuery, selectedDate]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedDate("");
  };

  return (
    <div className="space-y-12">
      {/* Search and Date Filter Bar */}
      <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-sm max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari berita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-turquoise focus:bg-white outline-none transition-all"
            />
          </div>

          {/* Date Picker Input */}
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none z-10" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              onClick={(e) => {
                try {
                  e.currentTarget.showPicker();
                } catch {}
              }}
              className={`w-full h-12 pl-12 pr-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-turquoise focus:bg-white outline-none transition-all cursor-pointer appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-4 ${
                !selectedDate ? "text-transparent" : "text-slate-700"
              }`}
            />
            {!selectedDate && (
              <span className="absolute left-12 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none">
                Pilih tanggal...
              </span>
            )}
          </div>
        </div>

        {/* Quick Date Badges */}
        <div>
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Tanggal dengan Berita (Klik untuk Filter):
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
                      ? "bg-turquoise text-white border-turquoise shadow-md shadow-turquoise/10"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {formatted}
                </button>
              );
            })}
            {availableDates.length === 0 && (
              <span className="text-xs text-slate-400 italic">Tidak ada tanggal berita aktif.</span>
            )}
          </div>
        </div>

        {/* Active Filters Summary */}
        {(searchQuery || selectedDate) && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
            <div>
              Menampilkan <span className="font-bold text-navy">{filteredArticles.length}</span> dari{" "}
              <span className="font-bold text-navy">{articles.length}</span> berita.
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

      {/* Grid output */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-blue-50/50 shadow-sm max-w-3xl mx-auto">
          <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium text-lg">
            Tidak ada berita yang cocok dengan kriteria pencarian Anda.
          </p>
          {(searchQuery || selectedDate) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-4 inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              <RefreshCw size={14} /> Tampilkan Semua
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filteredArticles.map((article) => {
            const imageUrl =
              article.media.length > 0
                ? article.media[0].url
                : "/placeholder-image.jpg";
            const displayDate = article.publishedAt ?? article.createdAt;

            return (
              <div
                key={article.id}
                className="transition-transform duration-300 hover:-translate-y-2"
              >
                <NewsCard
                  title={article.title}
                  summary={article.summary}
                  image={imageUrl}
                  slug={article.slug}
                  date={displayDate}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
