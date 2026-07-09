import { z } from "zod";
import { RegulationType } from "@prisma/client";

export const regulationSchema = z.object({
  title: z
    .string()
    .min(5, "Judul peraturan minimal 5 karakter")
    .max(200, "Judul peraturan maksimal 200 karakter"),
  number: z
    .string()
    .min(1, "Nomor peraturan wajib diisi"),
  year: z.coerce
    .number()
    .int()
    .min(1900, "Tahun tidak valid")
    .max(2100, "Tahun tidak valid"),
  description: z.string().optional().nullable(),
  type: z.nativeEnum(RegulationType),
  fileUrl: z.string().url("File URL tidak valid"),
  fileKey: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type RegulationInput = z.infer<typeof regulationSchema>;
