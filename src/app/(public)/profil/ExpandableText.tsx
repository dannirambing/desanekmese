"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandableTextProps {
  text: string;
  maxCollapsedHeight?: string;
  className?: string;
}

export default function ExpandableText({
  text,
  maxCollapsedHeight = "max-h-24",
  className = "",
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Batasan karakter lebih ketat agar teks sedang/panjang langsung terpotong
  const isLongText = text.length > 200;

  if (!isLongText) {
    return <div className={`whitespace-pre-line ${className}`}>{text}</div>;
  }

  return (
    <div>
      <div
        className={`relative transition-all duration-500 ease-in-out overflow-hidden whitespace-pre-line ${
          isExpanded ? "max-h-[3000px]" : maxCollapsedHeight
        } ${className}`}
      >
        {text}
        
        {/* Fade overlay ketika dalam kondisi collapse */}
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none" />
        )}
      </div>

      <div className="mt-3 flex justify-start">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          type="button"
          className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 font-bold text-xs uppercase tracking-wider transition-colors duration-300 cursor-pointer hover:underline"
        >
          {isExpanded ? (
            <>
              Tampilkan Lebih Sedikit <ChevronUp size={14} />
            </>
          ) : (
            <>
              Baca Selengkapnya <ChevronDown size={14} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
