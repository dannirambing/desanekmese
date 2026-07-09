import { PrismaClient, PublishStatus, OrderChannel } from '@prisma/client';
import { hashPassword } from '../src/lib/password';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Memulai proses seeding data Desa Nekmese secara aman (upsert)...');

  // 1. Akun admin default
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@nekmese.desa.id";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";
  const passwordHash = await hashPassword(adminPassword);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      name: "Administrator Desa",
    },
  });

  console.log(`👤 Admin seed terverifikasi: ${adminEmail}`);

  // 2. Buat Kategori Wisata
  let katAlam = await prisma.category.findFirst({ where: { name: 'Wisata Alam' } });
  if (!katAlam) katAlam = await prisma.category.create({ data: { name: 'Wisata Alam' } });

  let katBudaya = await prisma.category.findFirst({ where: { name: 'Wisata Budaya' } });
  if (!katBudaya) katBudaya = await prisma.category.create({ data: { name: 'Wisata Budaya' } });

  // 3. Masukkan Data Wisata Unggulan
  const wisata1 = await prisma.tourismPlace.upsert({
    where: { slug: 'air-terjun-oenesu' },
    update: {},
    create: {
      name: 'Air Terjun Oenesu',
      slug: 'air-terjun-oenesu',
      description: 'Dikelilingi oleh rindangnya pepohonan nira, Air Terjun Oenesu menawarkan panorama alam yang sejuk dan asri di tengah pulau Timor. Keunikan air terjun bertingkat empat ini adalah debit airnya yang tetap stabil sepanjang tahun, mengalir lembut di atas bebatuan masif yang mempesona.',
      location: 'Dusun 1, Desa Nekmese',
      mapUrl: 'https://maps.google.com/?q=-10.2345,123.6543',
      openHours: '08:00 - 17:00 WITA',
      facilities: ['Area Parkir Luas', 'Gazebo Istirahat', 'Toilet Umum', 'Akses Jalan Setapak'],
      status: PublishStatus.PUBLISHED,
      categoryId: katAlam.id,
      createdById: admin.id,
    },
  });

  const wisata2 = await prisma.tourismPlace.upsert({
    where: { slug: 'bukit-fatu-braun' },
    update: {},
    create: {
      name: 'Bukit Fatu Braun',
      slug: 'bukit-fatu-braun',
      description: 'Berdiri kokoh bagai benteng alam, Bukit Fatu Braun menyajikan lanskap dramatis 360 derajat. Dari puncaknya yang berbatu, Anda dapat menyaksikan hamparan perbukitan hijau Amarasi yang bersanding dengan birunya Samudra Hindia di cakrawala jauh.',
      location: 'Dusun 2, Desa Nekmese',
      mapUrl: 'https://maps.google.com/?q=-10.2456,123.6654',
      openHours: '24 Jam',
      facilities: ['Spot Foto', 'Area Camping', 'Pemandu Lokal'],
      status: PublishStatus.PUBLISHED,
      categoryId: katAlam.id,
      createdById: admin.id,
    },
  });

  // 4. Hubungkan Gambar ke Wisata
  const existingMedia1 = await prisma.mediaFile.findFirst({ where: { publicId: 'oenesu_main_01' } });
  if (!existingMedia1) {
    await prisma.mediaFile.create({
      data: {
        url: 'https://azhuh458gn.ufs.sh/f/IDwrE8y2GhNi7GmE9MZXjhb3xwf1TnqDM5tWQ4P7pyCGgoHr',
        publicId: 'oenesu_main_01',
        type: 'IMAGE',
        tourismPlaceId: wisata1.id,
      },
    });
  }

  const existingMedia2 = await prisma.mediaFile.findFirst({ where: { publicId: 'fatubraun_main_01' } });
  if (!existingMedia2) {
    await prisma.mediaFile.create({
      data: {
        url: 'https://azhuh458gn.ufs.sh/f/IDwrE8y2GhNi7GmE9MZXjhb3xwf1TnqDM5tWQ4P7pyCGgoHr',
        publicId: 'fatubraun_main_01',
        type: 'IMAGE',
        tourismPlaceId: wisata2.id,
      },
    });
  }

  // 5. Masukkan Data Produk UMKM
  const umkmData = [
    {
      name: "Kopi Arabika Nekmese",
      slug: "kopi-arabika-nekmese",
      description: "Biji kopi pilihan yang ditanam secara organik di ketinggian tanah dataran tinggi Nekmese, menghasilkan cita rasa nusantara yang pekat, tegas, dengan sedikit sentuhan aroma buah yang khas.",
      price: 45000,
      ownerName: "Mama Elisabeth",
      imageUrl: "https://azhuh458gn.ufs.sh/f/IDwrE8y2GhNi3ndrMxvSoMcmOPwdnAtusaZWEh3SKL1F4rvg",
      orderUrl: "https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20Kopi%20Arabika%20Nekmese",
      orderType: OrderChannel.WHATSAPP,
      status: PublishStatus.PUBLISHED,
      createdById: admin.id,
    },
    {
      name: "Madu Hutan Liar Kio",
      slug: "madu-hutan-liar-kio",
      description: "Madu murni alami yang dipanen langsung dari sarang lebah liar di kawasan Hutan Adat Konservasi Kio. Diproses secara higienis tradisional tanpa bahan pengawet.",
      price: 85000,
      ownerName: "Bapak Yoel",
      imageUrl: "https://azhuh458gn.ufs.sh/f/IDwrE8y2GhNi3ndrMxvSoMcmOPwdnAtusaZWEh3SKL1F4rvg",
      orderUrl: "https://shopee.co.id/",
      orderType: OrderChannel.SHOPEE,
      status: PublishStatus.PUBLISHED,
      createdById: admin.id,
    },
    {
      name: "Tenun Ikat Tradisional",
      slug: "tenun-ikat-tradisional",
      description: "Kain tenun ikat buatan tangan perajin lokal dengan pewarna alami. Setiap motif menceritakan kisah dan doa masyarakat Atoni Meto.",
      price: 350000,
      ownerName: "Ibu Marta",
      imageUrl: "https://azhuh458gn.ufs.sh/f/IDwrE8y2GhNi3ndrMxvSoMcmOPwdnAtusaZWEh3SKL1F4rvg",
      orderUrl: "https://tokopedia.com/",
      orderType: OrderChannel.TOKOPEDIA,
      status: PublishStatus.PUBLISHED,
      createdById: admin.id,
    },
    {
      name: "Minyak Kelapa Murni",
      slug: "minyak-kelapa-murni",
      description: "Minyak kelapa extra virgin hasil peras dingin tradisional. Cocok untuk memasak sehat dan perawatan tubuh alami.",
      price: 35000,
      ownerName: "Kelompok Wanita Tani",
      imageUrl: "https://azhuh458gn.ufs.sh/f/IDwrE8y2GhNi3ndrMxvSoMcmOPwdnAtusaZWEh3SKL1F4rvg",
      orderUrl: "https://wa.me/6281234567892?text=Halo,%20saya%20ingin%20pesan%20Minyak%20Kelapa%20Murni",
      orderType: OrderChannel.WHATSAPP,
      status: PublishStatus.PUBLISHED,
      createdById: admin.id,
    }
  ];

  for (const item of umkmData) {
    await prisma.productUMKM.upsert({
      where: { slug: item.slug },
      update: {},
      create: item,
    });
  }

  // 6. Kategori & Konten Budaya
  let katTenun = await prisma.cultureCategory.findFirst({ where: { name: "Tenun & Tekstil" } });
  if (!katTenun) katTenun = await prisma.cultureCategory.create({ data: { name: "Tenun & Tekstil" } });

  let katRitual = await prisma.cultureCategory.findFirst({ where: { name: "Ritual Adat" } });
  if (!katRitual) katRitual = await prisma.cultureCategory.create({ data: { name: "Ritual Adat" } });

  let katArsitektur = await prisma.cultureCategory.findFirst({ where: { name: "Arsitektur Tradisional" } });
  if (!katArsitektur) katArsitektur = await prisma.cultureCategory.create({ data: { name: "Arsitektur Tradisional" } });

  const budaya1 = await prisma.cultureItem.upsert({
    where: { slug: "tenun-motif-buna" },
    update: {},
    create: {
      name: "Tenun Motif Buna",
      slug: "tenun-motif-buna",
      summary: "Kain tenun tradisional Atoni Meto dengan motif Buna yang melambangkan persatuan dan kehidupan.",
      description: "Tenun Motif Buna adalah mahakarya tekstil tradisional masyarakat Atoni Meto di Desa Nekmese. Setiap helai benang diikat dan dicelup dengan pewarna alami dari daun indigo, kulit kayu, dan akar tanaman setempat.\n\nMotif Buna yang dominan melambangkan ikatan persaudaraan dan keharmonisan antara manusia dengan alam. Proses menenun dilakukan oleh perempuan desa di bawah naungan Ume Kbubu, dan setiap kain membutuhkan waktu berminggu-minggu hingga bulanan untuk diselesaikan.",
      status: PublishStatus.PUBLISHED,
      categoryId: katTenun.id,
      createdById: admin.id,
    },
  });

  const budaya2 = await prisma.cultureItem.upsert({
    where: { slug: "ritual-uma-lulik" },
    update: {},
    create: {
      name: "Ritual Uma Lulik",
      slug: "ritual-uma-lulik",
      summary: "Upacara adat sakral yang dijaga turun-temurun untuk memelihara keseimbangan antara manusia, alam, dan leluhur.",
      description: "Uma Lulik adalah rumah adat suci masyarakat Atoni Meto tempat diselenggarakannya berbagai ritual penting. Ritual ini diadakan pada momen-momen sakral seperti panen, kelahiran, dan perdamaian antarklan.\n\nMelalui ritual Uma Lulik, masyarakat Nekmese mengekspresikan rasa syukur dan memohon berkah kepada Sang Pencipta. Upacara dipimpin oleh tetua adat dan melibatkan seluruh elemen masyarakat desa.",
      status: PublishStatus.PUBLISHED,
      categoryId: katRitual.id,
      createdById: admin.id,
    },
  });

  const budaya3 = await prisma.cultureItem.upsert({
    where: { slug: "ume-kbubu" },
    update: {},
    create: {
      name: "Ume Kbubu",
      slug: "ume-kbubu",
      summary: "Rumah bulat tradisional Atoni Meto yang menjadi pusat kehidupan sosial dan spiritual masyarakat desa.",
      description: "Ume Kbubu adalah arsitektur tradisional ikonik suku Atoni Meto berbentuk bulat dengan atap jerami atau ilalang. Struktur bangunan ini dirancang untuk menampung kegiatan adat, pertemuan warga, dan proses menenun.\n\nDi Desa Nekmese, Ume Kbubu masih dijaga keberadaannya sebagai simbol identitas budaya. Setiap elemen konstruksinya memiliki makna filosofis — dari tiang penyangga hingga arah pintu masuk.",
      status: PublishStatus.PUBLISHED,
      categoryId: katArsitektur.id,
      createdById: admin.id,
    },
  });

  const cultureMediaData = [
    { url: "https://azhuh458gn.ufs.sh/f/IDwrE8y2GhNiFiq1eWAfVkoyK8aqUEzhAuwH3QBrdvnObJpP", publicId: "tenun_buna_01", cultureItemId: budaya1.id },
    { url: "https://azhuh458gn.ufs.sh/f/IDwrE8y2GhNiFiq1eWAfVkoyK8aqUEzhAuwH3QBrdvnObJpP", publicId: "ritual_uma_01", cultureItemId: budaya2.id },
    { url: "https://azhuh458gn.ufs.sh/f/IDwrE8y2GhNiFiq1eWAfVkoyK8aqUEzhAuwH3QBrdvnObJpP", publicId: "ume_kbubu_01", cultureItemId: budaya3.id },
  ];

  for (const media of cultureMediaData) {
    const existing = await prisma.mediaFile.findFirst({ where: { publicId: media.publicId } });
    if (!existing) {
      await prisma.mediaFile.create({ data: { ...media, type: "IMAGE" } });
    }
  }

  // 7. Berita Desa
  const berita1 = await prisma.newsArticle.upsert({
    where: { slug: "desa-nekmese-raih-penghargaan-desa-wisata-terbaik" },
    update: {},
    create: {
      title: "Desa Nekmese Raih Penghargaan Desa Wisata Terbaik",
      slug: "desa-nekmese-raih-penghargaan-desa-wisata-terbaik",
      summary: "Prestasi membanggakan diraih Desa Nekmese sebagai desa wisata terbaik tingkat kabupaten tahun ini.",
      content: "Desa Nekmese berhasil meraih penghargaan Desa Wisata Terbaik tingkat Kabupaten Kupang pada ajang apresiasi pariwisata daerah.\n\nPenghargaan ini diberikan atas komitmen masyarakat dan pemerintah desa dalam mengembangkan potensi wisata alam dan budaya Atoni Meto secara berkelanjutan.\n\nKepala Desa menyampaikan apresiasinya kepada seluruh warga dan pengelola destinasi wisata yang telah bekerja sama mempromosikan Nekmese ke mata dunia.",
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date("2025-11-15"),
      createdById: admin.id,
    },
  });

  const berita2 = await prisma.newsArticle.upsert({
    where: { slug: "festival-budaya-atonimeto-sukses-digelar" },
    update: {},
    create: {
      title: "Festival Budaya Atoni Meto Sukses Digelar",
      slug: "festival-budaya-atonimeto-sukses-digelar",
      summary: "Ribuan pengunjung hadir meramaikan Festival Budaya Atoni Meto yang menampilkan tenun, tarian, dan kuliner lokal.",
      content: "Festival Budaya Atoni Meto 2025 sukses digelar di halaman Ume Kbubu Desa Nekmese dengan antusiasme tinggi dari warga maupun wisatawan.\n\nAcara menampilkan pameran tenun tradisional, pertunjukan tarian adat, bazar UMKM, serta kuliner khas desa.\n\nFestival ini diharapkan menjadi agenda tahunan untuk melestarikan warisan budaya dan meningkatkan ekonomi masyarakat lokal.",
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date("2025-10-20"),
      createdById: admin.id,
    },
  });

  const newsMediaData = [
    { url: "https://azhuh458gn.ufs.sh/f/IDwrE8y2GhNiT3jd6hwEJvA74yPimMfuNFo6zp0Ia1S3eH2D", publicId: "berita_penghargaan_01", newsArticleId: berita1.id },
    { url: "https://azhuh458gn.ufs.sh/f/IDwrE8y2GhNiT3jd6hwEJvA74yPimMfuNFo6zp0Ia1S3eH2D", publicId: "berita_festival_01", newsArticleId: berita2.id },
  ];

  for (const media of newsMediaData) {
    const existing = await prisma.mediaFile.findFirst({ where: { publicId: media.publicId } });
    if (!existing) {
      await prisma.mediaFile.create({ data: { ...media, type: "IMAGE" } });
    }
  }

  // 8. Seeding Anggaran Desa
  const budget2025 = await prisma.villageBudget.upsert({
    where: { year: 2025 },
    update: {},
    create: {
      year: 2025,
      totalRevenueBudget: 1850000000,
      totalRevenueRealization: 1785000000,
      totalExpenditureBudget: 1920000000,
      totalExpenditureRealization: 1810000000,
      createdById: admin.id,
    }
  });

  const existingDetails2025 = await prisma.budgetDetail.count({ where: { budgetId: budget2025.id } });
  if (existingDetails2025 === 0) {
    await prisma.budgetDetail.createMany({
      data: [
        { budgetId: budget2025.id, type: 'REVENUE', category: 'Dana Desa (DD)', amountBudget: 1200000000, amountRealization: 1200000000 },
        { budgetId: budget2025.id, type: 'REVENUE', category: 'Alokasi Dana Desa (ADD)', amountBudget: 550000000, amountRealization: 520000000 },
        { budgetId: budget2025.id, type: 'REVENUE', category: 'Pendapatan Asli Desa (PADes)', amountBudget: 100000000, amountRealization: 65000000 },
        { budgetId: budget2025.id, type: 'EXPENDITURE', category: 'Bidang Penyelenggaraan Pemerintahan', amountBudget: 620000000, amountRealization: 605000000 },
        { budgetId: budget2025.id, type: 'EXPENDITURE', category: 'Bidang Pelaksanaan Pembangunan', amountBudget: 850000000, amountRealization: 790000000 },
        { budgetId: budget2025.id, type: 'EXPENDITURE', category: 'Bidang Pembinaan Kemasyarakatan', amountBudget: 200000000, amountRealization: 195000000 },
        { budgetId: budget2025.id, type: 'EXPENDITURE', category: 'Bidang Pemberdayaan Masyarakat', amountBudget: 180000000, amountRealization: 170000000 },
        { budgetId: budget2025.id, type: 'EXPENDITURE', category: 'Bidang Penanggulangan Bencana & Darurat', amountBudget: 70000000, amountRealization: 50000000 },
      ]
    });
  }

  const budget2024 = await prisma.villageBudget.upsert({
    where: { year: 2024 },
    update: {},
    create: {
      year: 2024,
      totalRevenueBudget: 1650000000,
      totalRevenueRealization: 1640000000,
      totalExpenditureBudget: 1700000000,
      totalExpenditureRealization: 1680000000,
      createdById: admin.id,
    }
  });

  const existingDetails2024 = await prisma.budgetDetail.count({ where: { budgetId: budget2024.id } });
  if (existingDetails2024 === 0) {
    await prisma.budgetDetail.createMany({
      data: [
        { budgetId: budget2024.id, type: 'REVENUE', category: 'Dana Desa (DD)', amountBudget: 1100000000, amountRealization: 1100000000 },
        { budgetId: budget2024.id, type: 'REVENUE', category: 'Alokasi Dana Desa (ADD)', amountBudget: 480000000, amountRealization: 480000000 },
        { budgetId: budget2024.id, type: 'REVENUE', category: 'Pendapatan Asli Desa (PADes)', amountBudget: 70000000, amountRealization: 60000000 },
        { budgetId: budget2024.id, type: 'EXPENDITURE', category: 'Bidang Penyelenggaraan Pemerintahan', amountBudget: 580000000, amountRealization: 575000000 },
        { budgetId: budget2024.id, type: 'EXPENDITURE', category: 'Bidang Pelaksanaan Pembangunan', amountBudget: 720000000, amountRealization: 715000000 },
        { budgetId: budget2024.id, type: 'EXPENDITURE', category: 'Bidang Pembinaan Kemasyarakatan', amountBudget: 180000000, amountRealization: 180000000 },
        { budgetId: budget2024.id, type: 'EXPENDITURE', category: 'Bidang Pemberdayaan Masyarakat', amountBudget: 150000000, amountRealization: 148000000 },
        { budgetId: budget2024.id, type: 'EXPENDITURE', category: 'Bidang Penanggulangan Bencana & Darurat', amountBudget: 70000000, amountRealization: 62000000 },
      ]
    });
  }

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
