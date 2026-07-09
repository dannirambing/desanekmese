import { z } from "zod";

export const newsArticleSchema = z.object({
  title: z
    .string()
    .min(5, "Judul berita minimal 5 karakter")
    .max(200, "Judul berita maksimal 200 karakter"),
  summary: z
    .string()
    .max(500, "Ringkasan maksimal 500 karakter")
    .optional()
    .nullable(),
  content: z
    .string()
    .min(20, "Konten berita terlalu pendek (minimal 20 karakter)"),
  status: z.enum(["PUBLISHED", "DRAFT"]),
});

export type NewsArticleInput = z.infer<typeof newsArticleSchema>;
