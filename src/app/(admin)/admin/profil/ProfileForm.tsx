"use client";

import { useState, useTransition } from "react";
import {
  FileText,
  Save,
  ArrowLeft,
  Image as ImageIcon,
  Upload,
  Info,
  MapPin,
  Users,
  BookOpen,
  Award,
} from "lucide-react";
import Link from "next/link";
import { updateVillageProfile } from "./actions";
import ImagePickerModal from "@/components/admin/ImagePickerModal";

interface VillageProfile {
  welcomeName: string;
  welcomeRole: string;
  welcomeText: string;
  welcomeImageUrl: string | null;
  history: string;
  vision: string;
  mission: string;
  villageCode: string;
  district: string;
  regency: string;
  province: string;
  establishedYear: string;
  boundariesNorth: string;
  boundariesEast: string;
  boundariesSouth: string;
  boundariesWest: string;
  mapUrl: string | null;
  geography: string;
  populationTotal: number;
  populationMale: number;
  populationFemale: number;
  populationFamilies: number;
  structureImageUrl: string | null;
  potential: string;
  organizations: string;
  facilities: string;
  achievements: string;
}

export default function ProfileForm({ initialProfile }: { initialProfile: VillageProfile }) {
  const [activeTab, setActiveTab] = useState<string>("sambutan");
  const [welcomeImageUrl, setWelcomeImageUrl] = useState<string | null>(initialProfile.welcomeImageUrl);
  const [structureImageUrl, setStructureImageUrl] = useState<string | null>(initialProfile.structureImageUrl);
  const [isKadesPickerOpen, setIsKadesPickerOpen] = useState(false);
  const [isStructurePickerOpen, setIsStructurePickerOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [incompleteFields, setIncompleteFields] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIncompleteFields([]);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const result = await updateVillageProfile(formData);
        setSuccess(true);
        if (result && result.incompleteFields) {
          setIncompleteFields(result.incompleteFields);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal menyimpan profil desa");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  };

  const tabs = [
    { id: "sambutan", label: "Sambutan & Identitas", icon: Info },
    { id: "sejarah", label: "Sejarah & Visi Misi", icon: BookOpen },
    { id: "wilayah", label: "Wilayah & Geografis", icon: MapPin },
    { id: "kependudukan", label: "Kependudukan & Struktur", icon: Users },
    { id: "potensi", label: "Kemasyarakatan & Potensi", icon: Award },
  ];

  return (
    <div className="max-w-4xl w-full mx-auto pb-16">
      <Link
        href="/admin"
        className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-[#0f172a]/40 hover:text-[#0f172a] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Dashboard
      </Link>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-teal-50 rounded-xl text-turquoise">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#0f172a] uppercase tracking-tight">
              Kelola Profil Desa
            </h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Kelola Informasi Struktur, Sejarah, Geografis, & Statistik Desa Nekmese
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${isActive
                  ? "bg-[#14b8a6] text-white shadow-md shadow-[#14b8a6]/20"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/50"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-semibold">
            {error}
          </div>
        )}

        {success && (
          <div className="space-y-4 mb-6">
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-2xl text-sm font-semibold">
              Profil desa berhasil diperbarui! Perubahan telah dipublikasikan.
            </div>
            {incompleteFields.length > 0 && (
              <div className="p-5 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs leading-relaxed">
                <div className="flex gap-2 items-start text-amber-700 font-bold mb-2">
                  <span className="text-sm">⚠️</span>
                  <span>Catatan Kelengkapan Profil:</span>
                </div>
                <p className="text-slate-600 mb-3 font-medium">
                  Beberapa field utama berikut belum diisi. Anda disarankan untuk melengkapinya agar informasi di halaman profil publik desa tampil maksimal:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 pl-2">
                  {incompleteFields.map((field) => (
                    <div key={field} className="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span>{field}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* TAB 1: SAMBUTAN & IDENTITAS */}
          <div className={activeTab === "sambutan" ? "space-y-6" : "hidden"}>
            <h3 className="text-sm font-black uppercase text-navy border-l-4 border-turquoise pl-3 mb-6">
              Sambutan Kepala Desa
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Photo Picker */}
              <div className="md:col-span-1 space-y-3">
                <label className="block text-[10px] font-black uppercase text-[#0f172a]/70">
                  Foto Kepala Desa
                </label>
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                  {welcomeImageUrl ? (
                    <img
                      src={welcomeImageUrl}
                      alt="Foto Kepala Desa"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Tanpa Foto</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsKadesPickerOpen(true)}
                    className="flex-1 inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-[#0f172a] py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border border-slate-200 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 mr-1.5" /> Pilih
                  </button>
                  {welcomeImageUrl && (
                    <button
                      type="button"
                      onClick={() => setWelcomeImageUrl(null)}
                      className="inline-flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2.5 rounded-xl font-bold text-xs uppercase transition-all border border-red-100 cursor-pointer"
                    >
                      Hapus
                    </button>
                  )}
                </div>
                <input type="hidden" name="welcomeImageUrl" value={welcomeImageUrl || ""} />
                <ImagePickerModal
                  open={isKadesPickerOpen}
                  onOpenChange={setIsKadesPickerOpen}
                  onSelect={(url) => setWelcomeImageUrl(url)}
                  title="Pilih Foto Kepala Desa"
                  description="Pilih dari pustaka media atau unggah foto Kepala Desa baru."
                />
              </div>

              {/* Form fields */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                    Nama Kepala Desa
                  </label>
                  <input
                    name="welcomeName"
                    defaultValue={initialProfile.welcomeName}
                    placeholder="Bapak Kepala Desa"
                    className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                    Jabatan
                  </label>
                  <input
                    name="welcomeRole"
                    defaultValue={initialProfile.welcomeRole}
                    placeholder="Kepala Desa Nekmese"
                    className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                    Teks Sambutan
                  </label>
                  <textarea
                    name="welcomeText"
                    rows={6}
                    defaultValue={initialProfile.welcomeText}
                    placeholder="Tuliskan kata sambutan Kepala Desa..."
                    className="w-full p-4 border border-slate-200 rounded-xl font-medium text-slate-700 focus:ring-2 focus:ring-[#14b8a6] outline-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            <h3 className="text-sm font-black uppercase text-navy border-l-4 border-turquoise pl-3 pt-6 mb-6">
              Identitas Desa
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                  Kode Wilayah Desa
                </label>
                <input
                  name="villageCode"
                  defaultValue={initialProfile.villageCode}
                  placeholder="53.01.05.2001"
                  className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                  Tahun Berdiri
                </label>
                <input
                  name="establishedYear"
                  defaultValue={initialProfile.establishedYear}
                  placeholder="1968"
                  className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                  Kecamatan
                </label>
                <input
                  name="district"
                  defaultValue={initialProfile.district}
                  placeholder="Amarasi Selatan"
                  className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                  Kabupaten / Kota
                </label>
                <input
                  name="regency"
                  defaultValue={initialProfile.regency}
                  placeholder="Kupang"
                  className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                  Provinsi
                </label>
                <input
                  name="province"
                  defaultValue={initialProfile.province}
                  placeholder="Nusa Tenggara Timur"
                  className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
                />
              </div>
            </div>
          </div>

          {/* TAB 2: SEJARAH & VISI MISI */}
          <div className={activeTab === "sejarah" ? "space-y-6" : "hidden"}>
            <h3 className="text-sm font-black uppercase text-navy border-l-4 border-turquoise pl-3 mb-6">
              Sejarah, Visi & Misi Desa
            </h3>

            <div>
              <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                Sejarah Desa
              </label>
              <textarea
                name="history"
                rows={8}
                defaultValue={initialProfile.history}
                placeholder="Tulis sejarah lengkap terbentuknya Desa Nekmese..."
                className="w-full p-4 border border-slate-200 rounded-xl font-medium text-slate-700 focus:ring-2 focus:ring-[#14b8a6] outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                Visi Desa
              </label>
              <textarea
                name="vision"
                rows={3}
                defaultValue={initialProfile.vision}
                placeholder="Tulis visi pembangunan jangka panjang desa..."
                className="w-full p-4 border border-slate-200 rounded-xl font-bold text-navy focus:ring-2 focus:ring-[#14b8a6] outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                Misi Desa
              </label>
              <textarea
                name="mission"
                rows={6}
                defaultValue={initialProfile.mission}
                placeholder="Tulis butir-butir misi desa (gunakan baris baru untuk setiap butir)..."
                className="w-full p-4 border border-slate-200 rounded-xl font-medium text-slate-700 focus:ring-2 focus:ring-[#14b8a6] outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* TAB 3: WILAYAH & GEOGRAFIS */}
          <div className={activeTab === "wilayah" ? "space-y-6" : "hidden"}>
            <h3 className="text-sm font-black uppercase text-navy border-l-4 border-turquoise pl-3 mb-6">
              Peta & Batas Wilayah
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                  Batas Utara
                </label>
                <input
                  name="boundariesNorth"
                  defaultValue={initialProfile.boundariesNorth}
                  placeholder="misal: Desa Sahraen"
                  className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                  Batas Timur
                </label>
                <input
                  name="boundariesEast"
                  defaultValue={initialProfile.boundariesEast}
                  placeholder="misal: Desa Apren"
                  className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                  Batas Selatan
                </label>
                <input
                  name="boundariesSouth"
                  defaultValue={initialProfile.boundariesSouth}
                  placeholder="misal: Laut Timor"
                  className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                  Batas Barat
                </label>
                <input
                  name="boundariesWest"
                  defaultValue={initialProfile.boundariesWest}
                  placeholder="misal: Desa Retraen"
                  className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                URL Google Maps Embed (iframe src)
              </label>
              <input
                name="mapUrl"
                defaultValue={initialProfile.mapUrl || ""}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="w-full p-4 border border-slate-200 rounded-xl font-medium text-slate-700 focus:ring-2 focus:ring-[#14b8a6] outline-none"
              />
              <span className="text-[10px] text-slate-400 font-medium block mt-1">
                Salin tautan `src` dari opsi Sematkan Peta (Embed Map) di Google Maps.
              </span>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                Kondisi Geografis Desa
              </label>
              <textarea
                name="geography"
                rows={4}
                defaultValue={initialProfile.geography}
                placeholder="Terangkan kondisi tanah, ketinggian, cuaca, luas wilayah, dll..."
                className="w-full p-4 border border-slate-200 rounded-xl font-medium text-slate-700 focus:ring-2 focus:ring-[#14b8a6] outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* TAB 4: KEPENDUDUKAN & STRUKTUR */}
          <div className={activeTab === "kependudukan" ? "space-y-6" : "hidden"}>
            <h3 className="text-sm font-black uppercase text-navy border-l-4 border-turquoise pl-3 mb-6">
              Data Statistik Kependudukan
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                  Total Penduduk
                </label>
                <input
                  type="number"
                  name="populationTotal"
                  defaultValue={initialProfile.populationTotal}
                  className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                  Laki-Laki
                </label>
                <input
                  type="number"
                  name="populationMale"
                  defaultValue={initialProfile.populationMale}
                  className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                  Perempuan
                </label>
                <input
                  type="number"
                  name="populationFemale"
                  defaultValue={initialProfile.populationFemale}
                  className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                  Kepala Keluarga (KK)
                </label>
                <input
                  type="number"
                  name="populationFamilies"
                  defaultValue={initialProfile.populationFamilies}
                  className="w-full p-4 border border-slate-200 rounded-xl font-bold text-[#0f172a] focus:ring-2 focus:ring-[#14b8a6] outline-none"
                />
              </div>
            </div>

            <h3 className="text-sm font-black uppercase text-navy border-l-4 border-turquoise pl-3 pt-6 mb-6">
              Struktur Organisasi Pemerintahan
            </h3>

            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase text-[#0f172a]/70">
                Bagan Struktur Organisasi Desa (Gambar)
              </label>
              <div className="relative aspect-[16/9] w-full max-w-2xl rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                {structureImageUrl ? (
                  <img
                    src={structureImageUrl}
                    alt="Struktur Organisasi Desa"
                    className="w-full h-full object-contain bg-white"
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-400">
                    <ImageIcon className="w-8 h-8 mb-2" />
                    <span className="text-xs font-bold uppercase tracking-wider">Belum Ada Bagan</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsStructurePickerOpen(true)}
                  className="inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-[#0f172a] px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border border-slate-200 cursor-pointer"
                >
                  <Upload className="w-4 h-4 mr-2" /> Pilih Bagan Struktur
                </button>
                {structureImageUrl && (
                  <button
                    type="button"
                    onClick={() => setStructureImageUrl(null)}
                    className="inline-flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border border-red-100 cursor-pointer"
                  >
                    Hapus
                  </button>
                )}
              </div>
              <input type="hidden" name="structureImageUrl" value={structureImageUrl || ""} />
              <ImagePickerModal
                open={isStructurePickerOpen}
                onOpenChange={setIsStructurePickerOpen}
                onSelect={(url) => setStructureImageUrl(url)}
                title="Pilih Gambar Struktur Organisasi"
                description="Pilih bagan struktur organisasi dari pustaka media atau unggah baru."
              />
            </div>
          </div>

          {/* TAB 5: POTENSI, LEMBAGA, SARPRAS & PRESTASI */}
          <div className={activeTab === "potensi" ? "space-y-6" : "hidden"}>
            <h3 className="text-sm font-black uppercase text-navy border-l-4 border-turquoise pl-3 mb-6">
              Potensi, Lembaga, Sarana & Prestasi
            </h3>

            <div>
              <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                Potensi Desa
              </label>
              <textarea
                name="potential"
                rows={4}
                defaultValue={initialProfile.potential}
                placeholder="Terangkan komoditas unggulan pertanian, tenun, pariwisata, kerajinan dll..."
                className="w-full p-4 border border-slate-200 rounded-xl font-medium text-slate-700 focus:ring-2 focus:ring-[#14b8a6] outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                Lembaga Kemasyarakatan
              </label>
              <textarea
                name="organizations"
                rows={4}
                defaultValue={initialProfile.organizations}
                placeholder="Tuliskan mengenai PKK, RT/RW, Karang Taruna, LPMD, dll..."
                className="w-full p-4 border border-slate-200 rounded-xl font-medium text-slate-700 focus:ring-2 focus:ring-[#14b8a6] outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                Sarana dan Prasarana Desa
              </label>
              <textarea
                name="facilities"
                rows={4}
                defaultValue={initialProfile.facilities}
                placeholder="Tuliskan sarana kantor, kesehatan, pendidikan, jalan, jembatan, air bersih, dll..."
                className="w-full p-4 border border-slate-200 rounded-xl font-medium text-slate-700 focus:ring-2 focus:ring-[#14b8a6] outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2">
                Prestasi dan Program Unggulan
              </label>
              <textarea
                name="achievements"
                rows={4}
                defaultValue={initialProfile.achievements}
                placeholder="Sebutkan prestasi yang pernah diraih serta program kerja prioritas desa..."
                className="w-full p-4 border border-slate-200 rounded-xl font-medium text-slate-700 focus:ring-2 focus:ring-[#14b8a6] outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center bg-navy hover:bg-navy/90 text-white px-8 py-4 rounded-full font-bold uppercase text-xs tracking-widest transition-all shadow-xl shadow-navy/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Menyimpan...
                </span>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" /> <span className="text-white">Simpan Profil Desa</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
