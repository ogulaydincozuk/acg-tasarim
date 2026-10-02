import type { Creation, UseCase, Usage } from './types';

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
  /** PLACEHOLDER: hesap adresleri girildiğinde ikonlar doğrudan profile gider (boşsa bilgi mesajı gösterilir) */
  social: { instagram: '', youtube: '', tiktok: '', pinterest: '' } as Record<'instagram' | 'youtube' | 'tiktok' | 'pinterest', string>,
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
  dekorasyon: {
    usage: 'dekorasyon',
    title: 'Dekoratif obje',
    summary: 'Jesmonite veya taş tozuyla döküp boyayarak mumluk, tepsi ve raf objeleri üret.',
    image: 'concreteVessels',
    duration: '≈ 1 saat + 24 saat kuruma',
    level: 'Orta',
    materialIds: ['p-107', 'p-106', 'p-108'],
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
  usages: ['mum', 'kokulu-tas', 'dekorasyon'] as Usage[],
};

/* --------------------------------------------------------------------------
   ACG ile Üretenler
   PLACEHOLDER: Gerçek müşteri paylaşımları (izinli) gelene kadar stok görsel
   kullanılır; kullanıcı adı veya yorum UYDURULMAZ.
   -------------------------------------------------------------------------- */
export const CREATIONS: Creation[] = [
  { id: 'c-1', image: 'jarCandleButterfly', productId: 'p-101', isPlaceholder: true },
  { id: 'c-2', image: 'vaseCollection', productId: 'p-107', isPlaceholder: true },
  { id: 'c-3', image: 'donutVaseFlowers', productId: 'p-003', isPlaceholder: true },
  { id: 'c-4', image: 'diffuser', productId: 'p-102', isPlaceholder: true },
  { id: 'c-5', image: 'watercolorFlowers', productId: 'p-108', isPlaceholder: true },
  { id: 'c-6', image: 'concreteVessels', productId: 'p-009', isPlaceholder: true },
  { id: 'c-7', image: 'jarCandleLeaves', productId: 'p-102', isPlaceholder: true },
];

/* --------------------------------------------------------------------------
   Arama
   -------------------------------------------------------------------------- */
export const POPULAR_SEARCHES = ['bubble kalıp', 'soya wax', 'taş tozu', 'vazo kalıbı', 'esans', 'başlangıç seti'];
