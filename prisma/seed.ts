import { PrismaClient, PublishStatus } from '@prisma/client';
import { hashPassword } from '../src/lib/password';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Memulai proses seeding data Desa Nekmese...');

  // 1. Bersihkan data lama (opsional, untuk memastikan tidak duplikat saat testing)
  await prisma.mediaFile.deleteMany({});
  await prisma.productUMKM.deleteMany({});
  await prisma.tourismPlace.deleteMany({});
  await prisma.cultureItem.deleteMany({});
  await prisma.newsArticle.deleteMany({});
  await prisma.admin.deleteMany({});
  await prisma.cultureCategory.deleteMany({});
  await prisma.category.deleteMany({});

  // 1b. Akun admin default
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@nekmese.desa.id";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";
  const passwordHash = await hashPassword(adminPassword);

  await prisma.admin.create({
    data: {
      email: adminEmail,
      passwordHash,
      name: "Administrator Desa",
    },
  });

  console.log(`👤 Admin seed: ${adminEmail}`);

  // 2. Buat Kategori Wisata
  const katAlam = await prisma.category.create({ data: { name: 'Wisata Alam' } });
  const katBudaya = await prisma.category.create({ data: { name: 'Wisata Budaya' } });

  // 3. Masukkan Data Wisata Unggulan
  const wisata1 = await prisma.tourismPlace.create({
    data: {
      name: 'Air Terjun Oenesu',
      slug: 'air-terjun-oenesu',
      description: 'Dikelilingi oleh rindangnya pepohonan nira, Air Terjun Oenesu menawarkan panorama alam yang sejuk dan asri di tengah pulau Timor. Keunikan air terjun bertingkat empat ini adalah debit airnya yang tetap stabil sepanjang tahun, mengalir lembut di atas bebatuan masif yang mempesona.',
      location: 'Dusun 1, Desa Nekmese',
      mapUrl: 'https://maps.google.com/?q=-10.2345,123.6543',
      openHours: '08:00 - 17:00 WITA',
      facilities: ['Area Parkir Luas', 'Gazebo Istirahat', 'Toilet Umum', 'Akses Jalan Setapak'],
      status: PublishStatus.PUBLISHED,
      categoryId: katAlam.id,
    },
  });

  const wisata2 = await prisma.tourismPlace.create({
    data: {
      name: 'Bukit Fatu Braun',
      slug: 'bukit-fatu-braun',
      description: 'Berdiri kokoh bagai benteng alam, Bukit Fatu Braun menyajikan lanskap dramatis 360 derajat. Dari puncaknya yang berbatu, Anda dapat menyaksikan hamparan perbukitan hijau Amarasi yang bersanding dengan birunya Samudra Hindia di cakrawala jauh.',
      location: 'Dusun 2, Desa Nekmese',
      mapUrl: 'https://maps.google.com/?q=-10.2456,123.6654',
      openHours: '24 Jam',
      facilities: ['Spot Foto', 'Area Camping', 'Pemandu Lokal'],
      status: PublishStatus.PUBLISHED,
      categoryId: katAlam.id,
    },
  });

  // 4. Hubungkan Gambar ke Wisata (MediaFile)
  await prisma.mediaFile.createMany({
    data: [
      {
        url: 'https://images.unsplash.com/photo-1518182170546-076616fdcbfa?q=80&w=2000', // Foto Air Terjun Pilihan Anda
        publicId: 'oenesu_main_01',
        type: 'IMAGE',
        tourismPlaceId: wisata1.id,
      },
      {
        url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2000',
        publicId: 'fatubraun_main_01',
        type: 'IMAGE',
        tourismPlaceId: wisata2.id,
      },
    ],
  });

  // 5. Masukkan Data Produk UMKM
  await prisma.productUMKM.createMany({
    data: [
      {
        name: "Kopi Arabika Nekmese",
        slug: "kopi-arabika-nekmese",
        description:
          "Biji kopi pilihan yang ditanam secara organik di ketinggian tanah dataran tinggi Nekmese, menghasilkan cita rasa nusantara yang pekat, tegas, dengan sedikit sentuhan aroma buah yang khas.",
        price: 45000,
        ownerName: "Mama Elisabeth",
        imageUrl:
          "https://images.unsplash.com/photo-1447933603533-566661898888?q=80&w=2071",
        orderUrl: "https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20Kopi%20Arabika%20Nekmese",
        orderType: "WHATSAPP",
        status: PublishStatus.PUBLISHED,
      },
      {
        name: "Madu Hutan Liar Kio",
        slug: "madu-hutan-liar-kio",
        description:
          "Madu murni alami yang dipanen langsung dari sarang lebah liar di kawasan Hutan Adat Konservasi Kio. Diproses secara higienis tradisional tanpa bahan pengawet.",
        price: 85000,
        ownerName: "Bapak Yoel",
        imageUrl:
          "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=2070",
        orderUrl: "https://shopee.co.id/",
        orderType: "SHOPEE",
        status: PublishStatus.PUBLISHED,
      },
      {
        name: "Tenun Ikat Tradisional",
        slug: "tenun-ikat-tradisional",
        description:
          "Kain tenun ikat buatan tangan perajin lokal dengan pewarna alami. Setiap motif menceritakan kisah dan doa masyarakat Atoni Meto.",
        price: 350000,
        ownerName: "Ibu Marta",
        imageUrl:
          "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=2071",
        orderUrl: "https://tokopedia.com/",
        orderType: "TOKOPEDIA",
        status: PublishStatus.PUBLISHED,
      },
      {
        name: "Minyak Kelapa Murni",
        slug: "minyak-kelapa-murni",
        description:
          "Minyak kelapa extra virgin hasil peras dingin tradisional. Cocok untuk memasak sehat dan perawatan tubuh alami.",
        price: 35000,
        ownerName: "Kelompok Wanita Tani",
        imageUrl:
          "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=2069",
        orderUrl: "https://wa.me/6281234567892?text=Halo,%20saya%20ingin%20pesan%20Minyak%20Kelapa%20Murni",
        orderType: "WHATSAPP",
        status: PublishStatus.PUBLISHED,
      },
    ],
  });

  // 6. Kategori & Konten Budaya
  const katTenun = await prisma.cultureCategory.create({
    data: { name: "Tenun & Tekstil" },
  });
  const katRitual = await prisma.cultureCategory.create({
    data: { name: "Ritual Adat" },
  });
  const katArsitektur = await prisma.cultureCategory.create({
    data: { name: "Arsitektur Tradisional" },
  });

  const budaya1 = await prisma.cultureItem.create({
    data: {
      name: "Tenun Motif Buna",
      slug: "tenun-motif-buna",
      summary:
        "Kain tenun tradisional Atoni Meto dengan motif Buna yang melambangkan persatuan dan kehidupan.",
      description:
        "Tenun Motif Buna adalah mahakarya tekstil tradisional masyarakat Atoni Meto di Desa Nekmese. Setiap helai benang diikat dan dicelup dengan pewarna alami dari daun indigo, kulit kayu, dan akar tanaman setempat.\n\nMotif Buna yang dominan melambangkan ikatan persaudaraan dan keharmonisan antara manusia dengan alam. Proses menenun dilakukan oleh perempuan desa di bawah naungan Ume Kbubu, dan setiap kain membutuhkan waktu berminggu-minggu hingga bulanan untuk diselesaikan.",
      status: PublishStatus.PUBLISHED,
      categoryId: katTenun.id,
    },
  });

  const budaya2 = await prisma.cultureItem.create({
    data: {
      name: "Ritual Uma Lulik",
      slug: "ritual-uma-lulik",
      summary:
        "Upacara adat sakral yang dijaga turun-temurun untuk memelihara keseimbangan antara manusia, alam, dan leluhur.",
      description:
        "Uma Lulik adalah rumah adat suci masyarakat Atoni Meto tempat diselenggarakannya berbagai ritual penting. Ritual ini diadakan pada momen-momen sakral seperti panen, kelahiran, dan perdamaian antarklan.\n\nMelalui ritual Uma Lulik, masyarakat Nekmese mengekspresikan rasa syukur dan memohon berkah kepada Sang Pencipta. Upacara dipimpin oleh tetua adat dan melibatkan seluruh elemen masyarakat desa.",
      status: PublishStatus.PUBLISHED,
      categoryId: katRitual.id,
    },
  });

  const budaya3 = await prisma.cultureItem.create({
    data: {
      name: "Ume Kbubu",
      slug: "ume-kbubu",
      summary:
        "Rumah bulat tradisional Atoni Meto yang menjadi pusat kehidupan sosial dan spiritual masyarakat desa.",
      description:
        "Ume Kbubu adalah arsitektur tradisional ikonik suku Atoni Meto berbentuk bulat dengan atap jerami atau ilalang. Struktur bangunan ini dirancang untuk menampung kegiatan adat, pertemuan warga, dan proses menenun.\n\nDi Desa Nekmese, Ume Kbubu masih dijaga keberadaannya sebagai simbol identitas budaya. Setiap elemen konstruksinya memiliki makna filosofis — dari tiang penyangga hingga arah pintu masuk.",
      status: PublishStatus.PUBLISHED,
      categoryId: katArsitektur.id,
    },
  });

  await prisma.mediaFile.createMany({
    data: [
      {
        url: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=2071",
        publicId: "tenun_buna_01",
        type: "IMAGE",
        cultureItemId: budaya1.id,
      },
      {
        url: "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?q=80&w=1974",
        publicId: "ritual_uma_01",
        type: "IMAGE",
        cultureItemId: budaya2.id,
      },
      {
        url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070",
        publicId: "ume_kbubu_01",
        type: "IMAGE",
        cultureItemId: budaya3.id,
      },
    ],
  });

  // 7. Berita Desa
  const berita1 = await prisma.newsArticle.create({
    data: {
      title: "Desa Nekmese Raih Penghargaan Desa Wisata Terbaik",
      slug: "desa-nekmese-raih-penghargaan-desa-wisata-terbaik",
      summary:
        "Prestasi membanggakan diraih Desa Nekmese sebagai desa wisata terbaik tingkat kabupaten tahun ini.",
      content:
        "Desa Nekmese berhasil meraih penghargaan Desa Wisata Terbaik tingkat Kabupaten Kupang pada ajang apresiasi pariwisata daerah.\n\nPenghargaan ini diberikan atas komitmen masyarakat dan pemerintah desa dalam mengembangkan potensi wisata alam dan budaya Atoni Meto secara berkelanjutan.\n\nKepala Desa menyampaikan apresiasinya kepada seluruh warga dan pengelola destinasi wisata yang telah bekerja sama mempromosikan Nekmese ke mata dunia.",
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date("2025-11-15"),
    },
  });

  const berita2 = await prisma.newsArticle.create({
    data: {
      title: "Festival Budaya Atoni Meto Sukses Digelar",
      slug: "festival-budaya-atonimeto-sukses-digelar",
      summary:
        "Ribuan pengunjung hadir meramaikan Festival Budaya Atoni Meto yang menampilkan tenun, tarian, dan kuliner lokal.",
      content:
        "Festival Budaya Atoni Meto 2025 sukses digelar di halaman Ume Kbubu Desa Nekmese dengan antusiasme tinggi dari warga maupun wisatawan.\n\nAcara menampilkan pameran tenun tradisional, pertunjukan tarian adat, bazar UMKM, serta kuliner khas desa.\n\nFestival ini diharapkan menjadi agenda tahunan untuk melestarikan warisan budaya dan meningkatkan ekonomi masyarakat lokal.",
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date("2025-10-20"),
    },
  });

  await prisma.mediaFile.createMany({
    data: [
      {
        url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070",
        publicId: "berita_penghargaan_01",
        type: "IMAGE",
        newsArticleId: berita1.id,
      },
      {
        url: "https://images.unsplash.com/photo-1533174072545-7a4b6ecd1928?q=80&w=2070",
        publicId: "berita_festival_01",
        type: "IMAGE",
        newsArticleId: berita2.id,
      },
    ],
  });

  console.log("✅ Seeding data selesai dengan sukses!");
}

main()
  .catch((e) => {
    console.error('❌ Terjadi kesalahan saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });