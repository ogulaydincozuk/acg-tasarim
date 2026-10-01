import type { CalculatorMeta, Creation, Guide, UseCase, Usage } from './types';

/* --------------------------------------------------------------------------
   Mağaza bilgileri
   PLACEHOLDER: Kargo eşiği, süreler ve iletişim bilgileri örnektir;
   yayın öncesi ACG TASARIM'ın gerçek koşullarıyla güncellenmelidir.
   -------------------------------------------------------------------------- */
export const STORE = {
  freeShippingThreshold: 3000,
  announcement: ['3.000 TL üzeri ücretsiz kargo', 'Güvenli ödeme', 'Hızlı kargo'],
  shippingNote: 'Hafta içi 15:00’e kadar verilen siparişler aynı gün kargoya verilir.',
  returnNote: 'Kullanılmamış ürünlerde 14 gün içinde koşulsuz iade.',
  phone: '0 (5xx) xxx xx xx',
  email: 'merhaba@acgtasarim.com',
  address: 'İzmir, Türkiye',
  hours: 'Hafta içi 09:00 – 18:00',
};

/* --------------------------------------------------------------------------
   "Bu kalıpla ne yapabilirsin?" — kullanım senaryoları
   -------------------------------------------------------------------------- */
export const USE_CASES: Record<Usage, UseCase> = {
  mum: {
    usage: 'mum',
    title: 'Mum',
    summary: 'Soya wax’ı eritip esans ve pigmentle renklendir, kalıba dök; 24 saat sonra kalıptan çıkar.',
    image: 'bubblePink',
    duration: '≈ 2 saat + 24 saat dinlenme',
    level: 'Kolay',
    materialIds: ['p-101', 'p-102', 'p-105'],
  },
  'kokulu-tas': {
    usage: 'kokulu-tas',
    title: 'Kokulu taş',
    summary: 'Taş tozunu suyla karıştır, esansı ekle ve dök; 20 dakikada kalıptan çıkan kalıcı kokulu objeler.',
    image: 'leafStones',
    duration: '≈ 30 dk + 24 saat kuruma',
    level: 'Kolay',
    materialIds: ['p-106', 'p-102', 'p-108'],
  },
  sabun: {
    usage: 'sabun',
    title: 'Sabun',
    summary: 'Gliserin bazını erit, mika ve esans ekle; birkaç saat içinde kullanıma hazır kalıp sabunlar.',
    image: 'soapMarble',
    duration: '≈ 1 saat + 3 saat donma',
    level: 'Kolay',
    materialIds: ['p-103', 'p-105', 'p-102'],
  },
  dekorasyon: {
    usage: 'dekorasyon',
    title: 'Dekoratif obje',
    summary: 'Jesmonite veya taş tozuyla döküp boyayarak mumluk, tepsi ve raf objeleri üret.',
    image: 'concreteVessels',
    duration: '≈ 1 saat + 24 saat kuruma',
    level: 'Orta',
    materialIds: ['p-107', 'p-106', 'p-108'],
  },
  epoksi: {
    usage: 'epoksi',
    title: 'Epoksi',
    summary: 'Reçineyi 2:1 oranında karıştır, mika ve kuru çiçekle katmanla; 24–48 saatte kürlenir.',
    image: 'resinGeode',
    duration: '≈ 1 saat + 48 saat kürlenme',
    level: 'Orta',
    materialIds: ['p-104', 'p-105'],
  },
  boyama: {
    usage: 'boyama',
    title: 'Boyama',
    summary: 'Kuruyan taş ve jesmonite objeleri pastel akriliklerle boyayıp mat vernikle koru.',
    image: 'watercolorFlowers',
    duration: '≈ 1 saat',
    level: 'Kolay',
    materialIds: ['p-108', 'p-106'],
  },
};

/** Ana sayfadaki vitrin kalıbı ve gösterilen senaryolar */
export const SHOWCASE = {
  productId: 'p-006',
  usages: ['mum', 'kokulu-tas', 'sabun', 'dekorasyon'] as Usage[],
};

/* --------------------------------------------------------------------------
   Akademi — rehberler ürünlere bağlı
   -------------------------------------------------------------------------- */
export const GUIDES: Guide[] = [
  {
    id: 'g-01',
    slug: 'mum-yapim-rehberi',
    title: 'Mum yapım rehberi: ilk dökümden kusursuz yüzeye',
    excerpt: 'Doğru wax seçimi, sıcaklık kontrolü, esans oranı ve kalıptan çıkarma — adım adım.',
    image: 'candleJarsPeach',
    readTime: '8 dk',
    level: 'Başlangıç',
    usage: 'mum',
    productIds: ['p-101', 'p-102', 'p-006', 'p-005'],
  },
  {
    id: 'g-02',
    slug: 'silikon-kalip-secme-rehberi',
    title: 'Silikon kalıp seçme rehberi',
    excerpt: 'Shore sertliği, ısı dayanımı ve detay seviyesine göre doğru kalıbı seç.',
    image: 'siliconeMoldPink',
    readTime: '5 dk',
    level: 'Başlangıç',
    usage: 'mum',
    productIds: ['p-001', 'p-002', 'p-003'],
  },
  {
    id: 'g-03',
    slug: 'epoksiye-baslangic',
    title: 'Epoksiye başlangıç',
    excerpt: 'Karışım oranı, kabarcık kontrolü ve güvenli çalışma alanı hazırlığı.',
    image: 'resinCoasters',
    readTime: '7 dk',
    level: 'Başlangıç',
    usage: 'epoksi',
    productIds: ['p-104', 'p-012', 'p-105'],
  },
  {
    id: 'g-04',
    slug: 'kokulu-tas-yapimi',
    title: 'Kokulu taş yapımı ve boyama',
    excerpt: 'Su oranı, esansın kalıcılığı ve pastel boyamayla zarif sonuçlar.',
    image: 'leafStones',
    readTime: '6 dk',
    level: 'Başlangıç',
    usage: 'kokulu-tas',
    productIds: ['p-106', 'p-001', 'p-108'],
  },
];

/* --------------------------------------------------------------------------
   Hesaplayıcılar — V1'de UI önizlemesi (basit yaklaşık formüller)
   -------------------------------------------------------------------------- */
export const CALCULATORS: CalculatorMeta[] = [
  { id: 'maliyet', name: 'Mum maliyet hesaplayıcı', description: 'Wax, esans ve fitil maliyetinden adet başı maliyet.' },
  { id: 'esans', name: 'Esans hesaplayıcı', description: 'Wax miktarı ve orana göre gereken esans.' },
  { id: 'wax', name: 'Wax miktarı hesaplayıcı', description: 'Kalıp hacmi ve adede göre gereken wax.' },
  { id: 'satis', name: 'Satış fiyatı hesaplayıcı', description: 'Maliyet, kâr marjı ve KDV ile satış fiyatı.' },
];

/* --------------------------------------------------------------------------
   ACG ile Üretenler
   PLACEHOLDER: Gerçek müşteri paylaşımları (izinli) gelene kadar stok görsel
   kullanılır; kullanıcı adı veya yorum UYDURULMAZ.
   -------------------------------------------------------------------------- */
export const CREATIONS: Creation[] = [
  { id: 'c-1', image: 'jarCandleButterfly', productId: 'p-101', isPlaceholder: true },
  { id: 'c-2', image: 'soapMarble', productId: 'p-103', isPlaceholder: true },
  { id: 'c-3', image: 'donutVaseFlowers', productId: 'p-003', isPlaceholder: true },
  { id: 'c-4', image: 'diffuser', productId: 'p-102', isPlaceholder: true },
  { id: 'c-5', image: 'resinFlowerTray', productId: 'p-010', isPlaceholder: true },
  { id: 'c-6', image: 'concreteVessels', productId: 'p-009', isPlaceholder: true },
  { id: 'c-7', image: 'jarCandleLeaves', productId: 'p-102', isPlaceholder: true },
];

/* --------------------------------------------------------------------------
   Arama
   -------------------------------------------------------------------------- */
export const POPULAR_SEARCHES = ['bubble kalıp', 'soya wax', 'epoksi reçine', 'vazo kalıbı', 'esans', 'başlangıç seti'];
