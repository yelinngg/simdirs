import type { Locale } from './utils';

export const REGION_KEYS = [
  'global',
  'asia',
  'europe',
  'north-america',
  'south-america',
  'africa',
  'oceania',
  'middle-east',
] as const;
export type RegionKey = (typeof REGION_KEYS)[number];

const en = {
  site: {
    name: 'SimDirs',
    tagline: 'Travel SIM & eSIM directory',
  },
  nav: {
    sims: 'SIM Cards',
    news: 'News',
  },
  hero: {
    title: 'Find the right SIM card for your next trip',
    subtitle:
      'Compare travel eSIM and SIM card providers — coverage, prices, validity and network quality, all in one place.',
    browse: 'Browse SIM cards',
    news: 'Latest news',
  },
  home: {
    featured: 'Featured SIM Cards',
    featuredSub: 'Hand-picked providers with the best overall value.',
    latestNews: 'Latest News',
    viewAll: 'View all',
    stats: {
      providers: 'SIM providers',
      regions: 'Regions covered',
      updates: 'Recent updates',
    },
  },
  sims: {
    title: 'SIM Card Directory',
    subtitle: 'Compare travel SIM & eSIM providers across regions, prices and coverage.',
    search: 'Search by carrier…',
    searchLabel: 'Search carriers',
    allRegions: 'All regions',
    regionLabel: 'Filter by region',
    cards: 'SIM cards',
    empty: 'No SIM cards match your filters.',
  },
  sim: {
    from: 'From',
    countries: 'countries & regions',
    validity: 'Validity',
    network: 'Network',
    dataFrom: 'Data from',
    coverage: 'Coverage',
    hotspot: 'Hotspot',
    yes: 'Yes',
    no: 'No',
    device: {
      esim: 'eSIM',
      physical: 'Physical SIM',
      both: 'eSIM + Physical',
    },
    visit: 'Visit website',
    features: 'Key features',
    overview: 'Overview',
    specs: 'Plan details',
    updated: 'Updated',
    backToList: 'Back to all SIM cards',
    breadcrumbList: 'SIM Cards',
  },
  news: {
    title: 'Latest News',
    subtitle: 'Updates, reviews and tips about travel SIM cards and eSIMs.',
    readMore: 'Read more',
    back: 'Back to news',
    published: 'Published',
    relatedTag: 'Topic',
  },
  footer: {
    about:
      'SimDirs is an independent directory of travel SIM cards and eSIM providers. Compare coverage, pricing and features to pick the right plan for your trip.',
    quickLinks: 'Quick links',
    feeds: 'Subscribe',
    rights: 'All rights reserved.',
  },
  seo: {
    home: {
      title: 'SimDirs – Travel SIM & eSIM Card Directory',
      description:
        'Compare travel SIM cards and eSIMs by coverage, price, validity and network. Independent directory with provider details and the latest news.',
    },
    sims: {
      title: 'SIM Card Directory – Compare Travel eSIMs',
      description:
        'Browse and compare travel SIM and eSIM providers: coverage, starting prices, validity, hotspot support and network types.',
    },
    news: {
      title: 'Latest SIM & eSIM News',
      description:
        'The latest updates, reviews and buying tips for travel SIM cards and eSIMs.',
    },
    rss: 'SimDirs RSS Feed',
  },
  regions: {
    global: 'Global',
    asia: 'Asia',
    europe: 'Europe',
    'north-america': 'North America',
    'south-america': 'South America',
    africa: 'Africa',
    oceania: 'Oceania',
    'middle-east': 'Middle East',
  } as Record<RegionKey, string>,
  notFound: {
    title: 'Page not found',
    message: 'The page you are looking for does not exist.',
    back: 'Back to home',
  },
};

const zh: typeof en = {
  site: {
    name: 'SimDirs',
    tagline: '旅行SIM卡与eSIM目录',
  },
  nav: {
    sims: 'SIM卡',
    news: '最新动态',
  },
  hero: {
    title: '为你的下一次旅行找到合适的SIM卡',
    subtitle: '一站式对比旅行eSIM与SIM卡供应商——覆盖范围、价格、有效期与网络质量。',
    browse: '浏览SIM卡',
    news: '最新动态',
  },
  home: {
    featured: '精选SIM卡',
    featuredSub: '整体性价比最优的精选供应商。',
    latestNews: '最新动态',
    viewAll: '查看全部',
    stats: {
      providers: '家SIM供应商',
      regions: '个覆盖地区',
      updates: '条近期动态',
    },
  },
  sims: {
    title: 'SIM卡目录',
    subtitle: '按地区、价格与覆盖范围对比旅行SIM卡与eSIM供应商。',
    search: '搜索运营商…',
    searchLabel: '搜索运营商',
    allRegions: '全部地区',
    regionLabel: '按地区筛选',
    cards: '张SIM卡',
    empty: '没有符合筛选条件的SIM卡。',
  },
  sim: {
    from: '低至',
    countries: '个国家和地区',
    validity: '有效期',
    network: '网络',
    dataFrom: '流量起步',
    coverage: '覆盖范围',
    hotspot: '热点共享',
    yes: '支持',
    no: '不支持',
    device: {
      esim: 'eSIM',
      physical: '实体SIM卡',
      both: 'eSIM + 实体卡',
    },
    visit: '访问官网',
    features: '主要特点',
    overview: '简介',
    specs: '套餐详情',
    updated: '更新于',
    backToList: '返回全部SIM卡',
    breadcrumbList: 'SIM卡',
  },
  news: {
    title: '最新动态',
    subtitle: '旅行SIM卡与eSIM的更新、评测与使用技巧。',
    readMore: '阅读全文',
    back: '返回动态列表',
    published: '发布于',
    relatedTag: '话题',
  },
  footer: {
    about:
      'SimDirs 是一个独立的旅行SIM卡与eSIM供应商目录。对比覆盖范围、价格与功能特性，为你的旅行选择合适的套餐。',
    quickLinks: '快速链接',
    feeds: '订阅',
    rights: '保留所有权利。',
  },
  seo: {
    home: {
      title: 'SimDirs – 旅行SIM卡与eSIM目录',
      description:
        '按覆盖范围、价格、有效期与网络对比旅行SIM卡与eSIM。独立目录，提供供应商详情与最新动态。',
    },
    sims: {
      title: 'SIM卡目录 – 对比旅行eSIM',
      description: '浏览并对比旅行SIM卡与eSIM供应商：覆盖范围、起步价格、有效期、热点支持与网络类型。',
    },
    news: {
      title: 'SIM卡与eSIM最新动态',
      description: '旅行SIM卡与eSIM的最新更新、评测与选购技巧。',
    },
    rss: 'SimDirs RSS 订阅',
  },
  regions: {
    global: '全球',
    asia: '亚洲',
    europe: '欧洲',
    'north-america': '北美洲',
    'south-america': '南美洲',
    africa: '非洲',
    oceania: '大洋洲',
    'middle-east': '中东',
  } as Record<RegionKey, string>,
  notFound: {
    title: '页面不存在',
    message: '你访问的页面不存在。',
    back: '返回首页',
  },
};

export const ui: Record<Locale, typeof en> = { en, zh };

export function t(lang: Locale): typeof en {
  return ui[lang];
}
