import { z } from "zod";

export const announcementSchema = z.object({
  title: z
    .string()
    .min(5, "Judul pengumuman minimal 5 karakter")
    .max(200, "Judul pengumuman maksimal 200 karakter"),
  content: z
    .string()
    .min(10, "Isi pengumuman terlalu pendek (minimal 10 karakter)"),
  category: z.string().min(1, "Kategori wajib dipilih"),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type AnnouncementInput = z.infer<typeof announcementSchema>;
