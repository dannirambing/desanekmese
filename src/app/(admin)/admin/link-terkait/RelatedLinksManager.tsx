"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createRelatedLink, updateRelatedLink, deleteRelatedLink } from "./actions";
import { Link2, Plus, Edit2, Trash2, Globe, ExternalLink, RefreshCw, X, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RelatedLink } from "@prisma/client";

interface RelatedLinksManagerProps {
  initialLinks: RelatedLink[];
}

export default function RelatedLinksManager({ initialLinks }: RelatedLinksManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Form states
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [order, setOrder] = useState<number>(0);
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  
  // UI states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Set form values when editing a link
  const handleEdit = (link: RelatedLink) => {
    setEditingId(link.id);
    setTitle(link.title);
    setUrl(link.url);
    setOrder(link.order);
    setStatus(link.status as "DRAFT" | "PUBLISHED");
    setFieldErrors({});
    setServerError(null);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setUrl("");
    setOrder(0);
    setStatus("DRAFT");
    setFieldErrors({});
    setServerError(null);
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setServerError(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("url", url);
    formData.append("order", String(order));
    formData.append("status", status);

    startTransition(async () => {
      const res = editingId 
        ? await updateRelatedLink(editingId, formData)
        : await createRelatedLink(formData);

      if (res.success) {
        setTitle("");
        setUrl("");
        setOrder(0);
        setStatus("DRAFT");
        setEditingId(null);
        router.refresh();
      } else {
        if (res.errors) {
          setFieldErrors(res.errors);
        }
        if (res.message) {
          setServerError(res.message);
        }
      }
    });
  };

  // Handle Delete link
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus link "${name}"?`)) return;

    startTransition(async () => {
      const res = await deleteRelatedLink(id);
      if (res.success) {
        router.refresh();
      } else if (res.message) {
        alert(res.message);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Kolom Kiri: Form Add/Edit */}
      <div className="lg:col-span-4">
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-navy flex items-center gap-2">
              <Link2 className="w-5 h-5 text-turquoise" />
              {editingId ? "Edit Link Terkait" : "Tambah Link Terkait"}
            </CardTitle>
            <CardDescription>
              {editingId ? "Ubah informasi link sistem atau website eksternal terkait." : "Hubungkan website/sistem informasi lain ke Footer."}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {serverError && (
                <div className="bg-red-50 text-red-600 text-xs px-4 py-3 rounded-lg border border-red-100 font-medium">
                  {serverError}
                </div>
              )}

              {/* Input Nama Website */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy uppercase tracking-wider">Nama Website / Sistem</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Pemetaan UMKM Nekmese"
                  className={cn("bg-white border-slate-200", fieldErrors.title && "border-red-400 focus-visible:ring-red-400")}
                  disabled={isPending}
                />
                {fieldErrors.title && (
                  <p className="text-red-500 text-[10px] font-bold">{fieldErrors.title[0]}</p>
                )}
              </div>

              {/* Input URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy uppercase tracking-wider">URL Website</label>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Contoh: https://umkm.nekmese.desa.id"
                  className={cn("bg-white border-slate-200", fieldErrors.url && "border-red-400 focus-visible:ring-red-400")}
                  disabled={isPending}
                />
                {fieldErrors.url && (
                  <p className="text-red-500 text-[10px] font-bold">{fieldErrors.url[0]}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Input Urutan */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy uppercase tracking-wider">Urutan</label>
                  <Input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    className={cn("bg-white border-slate-200", fieldErrors.order && "border-red-400")}
                    disabled={isPending}
                  />
                  {fieldErrors.order && (
                    <p className="text-red-500 text-[10px] font-bold">{fieldErrors.order[0]}</p>
                  )}
                </div>

                {/* Input Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy uppercase tracking-wider">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isPending}
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                  </select>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex gap-3 pt-3 border-t border-slate-100">
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={isPending}
                    className="flex-1 rounded-full text-xs font-bold uppercase tracking-wider h-11 border-slate-200 hover:bg-slate-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Batal
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-turquoise hover:bg-turquoise/90 text-black rounded-full text-xs font-bold uppercase tracking-wider h-11 shadow-md shadow-turquoise/10"
                >
                  {isPending ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  ) : editingId ? (
                    "Simpan"
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2 stroke-[3]" />
                      Tambah
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Kolom Kanan: Daftar Link */}
      <div className="lg:col-span-8">
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-navy">Daftar Link Terkait</CardTitle>
              <CardDescription>Sistem informasi luar/mitra yang terhubung di Footer website.</CardDescription>
            </div>
            <div className="bg-turquoise/10 text-turquoise text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              {initialLinks.length} Link
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {initialLinks.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold">Belum ada link terkait</p>
                <p className="text-xs text-slate-400 mt-1">Silakan tambah link baru di panel sebelah kiri.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/20 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                      <th className="px-6 py-4">Nama Website</th>
                      <th className="px-6 py-4">URL</th>
                      <th className="px-6 py-4 text-center">Urutan</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {initialLinks.map((link) => {
                      const isPublished = link.status === "PUBLISHED";
                      return (
                        <tr 
                          key={link.id}
                          className={cn(
                            "hover:bg-slate-50/30 transition-colors group",
                            editingId === link.id && "bg-turquoise/5 hover:bg-turquoise/5"
                          )}
                        >
                          <td className="px-6 py-4 font-bold text-navy max-w-[200px] truncate">
                            {link.title}
                          </td>
                          <td className="px-6 py-4 text-slate-500 font-medium max-w-[250px] truncate">
                            <a 
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-turquoise transition-colors flex items-center gap-1.5 text-xs underline decoration-slate-200 hover:decoration-turquoise"
                            >
                              {link.url}
                              <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-turquoise transition-colors shrink-0" />
                            </a>
                          </td>
                          <td className="px-6 py-4 text-center text-slate-500 font-bold">
                            <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-md border border-slate-200/50">
                              {link.order}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={cn(
                              "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                              isPublished 
                                ? "bg-turquoise/10 text-turquoise border border-turquoise/20" 
                                : "bg-slate-100 text-slate-500 border border-slate-200"
                            )}>
                              {isPublished ? (
                                <Eye className="w-3.5 h-3.5" />
                              ) : (
                                <EyeOff className="w-3.5 h-3.5" />
                              )}
                              {link.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2.5">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => handleEdit(link)}
                                disabled={isPending}
                                className={cn(
                                  "w-8 h-8 rounded-full border-slate-200 text-slate-500 hover:text-turquoise hover:border-turquoise hover:bg-turquoise/5 transition-all",
                                  editingId === link.id && "border-turquoise text-turquoise bg-turquoise/5"
                                )}
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => handleDelete(link.id, link.title)}
                                disabled={isPending}
                                className="w-8 h-8 rounded-full border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
