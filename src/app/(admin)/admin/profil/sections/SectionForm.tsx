"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Loader2,
  ArrowLeft,
  BookOpen,
  Image as ImageIcon,
  Video,
  Type,
  AlertCircle,
  Eye,
} from "lucide-react";
import Link from "next/link";
import ImagePickerModal from "@/components/admin/ImagePickerModal";
import { createProfileSection, updateProfileSection } from "./actions";

interface ProfileSectionItemInput {
  id?: string;
  title: string;
  contentType: "TEXT" | "IMAGE" | "YOUTUBE";
  content?: string;
  imageUrl?: string;
  youtubeUrl?: string;
  order: number;
}

interface ProfileSectionInput {
  id?: string;
  title: string;
  description?: string | null;
  order: number;
  status: "DRAFT" | "PUBLISHED";
  items: ProfileSectionItemInput[];
}

interface SectionFormProps {
  initialData?: ProfileSectionInput;
}

// Regex parser untuk mendapatkan video ID YouTube
function getYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default function SectionForm({ initialData }: SectionFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [order, setOrder] = useState(initialData?.order || 0);
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(initialData?.status || "DRAFT");
  
  // Repeater items state
  const [items, setItems] = useState<ProfileSectionItemInput[]>(
    initialData?.items || []
  );

  // Image picker modal state
  const [pickerState, setPickerState] = useState<{
    isOpen: boolean;
    itemIndex: number | null;
  }>({
    isOpen: false,
    itemIndex: null,
  });

  // Handler menambahkan item sub-bagian baru
  const handleAddItem = (type: "TEXT" | "IMAGE" | "YOUTUBE") => {
    setItems((prev) => [
      ...prev,
      {
        title: "",
        contentType: type,
        content: "",
        imageUrl: "",
        youtubeUrl: "",
        order: prev.length,
      },
    ]);
  };

  // Handler menghapus item
  const handleRemoveItem = (index: number) => {
    setItems((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      // Re-order
      return updated.map((item, i) => ({ ...item, order: i }));
    });
  };

  // Handler mengubah field item
  const handleItemChange = (index: number, fields: Partial<ProfileSectionItemInput>) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...fields } : item))
    );
  };

  // Memindahkan item ke atas
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setItems((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
      return updated.map((item, i) => ({ ...item, order: i }));
    });
  };

  // Memindahkan item ke bawah
  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    setItems((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
      return updated.map((item, i) => ({ ...item, order: i }));
    });
  };

  // Triger Image picker untuk item indeks tertentu
  const triggerImagePicker = (index: number) => {
    setPickerState({
      isOpen: true,
      itemIndex: index,
    });
  };

  // Callback dari Image Picker modal
  const handleSelectImage = (url: string) => {
    if (pickerState.itemIndex !== null) {
      handleItemChange(pickerState.itemIndex, { imageUrl: url });
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Judul Section wajib diisi.");
      return;
    }

    if (items.length === 0) {
      setError("Harap tambahkan minimal 1 item daftar isi (sub-bagian).");
      return;
    }

    for (let i = 0; i < items.length; i++) {
      if (!items[i].title.trim()) {
        setError(`Item #${i + 1} harus memiliki judul sub-bagian.`);
        return;
      }
      if (items[i].contentType === "TEXT" && !items[i].content?.trim()) {
        setError(`Konten teks pada item #${i + 1} (${items[i].title}) tidak boleh kosong.`);
        return;
      }
      if (items[i].contentType === "IMAGE" && !items[i].imageUrl) {
        setError(`Unggah gambar pada item #${i + 1} (${items[i].title}) terlebih dahulu.`);
        return;
      }
      if (items[i].contentType === "YOUTUBE" && !items[i].youtubeUrl?.trim()) {
        setError(`Link YouTube pada item #${i + 1} (${items[i].title}) wajib diisi.`);
        return;
      }
    }

    // Buat FormData secara manual
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("order", String(order));
    formData.append("status", status);
    formData.append("itemsJson", JSON.stringify(items));

    startTransition(async () => {
      let result;
      if (initialData?.id) {
        result = await updateProfileSection(initialData.id, formData);
      } else {
        result = await createProfileSection(formData);
      }

      if (result.success) {
        router.push("/admin/profil/sections");
        router.refresh();
      } else {
        setError(result.message || "Terjadi kesalahan saat menyimpan data.");
      }
    });
  };

  return (
    <div className="max-w-4xl w-full mx-auto pb-16">
      <Link
        href="/admin/profil/sections"
        className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-[#0f172a]/40 hover:text-[#0f172a] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar Section
      </Link>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Card Informasi Section Utama */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-teal-50 rounded-xl text-turquoise">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-navy uppercase tracking-tight">
                {initialData ? "Edit Section Profil" : "Tambah Section Profil Baru"}
              </h1>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Kelola judul utama dan sub-bagian dinamis beserta kontennya
              </p>
            </div>
          </div>

          {error && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-650 rounded-2xl text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} className="text-red-500 shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">
                Judul Utama Section
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Pariwisata & Ekonomi Kreatif"
                className="w-full p-4 border border-slate-200 rounded-xl font-bold text-navy focus:outline-none focus:ring-2 focus:ring-turquoise/40 bg-slate-50/50"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">
                Urutan Tampilan
              </label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                placeholder="0"
                className="w-full p-4 border border-slate-200 rounded-xl font-bold text-navy focus:outline-none focus:ring-2 focus:ring-turquoise/40 bg-slate-50/50"
              />
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">
                Deskripsi Singkat (Opsional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tulis ringkasan singkat isi section ini..."
                rows={2}
                className="w-full p-4 border border-slate-200 rounded-xl font-semibold text-navy focus:outline-none focus:ring-2 focus:ring-turquoise/40 bg-slate-50/50 resize-none"
              />
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">
                Status Publikasi
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
                className="w-full p-4 border border-slate-200 rounded-xl font-bold text-navy bg-white focus:outline-none focus:ring-2 focus:ring-turquoise/40"
              >
                <option value="DRAFT">DRAFT (Disembunyikan dari Publik)</option>
                <option value="PUBLISHED">PUBLISHED (Ditampilkan di /profil)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pemisah Section Repeater */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">
              Daftar Sub-Bagian / Konten Dinamis ({items.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleAddItem("TEXT")}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-55 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Plus size={12} /> Teks
              </button>
              <button
                type="button"
                onClick={() => handleAddItem("IMAGE")}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Plus size={12} /> Gambar
              </button>
              <button
                type="button"
                onClick={() => handleAddItem("YOUTUBE")}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Plus size={12} /> Video YouTube
              </button>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-50 text-slate-500" />
              <p className="text-xs font-bold uppercase tracking-widest">Belum ada sub-bagian</p>
              <p className="text-[10px] text-slate-450 uppercase tracking-wider mt-1">
                Gunakan tombol di kanan atas untuk menambahkan item baru secara modular.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative hover:shadow-md transition-all duration-300"
                >
                  {/* Header Item & Sort controls */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-extrabold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-655">
                        {item.contentType === "TEXT" && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[9px] font-bold">
                            <Type size={10} /> TEKS
                          </span>
                        )}
                        {item.contentType === "IMAGE" && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-teal-50 text-teal-700 rounded-md text-[9px] font-bold">
                            <ImageIcon size={10} /> GAMBAR
                          </span>
                        )}
                        {item.contentType === "YOUTUBE" && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-700 rounded-md text-[9px] font-bold">
                            <Video size={10} /> VIDEO
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#0f172a] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === items.length - 1}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#0f172a] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                      >
                        <ChevronDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-455 hover:text-red-600 ml-1 transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Input Fields */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400">
                        Judul Sub-Bagian (Muncul di Daftar Isi)
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleItemChange(idx, { title: e.target.value })}
                        placeholder="Contoh: Sejarah Perkembangan, Galeri Foto, atau Video Profil"
                        className="w-full p-3 border border-slate-200 rounded-lg text-xs font-bold text-navy focus:outline-none focus:ring-2 focus:ring-turquoise/40"
                      />
                    </div>

                    {/* TEXT CONTENT TYPE */}
                    {item.contentType === "TEXT" && (
                      <div className="space-y-1">
                        <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400">
                          Konten Teks
                        </label>
                        <textarea
                          value={item.content || ""}
                          onChange={(e) => handleItemChange(idx, { content: e.target.value })}
                          placeholder="Masukkan teks di sini. Pisahkan paragraf dengan enter..."
                          rows={6}
                          className="w-full p-3 border border-slate-200 rounded-lg text-xs font-semibold text-navy focus:outline-none focus:ring-2 focus:ring-turquoise/40 leading-relaxed resize-y"
                        />
                      </div>
                    )}

                    {/* IMAGE CONTENT TYPE */}
                    {item.contentType === "IMAGE" && (
                      <div className="space-y-3">
                        <div className="flex flex-col gap-2">
                          <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400">
                            Berkas Gambar
                          </label>

                          <div className="relative border border-dashed border-slate-200 rounded-xl p-4 flex items-center justify-center bg-slate-50 overflow-hidden min-h-[140px] max-h-[220px]">
                            {item.imageUrl ? (
                              <div className="relative w-full h-[180px] rounded-lg overflow-hidden group">
                                <img
                                  src={item.imageUrl}
                                  alt="Preview"
                                  className="w-full h-full object-contain"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button
                                    type="button"
                                    onClick={() => triggerImagePicker(idx)}
                                    className="px-4 py-2 bg-[#14b8a6] hover:bg-[#0f172a] text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-lg transition-colors cursor-pointer"
                                  >
                                    Ubah Gambar
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => triggerImagePicker(idx)}
                                className="w-full py-8 flex flex-col items-center justify-center text-slate-400 hover:text-[#14b8a6] transition-colors cursor-pointer"
                              >
                                <Plus className="mb-1 w-5 h-5" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">
                                  Pilih / Unggah Gambar
                                </span>
                              </button>
                            )}
                          </div>
                        </div>

                        {item.imageUrl && (
                          <div className="space-y-1">
                            <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400">
                              Keterangan Gambar (Opsional Teks)
                            </label>
                            <input
                              type="text"
                              value={item.content || ""}
                              onChange={(e) => handleItemChange(idx, { content: e.target.value })}
                              placeholder="Masukkan keterangan singkat di bawah gambar..."
                              className="w-full p-3 border border-slate-200 rounded-lg text-xs font-semibold text-navy focus:outline-none focus:ring-2 focus:ring-turquoise/40"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* YOUTUBE CONTENT TYPE */}
                    {item.contentType === "YOUTUBE" && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400">
                            URL Video YouTube
                          </label>
                          <input
                            type="url"
                            value={item.youtubeUrl || ""}
                            onChange={(e) => handleItemChange(idx, { youtubeUrl: e.target.value })}
                            placeholder="Contoh: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                            className="w-full p-3 border border-slate-200 rounded-lg text-xs font-semibold text-navy focus:outline-none focus:ring-2 focus:ring-turquoise/40"
                          />
                        </div>

                        {/* Embed Preview */}
                        {item.youtubeUrl && getYouTubeId(item.youtubeUrl) ? (
                          <div className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50 p-2 max-w-sm">
                            <span className="block text-[8px] font-black uppercase tracking-wider text-[#14b8a6] mb-1.5 px-1">
                              Preview Video YouTube:
                            </span>
                            <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200">
                              <iframe
                                src={`https://www.youtube.com/embed/${getYouTubeId(item.youtubeUrl)}`}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          </div>
                        ) : item.youtubeUrl ? (
                          <div className="text-[10px] text-red-500 font-bold uppercase tracking-wider flex items-center gap-1">
                            <AlertCircle size={12} />
                            Format URL YouTube tidak valid. Harap periksa kembali.
                          </div>
                        ) : null}

                        <div className="space-y-1">
                          <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400">
                            Deskripsi Video (Opsional Teks)
                          </label>
                          <textarea
                            value={item.content || ""}
                            onChange={(e) => handleItemChange(idx, { content: e.target.value })}
                            placeholder="Tulis deskripsi atau transkrip singkat untuk video di sini..."
                            rows={3}
                            className="w-full p-3 border border-slate-200 rounded-lg text-xs font-semibold text-navy focus:outline-none focus:ring-2 focus:ring-turquoise/40 leading-relaxed resize-y"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-[#14b8a6] text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#0f172a] hover:shadow-lg transition-all flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? (
              <Loader2 className="mr-2 animate-spin" size={20} />
            ) : (
              <Save className="mr-2" size={20} />
            )}
            {isPending ? "Menyimpan..." : "Simpan Section"}
          </button>
        </div>
      </form>

      {/* Shared Image Picker Modal */}
      <ImagePickerModal
        open={pickerState.isOpen}
        onOpenChange={(isOpen) => setPickerState((prev) => ({ ...prev, isOpen }))}
        onSelect={handleSelectImage}
        title="Pilih Gambar untuk Item Section"
        description="Unggah atau pilih gambar yang sudah ada dari pustaka media."
      />
    </div>
  );
}
