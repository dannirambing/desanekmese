import { z } from "zod";
import { OrderChannel } from "@prisma/client";

export const umkmSchema = z.object({
  name: z
    .string()
    .min(3, "Nama produk minimal 3 karakter")
    .max(100, "Nama produk maksimal 100 karakter"),
  description: z
    .string()
    .min(10, "Deskripsi terlalu pendek (minimal 10 karakter)")
    .max(1000, "Deskripsi maksimal 1000 karakter"),
  price: z.coerce
    .number()
    .min(0, "Harga tidak boleh negatif"),
  ownerName: z
    .string()
    .min(3, "Nama pemilik minimal 3 karakter")
    .max(100, "Nama pemilik maksimal 100 karakter"),
  orderUrl: z
    .string()
    .url("URL pesanan tidak valid")
    .max(255, "URL terlalu panjang"),
  orderType: z.enum(["WHATSAPP", "TOKOPEDIA", "SHOPEE", "CUSTOM"]),
  status: z.enum(["PUBLISHED", "DRAFT"]),
  newImageUrl: z.string().optional().nullable(),
  removeImage: z.preprocess((val) => val === "true" || val === true, z.boolean()).optional().default(false),
});

export type UMKMInput = z.infer<typeof umkmSchema>;
export type UMKMFormInput = z.input<typeof umkmSchema>;
