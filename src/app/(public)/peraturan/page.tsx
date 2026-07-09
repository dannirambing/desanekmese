import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { FileText, Search, Download, Calendar, Tag, AlertCircle } from "lucide-react";
import Link from "next/link";
import SectionTitle from "@/components/shared/SectionTitle";
import { Prisma, RegulationType } from "@prisma/client";

export const metadata: Metadata = {
  title: "Peraturan Desa | Desa Nekmese",
  description: "Arsip produk hukum, peraturan desa, dan keputusan resmi Desa Nekmese yang transparan dan dapat diakses oleh seluruh warga.",
};

export const revalidate = 60;

interface PublicPeraturanPageProps {
  searchParams: Promise<{ page?: string; search?: string; type?: string }>;
}

export default async function PublicPeraturanPage({ searchParams }: PublicPeraturanPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const search = params.search || "";
  const typeFilter = params.type || "";

  const itemsPerPage = 10;
  const skip = (page - 1) * itemsPerPage;

  const where: Prisma.VillageRegulationWhereInput = {
    status: "PUBLISHED",
  };

  if (typeFilter && Object.values(RegulationType).includes(typeFilter as RegulationType)) {
    where.type = typeFilter as RegulationType;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { number: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const totalItems = await prisma.villageRegulation.count({ where });

  const regulations = await prisma.villageRegulation.findMany({
    where,
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    skip,
    take: itemsPerPage,
  });

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getTypeText = (type: RegulationType) => {
    switch (type) {
      case "PERATURAN_DESA":
        return "Peraturan Desa";
      case "KEPUTUSAN_KEPALA_DESA":
        return "Keputusan Kepala Desa";
      case "PERATURAN_BERSAMA":
        return "Peraturan Bersama";
      default:
        return type;
    }
  };

  const getTabClass = (currentType: string) => {
    const base = "px-4 py-2 rounded-full text-xs font-semibold border cursor-pointer transition-all duration-300";
    if (typeFilter === currentType) {
      return `${base} bg-turquoise text-white border-turquoise shadow-md shadow-turquoise/15`;
    }
    return `${base} bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-navy`;
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-20 md:pt-44 md:pb-28 flex items-center justify-center bg-gray-900 overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://azhuh458gn.ufs.sh/f/IDwrE8y2GhNiX1h5gMQdgkOuTwC7WSyQHEfiAI8s51P2Rp0a')",
          }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/75 via-black/55 to-gray-900/40" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="inline-block font-semibold tracking-widest text-xs uppercase mb-3 bg-teal-500/10 text-teal-400 border border-teal-500/20 backdrop-blur-md px-4 py-1.5 rounded-full">
            Transparansi & Hukum
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md mb-4">
            Peraturan & Keputusan Desa
          </h1>
          <p className="text-base md:text-lg text-gray-300 font-normal leading-relaxed max-w-2xl mx-auto drop-shadow">
            Akses terbuka seluruh ketetapan hukum, surat keputusan kepala desa, dan aturan administratif resmi di Desa Nekmese.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16 md:py-24 bg-gray-50/50 min-h-screen">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-14">
            <SectionTitle
              subtitle="Dokumen Hukum Resmi"
              title="Daftar Peraturan & Ketetapan"
            />
          </div>

          {/* Search & Filter Controls Card */}
          <div className="bg-white p-6 rounded-3xl border border-blue-50 shadow-sm max-w-4xl mx-auto space-y-6 mb-12">
            {/* Search Input Box */}
            <form method="GET" action="/peraturan" className="relative flex items-center gap-2">
              {typeFilter && <input type="hidden" name="type" value={typeFilter} />}
              <div className="relative flex-1">
                <input
                  type="text"
                  name="search"
                  defaultValue={search}
                  placeholder="Cari nomor, judul, atau ringkasan peraturan..."
                  className="w-full h-12 pl-12 pr-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-turquoise focus:bg-white outline-none transition-all text-slate-800"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
              <button
                type="submit"
                className="bg-turquoise hover:bg-turquoise/90 text-white font-bold h-12 px-6 rounded-2xl text-xs uppercase tracking-widest transition-colors shadow-md shadow-turquoise/10 cursor-pointer"
              >
                Cari
              </button>
            </form>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100/70">
              <Link href={`/peraturan${search ? `?search=${search}` : ""}`} className={getTabClass("")}>
                Semua Dokumen
              </Link>
              <Link href={`/peraturan?type=PERATURAN_DESA${search ? `&search=${search}` : ""}`} className={getTabClass("PERATURAN_DESA")}>
                Peraturan Desa
              </Link>
              <Link href={`/peraturan?type=KEPUTUSAN_KEPALA_DESA${search ? `&search=${search}` : ""}`} className={getTabClass("KEPUTUSAN_KEPALA_DESA")}>
                Keputusan Kades
              </Link>
              <Link href={`/peraturan?type=PERATURAN_BERSAMA${search ? `&search=${search}` : ""}`} className={getTabClass("PERATURAN_BERSAMA")}>
                Peraturan Bersama
              </Link>
            </div>
          </div>

          {/* List of Regulations */}
          {regulations.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-3xl p-16 text-center shadow-sm max-w-3xl mx-auto">
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-700 mb-1">
                Tidak ada dokumen peraturan yang ditemukan
              </h3>
              <p className="text-sm text-slate-400 font-medium">
                Silakan ubah filter pencarian Anda atau kembali ke daftar utama.
              </p>
            </div>
          ) : (
            <div className="space-y-4 mb-12">
              {regulations.map((reg) => (
                <div
                  key={reg.id}
                  className="group bg-white border border-gray-200/80 hover:border-teal-500/30 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-3.5 flex-1">
                    {/* Header Tags */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/50 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                        <Tag size={10} />
                        {getTypeText(reg.type)}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-[10px] font-bold uppercase tracking-wider">
                        <Calendar size={10} />
                        Tahun {reg.year}
                      </span>
                    </div>

                    {/* Nomor & Judul */}
                    <div>
                      <h2 className="text-xs font-bold text-teal-600 tracking-wider uppercase mb-1">
                        Nomor: {reg.number}
                      </h2>
                      <h3 className="text-lg md:text-xl font-extrabold text-navy leading-snug group-hover:text-teal-600 transition-colors">
                        {reg.title}
                      </h3>
                    </div>

                    {/* Ringkasan */}
                    {reg.description && (
                      <p className="text-sm text-slate-600 font-normal leading-relaxed max-w-3xl">
                        {reg.description}
                      </p>
                    )}
                  </div>

                  {/* Action Link (PDF Download) */}
                  <div className="shrink-0">
                    <a
                      href={reg.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-4.5 rounded-2xl bg-navy hover:bg-teal-600 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md shadow-navy/10 cursor-pointer w-full md:w-auto"
                    >
                      <Download size={14} />
                      Unduh Dokumen
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              {/* Prev */}
              {page > 1 ? (
                <Link
                  href={`/peraturan?page=${page - 1}${search ? `&search=${search}` : ""}${typeFilter ? `&type=${typeFilter}` : ""}`}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-bold uppercase hover:bg-slate-50 text-slate-700 transition-colors"
                >
                  Sebelumnya
                </Link>
              ) : (
                <span className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 text-xs font-bold uppercase text-slate-300 cursor-not-allowed">
                  Sebelumnya
                </span>
              )}

              {/* Page indicator */}
              <span className="text-xs font-bold text-navy uppercase px-4">
                Halaman {page} dari {totalPages}
              </span>

              {/* Next */}
              {page < totalPages ? (
                <Link
                  href={`/peraturan?page=${page + 1}${search ? `&search=${search}` : ""}${typeFilter ? `&type=${typeFilter}` : ""}`}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-bold uppercase hover:bg-slate-50 text-slate-700 transition-colors"
                >
                  Selanjutnya
                </Link>
              ) : (
                <span className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 text-xs font-bold uppercase text-slate-300 cursor-not-allowed">
                  Selanjutnya
                </span>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
