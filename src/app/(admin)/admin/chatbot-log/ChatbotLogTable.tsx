"use client";

import { useState, useTransition } from "react";
import { formatIndonesianDate } from "@/lib/format-date";
import { Search, ChevronDown, ChevronUp, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteChatLog } from "./actions";
import { useRouter } from "next/navigation";

type ChatLog = {
  id: string;
  question: string;
  answer: string;
  category: string;
  useCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export default function ChatbotLogTable({ logs }: { logs: ChatLog[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus log ini? Log yang dihapus tidak dapat dikembalikan.")) {
      setDeletingId(id);
      startTransition(async () => {
        await deleteChatLog(id);
        setDeletingId(null);
        router.refresh();
      });
    }
  };

  const filteredLogs = logs.filter((log) =>
    log.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Search Bar */}
      <div className="p-4 border-b border-slate-100 bg-white">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari pertanyaan atau jawaban..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50/50 text-xs text-slate-500 uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Kueri / Pertanyaan</th>
              <th className="px-6 py-4 text-center">Kategori</th>
              <th className="px-6 py-4 text-center">Frekuensi</th>
              <th className="px-6 py-4">Terakhir Digunakan</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => {
                const isExpanded = expandedId === log.id;
                return (
                  <tr key={log.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 max-w-md">
                      <div className="font-medium text-slate-900 mb-1 leading-snug">
                        {log.question}
                      </div>
                      
                      <div 
                        className={cn(
                          "text-slate-500 text-sm mt-2 relative transition-all duration-300",
                          !isExpanded && "line-clamp-2"
                        )}
                      >
                        {log.answer}
                      </div>
                      
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : log.id)}
                        className="text-teal-600 text-xs font-semibold flex items-center gap-1 mt-2 hover:text-teal-700"
                      >
                        {isExpanded ? (
                          <>Sembunyikan <ChevronUp className="w-3 h-3" /></>
                        ) : (
                          <>Lihat Jawaban <ChevronDown className="w-3 h-3" /></>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center align-top">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-widest border border-slate-200">
                        {log.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center align-top">
                      <div className="inline-flex items-center justify-center min-w-[2rem] h-8 px-2 bg-indigo-50 text-indigo-700 font-bold rounded-lg border border-indigo-100">
                        {log.useCount}x
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top text-slate-500 whitespace-nowrap">
                      {formatIndonesianDate(log.updatedAt)}
                    </td>
                    <td className="px-6 py-4 align-top text-center">
                      <button
                        onClick={() => handleDelete(log.id)}
                        disabled={isPending && deletingId === log.id}
                        className="inline-flex items-center justify-center p-2 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Hapus log ini"
                      >
                        {isPending && deletingId === log.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  Tidak ada riwayat kueri yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
