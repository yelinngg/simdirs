export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

/** Prefix a locale-stripped path with the locale route segment. */
export function localePath(lang: Locale, path: string = '/'): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  if (lang === defaultLocale) return p;
  return `/${lang}${p}`;
}

/** Remove the locale prefix: `/zh/sims/x` → `/sims/x`, `/sims` → `/sims` */
export function stripLocalePath(pathname: string): string {
  const seg = pathname.split('/')[1];
  if (locales.includes(seg as Locale) && seg !== defaultLocale) {
    const stripped = pathname.replace(/^\/[^/]+/, '');
    return stripped === '' ? '/' : stripped;
  }
  return pathname;
}

/** URL of the same page in another locale. */
export function translatePath(pathname: string, to: Locale): string {
  return localePath(to, stripLocalePath(pathname));
}

/** Pick a localized value with English fallback. */
export function pick<T>(value: { en: T; zh: T }, lang: Locale): T {
  return value[lang] ?? value.en;
}

/** Locale-aware date formatting. */
export function formatDate(date: Date, lang: Locale): string {
  return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
