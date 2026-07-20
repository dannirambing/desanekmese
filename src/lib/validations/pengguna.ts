import { z } from "zod";

export const createAdminSchema = z.object({
  name: z
    .string()
    .min(3, "Nama lengkap minimal 3 karakter")
    .max(50, "Nama lengkap maksimal 50 karakter")
    .regex(/^[a-zA-Z\s'.]+$/, "Nama lengkap hanya boleh berisi huruf, spasi, tanda petik, dan titik"),
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid")
    .refine((val) => val === val.toLowerCase(), {
      message: "Email tidak boleh mengandung huruf kapital/besar",
    }),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter"),
  confirmPassword: z
    .string()
    .min(1, "Konfirmasi password wajib diisi"),
  roleId: z
    .string()
    .min(1, "Role wajib dipilih"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password dan Konfirmasi Password tidak cocok",
  path: ["confirmPassword"],
});

export const updateAdminSchema = z.object({
  name: z
    .string()
    .min(3, "Nama lengkap minimal 3 karakter")
    .max(50, "Nama lengkap maksimal 50 karakter")
    .regex(/^[a-zA-Z\s'.]+$/, "Nama lengkap hanya boleh berisi huruf, spasi, tanda petik, dan titik"),
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid")
    .refine((val) => val === val.toLowerCase(), {
      message: "Email tidak boleh mengandung huruf kapital/besar",
    }),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .optional()
    .or(z.literal("")),
  confirmPassword: z
    .string()
    .optional()
    .or(z.literal("")),
  roleId: z
    .string()
    .min(1, "Role wajib dipilih"),
}).refine((data) => {
  if (data.password && data.password.length > 0) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Password dan Konfirmasi Password tidak cocok",
  path: ["confirmPassword"],
});
