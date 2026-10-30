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
    kicker: 'SIM & eSIM index',
  },
  nav: {
    sims: 'SIM Cards',
    news: 'Notes',
  },
  hero: {
    title: 'Pick the SIM before you land',
    subtitle:
      'We read the official price pages so you do not have to: what each provider costs, where its traffic exits, and how long a number survives.',
    browse: 'Browse the directory',
    news: 'Read the notes',
  },
  home: {
    featured: 'Worth starting with',
    featuredSub:
      'Nine providers picked on rating, coverage, and how much of their pricing we could verify against the official page. Nobody pays for a slot here.',
    latestNews: 'Latest notes',
    viewAll: 'All',
    stats: {
      providers: 'providers tracked',
      regions: 'regions covered',
      updates: 'field notes',
    },
  },
  sims: {
    title: 'SIM Card Directory',
    subtitle: 'Starting price, data, validity and hotspot support for every provider we track.',
    search: 'Search by carrier…',
    searchLabel: 'Search carriers',
    allRegions: 'All regions',
    regionLabel: 'Filter by region',
    cards: 'SIM cards',
    empty: 'No SIM cards match your filters.',
  },
  sim: {
    from: 'From',
    free: 'Free tier',
    countries: 'countries & regions',
    singleCountry: 'Single country',
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
    viewDetails: 'Details',
    breadcrumbList: 'SIM Cards',
    bestFor: 'Best for',
    plans: 'Popular plans',
    prosCons: 'Pros and cons',
    planName: 'Plan',
    planData: 'Data',
    planPrice: 'Price',
    pros: 'Pros',
    cons: 'Things to note',
    ipProfile: 'IP exit profile',
    ipCountry: 'IP country',
    ipType: 'IP type',
    ipNote: 'IP notes',
    ipConfidence: {
      high: 'verified',
      medium: 'likely',
      low: 'uncertain',
      unverified: 'community-reported',
    },
    ipTypes: {
      residential: 'Residential',
      datacenter: 'Datacenter',
      business: 'Business broadband',
      mobile: 'Mobile carrier',
      mixed: 'Mixed / varies',
      unknown: 'Unknown',
    },
    related: 'Related providers',
  },
  news: {
    title: 'Field notes',
    subtitle: 'What we tested, what broke, and what the terms actually say.',
    readMore: 'Read',
    back: 'Back to all notes',
    published: 'Published',
    relatedTag: 'Topic',
  },
  footer: {
    about:
      'An independent directory of travel SIM and eSIM cards. Prices come from official pages, on the date stamped on each card. No provider pays for placement.',
    quickLinks: 'Quick links',
    feeds: 'Subscribe',
    rights: 'All rights reserved.',
    note: 'Prices in USD, checked monthly',
  },
  seo: {
    home: {
      title: 'SIM & eSIM Directory: Prices, IP Exit, Keep-Alive – SimDirs',
      description:
        '40 travel SIM and eSIM providers, checked against official price pages: what it costs, where traffic exits, and how long a number stays alive.',
    },
    sims: {
      title: 'All SIM & eSIM Providers We Track – SimDirs',
      description:
        'Starting price, data, validity, hotspot support and network for every provider in the directory. Filter by region, search by name.',
    },
    news: {
      title: 'Field Notes on Travel eSIMs – SimDirs',
      description:
        'What we tested, what broke, and what the official terms actually say. Hands-on notes on travel eSIMs, keep-alive rules and exit IPs.',
    },
    rss: 'SimDirs feed',
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
    kicker: 'SIM / eSIM 索引',
  },
  nav: {
    sims: 'SIM卡',
    news: '笔记',
  },
  hero: {
    title: '出发前，把这张卡选明白',
    subtitle: '官网价格页我们替你读了：多少钱、流量从哪儿出去、号码能放多久，都写在页面上。',
    browse: '看全部供应商',
    news: '看实测笔记',
  },
  home: {
    featured: '先看这几家',
    featuredSub: '按评分、覆盖范围和价格可核实程度挑的 9 家。没有广告位，也没有谁付费上榜。',
    latestNews: '最新笔记',
    viewAll: '全部',
    stats: {
      providers: '家供应商',
      regions: '个地区',
      updates: '篇笔记',
    },
  },
  sims: {
    title: 'SIM卡目录',
    subtitle: '收录的每一家：起步价、流量、有效期、热点支持，逐条列清楚。',
    search: '搜索运营商…',
    searchLabel: '搜索运营商',
    allRegions: '全部地区',
    regionLabel: '按地区筛选',
    cards: '张SIM卡',
    empty: '没有符合筛选条件的SIM卡。',
  },
  sim: {
    from: '低至',
    free: '免费档',
    countries: '个国家和地区',
    singleCountry: '仅单一国家',
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
    viewDetails: '看详情',
    breadcrumbList: 'SIM卡',
    bestFor: '适合人群',
    plans: '热门套餐',
    prosCons: '优缺点',
    planName: '套餐',
    planData: '流量',
    planPrice: '价格',
    pros: '优势',
    cons: '注意事项',
    ipProfile: '出口IP画像',
    ipCountry: 'IP归属地',
    ipType: 'IP性质',
    ipNote: 'IP说明',
    ipConfidence: {
      high: '已核实',
      medium: '较可信',
      low: '不确定',
      unverified: '社区口径',
    },
    ipTypes: {
      residential: '住宅IP',
      datacenter: '数据中心IP',
      business: '商业宽带IP',
      mobile: '运营商移动IP',
      mixed: '混合/随线路变化',
      unknown: '未知',
    },
    related: '相关SIM卡',
  },
  news: {
    title: '实测笔记',
    subtitle: '测了什么、哪里出问题、条款原文到底怎么写。',
    readMore: '读',
    back: '返回笔记列表',
    published: '发布于',
    relatedTag: '话题',
  },
  footer: {
    about:
      '一个独立的旅行 SIM 与 eSIM 目录。价格取自官网，卡片上标了核对日期。没有任何供应商付费上榜。',
    quickLinks: '快速链接',
    feeds: '订阅',
    rights: '保留所有权利。',
    note: '价格以美元计，每月核对',
  },
  seo: {
    home: {
      title: '旅行SIM卡与eSIM目录：价格、出口IP、保号 – SimDirs',
      description: '40 家旅行 SIM 与 eSIM 供应商，价格按官网核对：多少钱、出口 IP 落在哪、号码能放多久。',
    },
    sims: {
      title: '全部供应商 – SIM卡目录 – SimDirs',
      description: '收录的每一家：起步价、流量、有效期、热点支持与网络制式。可按地区筛选、按名称搜索。',
    },
    news: {
      title: '旅行 eSIM 实测笔记 – SimDirs',
      description: '测了什么、哪里出问题、条款原文怎么写。旅行 eSIM、保号规则与出口 IP 的实测记录。',
    },
    rss: 'SimDirs 订阅',
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
