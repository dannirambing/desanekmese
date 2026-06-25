"use client";

import { useState, useMemo } from "react";
import { Search, RefreshCw, X, ShoppingBag, ArrowUpDown, User } from "lucide-react";
import ProductCard from "@/components/shared/ProductCard";
import type { OrderChannel } from "@prisma/client";

interface ProductUMKM {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  ownerName: string;
  imageUrl: string | null;
  orderUrl: string;
  orderType: OrderChannel;
  status: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export default function ProductListWithFilter({
  products,
}: {
  products: ProductUMKM[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOwner, setSelectedOwner] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">("newest");

  // Get unique owner names
  const uniqueOwners = useMemo(() => {
    const owners = products.map((prod) => prod.ownerName.trim());
    return Array.from(new Set(owners)).sort();
  }, [products]);

  // Filter and sort products
  const processedProducts = useMemo(() => {
    // 1. Filter
    let result = products.filter((prod) => {
      const matchesSearch =
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.ownerName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesOwner = selectedOwner ? prod.ownerName.trim() === selectedOwner : true;

      return matchesSearch && matchesOwner;
    });

    // 2. Sort
    result = [...result].sort((a, b) => {
      if (sortBy === "price-asc") {
        return a.price - b.price;
      }
      if (sortBy === "price-desc") {
        return b.price - a.price;
      }
      // "newest" (default)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [products, searchQuery, selectedOwner, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedOwner("");
    setSortBy("newest");
  };

  return (
    <div className="space-y-10">
      {/* Filters Dashboard */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm max-w-5xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-stone-400" />
            <input
              type="text"
              placeholder="Cari produk UMKM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
            />
          </div>

          {/* Owner Dropdown */}
          <div className="relative">
            <User className="absolute left-4 top-3.5 h-5 w-5 text-stone-400 pointer-events-none" />
            <select
              value={selectedOwner}
              onChange={(e) => setSelectedOwner(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all text-stone-700 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2378716c%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.65rem_auto] bg-[right_1rem_center] bg-no-repeat"
            >
              <option value="">Semua Penjual / Pelaku UMKM</option>
              {uniqueOwners.map((owner) => (
                <option key={owner} value={owner}>
                  {owner}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <ArrowUpDown className="absolute left-4 top-3.5 h-5 w-5 text-stone-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all text-stone-700 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2378716c%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.65rem_auto] bg-[right_1rem_center] bg-no-repeat"
            >
              <option value="newest">Terbaru / Paling Baru</option>
              <option value="price-asc">Harga: Terendah ke Tertinggi</option>
              <option value="price-desc">Harga: Tertinggi ke Terendah</option>
            </select>
          </div>
        </div>

        {/* Filters Active Summary */}
        {(searchQuery || selectedOwner || sortBy !== "newest") && (
          <div className="flex items-center justify-between pt-4 border-t border-stone-100 text-xs text-stone-500">
            <div>
              Menampilkan <span className="font-bold text-navy">{processedProducts.length}</span> dari{" "}
              <span className="font-bold text-navy">{products.length}</span> produk.
            </div>
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 text-red-600 hover:text-red-500 font-bold uppercase tracking-wider cursor-pointer border-none bg-transparent"
            >
              <X size={14} /> Bersihkan Filter
            </button>
          </div>
        )}
      </div>

      {/* Grid output */}
      {processedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-150 shadow-sm max-w-3xl mx-auto">
          <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500 font-medium text-lg">
            Tidak ada produk UMKM yang cocok dengan kriteria pencarian Anda.
          </p>
          {(searchQuery || selectedOwner || sortBy !== "newest") && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-4 inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              <RefreshCw size={14} /> Tampilkan Semua
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {processedProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
}
