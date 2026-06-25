import { prisma } from "@/lib/prisma";
import { updateUMKMProduct } from "@/app/(admin)/admin/umkm/actions";
import ImagePickerField from "@/components/admin/ImagePickerField";
import { ORDER_CHANNEL_OPTIONS } from "@/lib/umkm-order";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { notFound } from "next/navigation";

const inputClass =
  "w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none";
const labelClass =
  "block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2";

export default async function EditUmkmPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.productUMKM.findUnique({ where: { id } });

  if (!product) notFound();

  const updateWithId = updateUMKMProduct.bind(null, product.id);

  return (
    <div className="max-w-3xl w-full mx-auto">
      <Link
        href="/admin/umkm"
        className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-[#0f172a]/40 hover:text-[#0f172a] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-black text-[#0f172a] uppercase mb-8">
          Ubah Produk UMKM
        </h1>

        <form action={updateWithId} className="space-y-6">
          <ImagePickerField
            currentImage={product.imageUrl}
            label="Foto Produk"
            title="Pilih Foto Produk"
          />

          <div>
            <label className={labelClass}>Nama Produk</label>
            <input
              name="name"
              defaultValue={product.name}
              required
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nama Pemilik / UMKM</label>
              <input
                name="ownerName"
                defaultValue={product.ownerName}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Harga (Rp)</label>
              <input
                type="number"
                name="price"
                min={0}
                defaultValue={product.price}
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
              defaultValue={product.description}
              required
              className={`${inputClass} font-semibold`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Channel Pemesanan</label>
              <select
                name="orderType"
                defaultValue={product.orderType}
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
                defaultValue={product.status}
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
              defaultValue={product.orderUrl}
              required
              className={`${inputClass} font-semibold`}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#14b8a6] text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#0f172a] transition-all flex justify-center items-center"
          >
            <Save className="mr-2" size={20} /> Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
}
