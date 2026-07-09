import { z } from "zod";

export const cultureSchema = z.object({
  name: z.string().min(3, "Nama budaya minimal 3 karakter").max(150, "Nama budaya maksimal 150 karakter"),
  summary: z.string().max(300, "Ringkasan maksimal 300 karakter").optional().nullable(),
  description: z.string().min(10, "Deskripsi terlalu pendek (minimal 10 karakter)"),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  status: z.enum(["PUBLISHED", "DRAFT"]),
});

export type CultureInput = z.infer<typeof cultureSchema>;
