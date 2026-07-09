import { z } from "zod";

export const tourismSchema = z.object({
  name: z.string().min(3, "Nama destinasi minimal 3 karakter").max(150, "Nama destinasi maksimal 150 karakter"),
  location: z.string().min(3, "Lokasi minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi terlalu pendek (minimal 10 karakter)"),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  status: z.enum(["PUBLISHED", "DRAFT"]),
  facilities: z.string().optional().nullable(),
  mapUrl: z.string().optional().nullable(),
  openHours: z.string().optional().nullable(),
});

export type TourismInput = z.infer<typeof tourismSchema>;
