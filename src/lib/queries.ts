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
          imageUrl: "https://images.unsplash.com/photo-1698737474049-2858da07eaff?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHRpbW9yfGVufDB8fDB8fHww",
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
