"use client";

import { useOptimistic, useTransition, useState } from "react";
import Link from "next/link";
import { Edit, Eye, Store, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ConfirmDeleteButton from "./ConfirmDeleteButton";
import { deleteUMKMProduct, bulkDeleteUMKM } from "@/app/(admin)/admin/umkm/actions";
import { formatRupiah } from "@/lib/format-rupiah";
import { getOrderLabel } from "@/lib/umkm-order";

interface ProductUMKM {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  price: number;
  orderType: string;
  status: string;
}

export default function UmkmTable({ initialProducts }: { initialProducts: ProductUMKM[] }) {
  const [isPending, startTransition] = useTransition();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [optimisticProducts, addOptimisticAction] = useOptimistic(
    initialProducts,
    (state, action: { type: "delete" | "deleteBulk"; ids: string[] }) => {
      if (action.type === "delete" || action.type === "deleteBulk") {
        return state.filter((product) => !action.ids.includes(product.id));
      }
      return state;
    }
  );

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      addOptimisticAction({ type: "delete", ids: [id] });
      await deleteUMKMProduct({ id });
    });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    const idsToDelete = Array.from(selectedIds);
    addOptimisticAction({ type: "deleteBulk", ids: idsToDelete });
    await bulkDeleteUMKM({ ids: idsToDelete });
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === optimisticProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(optimisticProducts.map((p) => p.id)));
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Toolbar Bulk Action */}
      {selectedIds.size > 0 && (
        <div className="bg-turquoise/10 px-6 py-3 border-b border-turquoise/20 flex items-center justify-between">
          <span className="text-sm font-bold text-navy">
            {selectedIds.size} produk dipilih
          </span>
          <ConfirmDeleteButton
            onConfirm={handleBulkDelete}
            title="Hapus Produk Terpilih"
            message={`Apakah Anda yakin ingin menghapus ${selectedIds.size} produk terpilih secara permanen? Tindakan ini tidak dapat dibatalkan.`}
            buttonClassName="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all disabled:opacity-50 cursor-pointer"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Hapus Terpilih
          </ConfirmDeleteButton>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 uppercase text-xs font-extrabold text-navy/70 tracking-wider">
            <tr>
              <th className="px-6 py-4.5 w-12">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-turquoise focus:ring-turquoise/40"
                  checked={optimisticProducts.length > 0 && selectedIds.size === optimisticProducts.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-6 py-4.5">Produk</th>
              <th className="px-6 py-4.5">Harga</th>
              <th className="px-6 py-4.5">Pemesanan</th>
              <th className="px-6 py-4.5">Status</th>
              <th className="px-6 py-4.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-navy/80">
            {optimisticProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-navy/40 font-semibold">
                  Belum ada produk UMKM yang direkam.
                </td>
              </tr>
            ) : (
              optimisticProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-turquoise focus:ring-turquoise/40"
                      checked={selectedIds.has(product.id)}
                      onChange={() => toggleSelect(product.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-extrabold text-navy text-base mb-1">
                      {product.name}
                    </div>
                    <div className="flex items-center text-xs text-navy/50 font-semibold">
                      <Store className="w-3.5 h-3.5 mr-1 text-turquoise" />
                      {product.ownerName}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gold">
                    {formatRupiah(product.price)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
                      {getOrderLabel(product.orderType as any)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border",
                        product.status === "PUBLISHED"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      )}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end items-center gap-1.5">
                      <Link
                        href={`/umkm/${product.slug}`}
                        target="_blank"
                        className="p-2 text-navy/40 hover:text-turquoise hover:bg-turquoise/5 rounded-xl transition-all"
                        title="Lihat Halaman Publik"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      <Link
                        href={`/admin/umkm/${product.id}/edit`}
                        className="p-2 text-navy/40 hover:text-navy hover:bg-navy/5 rounded-xl transition-all"
                        title="Ubah Data"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      
                      <ConfirmDeleteButton
                        onConfirm={() => handleDelete(product.id)}
                        title="Hapus Produk"
                        message="Hapus produk ini secara permanen?"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
