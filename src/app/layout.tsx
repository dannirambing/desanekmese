import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 1. Inisialisasi font di level root
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter', // Opsional: untuk penggunaan di tailwind.config
});

export const metadata: Metadata = {
  title: "Desa Nekmese",
  description: "Portal Informasi dan Wisata Desa Nekmese",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      {/* 2. Terapkan class font di sini, ini akan diwariskan ke semua halaman */}
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}