import NewsAndAnnouncementSection from "./NewsAndAnnouncementSection";
import { getPublishedNewsArticles, getPublishedAnnouncements } from "@/lib/queries";

export default async function NewsAndAnnouncementSectionWrapper() {
  const [newsArticles, announcements] = await Promise.all([
    getPublishedNewsArticles(),
    getPublishedAnnouncements(),
  ]);

  return (
    <NewsAndAnnouncementSection
      newsArticles={newsArticles}
      announcements={announcements}
    />
  );
}
