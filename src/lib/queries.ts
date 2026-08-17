import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/utils';

export type SimEntry = CollectionEntry<'sims'>;
export type NewsEntry = CollectionEntry<'news'>;

/** All SIMs sorted by rating (best first). */
export async function getAllSims(): Promise<SimEntry[]> {
  const sims = await getCollection('sims');
  return sims.sort((a, b) => b.data.rating - a.data.rating);
}

/** Featured SIMs, falling back to top-rated ones. */
export async function getFeaturedSims(limit = 6): Promise<SimEntry[]> {
  const sims = await getAllSims();
  const featured = sims.filter((s) => s.data.featured);
  return (featured.length >= limit ? featured : [...featured, ...sims.filter((s) => !s.data.featured)]).slice(0, limit);
}

export async function getSim(slug: string): Promise<SimEntry | undefined> {
  const sims = await getCollection('sims');
  return sims.find((s) => s.id === slug);
}

/** Slug of a news entry: `en/my-post` → `my-post`. */
export function newsSlug(entry: NewsEntry): string {
  return entry.id.split('/').pop() ?? entry.id;
}

/** All news for one language, newest first. */
export async function getNews(lang: Locale): Promise<NewsEntry[]> {
  const all = await getCollection('news');
  return all
    .filter((e) => e.data.lang === lang)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getNewsEntry(lang: Locale, slug: string): Promise<NewsEntry | undefined> {
  const news = await getNews(lang);
  return news.find((e) => newsSlug(e) === slug);
}

/** getStaticPaths for SIM detail pages. */
export async function simStaticPaths() {
  const sims = await getAllSims();
  return sims.map((sim) => ({ params: { slug: sim.id } }));
}

/** getStaticPaths for news detail pages of one language. */
export async function newsStaticPaths(lang: Locale) {
  const news = await getNews(lang);
  return news.map((entry) => ({ params: { slug: newsSlug(entry) } }));
}
