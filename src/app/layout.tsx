import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 1. Inisialisasi font di level root
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter', // Opsional: untuk penggunaan di tailwind.config
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://desanekmese.vercel.app"),
  title: "Desa Nekmese - Amarasi Selatan, Kabupaten Kupang",
  description: "Portal resmi Desa Nekmese, Amarasi Selatan, Kabupaten Kupang. Jelajahi destinasi wisata alam, budaya lokal Atoni Meto, pengumuman resmi, berita terkini, dan produk UMKM unggulan desa.",
  keywords: ["Desa Nekmese", "Amarasi Selatan", "Kabupaten Kupang", "Wisata Kupang", "Budaya Atoni Meto", "UMKM Nekmese", "Portal Desa"],
  authors: [{ name: "Pemerintah Desa Nekmese" }],
  creator: "Pemerintah Desa Nekmese",
  publisher: "Pemerintah Desa Nekmese",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://desanekmese.vercel.app",
    title: "Desa Nekmese - Amarasi Selatan, Kabupaten Kupang",
    description: "Portal resmi Desa Nekmese, Amarasi Selatan, Kabupaten Kupang. Jelajahi destinasi wisata alam, budaya lokal Atoni Meto, pengumuman resmi, berita terkini, dan produk UMKM unggulan desa.",
    siteName: "Desa Nekmese Portal",
    images: [
      {
        url: "https://azhuh458gn.ufs.sh/f/IDwrE8y2GhNiT3jd6hwEJvA74yPimMfuNFo6zp0Ia1S3eH2D",
        width: 1200,
        height: 630,
        alt: "Portal Desa Nekmese",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Desa Nekmese - Amarasi Selatan, Kabupaten Kupang",
    description: "Portal resmi Desa Nekmese, Amarasi Selatan, Kabupaten Kupang. Jelajahi destinasi wisata alam, budaya lokal Atoni Meto, pengumuman resmi, berita terkini, dan produk UMKM unggulan desa.",
    images: ["https://azhuh458gn.ufs.sh/f/IDwrE8y2GhNiT3jd6hwEJvA74yPimMfuNFo6zp0Ia1S3eH2D"],
  },
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