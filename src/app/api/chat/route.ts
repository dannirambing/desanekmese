import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type {
  VillageProfile,
  TourismPlace,
  CultureItem,
  ProductUMKM,
  Announcement,
  NewsArticle,
  VillageBudget,
} from "@prisma/client";
import { getTrigramCosineSimilarity, normalizeText } from "@/lib/similarity";

// Simple in-memory rate limiter to prevent abuse and protect free tier limits
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15; // Max 10 messages per minute per IP

function detectCategory(
  question: string,
  answer: string
): "WISATA" | "UMKM" | "ANGGARAN" | "PENGUMUMAN" | "BERITA" | "BUDAYA" | "PROFIL" {
  const q = question.toLowerCase();
  const a = answer.toLowerCase();

  if (
    q.includes("wisata") ||
    a.includes("wisata") ||
    q.includes("pantai") ||
    a.includes("pantai") ||
    (q.includes("fasilitas") && a.includes("wisata"))
  ) {
    return "WISATA";
  }
  if (
    q.includes("produk") ||
    q.includes("umkm") ||
    q.includes("beli") ||
    q.includes("pesan") ||
    q.includes("kopi") ||
    q.includes("tenun") ||
    q.includes("harga") ||
    a.includes("umkm") ||
    a.includes("produk")
  ) {
    return "UMKM";
  }
  if (
    q.includes("anggaran") ||
    q.includes("apbdes") ||
    q.includes("dana") ||
    q.includes("belanja") ||
    q.includes("pendapatan") ||
    a.includes("anggaran") ||
    a.includes("apbdes")
  ) {
    return "ANGGARAN";
  }
  if (q.includes("pengumuman") || a.includes("pengumuman")) {
    return "PENGUMUMAN";
  }
  if (
    q.includes("berita") ||
    a.includes("berita") ||
    q.includes("artikel") ||
    a.includes("artikel")
  ) {
    return "BERITA";
  }
  if (
    q.includes("budaya") ||
    q.includes("adat") ||
    q.includes("tari") ||
    a.includes("budaya") ||
    a.includes("adat")
  ) {
    return "BUDAYA";
  }
  return "PROFIL";
}

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

    // Get dynamic origin to provide absolute URLs for the AI
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
    const origin = req.headers.get("origin") || `${protocol}://${host}`;

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

    // --- LOGIKA SEMANTIC CACHE (START) ---
    const normalizedQuestion = normalizeText(pesanBaru);

    try {
      // Cari cache aktif di database
      const caches = await prisma.chatCache.findMany();
      const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 hari
      let bestMatch: { id: string; answer: string; similarity: number } | null = null;

      for (const cache of caches) {
        const isExpired = now - new Date(cache.updatedAt).getTime() > CACHE_TTL_MS;
        if (isExpired) continue;

        const sim = getTrigramCosineSimilarity(normalizedQuestion, cache.question);
        if (sim > (bestMatch?.similarity || 0)) {
          bestMatch = { id: cache.id, answer: cache.answer, similarity: sim };
        }
      }

      // Gunakan threshold 0.65 untuk semantic cache hit (cukup aman untuk menghindari false positive tetapi fleksibel terhadap susunan kata/typo/sinonim)
      if (bestMatch && bestMatch.similarity >= 0.65) {
        console.log(`[Cache Hit] Similarity: ${bestMatch.similarity.toFixed(4)}, Q: "${pesanBaru}" (Matched with "${caches.find(c => c.id === bestMatch!.id)?.question}")`);

        // Update hit count secara asinkron (tidak memblokir response)
        prisma.chatCache
          .update({
            where: { id: bestMatch.id },
            data: { useCount: { increment: 1 } },
          })
          .catch((err) => console.error("Gagal mengupdate useCount:", err));

        return new Response(bestMatch.answer, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
          },
        });
      }
    } catch (cacheErr) {
      // Jika terjadi error pada cache, log dan biarkan proses berlanjut ke Groq API secara langsung (fail-safe)
      console.error("Error pada proses semantic cache:", cacheErr);
    }
    // --- LOGIKA SEMANTIC CACHE (END) ---

    // 1. Ambil data dari database untuk membangun konteks secara paralel/aman
    let profileData: VillageProfile | null = null;
    let wisataData: Partial<TourismPlace>[] = [];
    let budayaData: Partial<CultureItem>[] = [];
    let produkData: Partial<ProductUMKM>[] = [];
    let pengumumanData: Partial<Announcement>[] = [];
    let beritaData: Partial<NewsArticle>[] = [];
    let anggaranData: Partial<VillageBudget>[] = [];

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
        select: { name: true, slug: true, description: true, location: true, openHours: true, facilities: true, createdAt: true },
      });
    } catch (e) {
      console.error("Gagal mengambil data wisata:", e);
    }

    try {
      budayaData = await prisma.cultureItem.findMany({
        where: { status: "PUBLISHED" },
        select: { name: true, slug: true, summary: true, description: true, createdAt: true },
      });
    } catch (e) {
      console.error("Gagal mengambil data budaya:", e);
    }

    try {
      produkData = await prisma.productUMKM.findMany({
        where: { status: "PUBLISHED" },
        select: { name: true, slug: true, description: true, price: true, ownerName: true, orderUrl: true, orderType: true, createdAt: true },
      });
    } catch (e) {
      console.error("Gagal mengambil data produk UMKM:", e);
    }

    try {
      pengumumanData = await prisma.announcement.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        take: 3, // Batasi ke 3 pengumuman terbaru untuk menghemat kuota token
        select: { title: true, slug: true, content: true, category: true, createdAt: true },
      });
    } catch (e) {
      console.error("Gagal mengambil data pengumuman:", e);
    }

    try {
      beritaData = await prisma.newsArticle.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 2,
        select: { title: true, slug: true, summary: true, content: true, publishedAt: true },
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
    const limitLength = (text: string | null | undefined, max: number) => {
      if (!text) return "N/A";
      return text.length > max ? text.substring(0, max) + "..." : text;
    };

    // Dapatkan tanggal hari ini dalam format bahasa Indonesia
    const todayStr = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    // 2. Format konteks ke bentuk teks Markdown yang sangat padat (sangat hemat token)
    let contextText = `Hari Ini: ${todayStr}\n\nKonteks Informasi Desa Nekmese:\n\n`;

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
- Lokasi: Kec. Amarasi Selatan, Kab. Kupang, Nusa Tenggara Timur (NTT).
- Kades saat ini: Krisna Jems Baok (Kepala Desa Nekmese).\n\n`;
    }

    if (wisataData.length > 0) {
      contextText += `### 2. Destinasi Wisata
${wisataData.map((w, idx) => {
        const tgl = w.createdAt ? new Date(w.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "N/A";
        return `${idx + 1}. **${w.name}** (Lokasi: ${w.location || "N/A"}, Jam buka: ${w.openHours || "N/A"}, Fasilitas: ${Array.isArray(w.facilities) ? w.facilities.slice(0, 3).join(", ") : "N/A"}, Ditambahkan: ${tgl}, URL: ${origin}/wisata/${w.slug}). Deskripsi: ${limitLength(w.description, 80)}`;
      }).join("\n")}\n\n`;
    }

    if (budayaData.length > 0) {
      contextText += `### 3. Kebudayaan
${budayaData.map((b, idx) => {
        const tgl = b.createdAt ? new Date(b.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "N/A";
        return `${idx + 1}. **${b.name}** (Ringkasan: ${limitLength(b.summary || "", 60)}, Ditambahkan: ${tgl}, URL: ${origin}/budaya/${b.slug}). Deskripsi: ${limitLength(b.description, 65)}`;
      }).join("\n")}\n\n`;
    }

    if (produkData.length > 0) {
      contextText += `### 4. UMKM & Produk Desa
${produkData.map((p, idx) => {
        const tgl = p.createdAt ? new Date(p.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "N/A";
        return `${idx + 1}. **${p.name}** (Harga: Rp ${p.price ? p.price.toLocaleString("id-ID") : "N/A"}, Pemilik: ${p.ownerName || "N/A"}, Ditambahkan: ${tgl}, URL: ${origin}/umkm/${p.slug}). Cara pesan (${p.orderType || "N/A"}): Beli di link: ${p.orderUrl || "N/A"}. Deskripsi: ${limitLength(p.description, 60)}`;
      }).join("\n")}\n\n`;
    }

    if (pengumumanData.length > 0) {
      contextText += `### 5. Pengumuman Terbaru
${pengumumanData.map((p, idx) => {
        const tgl = p.createdAt ? new Date(p.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "N/A";
        return `${idx + 1}. **[${p.category || "Umum"}] ${p.title}** (Dipublikasikan: ${tgl}, URL: ${origin}/pengumuman/${p.slug}):\n${limitLength(p.content || "", 400)}`;
      }).join("\n\n")}\n\n`;
    }

    if (beritaData.length > 0) {
      contextText += `### 6. Berita Terbaru
${beritaData.map((b, idx) => {
        const tgl = b.publishedAt ? new Date(b.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "N/A";
        return `${idx + 1}. **${b.title}** (Dipublikasikan: ${tgl}, URL: ${origin}/berita/${b.slug}) - Ringkasan: ${limitLength(b.summary || "", 100)}:\n${limitLength(b.content || "", 300)}`;
      }).join("\n\n")}\n\n`;
    }

    if (anggaranData.length > 0) {
      contextText += `### 7. Transparansi Anggaran (APBDes)
${anggaranData.map((a) => {
        const totalAnggaran = (a.totalRevenueBudget || 0) + (a.totalExpenditureBudget || 0);
        return `- **Tahun ${a.year}**: 
  - Total Keseluruhan Anggaran APBDes (Pendapatan + Belanja): Rp ${totalAnggaran.toLocaleString("id-ID")}
  - Rincian Pendapatan: Rp ${a.totalRevenueBudget ? a.totalRevenueBudget.toLocaleString("id-ID") : "0"} (Realisasi: Rp ${a.totalRevenueRealization ? a.totalRevenueRealization.toLocaleString("id-ID") : "0"})
  - Rincian Belanja: Rp ${a.totalExpenditureBudget ? a.totalExpenditureBudget.toLocaleString("id-ID") : "0"} (Realisasi: Rp ${a.totalExpenditureRealization ? a.totalExpenditureRealization.toLocaleString("id-ID") : "0"})`;
      }).join("\n")}\n\n`;
    }

    // 3. Bangun Sistem Prompt
    const systemPrompt = `Anda adalah "Nina", Asisten AI Desa Nekmese (Nekmese AI Assistant), asisten virtual cerdas, ramah, dan solutif yang berdedikasi untuk membantu warga maupun pengunjung website Desa Nekmese.

ATURAN BAHASA & LOGAT KUPANG SOPAN (CRITICAL STYLE RULES):
1. Anda WAJIB menjawab menggunakan Bahasa Indonesia yang santun, resmi, dan hangat, dengan sentuhan logat Kupang yang halus dan sopan.
2. Gunakan kata ganti "Beta" untuk menyebut diri Anda (sebagai Nina, asisten virtual resmi desa), dan sapa pengguna dengan sebutan lokal yang sangat dihormati seperti "Kaka", "Bapa", atau "Mama".
3. DILARANG KERAS menggunakan kata-kata percakapan jalanan/informal/kasar seperti "sonde", "son", "ko", "pi", "sa", "lu", atau "pung". Gunakan kata baku Bahasa Indonesia yang sopan untuk tata bahasa (seperti "tidak", "apakah", "pergi", "saja", "punya").
4. Contoh cara menjawab yang sopan dan halus:
   - "Halo Kaka! Beta Nina. Ada yang bisa beta bantu hari ini?"
   - "Kaka jika ingin memesan Kopi Arabika Nekmese, silakan klik tautan WhatsApp berikut..."
   - "Mohon maaf Kaka, saat ini beta tidak memiliki data resmi mengenai hal tersebut di database kami..."

PANDUAN AKURASI DATA & ANTI-HALUSINASI:
1. Jawablah pertanyaan hanya berdasarkan fakta yang tertulis secara literal dalam "Konteks Informasi Desa" di bawah.
2. Dilarang keras mengarang (berhalusinasi) informasi, data, angka, nama orang, nomor telepon, atau prosedur layanan jika tidak ada di dalam teks konteks di bawah.
3. Jika informasi yang ditanyakan SAMA SEKALI TIDAK ADA di teks konteks, sampaikan dengan jujur dan sopan bahwa Anda tidak memiliki datanya, lalu arahkan untuk ke kantor desa.
   PENTING: Jika pengguna menanyakan data "terbaru" (misal: anggaran terbaru/2026) namun Anda hanya memiliki data tahun sebelumnya (misal: 2025), JANGAN gunakan kalimat penolakan atau minta maaf. Langsung saja berikan data tahun terbaru yang Anda miliki dengan percaya diri (contoh: "Total anggaran APBDes terbaru yang kami catat untuk tahun 2025 adalah...").

Tugas utama Anda:
1. Jawab pertanyaan pengguna mengenai profil desa, sejarah, visi misi, potensi, wisata, kebudayaan, produk UMKM lokal, berita, pengumuman (termasuk prosedur administrasi seperti KTP-el dan KK jika tercantum), dan transparansi anggaran (APBDes) berdasarkan data resmi desa yang diberikan di bawah ini.
2. Gunakan bahasa Indonesia yang sopan, ramah, dan mudah dipahami dengan sentuhan logat Kupang halus sesuai panduan bahasa di atas.
3. Jawablah secara akurat sesuai dengan informasi yang ada dalam Konteks Informasi Desa. Khusus untuk pertanyaan "Total Anggaran" atau "APBDes", sebutkan kedua metrik secara rinci (Total Anggaran Pendapatan dan Total Anggaran Belanja).
4. Jika ada pertanyaan mengenai informasi yang tidak tercantum dalam Konteks Informasi Desa, berikan penolakan sopan sesuai aturan nomor 3 di atas. Jangan mengarang informasi.
5. PENTING (KONSISTENSI RIWAYAT): Jika di riwayat percakapan sebelumnya Anda pernah menjawab "tidak memiliki data", namun pada Konteks di bawah ternyata datanya ADA (misal data anggaran tahun lalu), Anda WAJIB mengabaikan jawaban lama Anda dan langsung berikan data yang ada di Konteks tanpa beralasan.
6. Berikan jawaban terstruktur dengan list atau poin-poin jika penjelasannya panjang agar mudah dibaca oleh warga.
7. SELALU sertakan tautan/URL menggunakan format Markdown standard \`[Judul Teks](URL-nya)\` di dalam kalimat Anda jika konteks memberikan informasi URL untuk item tersebut (seperti wisata, budaya, produk, berita, atau pengumuman).
   - PENTING: Gunakan EXACT URL (tautan lengkap) yang tertulis di keterangan "URL:" pada teks konteks.
   - Jangan memotong atau menyingkat URL tersebut.
   - Contoh format yang benar: \`Kaka bisa melihat [Tenun Motif Burung](${origin}/umkm/tenun-motif-burung)\`.

Berikut adalah informasi resmi terbaru dari database website Desa Nekmese untuk menjawab pertanyaan:
---
${contextText}
---`;

    // 4. Format pesan untuk dikirim ke API Groq (Batasi riwayat ke 4 pesan terakhir agar menghemat token)
    const mappedMessages = [
      { role: "system", content: systemPrompt },
      ...(Array.isArray(riwayatPesan)
        ? riwayatPesan.slice(-4).map((m: { role: string; content: string }) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content || "",
        }))
        : []),
      { role: "user", content: pesanBaru },
    ];

    // 5. Panggil API Groq dengan mode streaming
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
        stream: true, // Aktifkan streaming dari Groq
      }),
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.json().catch(() => ({}));
      const status = groqResponse.status;

      // Log detail kesalahan teknis hanya di server untuk keamanan informasi
      console.error(`Groq API Error (Status ${status}):`, errorData);

      // Selalu kembalikan pesan ramah pengguna yang bersih tanpa mengekspos detail teknis / kredensial API
      return NextResponse.json(
        { error: "Mohon maaf Kaka, layanan asisten AI sedang sibuk atau batas kuota terlampaui saat ini. Silakan coba beberapa saat lagi." },
        { status: status === 429 ? 429 : 500 }
      );
    }

    // 6. Buat readable stream untuk meneruskan potongan jawaban ke klien secara real-time
    const responseStream = new ReadableStream({
      async start(controller) {
        const reader = groqResponse.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";
        let fullAnswer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || ""; // Simpan potongan baris terakhir yang tidak lengkap di buffer

            for (const line of lines) {
              const cleaned = line.trim();
              if (!cleaned) continue;

              if (cleaned.startsWith("data: ")) {
                const dataStr = cleaned.slice(6);
                if (dataStr === "[DONE]") {
                  break;
                }

                try {
                  const parsed = JSON.parse(dataStr);
                  const content = parsed.choices?.[0]?.delta?.content || "";
                  if (content) {
                    fullAnswer += content;
                    controller.enqueue(new TextEncoder().encode(content));
                  }
                } catch (jsonErr) {
                  // Abaikan kesalahan parse JSON pada potongan data yang belum lengkap
                }
              }
            }
          }

          // Simpan ke cache secara asinkron jika fullAnswer berhasil didapatkan dan bukan merupakan penolakan (refusal)
          if (fullAnswer) {
            const isRefusal =
              fullAnswer.toLowerCase().includes("tidak memiliki data resmi") ||
              fullAnswer.toLowerCase().includes("silakan kunjungi kantor desa");

            if (!isRefusal) {
              const detectedCat = detectCategory(normalizedQuestion, fullAnswer);
              prisma.chatCache
                .upsert({
                  where: { question: normalizedQuestion },
                  create: {
                    question: normalizedQuestion,
                    answer: fullAnswer,
                    category: detectedCat,
                  },
                  update: {
                    answer: fullAnswer,
                    category: detectedCat,
                    useCount: { increment: 1 },
                  },
                })
                .catch((err) => console.error("Gagal menyimpan ke cache:", err));
            }
          }
        } catch (streamErr) {
          console.error("Error saat streaming data dari Groq:", streamErr);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Terjadi error di Route Handler API Chat:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server. Silakan coba lagi nanti." },
      { status: 500 }
    );
  }
}
