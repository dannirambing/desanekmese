import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Bot, Search, Calendar, MessageSquare, Trash2, Layers } from "lucide-react";
import { formatIndonesianDate } from "@/lib/format-date";
import ChatbotLogTable from "./ChatbotLogTable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ChatbotLogPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  // Fetch chatbot logs
  const logs = await prisma.chatCache.findMany({
    orderBy: { updatedAt: "desc" },
  });

  const totalQueries = logs.reduce((acc, log) => acc + log.useCount, 0);

  return (
    <div className="w-full relative pb-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-2 flex items-center gap-3">
          <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
            <Bot className="w-8 h-8" />
          </div>
          Log Chatbot AI
        </h1>
        <p className="text-sm md:text-base text-slate-500 max-w-xl">
          Pantau daftar pertanyaan yang diajukan warga dan balasan yang dihasilkan oleh asisten cerdas desa.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-5 h-5 text-indigo-500" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Kueri</p>
          </div>
          <p className="text-3xl font-black text-slate-900">{totalQueries}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <Layers className="w-5 h-5 text-emerald-500" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Unik Tersimpan</p>
          </div>
          <p className="text-3xl font-black text-slate-900">{logs.length}</p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Riwayat Percakapan</h2>
            <p className="text-sm text-slate-500">Data percakapan yang di-*cache* untuk mempercepat respons.</p>
          </div>
        </div>

        <ChatbotLogTable logs={logs} />
      </div>
    </div>
  );
}
