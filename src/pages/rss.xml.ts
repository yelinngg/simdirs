import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getNews, newsSlug } from '../lib/queries';
import { t } from '../i18n/ui';

export const GET: APIRoute = async (context) => {
  const news = await getNews('en');
  const tr = t('en');

  return rss({
    title: tr.seo.news.title,
    description: tr.seo.news.description,
    site: context.site ?? 'https://simdirs.example.com',
    items: news.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.date,
      link: `/news/${newsSlug(entry)}/`,
      categories: entry.data.tags,
    })),
    customData: '<language>en</language>',
  });
};
