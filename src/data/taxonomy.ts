import type { Badge, CraftCategory, MainCategory, SizeGroup, Usage } from './types';

export const USAGE_LABEL: Record<Usage, string> = {
  mum: 'Mum',
  sabun: 'Sabun',
  'kokulu-tas': 'Kokulu Taş',
  epoksi: 'Epoksi',
  boyama: 'Boyama',
  dekorasyon: 'Dekorasyon',
};

export const USAGE_ORDER: Usage[] = ['mum', 'sabun', 'kokulu-tas', 'epoksi', 'boyama', 'dekorasyon'];

export const CATEGORY_LABEL: Record<MainCategory, string> = {
  kaliplar: 'Kalıplar',
  hammaddeler: 'Hammaddeler',
  setler: 'Setler',
};

export const BADGE_LABEL: Record<Badge, string> = {
  yeni: 'Yeni',
  'cok-satan': 'Çok Satan',
  indirim: 'İndirim',
};

export const SIZE_LABEL: Record<SizeGroup, string> = {
  kucuk: 'Küçük (0–7 cm)',
  orta: 'Orta (7–12 cm)',
  buyuk: 'Büyük (12 cm +)',
};

export const THEMES = ['Minimal', 'Geometrik', 'Doğa & Botanik', 'Figür', 'Harf & Rakam', 'Mutfak'];

export const PRICE_RANGES: { id: string; label: string; min: number; max: number }[] = [
  { id: '0-250', label: '250 TL altı', min: 0, max: 250 },
  { id: '250-500', label: '250 – 500 TL', min: 250, max: 500 },
  { id: '500-1000', label: '500 – 1.000 TL', min: 500, max: 1000 },
  { id: '1000-99999', label: '1.000 TL üzeri', min: 1000, max: 99999 },
];

/** "Ne üretmek istiyorsun?" — 6 üretim kategorisi */
export const CRAFT_CATEGORIES: CraftCategory[] = [
  { usage: 'mum', name: 'Mum', hint: 'Kalıp, wax, fitil, esans', image: 'archCandle' },
  { usage: 'sabun', name: 'Sabun', hint: 'Sabun bazı, kalıp, pigment', image: 'soapStackWhite' },
  { usage: 'kokulu-tas', name: 'Kokulu Taş', hint: 'Taş tozu, kalıp, esans', image: 'leafStones' },
  { usage: 'epoksi', name: 'Epoksi', hint: 'Reçine, kalıp, mika', image: 'resinCoasters' },
  { usage: 'boyama', name: 'Boyama', hint: 'Boya, fırça, pigment', image: 'watercolorFlowers' },
  { usage: 'dekorasyon', name: 'Dekorasyon', hint: 'Vazo, tepsi, mumluk', image: 'vaseCollection' },
];

/* --------------------------------------------------------------------------
   Navigasyon
   -------------------------------------------------------------------------- */

export interface NavLink {
  label: string;
  to: string;
}

export interface MegaColumn {
  title: string;
  links: NavLink[];
}

export interface NavItem extends NavLink {
  mega?: { columns: MegaColumn[]; promo: { title: string; text: string; to: string; image: 'siliconeMoldPink' | 'waxPastilles' } };
  accent?: boolean;
}

export const MAIN_NAV: NavItem[] = [
  {
    label: 'Kalıplar',
    to: '/kategori/kaliplar',
    mega: {
      columns: [
        {
          title: 'Kullanım alanına göre',
          links: [
            { label: 'Mum kalıpları', to: '/kategori/kaliplar?kullanim=mum' },
            { label: 'Sabun kalıpları', to: '/kategori/kaliplar?kullanim=sabun' },
            { label: 'Kokulu taş kalıpları', to: '/kategori/kaliplar?kullanim=kokulu-tas' },
            { label: 'Epoksi kalıpları', to: '/kategori/kaliplar?kullanim=epoksi' },
            { label: 'Dekor & beton kalıpları', to: '/kategori/kaliplar?kullanim=dekorasyon' },
          ],
        },
        {
          title: 'Temaya göre',
          links: [
            { label: 'Minimal', to: '/kategori/kaliplar?tema=Minimal' },
            { label: 'Geometrik', to: '/kategori/kaliplar?tema=Geometrik' },
            { label: 'Doğa & Botanik', to: '/kategori/kaliplar?tema=Doğa%20%26%20Botanik' },
            { label: 'Figür', to: '/kategori/kaliplar?tema=Figür' },
            { label: 'Harf & Rakam', to: '/kategori/kaliplar?tema=Harf%20%26%20Rakam' },
          ],
        },
        {
          title: 'Keşfet',
          links: [
            { label: 'Yeni kalıplar', to: '/kategori/kaliplar?yeni=1' },
            { label: 'Çok satanlar', to: '/kategori/kaliplar?coksatan=1' },
            { label: 'İndirimdeki kalıplar', to: '/kategori/kampanyalar' },
            { label: 'Tüm kalıplar', to: '/kategori/kaliplar' },
          ],
        },
      ],
      promo: {
        title: 'Silikon kalıp seçme rehberi',
        text: 'Shore sertliği, ısı dayanımı ve kullanım alanına göre doğru kalıbı seç.',
        to: '/rehber/silikon-kalip-secme-rehberi',
        image: 'siliconeMoldPink',
      },
    },
  },
  {
    label: 'Hammaddeler',
    to: '/kategori/hammaddeler',
    mega: {
      columns: [
        {
          title: 'Bazlar',
          links: [
            { label: 'Wax & mum bazları', to: '/arama?q=wax' },
            { label: 'Sabun bazları', to: '/kategori/hammaddeler?kullanim=sabun' },
            { label: 'Epoksi reçineler', to: '/kategori/hammaddeler?kullanim=epoksi' },
            { label: 'Taş tozu', to: '/arama?q=taş tozu' },
          ],
        },
        {
          title: 'Koku & renk',
          links: [
            { label: 'Esanslar', to: '/arama?q=esans' },
            { label: 'Mika & pigmentler', to: '/arama?q=pigment' },
            { label: 'Boyama setleri', to: '/kategori/hammaddeler?kullanim=boyama' },
          ],
        },
        {
          title: 'Üretime göre',
          links: [
            { label: 'Mum hammaddeleri', to: '/kategori/hammaddeler?kullanim=mum' },
            { label: 'Sabun hammaddeleri', to: '/kategori/hammaddeler?kullanim=sabun' },
            { label: 'Kokulu taş hammaddeleri', to: '/kategori/hammaddeler?kullanim=kokulu-tas' },
            { label: 'Tüm hammaddeler', to: '/kategori/hammaddeler' },
          ],
        },
      ],
      promo: {
        title: 'Wax miktarını hesapla',
        text: 'Kalıp hacmini gir, ihtiyacın olan wax ve esans miktarını gör.',
        to: '/#hesaplayicilar',
        image: 'waxPastilles',
      },
    },
  },
  { label: 'Mum', to: '/kategori/mum' },
  { label: 'Sabun', to: '/kategori/sabun' },
  { label: 'Epoksi', to: '/kategori/epoksi' },
  { label: 'Setler', to: '/kategori/setler' },
  { label: 'Yeni Gelenler', to: '/kategori/yeni-gelenler' },
  { label: 'Kampanyalar', to: '/kategori/kampanyalar', accent: true },
];

/* --------------------------------------------------------------------------
   Listeleme sayfası tanımları (slug → başlık + temel filtre)
   -------------------------------------------------------------------------- */

export interface ListingDef {
  slug: string;
  title: string;
  description: string;
  category?: MainCategory;
  usage?: Usage;
  onlyNew?: boolean;
  onlyDiscount?: boolean;
  /** Üstteki hızlı geçiş çipleri */
  quickLinks?: NavLink[];
}

const usageQuickLinks = (base: string): NavLink[] =>
  USAGE_ORDER.filter((u) => u !== 'boyama').map((u) => ({
    label: USAGE_LABEL[u],
    to: `${base}?kullanim=${u}`,
  }));

export const LISTINGS: Record<string, ListingDef> = {
  kaliplar: {
    slug: 'kaliplar',
    title: 'Kalıplar',
    description: 'Mum, sabun, kokulu taş ve epoksi için yüksek detaylı silikon kalıplar.',
    category: 'kaliplar',
    quickLinks: usageQuickLinks('/kategori/kaliplar'),
  },
  hammaddeler: {
    slug: 'hammaddeler',
    title: 'Hammaddeler',
    description: 'Wax, sabun bazı, reçine, esans ve pigmentler — üretimin temel malzemeleri.',
    category: 'hammaddeler',
    quickLinks: USAGE_ORDER.map((u) => ({ label: USAGE_LABEL[u], to: `/kategori/hammaddeler?kullanim=${u}` })),
  },
  setler: {
    slug: 'setler',
    title: 'Başlangıç Setleri',
    description: 'İlk üretimin için gereken her şey tek kutuda; adım adım rehber kartıyla.',
    category: 'setler',
  },
  'yeni-gelenler': {
    slug: 'yeni-gelenler',
    title: 'Yeni Gelenler',
    description: 'Koleksiyona son eklenen kalıp ve hammaddeler.',
    onlyNew: true,
  },
  kampanyalar: {
    slug: 'kampanyalar',
    title: 'Kampanyalar',
    description: 'Seçili kalıp, hammadde ve setlerde dönemsel fiyat avantajları.',
    onlyDiscount: true,
  },
  ...Object.fromEntries(
    USAGE_ORDER.map((u) => [
      u,
      {
        slug: u,
        title: USAGE_LABEL[u],
        description: `${USAGE_LABEL[u]} üretimi için kalıplar, hammaddeler ve setler.`,
        usage: u,
        quickLinks: [
          { label: `${USAGE_LABEL[u]} kalıpları`, to: `/kategori/kaliplar?kullanim=${u}` },
          { label: `${USAGE_LABEL[u]} hammaddeleri`, to: `/kategori/hammaddeler?kullanim=${u}` },
          { label: 'Başlangıç setleri', to: `/kategori/setler?kullanim=${u}` },
        ],
      } satisfies ListingDef,
    ]),
  ),
};

export const SEARCH_LISTING: ListingDef = {
  slug: 'arama',
  title: 'Arama sonuçları',
  description: '',
};
