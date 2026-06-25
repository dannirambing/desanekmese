import ImagePickerField from "@/components/admin/ImagePickerField";
import { createUMKMProduct } from "@/app/(admin)/admin/umkm/actions";
import { ORDER_CHANNEL_OPTIONS } from "@/lib/umkm-order";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

const inputClass =
  "w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none";
const labelClass =
  "block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2";

export default function TambahUmkmPage() {
  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/umkm"
        className="flex items-center text-sm font-bold text-slate-500 hover:text-[#0f172a] mb-6"
      >
        <ArrowLeft className="mr-2" size={16} /> KEMBALI
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-black text-[#0f172a] mb-6 uppercase tracking-tight">
          Tambah Produk UMKM
        </h1>

        <form action={createUMKMProduct} className="space-y-6">
          <ImagePickerField label="Foto Produk" title="Pilih Foto Produk" />

          <div>
            <label className={labelClass}>Nama Produk</label>
            <input type="text" name="name" required className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nama Pemilik / UMKM</label>
              <input name="ownerName" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Harga (Rp)</label>
              <input
                type="number"
                name="price"
                min={0}
                required
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Deskripsi</label>
            <textarea
              name="description"
              rows={4}
              required
              className={`${inputClass} font-semibold`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Channel Pemesanan</label>
              <select
                name="orderType"
                defaultValue="WHATSAPP"
                className={`${inputClass} bg-white`}
              >
                {ORDER_CHANNEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select
                name="status"
                defaultValue="DRAFT"
                className={`${inputClass} bg-white`}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Link Pemesanan</label>
            <input
              name="orderUrl"
              type="url"
              required
              placeholder="https://wa.me/628xxx, shopee.co.id/..., tokopedia.com/..."
              className={`${inputClass} font-semibold`}
            />
            <p className="text-xs text-slate-400 mt-2">
              Paste link WhatsApp, Shopee, Tokopedia, atau link toko online
              lainnya.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-[#14b8a6] text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#0f172a] transition-all flex justify-center items-center"
          >
            <Save className="mr-2" size={20} /> Simpan Produk
          </button>
        </form>
      </div>
    </div>
  );
}
