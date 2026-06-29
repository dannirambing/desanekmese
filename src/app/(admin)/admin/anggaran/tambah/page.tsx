import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { createBudget } from "../actions";

export default function TambahAnggaranPage() {
  return (
    <div className="max-w-3xl w-full mx-auto">
      <Link
        href="/admin/anggaran"
        className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-[#0f172a]/40 hover:text-[#0f172a] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-black text-[#0f172a] uppercase mb-8">
          Tambah Tahun Anggaran Baru
        </h1>

        <form action={createBudget} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
              Tahun Anggaran (Contoh: 2026)
            </label>
            <input
              type="number"
              name="year"
              required
              min={2000}
              max={2100}
              defaultValue={new Date().getFullYear()}
              className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-turquoise outline-none"
              placeholder="Masukkan tahun..."
            />
            <p className="text-xs text-navy/40 font-semibold mt-1">
              Data anggaran akan diinisialisasi dengan nominal nol. Anda dapat menambahkan detail pendapatan dan belanja di halaman berikutnya.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-[#14b8a6] hover:bg-[#0f172a] text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all flex justify-center items-center cursor-pointer shadow-md shadow-turquoise/10 hover:shadow-none"
          >
            <Save className="mr-2" size={20} /> Buat Tahun Anggaran
          </button>
        </form>
      </div>
    </div>
  );
}
