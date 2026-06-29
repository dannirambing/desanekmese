import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const getPublishedDestinations = unstable_cache(
  async () =>
    prisma.tourismPlace.findMany({
      where: { status: "PUBLISHED" },
      include: {
        category: true,
        media: { take: 1 },
      },
      orderBy: { createdAt: "desc" },
    }),
  ["published-destinations"],
  { revalidate: 60, tags: ["tourism"] }
);

export const getFeaturedDestinations = unstable_cache(
  async () =>
    prisma.tourismPlace.findMany({
      where: { status: "PUBLISHED" },
      include: {
        category: true,
        media: { take: 1 },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ["featured-destinations-home"],
  { revalidate: 60, tags: ["tourism"] }
);

export function getTourismPlaceBySlug(slug: string) {
  return unstable_cache(
    async () =>
      prisma.tourismPlace.findUnique({
        where: { slug },
        include: { media: true, category: true },
      }),
    ["tourism-place", slug],
    { revalidate: 60, tags: ["tourism", `tourism-${slug}`] }
  )();
}

export const getPublishedUMKMProducts = unstable_cache(
  async () =>
    prisma.productUMKM.findMany({
      where: { status: "PUBLISHED" },
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
  ["published-umkm-home"],
  { revalidate: 60, tags: ["umkm"] }
);

export const getAllPublishedUMKMProducts = unstable_cache(
  async () =>
    prisma.productUMKM.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
    }),
  ["published-umkm-all"],
  { revalidate: 60, tags: ["umkm"] }
);

export function getUMKMProductBySlug(slug: string) {
  return unstable_cache(
    async () =>
      prisma.productUMKM.findUnique({
        where: { slug },
      }),
    ["umkm-product", slug],
    { revalidate: 60, tags: ["umkm", `umkm-${slug}`] }
  )();
}

export const getPublishedCultureItems = unstable_cache(
  async () =>
    prisma.cultureItem.findMany({
      where: { status: "PUBLISHED" },
      include: {
        category: true,
        media: { take: 1 },
      },
      orderBy: { createdAt: "desc" },
    }),
  ["published-culture-items"],
  { revalidate: 60, tags: ["culture"] }
);

export function getCultureItemBySlug(slug: string) {
  return unstable_cache(
    async () =>
      prisma.cultureItem.findUnique({
        where: { slug },
        include: { media: true, category: true },
      }),
    ["culture-item", slug],
    { revalidate: 60, tags: ["culture", `culture-${slug}`] }
  )();
}

export const getPublishedNewsArticles = unstable_cache(
  async () =>
    prisma.newsArticle.findMany({
      where: { status: "PUBLISHED" },
      include: { media: { take: 1 } },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    }),
  ["published-news-articles"],
  { revalidate: 60, tags: ["news"] }
);

export function getNewsArticleBySlug(slug: string) {
  return unstable_cache(
    async () =>
      prisma.newsArticle.findUnique({
        where: { slug },
        include: { media: true },
      }),
    ["news-article", slug],
    { revalidate: 60, tags: ["news", `news-${slug}`] }
  )();
}

export const getHeroSettings = unstable_cache(
  async () => {
    let settings = await prisma.heroSettings.findUnique({
      where: { id: "main" },
    });
    
    if (!settings) {
      settings = await prisma.heroSettings.create({
        data: {
          id: "main",
          imageUrl: "https://azhuh458gn.ufs.sh/f/IDwrE8y2GhNiT3jd6hwEJvA74yPimMfuNFo6zp0Ia1S3eH2D",
          tagline: "Desa Nekmese, Timor · NTT",
          titleLine1: "Nekaf Mese,",
          titleLine2: "Atoni Meto Nao Fatu Nao Oe.",
          subTagline: "Satu Hati · Berjalan di Atas Batu dan Air",
          description: "Dari tanah Timor yang kuat bagai batu, dan jiwa yang mengalir bagai air, Desa Nekmese menyambut Anda dengan ketulusan budaya leluhur.",
        },
      });
    }
    
    return settings;
  },
  ["hero-settings"],
  { revalidate: 60, tags: ["hero"] }
);

export const getPublishedAnnouncements = unstable_cache(
  async () =>
    prisma.announcement.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
    }),
  ["published-announcements"],
  { revalidate: 60, tags: ["announcement"] }
);

export const getRecentAnnouncements = unstable_cache(
  async () =>
    prisma.announcement.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ["recent-announcements-footer"],
  { revalidate: 60, tags: ["announcement"] }
);

export function getAnnouncementBySlug(slug: string) {
  return unstable_cache(
    async () =>
      prisma.announcement.findUnique({
        where: { slug },
      }),
    ["announcement", slug],
    { revalidate: 60, tags: ["announcement", `announcement-${slug}`] }
  )();
}

export const getVillageProfile = unstable_cache(
  async () => {
    let profile = await prisma.villageProfile.findUnique({
      where: { id: "main" },
    });
    
    if (!profile) {
      profile = await prisma.villageProfile.create({
        data: {
          id: "main",
          welcomeName: "Bapak Kepala Desa",
          welcomeRole: "Kepala Desa Nekmese",
          welcomeText: "Selamat datang di portal resmi Desa Nekmese. Kami berkomitmen untuk memberikan transparansi dan kemudahan akses informasi bagi seluruh warga dan pengunjung.",
          welcomeImageUrl: "https://azhuh458gn.ufs.sh/f/IDwrE8y2GhNiT3jd6hwEJvA74yPimMfuNFo6zp0Ia1S3eH2D",
          history: "Desa Nekmese memiliki sejarah panjang yang berakar pada kearifan lokal suku Atoni Meto. Berdiri sejak tahun...",
          vision: "Mewujudkan Desa Nekmese yang mandiri, sejahtera, dan berbudaya berlandaskan gotong royong.",
          mission: "1. Meningkatkan kualitas pelayanan publik berbasis teknologi.\n2. Mengembangkan sektor wisata budaya dan ekonomi kreatif.\n3. Melestarikan warisan budaya Atoni Meto.",
          villageCode: "53.01.05.2001",
          district: "Amarasi Selatan",
          regency: "Kupang",
          province: "Nusa Tenggara Timur",
          establishedYear: "1968",
          boundariesNorth: "Desa Sahraen",
          boundariesEast: "Desa Apren",
          boundariesSouth: "Laut Timor",
          boundariesWest: "Desa Retraen",
          mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15764.088320448107!2d123.77494555!3d-10.29828345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2c569b9f9393e11f%3A0xe5c35e381014a52d!2sNekmese%2C%20Amarasi%20Sel.%2C%20Kabupaten%20Kupang%2C%20Nusa%20Tenggara%20Tim.!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid",
          geography: "Desa Nekmese terletak di wilayah perbukitan berkapur dengan ketinggian rata-rata 300 meter di atas permukaan laut. Suhu rata-rata harian berkisar antara 24-32°C. Bentang alam didominasi oleh perbukitan batu karang khas Timor dan lahan pertanian kering.",
          populationTotal: 1250,
          populationMale: 610,
          populationFemale: 640,
          populationFamilies: 350,
          structureImageUrl: "https://azhuh458gn.ufs.sh/f/IDwrE8y2GhNiT3jd6hwEJvA74yPimMfuNFo6zp0Ia1S3eH2D",
          potential: "Potensi utama Desa Nekmese meliputi tenun ikat motif Buna bernilai seni tinggi, pertanian hortikultura (jagung, ubi-ubian), peternakan sapi timor, dan objek wisata alam air terjun dan perbukitan indah.",
          organizations: "Lembaga kemasyarakatan yang aktif di desa ini antara lain Pemberdayaan Kesejahteraan Keluarga (PKK), Karang Taruna 'Tunas Mekar', Lembaga Pemberdayaan Masyarakat Desa (LPMD), dan kelompok tani lokal.",
          facilities: "Sarana publik pendukung di Desa Nekmese meliputi 1 unit Kantor Desa, 1 unit Puskesmas Pembantu (Pustu), 1 buah sekolah PAUD/TK, 1 buah SD Negeri, dan beberapa tempat ibadah.",
          achievements: "1. Meraih penghargaan Desa Wisata Berkembang tingkat Provinsi NTT.\n2. Pelopor pelestarian pewarnaan tenun alami secara tradisional.",
        },
      });
    }
    
    return profile;
  },
  ["village-profile"],
  { revalidate: 60, tags: ["profile"] }
);

export const getVillageBudgets = unstable_cache(
  async () =>
    prisma.villageBudget.findMany({
      orderBy: { year: "desc" },
    }),
  ["village-budgets-all"],
  { revalidate: 60, tags: ["budgets"] }
);

export function getVillageBudgetByYear(year: number) {
  return unstable_cache(
    async () =>
      prisma.villageBudget.findUnique({
        where: { year },
        include: {
          items: {
            orderBy: { createdAt: "asc" },
          },
        },
      }),
    ["village-budget", String(year)],
    { revalidate: 60, tags: ["budgets", `budget-${year}`] }
  )();
}


