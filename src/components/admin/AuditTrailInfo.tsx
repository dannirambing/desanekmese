import { Clock, User } from "lucide-react";

interface AuditTrailProps {
  createdBy: { name: string | null } | null;
  updatedBy: { name: string | null } | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function AuditTrailInfo({
  createdBy,
  updatedBy,
  createdAt,
  updatedAt,
}: AuditTrailProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-500 bg-slate-50 p-4 rounded-xl">
      <div className="flex flex-col gap-1">
        <span className="uppercase tracking-widest text-[9px] text-slate-400 font-black">
          Informasi Pembuatan
        </span>
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5" />
          <span>Dibuat oleh: {createdBy?.name || "Sistem / Admin"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" />
          <span>Pada: {formatDate(createdAt)}</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-1">
        <span className="uppercase tracking-widest text-[9px] text-slate-400 font-black">
          Informasi Perubahan
        </span>
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5" />
          <span>Terakhir diubah oleh: {updatedBy?.name || "Belum ada"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" />
          <span>Pada: {formatDate(updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}
