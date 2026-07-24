import { z } from "zod";

export const relatedLinkSchema = z.object({
  title: z
    .string()
    .min(3, "Nama website/sistem minimal 3 karakter")
    .max(100, "Nama website/sistem maksimal 100 karakter"),
  url: z
    .string()
    .url("URL website tidak valid (harus diawali dengan http:// atau https://)"),
  order: z.coerce
    .number()
    .int()
    .min(0, "Urutan minimal 0"),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type RelatedLinkInput = z.infer<typeof relatedLinkSchema>;
