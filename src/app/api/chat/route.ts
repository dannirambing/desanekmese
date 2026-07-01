import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Simple in-memory rate limiter to prevent abuse and protect free tier limits
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // Max 10 messages per minute per IP

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Groq API Key tidak dikonfigurasi di server." },
        { status: 500 }
      );
    }

    // Get client IP address to apply rate limit
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown-ip";
    const now = Date.now();
    
    const ipData = ipRequestCounts.get(ip);
    if (ipData) {
      if (now > ipData.resetTime) {
        // Reset window
        ipRequestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      } else {
        ipData.count += 1;
        if (ipData.count > MAX_REQUESTS_PER_WINDOW) {
          return NextResponse.json(
            { error: "Terlalu banyak permintaan pesan (rate limit). Silakan coba lagi dalam 1 menit." },
            { status: 429 }
          );
        }
      }
    } else {
      ipRequestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }

    const body = await req.json();
    const { pesanBaru, riwayatPesan } = body;

    if (!pesanBaru) {
      return NextResponse.json(
        { error: "Pesan baru tidak boleh kosong." },
        { status: 400 }
      );
    }

    // 1. Ambil data dari database untuk membangun konteks secara paralel/aman
    let profileData: any = null;
    let wisataData: any[] = [];
    let budayaData: any[] = [];
    let produkData: any[] = [];
    let pengumumanData: any[] = [];
    let beritaData: any[] = [];
    let anggaranData: any[] = [];

    try {
      profileData = await prisma.villageProfile.findUnique({
        where: { id: "main" },
      });
    } catch (e) {
      console.error("Gagal mengambil data profil:", e);
    }

    try {
      wisataData = await prisma.tourismPlace.findMany({
        where: { status: "PUBLISHED" },
        select: { name: true, description: true, location: true, openHours: true, facilities: true },
      });
    } catch (e) {
      console.error("Gagal mengambil data wisata:", e);
    }

    try {
      budayaData = await prisma.cultureItem.findMany({
        where: { status: "PUBLISHED" },
        select: { name: true, summary: true, description: true },
      });
    } catch (e) {
      console.error("Gagal mengambil data budaya:", e);
    }

    try {
      produkData = await prisma.productUMKM.findMany({
        where: { status: "PUBLISHED" },
        select: { name: true, description: true, price: true, ownerName: true, orderUrl: true, orderType: true },
      });
    } catch (e) {
      console.error("Gagal mengambil data produk UMKM:", e);
    }

    try {
      pengumumanData = await prisma.announcement.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { title: true, content: true, category: true },
      });
    } catch (e) {
      console.error("Gagal mengambil data pengumuman:", e);
    }

    try {
      beritaData = await prisma.newsArticle.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 2,
        select: { title: true, summary: true, content: true },
      });
    } catch (e) {
      console.error("Gagal mengambil data berita:", e);
    }

    try {
      anggaranData = await prisma.villageBudget.findMany({
        orderBy: { year: "desc" },
        take: 2,
        select: {
          year: true,
          totalRevenueBudget: true,
          totalRevenueRealization: true,
          totalExpenditureBudget: true,
          totalExpenditureRealization: true,
        }
      });
    } catch (e) {
      console.error("Gagal mengambil data anggaran:", e);
    }

    // Helper to truncate text to keep context token count low (under Groq free limits)
    const limitLength = (text: string, max: number) => {
      if (!text) return "N/A";
      return text.length > max ? text.substring(0, max) + "..." : text;
    };

    // 2. Format konteks ke bentuk teks Markdown yang sangat padat (sangat hemat token)
    let contextText = `Konteks Informasi Desa Nekmese:\n\n`;

    if (profileData) {
      contextText += `### 1. Profil Umum Desa
- Lokasi: Kec. ${profileData.district || "Kupang Barat"}, Kab. ${profileData.regency || "Kupang"}, NTT. Kode: ${profileData.villageCode || "53.01.xx.xxxx"}. Tahun berdiri: ${profileData.establishedYear || "N/A"}.
- Kades saat ini: ${profileData.welcomeName || "Krisna Jems Baok"} (${profileData.welcomeRole || "Kepala Desa"}).
- Sambutan: "${limitLength(profileData.welcomeText, 100)}"
- Sejarah Singkat: ${limitLength(profileData.history, 120)}
- Visi & Misi: Visi (${limitLength(profileData.vision, 80)}) Misi (${limitLength(profileData.mission, 120)})
- Geografi & Batas Wilayah: Batas Utara (${profileData.boundariesNorth || "N/A"}), Timur (${profileData.boundariesEast || "N/A"}), Selatan (${profileData.boundariesSouth || "N/A"}), Barat (${profileData.boundariesWest || "N/A"}). Geografi: ${limitLength(profileData.geography, 80)}
- Penduduk: Total ${profileData.populationTotal || 0} jiwa (Laki: ${profileData.populationMale || 0}, Perempuan: ${profileData.populationFemale || 0}), ${profileData.populationFamilies || 0} KK.
- Potensi & Lembaga: Potensi (${limitLength(profileData.potential, 80)}), Lembaga (${limitLength(profileData.organizations, 80)}), Fasilitas (${limitLength(profileData.facilities, 80)}), Prestasi (${limitLength(profileData.achievements, 80)})\n\n`;
    } else {
      contextText += `### 1. Profil Umum Desa
- Lokasi: Kecamatan Kupang Barat, Kabupaten Kupang, Nusa Tenggara Timur (NTT). Kades: Krisna Jems Baok.\n\n`;
    }

    if (wisataData.length > 0) {
      contextText += `### 2. Destinasi Wisata
${wisataData.map((w, idx) => `${idx + 1}. **${w.name}** (Lokasi: ${w.location || "N/A"}, Jam buka: ${w.openHours || "N/A"}, Fasilitas: ${Array.isArray(w.facilities) ? w.facilities.slice(0,3).join(", ") : "N/A"}). Deskripsi: ${limitLength(w.description, 80)}`).join("\n")}\n\n`;
    }

    if (budayaData.length > 0) {
      contextText += `### 3. Kebudayaan
${budayaData.map((b, idx) => `${idx + 1}. **${b.name}** (Ringkasan: ${limitLength(b.summary || "", 60)}). Deskripsi: ${limitLength(b.description, 65)}`).join("\n")}\n\n`;
    }

    if (produkData.length > 0) {
      contextText += `### 4. UMKM & Produk Desa
${produkData.map((p, idx) => `${idx + 1}. **${p.name}** (Harga: Rp ${p.price ? p.price.toLocaleString("id-ID") : "N/A"}, Pemilik: ${p.ownerName || "N/A"}). Cara pesan (${p.orderType || "N/A"}): Beli di link: ${p.orderUrl || "N/A"}. Deskripsi: ${limitLength(p.description, 60)}`).join("\n")}\n\n`;
    }

    if (pengumumanData.length > 0) {
      contextText += `### 5. Pengumuman Terbaru
${pengumumanData.map((p, idx) => `${idx + 1}. **[${p.category || "Umum"}] ${p.title}**:\n${limitLength(p.content || "", 1500)}`).join("\n\n")}\n\n`;
    }

    if (beritaData.length > 0) {
      contextText += `### 6. Berita Terbaru
${beritaData.map((b, idx) => `${idx + 1}. **${b.title}** (Ringkasan: ${limitLength(b.summary || "", 100)}):\n${limitLength(b.content || "", 600)}`).join("\n\n")}\n\n`;
    }

    if (anggaranData.length > 0) {
      contextText += `### 7. Ringkasan Anggaran (APBDes)
${anggaranData.map((a) => `- **Tahun ${a.year}**: Pendapatan (Anggaran: Rp ${a.totalRevenueBudget ? a.totalRevenueBudget.toLocaleString("id-ID") : "0"}, Realisasi: Rp ${a.totalRevenueRealization ? a.totalRevenueRealization.toLocaleString("id-ID") : "0"}). Belanja (Anggaran: Rp ${a.totalExpenditureBudget ? a.totalExpenditureBudget.toLocaleString("id-ID") : "0"}, Realisasi: Rp ${a.totalExpenditureRealization ? a.totalExpenditureRealization.toLocaleString("id-ID") : "0"}).`).join("\n")}\n\n`;
    }

    // 3. Bangun Sistem Prompt
    const systemPrompt = `Anda adalah "Asisten AI Desa Nekmese" (Nekmese AI Assistant), asisten virtual cerdas, ramah, dan solutif yang berdedikasi untuk membantu warga maupun pengunjung website Desa Nekmese.

ATURAN BAHASA & LOGAT KUPANG SOPAN (CRITICAL STYLE RULES):
1. Anda WAJIB menjawab menggunakan Bahasa Indonesia yang santun, resmi, dan hangat, dengan sentuhan logat Kupang yang halus dan sopan.
2. Gunakan kata ganti "Beta" untuk menyebut diri Anda (sebagai asisten virtual resmi desa), dan sapa pengguna dengan sebutan lokal yang sangat dihormati seperti "Kaka", "Bapa", atau "Mama".
3. DILARANG KERAS menggunakan kata-kata percakapan jalanan/informal/kasar seperti "sonde", "son", "ko", "pi", "sa", "lu", atau "pung". Gunakan kata baku Bahasa Indonesia yang sopan untuk tata bahasa (seperti "tidak", "apakah", "pergi", "saja", "punya").
4. Contoh cara menjawab yang sopan dan halus:
   - "Halo Kaka! Ada yang bisa beta bantu hari ini?"
   - "Kaka jika ingin memesan Kopi Arabika Nekmese, silakan klik tautan WhatsApp berikut..."
   - "Mohon maaf Kaka, saat ini beta tidak memiliki data resmi mengenai hal tersebut di database kami..."

PANDUAN AKURASI DATA & ANTI-HALUSINASI:
1. Jawablah pertanyaan hanya berdasarkan fakta yang tertulis secara literal dalam "Konteks Informasi Desa" di bawah.
2. Dilarang keras mengarang (berhalusinasi) informasi, data, angka, nama orang, nomor telepon, atau prosedur layanan jika tidak ada di dalam teks konteks di bawah.
3. Jika informasi yang ditanyakan pengguna TIDAK ADA secara tertulis di dalam konteks di bawah, Anda wajib menjawab dengan bahasa Indonesia dan sapaan Kupang yang sopan:
   "Mohon maaf Kaka/Bapa/Mama, beta tidak memiliki data resmi mengenai hal tersebut di database kami saat ini. Silakan kunjungi Kantor Desa Nekmese secara langsung atau hubungi perangkat desa terkait untuk mendapatkan informasi yang akurat."

Tugas utama Anda:
1. Jawab pertanyaan pengguna mengenai profil desa, sejarah, visi misi, potensi, wisata, kebudayaan, produk UMKM lokal, berita, pengumuman (termasuk prosedur administrasi seperti KTP-el dan KK jika tercantum), dan transparansi anggaran (APBDes) berdasarkan data resmi desa yang diberikan di bawah ini.
2. Gunakan bahasa Indonesia yang sopan, ramah, dan mudah dipahami dengan sentuhan logat Kupang halus sesuai panduan bahasa di atas.
3. Jawablah secara akurat sesuai dengan informasi yang ada dalam Konteks Informasi Desa.
4. Jika ada pertanyaan mengenai informasi yang tidak tercantum dalam Konteks Informasi Desa, berikan penolakan sopan sesuai aturan nomor 3 di atas. Jangan mengarang informasi.
5. Berikan jawaban terstruktur dengan list atau poin-poin jika penjelasannya panjang agar mudah dibaca oleh warga.
6. PENTING: Jika pengguna ingin memesan/membeli produk UMKM desa (seperti Kopi Arabika Nekmese, Tenun Ikat, dll.), berikan link pemesanan langsung (orderUrl) produk tersebut secara lengkap seperti yang tertulis pada rincian produk di bawah. Jangan menyuruh mereka pergi ke kantor desa jika link pemesanan produk tersebut sudah tercantum di data produk.

Berikut adalah informasi resmi terbaru dari database website Desa Nekmese untuk menjawab pertanyaan:
---
${contextText}
---`;

    // 4. Format pesan untuk dikirim ke API Groq (Batasi riwayat ke 4 pesan terakhir agar menghemat token)
    const mappedMessages = [
      { role: "system", content: systemPrompt },
      ...(Array.isArray(riwayatPesan)
        ? riwayatPesan.slice(-4).map((m: any) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content || "",
          }))
        : []),
      { role: "user", content: pesanBaru },
    ];

    // 5. Panggil API Groq
    const modelToUse = "llama-3.1-8b-instant";
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelToUse,
        messages: mappedMessages,
        temperature: 0.0, // Set to 0.0 to prevent creative hallucinations and guarantee strict factual outputs based only on database context
        max_tokens: 1500,
      }),
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.json().catch(() => ({}));
      const status = groqResponse.status;
      
      console.error(`Groq API Error (Status ${status}):`, errorData);

      // Jika HTTP 429 (Rate Limit), kembalikan status 429
      if (status === 429) {
        return NextResponse.json(
          { error: "Limit token habis atau terlalu banyak permintaan ke Groq API." },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: errorData.error?.message || "Terjadi kesalahan pada layanan AI Groq." },
        { status: status }
      );
    }

    const data = await groqResponse.json();
    const botReply = data.choices?.[0]?.message?.content || "";

    return NextResponse.json({
      balasan: botReply,
    });
  } catch (error: any) {
    console.error("Terjadi error di Route Handler API Chat:", error);
    return NextResponse.json(
      { error: error?.message || "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}
