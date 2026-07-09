"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { umkmSchema, UMKMInput, UMKMFormInput } from "@/lib/validations/umkm";
import { Save, Loader2 } from "lucide-react";
import ImagePickerField from "./ImagePickerField";
import { useState, useTransition } from "react";
import { createUMKMProduct, updateUMKMProduct } from "@/app/(admin)/admin/umkm/actions";
import { ORDER_CHANNEL_OPTIONS } from "@/lib/umkm-order";

interface UmkmFormProps {
  initialData?: Partial<UMKMFormInput> & { id: string };
  initialImage?: string | null;
}

export default function UmkmForm({ initialData, initialImage }: UmkmFormProps) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UMKMFormInput, any, UMKMInput>({
    resolver: zodResolver(umkmSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      price: 0,
      ownerName: "",
      orderUrl: "",
      orderType: "WHATSAPP",
      status: "DRAFT",
    },
  });

  const onSubmit = async (data: UMKMInput) => {
    setServerError(null);
    
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("ownerName", data.ownerName);
    formData.append("orderUrl", data.orderUrl);
    formData.append("orderType", data.orderType);
    formData.append("status", data.status);

    const imageUrl = (document.querySelector('input[name="imageUrl"]') as HTMLInputElement)?.value;
    const removeImage = (document.querySelector('input[name="removeImage"]') as HTMLInputElement)?.value;

    if (imageUrl) formData.append("newImageUrl", imageUrl);
    if (removeImage) formData.append("removeImage", removeImage);

    startTransition(async () => {
      let result;
      if (initialData?.id) {
        result = await updateUMKMProduct(initialData.id, formData);
      } else {
        result = await createUMKMProduct(formData);
      }

      if (!result.success) {
        setServerError(result.message || "Terjadi kesalahan saat menyimpan produk.");
      }
    });
  };

  const inputClass = (error?: any) => `w-full p-4 border rounded-xl font-bold focus:outline-none focus:ring-2 ${error ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-turquoise/40 text-[#0f172a]"}`;
  const labelClass = "block text-[10px] font-black uppercase text-[#0f172a]/70 mb-2 tracking-widest";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl font-bold border border-red-200 text-sm">
          {serverError}
        </div>
      )}

      <ImagePickerField 
        label="Foto Produk" 
        title="Pilih Foto Produk" 
        currentImage={initialImage || null} 
      />

      <div>
        <label className={labelClass}>Nama Produk</label>
        <input {...register("name")} className={inputClass(errors.name)} />
        {errors.name && <p className="text-red-500 text-xs mt-1 font-bold">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nama Pemilik / UMKM</label>
          <input {...register("ownerName")} className={inputClass(errors.ownerName)} />
          {errors.ownerName && <p className="text-red-500 text-xs mt-1 font-bold">{errors.ownerName.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Harga (Rp)</label>
          <input type="number" min={0} {...register("price")} className={inputClass(errors.price)} />
          {errors.price && <p className="text-red-500 text-xs mt-1 font-bold">{errors.price.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Deskripsi</label>
        <textarea {...register("description")} rows={4} className={`${inputClass(errors.description)} font-semibold`} />
        {errors.description && <p className="text-red-500 text-xs mt-1 font-bold">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Channel Pemesanan</label>
          <select {...register("orderType")} className={`${inputClass(errors.orderType)} bg-white`}>
            {ORDER_CHANNEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.orderType && <p className="text-red-500 text-xs mt-1 font-bold">{errors.orderType.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select {...register("status")} className={`${inputClass(errors.status)} bg-white`}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
          {errors.status && <p className="text-red-500 text-xs mt-1 font-bold">{errors.status.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Link Pemesanan</label>
        <input 
          type="url" 
          placeholder="https://wa.me/628xxx, shopee.co.id/..., tokopedia.com/..." 
          {...register("orderUrl")} 
          className={`${inputClass(errors.orderUrl)} font-semibold`} 
        />
        <p className="text-xs text-slate-400 mt-2">Paste link WhatsApp, Shopee, Tokopedia, atau link toko online lainnya.</p>
        {errors.orderUrl && <p className="text-red-500 text-xs mt-1 font-bold">{errors.orderUrl.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#14b8a6] text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#0f172a] transition-all flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? <Loader2 className="mr-2 animate-spin" size={20} /> : <Save className="mr-2" size={20} />}
        {isPending ? "Menyimpan..." : "Simpan Produk"}
      </button>
    </form>
  );
}
