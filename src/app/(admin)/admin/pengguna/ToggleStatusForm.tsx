"use client";

import { useState } from "react";
import { Power, PowerOff } from "lucide-react";
import { toggleAdminStatus } from "./actions";

export default function ToggleStatusForm({ id, currentStatus }: { id: string, currentStatus: boolean }) {
  const [isPending, setIsPending] = useState(false);

  async function handleToggle(e: React.FormEvent) {
    e.preventDefault();
    const actionText = currentStatus ? "menonaktifkan" : "mengaktifkan";
    if (confirm(`Apakah Anda yakin ingin ${actionText} akun ini?`)) {
      setIsPending(true);
      try {
        await toggleAdminStatus(id);
      } catch (error) {
        alert("Terjadi kesalahan.");
      } finally {
        setIsPending(false);
      }
    }
  }

  return (
    <form onSubmit={handleToggle}>
      <button
        type="submit"
        disabled={isPending}
        className={`p-2 rounded-xl transition-all ${
          currentStatus
            ? "text-red-500 hover:text-red-600 hover:bg-red-50"
            : "text-green-500 hover:text-green-600 hover:bg-green-50"
        } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
        title={currentStatus ? "Nonaktifkan Akun" : "Aktifkan Akun"}
      >
        {currentStatus ? <PowerOff className="w-5 h-5" /> : <Power className="w-5 h-5" />}
      </button>
    </form>
  );
}
