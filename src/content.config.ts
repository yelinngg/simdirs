import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';
import { REGION_KEYS } from './i18n/ui';

/** A field that must exist in both English and Chinese. */
const localized = <T extends z.ZodTypeAny>(schema: T) => z.object({ en: schema, zh: schema });

const sims = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/sims' }),
  schema: z.object({
    name: localized(z.string()),
    tagline: localized(z.string()),
    description: localized(z.string()),
    regions: z.array(z.enum(REGION_KEYS)).min(1),
    coverage: z.number().int().min(0),
    plansFrom: z.number().min(0),
    dataFrom: z.string(),
    validity: z.string(),
    network: z.string(),
    device: z.enum(['esim', 'physical', 'both']),
    hotspot: z.boolean(),
    rating: z.number().min(0).max(5),
    website: z.url(),
    features: localized(z.array(z.string())),
    featured: z.boolean().default(false),
    updatedAt: z.coerce.date(),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    lang: z.enum(['en', 'zh']),
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { sims, news };
