import { z } from "zod";

export const waterSourceSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  latitude: z.coerce.number({ message: "Latitude harus berupa angka" }),
  longitude: z.coerce.number({ message: "Longitude harus berupa angka" }),
  mapUrl: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  images: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type WaterSourceInput = z.infer<typeof waterSourceSchema>;
