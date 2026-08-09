"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createCollaborator, updateCollaborator, deleteCollaborator } from "./actions";
import { Handshake, Plus, Edit2, Trash2, RefreshCw, X, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Collaborator } from "@prisma/client";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import ImagePickerField from "@/components/admin/ImagePickerField";

interface CollaboratorsManagerProps {
  initialCollaborators: Collaborator[];
}

export default function CollaboratorsManager({ initialCollaborators }: CollaboratorsManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Form states
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [order, setOrder] = useState<number>(0);
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  
  // UI states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Set form values when editing a collaborator
  const handleEdit = (collab: Collaborator) => {
    setEditingId(collab.id);
    setName(collab.name);
    setLogoUrl(collab.logoUrl);
    setOrder(collab.order);
    setStatus(collab.status as "DRAFT" | "PUBLISHED");
    setFieldErrors({});
    setServerError(null);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setLogoUrl("");
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

    // Dapatkan url logo dari DOM input tersembunyi milik ImagePickerField
    const selectedLogoUrl = (document.querySelector('input[name="logoUrl"]') as HTMLInputElement)?.value || "";

    const formData = new FormData();
    formData.append("name", name);
    formData.append("logoUrl", selectedLogoUrl);
    formData.append("order", String(order));
    formData.append("status", status);

    startTransition(async () => {
      const res = editingId 
        ? await updateCollaborator(editingId, formData)
        : await createCollaborator(formData);

      if (res.success) {
        setName("");
        setLogoUrl("");
        setOrder(0);
        setStatus("DRAFT");
        setEditingId(null);
        
        // Reset manual preview ImagePickerField jika ada
        const removeBtn = document.querySelector('button[aria-label="Remove image"]') as HTMLButtonElement;
        if (removeBtn) removeBtn.click();
        
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

  // Handle Delete collaborator
  const handleDelete = async (id: string) => {
    const res = await deleteCollaborator(id);
    if (!res.success) {
      throw new Error(res.message || "Gagal menghapus kolaborator");
    }
    router.refresh();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Kolom Kiri: Form Add/Edit */}
      <div className="lg:col-span-4">
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-navy flex items-center gap-2">
              <Handshake className="w-5 h-5 text-turquoise" />
              {editingId ? "Edit Kolaborator" : "Tambah Kolaborator"}
            </CardTitle>
            <CardDescription>
              {editingId ? "Ubah informasi mitra/kolaborator terdaftar." : "Tambahkan logo dan nama instansi kolaborator baru."}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {serverError && (
                <div className="bg-red-50 text-red-600 text-xs px-4 py-3 rounded-lg border border-red-100 font-medium">
                  {serverError}
                </div>
              )}

              {/* Input Nama Kolaborator */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy uppercase tracking-wider">Nama Instansi / Mitra</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Solar Chapter"
                  className={cn("bg-white border-slate-200", fieldErrors.name && "border-red-400 focus-visible:ring-red-400")}
                  disabled={isPending}
                />
                {fieldErrors.name && (
                  <p className="text-red-500 text-[10px] font-bold">{fieldErrors.name[0]}</p>
                )}
              </div>

              {/* Input Logo Kolaborator */}
              <div className="space-y-1.5">
                <ImagePickerField 
                  key={editingId || "new"}
                  name="logoUrl"
                  label="Logo Kolaborator" 
                  title="Pilih Logo" 
                  currentImage={logoUrl || null} 
                />
                {fieldErrors.logoUrl && (
                  <p className="text-red-500 text-[10px] font-bold">{fieldErrors.logoUrl[0]}</p>
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

      {/* Kolom Kanan: Daftar Kolaborator */}
      <div className="lg:col-span-8">
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-navy">Daftar Kolaborator</CardTitle>
              <CardDescription>Instansi atau mitra yang berkolaborasi dengan Desa Nekmese.</CardDescription>
            </div>
            <div className="bg-turquoise/10 text-turquoise text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              {initialCollaborators.length} Kolaborator
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {initialCollaborators.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Handshake className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold">Belum ada kolaborator</p>
                <p className="text-xs text-slate-400 mt-1">Silakan tambah kolaborator baru di panel sebelah kiri.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/20 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                      <th className="px-6 py-4">Logo</th>
                      <th className="px-6 py-4">Nama Kolaborator</th>
                      <th className="px-6 py-4 text-center">Urutan</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {initialCollaborators.map((collab) => (
                      <tr key={collab.id} className="border-b border-slate-100/50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="w-12 h-12 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center p-1.5 overflow-hidden">
                            <img src={collab.logoUrl} alt={collab.name} className="w-full h-full object-contain" />
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-navy text-sm">
                          {collab.name}
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-slate-500 text-xs">
                          {collab.order}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <span className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border",
                              collab.status === "PUBLISHED" 
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                : "bg-amber-50 text-amber-600 border-amber-100"
                            )}>
                              {collab.status === "PUBLISHED" ? (
                                <>
                                  <Eye className="w-3.5 h-3.5" />
                                  PUBLISHED
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3.5 h-3.5" />
                                  DRAFT
                                </>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(collab)}
                              className="h-8 w-8 text-slate-500 hover:text-[#14b8a6] hover:bg-[#14b8a6]/5 border-slate-200 hover:border-[#14b8a6]/30 rounded-lg cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <ConfirmDeleteButton
                              onConfirm={() => handleDelete(collab.id)}
                              title="Hapus Kolaborator"
                              message={`Apakah Anda yakin ingin menghapus kolaborator "${collab.name}" secara permanen? Tindakan ini tidak dapat dibatalkan.`}
                              buttonClassName="h-8 w-8 rounded-lg border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </ConfirmDeleteButton>
                          </div>
                        </td>
                      </tr>
                    ))}
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
