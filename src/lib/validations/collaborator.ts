import { z } from "zod";

export const collaboratorSchema = z.object({
  name: z
    .string()
    .min(3, "Nama kolaborator minimal 3 karakter")
    .max(100, "Nama kolaborator maksimal 100 karakter"),
  logoUrl: z
    .string()
    .min(1, "Logo kolaborator wajib dipilih/diunggah"),
  order: z.coerce
    .number()
    .int()
    .min(0, "Urutan minimal 0"),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type CollaboratorInput = z.infer<typeof collaboratorSchema>;
