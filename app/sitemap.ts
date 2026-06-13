import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hmwebsites.de';
const LOCALES = ['de', 'en'] as const;

const PAGES = ['', '/services', '/process', '/faq', '/contact'];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const page of PAGES) {
      entries.push({
        url: `${SITE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : 0.8,
      });
    }
  }

  return entries;
}
