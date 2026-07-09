"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";

interface ConfirmDeleteButtonProps {
  onConfirm: () => Promise<void>;
  title?: string;
  message?: string;
  buttonClassName?: string;
  children?: React.ReactNode;
}

export default function ConfirmDeleteButton({
  onConfirm,
  title = "Hapus Data Permanen",
  message = "Apakah Anda yakin ingin menghapus data ini secara permanen? Tindakan ini tidak dapat dibatalkan.",
  buttonClassName = "p-2 text-navy/40 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer flex items-center justify-center disabled:opacity-50",
  children,
}: ConfirmDeleteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        await onConfirm();
        setShowConfirm(false);
      } catch (error) {
        console.error("Gagal menghapus:", error);
        alert("Terjadi kesalahan saat memproses penghapusan data.");
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        disabled={isPending}
        className={buttonClassName}
        title={title}
      >
        {isPending ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          children || <Trash2 size={18} />
        )}
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-left">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-5">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-black text-navy mb-2 tracking-tight">{title}</h3>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">
                {message}
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setShowConfirm(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={handleConfirm}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 shadow-md shadow-red-600/20"
                >
                  {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Hapus Permanen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
